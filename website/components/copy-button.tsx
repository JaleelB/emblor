import { useCallback, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Check, Copy } from 'lucide-react';

export default function CopyButton({ value }: { value: string; copyable?: boolean }) {
  const [copying, setCopying] = useState<number>(0);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopying((c) => c + 1);
      setTimeout(() => {
        setCopying((c) => c - 1);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, [value]);

  const variants = {
    visible: { opacity: 1, scale: 1 },
    hidden: { opacity: 0, scale: 0.5 },
  };

  return (
    <Button
      onClick={onCopy}
      aria-label="Copy code"
      variant="ghost"
      className={cn(
        `absolute right-3 top-[0.6rem] p-0 z-50 flex h-8 w-8 items-center justify-center rounded-md text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50`,
      )}
    >
      <MotionConfig transition={{ duration: 0.15 }}>
        <AnimatePresence initial={false} mode="wait">
          {copying ? (
            <motion.div animate="visible" exit="hidden" initial="hidden" key="check" variants={variants}>
              <Check className="w-3 h-3" />
            </motion.div>
          ) : (
            <motion.div animate="visible" exit="hidden" initial="hidden" key="copy" variants={variants}>
              <Copy className="w-3 h-3" />
            </motion.div>
          )}
        </AnimatePresence>
      </MotionConfig>
    </Button>
  );
}
