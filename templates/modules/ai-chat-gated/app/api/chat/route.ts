import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { consumeChatPayment } from '../../../lib/chat-payment';
import { getLanguageModel } from '../../../lib/ai/providers';

export const maxDuration = 60;

type TChatRequestBody = {
  messages?: UIMessage[];
  paymentId?: string;
  preimage?: string;
};

/**
 * Streaming AI chat endpoint. Requires a valid, single-use Lightning payment per request.
 */
export async function POST(request: Request) {
  let body: TChatRequestBody;

  try {
    body = (await request.json()) as TChatRequestBody;
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  const paymentId =
    body.paymentId ?? request.headers.get('x-payment-id') ?? undefined;
  const preimage =
    body.preimage ?? request.headers.get('x-payment-preimage') ?? undefined;

  if (!paymentId || !preimage) {
    return new Response('Payment required', { status: 402 });
  }

  const payment = await consumeChatPayment(paymentId, preimage);
  if (!payment.valid) {
    return new Response(payment.reason, { status: 402 });
  }

  const messages = body.messages;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response('messages array is required', { status: 400 });
  }

  try {
    const result = streamText({
      model: getLanguageModel(),
      messages: await convertToModelMessages(messages),
      system:
        'You are a helpful assistant inside a Fedi Mini App. Keep answers concise and practical.',
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI request failed';
    return new Response(message, { status: 500 });
  }
}
