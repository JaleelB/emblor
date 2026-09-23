import { cn } from '@/lib/utils';

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex size-7 items-center justify-center rounded-lg border border-border/80 bg-foreground text-background font-mono text-xs font-bold shadow-xs',
        className,
      )}
      aria-hidden="true"
    >
      <span>#</span>
    </span>
  );
}
