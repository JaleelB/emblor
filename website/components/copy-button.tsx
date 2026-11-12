'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

import { useToast } from '@/components/toast-provider';
import { Button } from '@/components/ui/button';

export async function writeClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // Sandboxed previews can expose the async clipboard API while denying
      // permission. Fall through to the selection-based browser fallback.
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();

  if (!copied) throw new Error('Clipboard is unavailable');
}

export function CopyButton({
  value,
  label = 'Copy',
  copiedLabel = 'Copied',
  className,
  iconOnly = false,
}: {
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  iconOnly?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  async function copyValue() {
    try {
      await writeClipboard(value);
      setCopied(true);
      showToast('Copied to clipboard');
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      showToast('Copy failed — select the code manually');
    }
  }

  return (
    <Button
      variant="ghost"
      size={iconOnly ? 'icon-sm' : 'sm'}
      className={className}
      type="button"
      aria-label={iconOnly ? (copied ? copiedLabel : label) : undefined}
      data-copied={copied ? 'true' : 'false'}
      onClick={copyValue}
    >
      {copied ? (
        <Check aria-hidden="true" data-icon="inline-start" />
      ) : (
        <Copy aria-hidden="true" data-icon="inline-start" />
      )}
      {!iconOnly && <span>{copied ? copiedLabel : label}</span>}
    </Button>
  );
}
