'use client';

import dynamic from 'next/dynamic';

import { CodeCopyAction } from '@/components/fumadocs-code-block';
import { cn } from '@/lib/utils';

const DynamicCodeBlock = dynamic(
  () => import('fumadocs-ui/components/dynamic-codeblock').then((module) => module.DynamicCodeBlock),
  {
    ssr: false,
    loading: () => <div className="code-loading">Formatting source…</div>,
  },
);

export function CodeBlock({
  value,
  label = 'Copy code',
  className,
  title,
  language = 'tsx',
}: {
  value: string;
  label?: string;
  className?: string;
  title?: string;
  language?: string;
}) {
  return (
    <DynamicCodeBlock
      lang={language}
      code={value}
      codeblock={{
        title: title ?? 'Code',
        'aria-label': label,
        allowCopy: false,
        className: cn('code-block not-prose', className),
        Actions: ({ className: actionsClassName }) => <CodeCopyAction className={actionsClassName} />,
      }}
    />
  );
}
