import type { Metadata } from 'next';
import { AssistantDemoClient } from './AssistantDemoClient';

export const metadata: Metadata = {
  title: 'AI Assistant',
  description:
    'Free AI assistant demo for Fedi Mini Apps. Configure a system prompt, stream replies via the Vercel AI SDK, and copy messages to clipboard.',
  openGraph: {
    title: 'AI Assistant',
    description:
      'Free AI assistant demo for Fedi Mini Apps. Configure a system prompt, stream replies via the Vercel AI SDK, and copy messages to clipboard.',
  },
  twitter: {
    card: 'summary',
    title: 'AI Assistant',
    description:
      'Free AI assistant demo for Fedi Mini Apps. Configure a system prompt, stream replies via the Vercel AI SDK, and copy messages to clipboard.',
  },
};

export default function AssistantDemoPage() {
  return <AssistantDemoClient />;
}
