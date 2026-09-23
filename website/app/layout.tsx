import type { Metadata, Viewport } from 'next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import './globals.css';

import { FumadocsProvider } from '@/components/fumadocs-provider';
import { ToastProvider } from '@/components/toast-provider';
import { siteConfig } from '@/config/site-config';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Emblor — Headless Tag Input for React',
    template: '%s · Emblor',
  },
  description: siteConfig.description,
  keywords: [
    'React tag input',
    'headless React primitive',
    'compound components',
    'accessible tag input',
    'shadcn tag input',
  ],
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: 'Emblor — Headless Tag Input for React',
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emblor — Headless Tag Input for React',
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" className={`dark ${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground">
        <FumadocsProvider>
          <ToastProvider>
            <a className="skip-link" href="#main-content">
              Skip to content
            </a>
            {children}
          </ToastProvider>
        </FumadocsProvider>
      </body>
    </html>
  );
}
