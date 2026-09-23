'use client';

import { useState } from 'react';
import { EmblorInput, EmblorLabel, EmblorRoot, EmblorTag, EmblorTagList, EmblorTagRemove, EmblorTagText } from 'emblor';

export function EmblorNativeFormField() {
  const [submitted, setSubmitted] = useState<string[]>([]);

  return (
    <form
      className="flex w-full max-w-xl flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(new FormData(event.currentTarget).getAll('skills[]') as string[]);
      }}
      onReset={() => setSubmitted([])}
    >
      <EmblorRoot defaultValue={['react']} name="skills[]" required className="flex flex-col gap-2">
        <EmblorLabel className="text-sm font-medium">Skills</EmblorLabel>
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
          <EmblorInput className="min-w-28 flex-1 bg-transparent text-sm outline-none" placeholder="Add a skill" />
        </div>
        <p className="text-sm text-muted-foreground">Submitted as repeated skills[] values.</p>
      </EmblorRoot>
      <div className="flex flex-wrap gap-2">
        <button type="submit" className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
          Read FormData
        </button>
        <button type="reset" className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium">
          Reset
        </button>
      </div>
      <output className="rounded-md bg-muted px-3 py-2 font-mono text-xs text-muted-foreground" aria-live="polite">
        {submitted.length ? JSON.stringify(submitted) : 'Submit to inspect FormData'}
      </output>
    </form>
  );
}
