import { NextResponse } from 'next/server';
import { generateInvoice } from '../../../../lib/payment-gate';

export async function POST(request: Request) {
  let body: { contentId?: string; amountSats?: number; memo?: string };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { contentId, amountSats, memo } = body;

  if (!contentId || typeof contentId !== 'string') {
    return NextResponse.json({ error: 'contentId is required' }, { status: 400 });
  }

  if (!amountSats || typeof amountSats !== 'number' || amountSats < 1) {
    return NextResponse.json({ error: 'amountSats must be a positive number' }, { status: 400 });
  }

  const invoice = await generateInvoice({ contentId, amountSats, memo });
  return NextResponse.json(invoice);
}
