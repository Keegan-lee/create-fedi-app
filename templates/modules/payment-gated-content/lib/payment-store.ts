import { randomBytes } from 'crypto';

export type TPaymentStatus = 'pending' | 'paid' | 'expired';

export type TPaymentRecord = {
  id: string;
  contentId: string;
  invoice: string;
  preimage: string;
  amountSats: number;
  memo: string;
  status: TPaymentStatus;
  createdAt: number;
  paidAt: number | null;
  metadata?: Record<string, string>;
};

const payments = new Map<string, TPaymentRecord>();
const INVOICE_TTL_MS = 60 * 60 * 1000;

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
 * Creates a pending payment record. Uses in-memory storage by default;
 * when DATABASE_URL is set and lib/db exists, the database module can extend this.
 */
export async function createPaymentRecord(options: {
  contentId: string;
  amountSats: number;
  memo: string;
  metadata?: Record<string, string>;
}): Promise<TPaymentRecord> {
  const id = generateId();
  const preimage = generatePreimage();
  const record: TPaymentRecord = {
    id,
    contentId: options.contentId,
    invoice: buildMockInvoice(options.amountSats, id),
    preimage,
    amountSats: options.amountSats,
    memo: options.memo,
    status: 'pending',
    createdAt: Date.now(),
    paidAt: null,
    metadata: options.metadata,
  };

  payments.set(id, record);
  return record;
}

export async function getPaymentById(id: string): Promise<TPaymentRecord | null> {
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

export async function getPaymentByPreimage(
  preimage: string,
): Promise<TPaymentRecord | null> {
  for (const record of payments.values()) {
    if (record.preimage === preimage) return record;
  }
  return null;
}

export async function markPaymentPaid(id: string): Promise<TPaymentRecord | null> {
  const record = await getPaymentById(id);
  if (!record || record.status !== 'pending') return null;

  record.status = 'paid';
  record.paidAt = Date.now();
  payments.set(id, record);
  return record;
}

export async function hasPaidForContent(contentId: string): Promise<boolean> {
  for (const record of payments.values()) {
    if (record.contentId === contentId && record.status === 'paid') {
      return true;
    }
  }
  return false;
}
