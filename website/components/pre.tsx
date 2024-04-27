import React from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

export default function Pre({ children, className, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = React.useState(false);
  const ref = React.useRef<HTMLPreElement>(null);

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (copied) {
      timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [copied]);

  const onClick = () => {
    setCopied(true);
    const content = ref.current?.textContent;
    if (content) {
      navigator.clipboard.writeText(content);
    }
  };

  return (
    <div className="relative overflow-auto max-h-[500px]">
      <Button
        variant="ghost"
        className={cn(
          `absolute top-4 right-4 bg-transparent p-0 h-8 w-8 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50`,
          copied && 'text-foreground',
        )}
        onClick={onClick}
      >
        {!copied ? <Copy className="h-3 w-3" /> : <Check className="h-3 w-3" />}
      </Button>
      <pre
        ref={ref}
        className={cn(
          'border border-border rounded-lg p-4 text-sm overflow-auto text-white/80 bg-zinc-950 dark:bg-zinc-900',
          className,
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}
