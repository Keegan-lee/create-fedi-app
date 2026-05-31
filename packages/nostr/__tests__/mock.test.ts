import { describe, it, expect } from 'vitest';
import { MockNostrProvider } from '../src/mock';

describe('MockNostrProvider', () => {
  it('getPublicKey returns 64-char hex string', async () => {
    const mock = new MockNostrProvider();
    const pubkey = await mock.getPublicKey();
    expect(pubkey).toHaveLength(64);
    expect(pubkey).toMatch(/^[0-9a-f]+$/);
  });

  it('signEvent returns object with id (64-char hex) and sig (128-char hex)', async () => {
    const mock = new MockNostrProvider();
    const event = await mock.signEvent({
      created_at: Math.floor(Date.now() / 1000),
      kind: 1,
      tags: [],
      content: 'Hello Nostr',
    });
    expect(event.id).toHaveLength(64);
    expect(event.id).toMatch(/^[0-9a-f]+$/);
    // Schnorr signature is 64 bytes = 128 hex chars
    expect(event.sig).toHaveLength(128);
    expect(event.sig).toMatch(/^[0-9a-f]+$/);
  });
});
