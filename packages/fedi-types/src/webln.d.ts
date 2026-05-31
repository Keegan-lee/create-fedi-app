export interface RequestInvoiceArgs {
  amount?: string | number;
  defaultAmount?: string | number;
  minimumAmount?: string | number;
  maximumAmount?: string | number;
  defaultMemo?: string;
}

export interface RequestInvoiceResponse {
  paymentRequest: string;
}

export interface SendPaymentResponse {
  preimage: string;
}

export interface KeysendArgs {
  destination: string;
  amount: string | number;
  customRecords?: Record<string, string>;
}

export interface SignMessageResponse {
  message: string;
  signature: string;
}

export interface GetInfoResponse {
  node: {
    alias: string;
    pubkey: string;
    color: string;
  };
  methods: string[];
}

export interface WebLNProvider {
  enable(): Promise<void>;
  getInfo(): Promise<GetInfoResponse>;
  sendPayment(paymentRequest: string): Promise<SendPaymentResponse>;
  makeInvoice(args: RequestInvoiceArgs | string | number): Promise<RequestInvoiceResponse>;
  signMessage(message: string): Promise<SignMessageResponse>;
  verifyMessage(signature: string, message: string): Promise<void>;
  sendKeysend(args: KeysendArgs): Promise<SendPaymentResponse>;
}

declare global {
  interface Window {
    webln?: WebLNProvider;
  }
}
