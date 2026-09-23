'use client';

import type { ReactNode } from 'react';
import { RootProvider } from 'fumadocs-ui/provider/next';

import { FumadocsSearchDialog } from '@/components/fumadocs-search';

export function FumadocsProvider({ children }: { children: ReactNode }) {
  return (
    <RootProvider dir="ltr" theme={{ enabled: false }} search={{ SearchDialog: FumadocsSearchDialog }}>
      {children}
    </RootProvider>
  );
}
