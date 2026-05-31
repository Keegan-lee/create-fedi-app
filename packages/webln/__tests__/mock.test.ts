import { describe, it, expect } from 'vitest';
import { MockWebLNProvider } from '../src/mock';

describe('MockWebLNProvider', () => {
  it('makeInvoice returns string starting with lnbc', async () => {
    const mock = new MockWebLNProvider({ paymentDelay: 0 });
    const result = await mock.makeInvoice({ amount: '1000' });
    expect(result.paymentRequest).toMatch(/^lnbc/);
  });

  it('sendPayment returns object with preimage', async () => {
    const mock = new MockWebLNProvider({ paymentDelay: 0 });
    const result = await mock.sendPayment('lnbc1000n1ptest');
    expect(result).toHaveProperty('preimage');
    expect(typeof result.preimage).toBe('string');
    expect(result.preimage.length).toBeGreaterThan(0);
  });

  it('shouldFail causes sendPayment to throw', async () => {
    const mock = new MockWebLNProvider({ shouldFail: true, failureMessage: 'Test failure' });
    await expect(mock.sendPayment('lnbc1000n1ptest')).rejects.toThrow('Test failure');
  });
});
