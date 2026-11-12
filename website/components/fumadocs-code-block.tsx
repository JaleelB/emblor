'use client';

import { CodeBlock, type CodeBlockProps } from 'fumadocs-ui/components/codeblock';
import { Check, Clipboard } from 'lucide-react';
import { useState } from 'react';

import { useToast } from '@/components/toast-provider';
import { Button } from '@/components/ui/button';
import { writeClipboard } from '@/components/copy-button';

export function CodeCopyAction({ className }: { className?: string }) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  return (
    <div className={className}>
      <Button
        className="code-copy-button"
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label={copied ? 'Copied Text' : 'Copy Text'}
        onClick={async (event) => {
          const code = event.currentTarget.closest('figure')?.querySelector('pre')?.textContent ?? '';
          try {
            await writeClipboard(code);
            setCopied(true);
            showToast('Copied to clipboard');
            window.setTimeout(() => setCopied(false), 1500);
          } catch {
            showToast('Copy failed — select the code manually');
          }
        }}
      >
        {copied ? <Check /> : <Clipboard />}
      </Button>
    </div>
  );
}

export function FumadocsCodeBlock(props: CodeBlockProps) {
  return (
    <CodeBlock {...props} allowCopy={false} Actions={({ className }) => <CodeCopyAction className={className} />} />
  );
}
