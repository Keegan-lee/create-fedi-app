import { randomBytes } from 'crypto';

export type TChatPaymentStatus = 'pending' | 'paid' | 'consumed' | 'expired';

export type TChatPaymentRecord = {
  id: string;
  invoice: string;
  preimage: string;
  amountSats: number;
  memo: string;
  status: TChatPaymentStatus;
  createdAt: number;
  paidAt: number | null;
  consumedAt: number | null;
};

const payments = new Map<string, TChatPaymentRecord>();
const INVOICE_TTL_MS = 15 * 60 * 1000;

function generateId(): string {
  return randomBytes(16).toString('hex');
}

function generatePreimage(): string {
  return randomBytes(32).toString('hex');
}

function buildMockInvoice(amountSats: number, paymentId: string): string {
  const amountPart = amountSats.toString(16).padStart(6, '0');
  return `lnbc${amountPart}n1p${paymentId.slice(0, 40)}`;
}

/**
 * Reads the per-message price from env (default 10 sats).
 */
export function getSatsPerMessage(): number {
  const raw = process.env.AI_SATS_PER_MESSAGE ?? '10';
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 10;
}

export type TChatInvoiceResult = {
  paymentId: string;
  invoice: string;
  amountSats: number;
  memo: string;
  /** Present in development to simulate wallet payment without WebLN */
  devPreimage?: string;
};

/**
 * Creates a pending chat payment invoice for one AI message.
 */
export async function generateChatInvoice(memo?: string): Promise<TChatInvoiceResult> {
  const amountSats = getSatsPerMessage();
  const id = generateId();
  const preimage = generatePreimage();

  const record: TChatPaymentRecord = {
    id,
    invoice: buildMockInvoice(amountSats, id),
    preimage,
    amountSats,
    memo: memo ?? `AI chat message (${amountSats} sats)`,
    status: 'pending',
    createdAt: Date.now(),
    paidAt: null,
    consumedAt: null,
  };

  payments.set(id, record);

  const result: TChatInvoiceResult = {
    paymentId: id,
    invoice: record.invoice,
    amountSats: record.amountSats,
    memo: record.memo,
  };

  if (process.env.NODE_ENV === 'development') {
    result.devPreimage = preimage;
  }

  return result;
}

async function getPaymentById(id: string): Promise<TChatPaymentRecord | null> {
  const record = payments.get(id);
  if (!record) return null;

  if (
    record.status === 'pending' &&
    Date.now() - record.createdAt > INVOICE_TTL_MS
  ) {
    record.status = 'expired';
    payments.set(id, record);
  }

  return record;
}

export type TVerifyChatPaymentResult =
  | { valid: true; record: TChatPaymentRecord }
  | { valid: false; reason: string };

/**
 * Verifies a Lightning preimage and marks the payment as paid (not yet consumed).
 */
export async function verifyChatPayment(
  paymentId: string,
  preimage: string,
): Promise<TVerifyChatPaymentResult> {
  const record = await getPaymentById(paymentId);
  if (!record) {
    return { valid: false, reason: 'Payment not found' };
  }

  if (record.status === 'expired') {
    return { valid: false, reason: 'Invoice expired' };
  }

  if (record.status === 'consumed') {
    return { valid: false, reason: 'Payment already used' };
  }

  if (record.status === 'paid') {
    return { valid: true, record };
  }

  if (record.preimage !== preimage) {
    return { valid: false, reason: 'Invalid payment proof' };
  }

  record.status = 'paid';
  record.paidAt = Date.now();
  payments.set(paymentId, record);
  return { valid: true, record };
}

/**
 * Confirms a paid invoice is valid and marks it consumed for a single AI request.
 */
export async function consumeChatPayment(
  paymentId: string,
  preimage: string,
): Promise<TVerifyChatPaymentResult> {
  const verified = await verifyChatPayment(paymentId, preimage);
  if (!verified.valid) {
    return verified;
  }

  const record = verified.record;
  if (record.status === 'consumed') {
    return { valid: false, reason: 'Payment already used' };
  }

  record.status = 'consumed';
  record.consumedAt = Date.now();
  payments.set(paymentId, record);
  return { valid: true, record };
}
