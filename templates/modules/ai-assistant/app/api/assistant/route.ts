import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { getLanguageModel } from '../../../lib/ai/providers';

export const maxDuration = 60;

const DEFAULT_SYSTEM_PROMPT =
  'You are a helpful assistant inside a Fedi Mini App. Keep answers concise and practical.';

type TAssistantRequestBody = {
  messages?: UIMessage[];
  systemPrompt?: string;
};

/**
 * Streaming AI assistant endpoint. No payment gating, available to all users.
 */
export async function POST(request: Request) {
  let body: TAssistantRequestBody;

  try {
    body = (await request.json()) as TAssistantRequestBody;
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  const messages = body.messages;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response('messages array is required', { status: 400 });
  }

  const system = body.systemPrompt?.trim() || DEFAULT_SYSTEM_PROMPT;

  try {
    const result = streamText({
      model: getLanguageModel(),
      messages: await convertToModelMessages(messages),
      system,
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI request failed';
    return new Response(message, { status: 500 });
  }
}
