export interface NostrEvent {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
  sig: string;
}

export type UnsignedNostrEvent = Omit<NostrEvent, 'id' | 'pubkey' | 'sig'>;

export interface Nip04 {
  encrypt(pubkey: string, plaintext: string): Promise<string>;
  decrypt(pubkey: string, ciphertext: string): Promise<string>;
}

export interface NostrProvider {
  getPublicKey(): Promise<string>;
  signEvent(event: UnsignedNostrEvent): Promise<NostrEvent>;
  getRelays(): Promise<Record<string, { read: boolean; write: boolean }>>;
  nip04: Nip04;
}

declare global {
  interface Window {
    nostr?: NostrProvider;
  }
}
