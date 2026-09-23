'use client';

import type { ReactNode } from 'react';
import { Code2, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeBlock } from '@/components/code-block';
import { cn } from '@/lib/utils';

export function PreviewTabs({
  preview,
  code,
  rawCode,
  align = 'center',
  className,
  contentClassName,
  actions,
  label = 'Example',
  filename = 'example.tsx',
}: {
  preview: ReactNode;
  code?: ReactNode;
  rawCode?: string;
  align?: 'center' | 'start';
  className?: string;
  contentClassName?: string;
  actions?: ReactNode;
  label?: string;
  filename?: string;
}) {
  return (
    <Tabs defaultValue="preview" className={cn('example-panel not-prose', className)}>
      <div className="example-toolbar">
        <TabsList variant="line" aria-label={label + ' view'}>
          <TabsTrigger value="preview">
            <Eye />
            Preview
          </TabsTrigger>
          <TabsTrigger value="code">
            <Code2 />
            Code
          </TabsTrigger>
        </TabsList>
        <div className="example-actions">{actions}</div>
      </div>
      <TabsContent value="preview" forceMount className="example-tab data-[state=inactive]:hidden">
        <div className={cn('example-preview', align === 'start' && 'items-start', contentClassName)}>{preview}</div>
      </TabsContent>
      <TabsContent value="code" className="example-tab">
        {rawCode ? <CodeBlock value={rawCode} title={filename} className="example-source" /> : code}
      </TabsContent>
    </Tabs>
  );
}
