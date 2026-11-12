'use client';

import { useId, useState } from 'react';
import { EmblorInput, EmblorLabel, EmblorRoot, EmblorTag, EmblorTagList, EmblorTagRemove, EmblorTagText } from 'emblor';

export function EmblorAccessibleField() {
  const helpId = useId();
  const errorId = useId();
  const [error, setError] = useState('');

  return (
    <EmblorRoot
      defaultValue={['design systems']}
      minLength={3}
      invalid={Boolean(error)}
      onInputValueChange={() => setError('')}
      onValueChange={() => setError('')}
      onReject={() => setError('Enter at least three characters.')}
      className="flex w-full max-w-xl flex-col gap-2"
    >
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
        <EmblorInput
          aria-describedby={`${helpId}${error ? ` ${errorId}` : ''}`}
          aria-invalid={Boolean(error) || undefined}
          className="min-w-28 flex-1 bg-transparent text-sm outline-none"
          placeholder="Add a topic"
        />
      </div>
      <p id={helpId} className="text-sm text-muted-foreground">
        Add one topic at a time. Emblor announces additions and removals.
      </p>
      {error ? (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </EmblorRoot>
  );
}
