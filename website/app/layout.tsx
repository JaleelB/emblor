import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { siteConfig } from '../config/site-config';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: [
    'shadcn',
    'tag input',
    'shadcn/ui',
    'shadcn tag input',
    'tag input component',
    'shadcn tag input component',
    'input',
    'radix ui',
    'react tag input',
  ],
  authors: [
    {
      name: 'Jaleel Bennett',
      url: 'https://jaleelbennett.com',
    },
  ],
  creator: 'Jaleel Bennett',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    creator: '@jal_eelll',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="smooth-scroll" lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SiteHeader />
          {children}
          <SiteFooter />
        </ThemeProvider>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
