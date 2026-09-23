'use client';

import { useId, useState } from 'react';
import { EmblorInput, EmblorLabel, EmblorRoot, EmblorTag, EmblorTagList, EmblorTagRemove, EmblorTagText } from 'emblor';

export function EmblorValidationField() {
  const messageId = useId();
  const [error, setError] = useState('');

  return (
    <EmblorRoot
      defaultValue={['#react']}
      transform={(value) => value.toLowerCase()}
      validate={(value) => value.startsWith('#')}
      minLength={2}
      maxTags={4}
      invalid={Boolean(error)}
      onInputValueChange={() => setError('')}
      onValueChange={() => setError('')}
      onReject={(rejection) => setError(`“${rejection.rawValue}” must begin with #.`)}
      className="flex w-full max-w-xl flex-col gap-2"
    >
      <EmblorLabel className="text-sm font-medium">Hashtags</EmblorLabel>
      <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-background px-2.5 py-2 shadow-xs has-[[data-invalid]]:border-destructive">
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
          aria-describedby={messageId}
          aria-invalid={Boolean(error) || undefined}
          className="min-w-28 flex-1 bg-transparent text-sm outline-none"
          placeholder="Add #hashtag"
        />
      </div>
      <p
        id={messageId}
        aria-live="polite"
        className={error ? 'text-sm text-destructive' : 'text-sm text-muted-foreground'}
      >
        {error || 'Use a # prefix. Up to four hashtags.'}
      </p>
    </EmblorRoot>
  );
}
