'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export function BrandMark({ className }: { className?: string }) {
  const maskId = React.useId();

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0 text-foreground', className)}
      aria-hidden="true"
    >
      <mask id={maskId}>
        <rect width="24" height="24" fill="#FFFFFF" />
        {/* Roving cluster tag slits */}
        <rect x="4.25" y="6" width="10.5" height="2.8" rx="1.4" fill="#000000" />
        <rect x="4.25" y="10.6" width="14" height="2.8" rx="1.4" fill="#000000" />
        <rect x="4.25" y="15.2" width="8" height="2.8" rx="1.4" fill="#000000" />
        <circle cx="15.25" cy="16.6" r="1.4" fill="#000000" />
      </mask>
      <circle cx="12" cy="12" r="11" fill="currentColor" mask={`url(#${maskId})`} />
    </svg>
  );
}
