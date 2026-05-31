import { NextResponse } from 'next/server';
import { generateChatInvoice } from '../../../../lib/chat-payment';

export async function POST(request: Request) {
  let body: { memo?: string };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    body = {};
  }

  const invoice = await generateChatInvoice(body.memo);
  return NextResponse.json(invoice);
}
