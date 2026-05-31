import { jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

/** Payment records for payment-gated content and other Lightning-gated features. */
export const payments = pgTable('payments', {
  id: text('id').primaryKey(),
  invoice: text('invoice').notNull(),
  preimage: text('preimage').notNull(),
  paidAt: timestamp('paid_at', { withTimezone: true, mode: 'date' }),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
});

export type TPayment = typeof payments.$inferSelect;
export type TNewPayment = typeof payments.$inferInsert;
