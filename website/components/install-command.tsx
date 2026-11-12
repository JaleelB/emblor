'use client';

import { Terminal } from 'lucide-react';
import { CopyButton } from '@/components/copy-button';
import { cn } from '@/lib/utils';

export function InstallCommand({
  command = 'pnpm add emblor@2.0.0-alpha.1',
  className,
}: {
  command?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-muted/30 px-3.5 py-1.5 font-mono text-xs text-muted-foreground shadow-xs transition-colors hover:border-border hover:bg-muted/50',
        className,
      )}
    >
      <Terminal size={13} className="shrink-0 text-primary/70" aria-hidden="true" />
      <code className="select-all text-xs text-foreground">{command}</code>
      <CopyButton value={command} label="Copy install command" iconOnly />
    </div>
  );
}
