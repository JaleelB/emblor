'use client';

import { useState } from 'react';
import {
  EmblorClear,
  EmblorInput,
  EmblorLabel,
  EmblorRoot,
  EmblorTag,
  EmblorTagList,
  EmblorTagRemove,
  EmblorTagText,
} from 'emblor';

export function EmblorControlledField() {
  const [values, setValues] = useState<string[]>(['react']);
  const [draft, setDraft] = useState('');

  return (
    <EmblorRoot
      value={values}
      onValueChange={setValues}
      inputValue={draft}
      onInputValueChange={setDraft}
      className="flex w-full max-w-xl flex-col gap-2"
    >
      <EmblorLabel className="text-sm font-medium">Controlled technologies</EmblorLabel>
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
        <EmblorInput className="min-w-28 flex-1 bg-transparent text-sm outline-none" placeholder="Add a technology" />
        <EmblorClear className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent">Clear</EmblorClear>
      </div>
      <output className="rounded-md bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
        value: {JSON.stringify(values)} · draft: {JSON.stringify(draft)}
      </output>
    </EmblorRoot>
  );
}
