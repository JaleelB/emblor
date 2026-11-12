'use client';

import type { ComponentProps } from 'react';
import { Header } from 'fumadocs-ui/layouts/docs/slots/header';

export function DocsSubnav(props: ComponentProps<typeof Header>) {
  return (
    <nav aria-label="Documentation navigation" className="contents">
      <Header {...props} role="none" />
    </nav>
  );
}
