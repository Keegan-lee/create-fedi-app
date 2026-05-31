import type { Metadata } from 'next';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Bricolage_Grotesque, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const body = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const siteUrl = 'https://fedi.keeganfrancis.com';

export const metadata: Metadata = {
  title: 'Build on Fedi',
  description:
    'Scaffold a Next.js Fedi mini app with WebLN, Nostr, Lightning payments, and optional modules. Run npx create-fedi-app@latest to start.',
  openGraph: {
    title: 'Build on Fedi',
    description:
      'Scaffold a Next.js Fedi mini app with WebLN, Nostr, Lightning payments, and optional modules.',
    url: siteUrl,
    siteName: 'create-fedi-app',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Build on Fedi',
    description:
      'Scaffold a Next.js Fedi mini app with WebLN, Nostr, Lightning payments, and optional modules.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${display.variable} ${body.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className={`${body.className} flex min-h-screen flex-col antialiased`}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
