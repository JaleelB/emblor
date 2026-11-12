'use client';

import type { ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { PreviewTabs } from '@/components/preview-tabs';
import { Button } from '@/components/ui/button';

export function DemoFrame({
  title,
  description,
  code,
  children,
  reset,
}: {
  title: string;
  description?: string;
  code: string;
  children: ReactNode;
  reset?: () => void;
}) {
  return (
    <section className="demo-frame not-prose" aria-label={title + ' example'}>
      <div className="example-heading">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
      <PreviewTabs
        label={title}
        rawCode={code}
        preview={<div className="example-field">{children}</div>}
        actions={
          reset && (
            <Button variant="ghost" size="sm" onClick={reset}>
              <RotateCcw data-icon="inline-start" />
              Reset
            </Button>
          )
        }
      />
    </section>
  );
}
