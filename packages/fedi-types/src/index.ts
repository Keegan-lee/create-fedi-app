// Re-export WebLN types
export type {
  RequestInvoiceArgs,
  RequestInvoiceResponse,
  SendPaymentResponse,
  KeysendArgs,
  SignMessageResponse,
  GetInfoResponse,
  WebLNProvider,
} from './webln';

// Re-export Nostr types
export type {
  NostrEvent,
  UnsignedNostrEvent,
  Nip04,
  NostrProvider,
} from './nostr';

// Re-export FediInternal — this import also registers window.fediInternal globally
export type { FediInternal } from './fedi-internal';
