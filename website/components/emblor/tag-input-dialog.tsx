'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { EmblorInput, EmblorLabel, EmblorRoot, EmblorTag, EmblorTagList, EmblorTagRemove, EmblorTagText } from 'emblor';

export function EmblorDialogField() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          Edit topics
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit topics</DialogTitle>
          <DialogDescription>Choose the topics attached to this record.</DialogDescription>
        </DialogHeader>
        <EmblorRoot defaultValue={['react', 'shadcn']} className="flex flex-col gap-2">
          <EmblorLabel className="text-sm font-medium">Topics</EmblorLabel>
          <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-background px-2.5 py-2 shadow-xs">
            <EmblorTagList className="flex flex-wrap gap-1.5">
              {(tag, index) => (
                <EmblorTag
                  key={tag}
                  index={index}
                  className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm font-medium"
                >
                  <EmblorTagText />
                  <EmblorTagRemove
                    aria-label={`Remove ${tag}`}
                    className="rounded-sm px-0.5 text-muted-foreground hover:bg-accent"
                  >
                    ×
                  </EmblorTagRemove>
                </EmblorTag>
              )}
            </EmblorTagList>
            <EmblorInput className="min-w-28 flex-1 bg-transparent text-sm outline-none" placeholder="Add a topic" />
          </div>
        </EmblorRoot>
        <DialogClose asChild>
          <Button type="button">Done</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
