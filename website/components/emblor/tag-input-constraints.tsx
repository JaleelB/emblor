'use client';

import { useId, useState } from 'react';
import {
  EmblorInput,
  EmblorLabel,
  EmblorRoot,
  EmblorTag,
  EmblorTagList,
  EmblorTagRemove,
  EmblorTagText,
  type EmblorRejection,
} from 'emblor';

const rejectionMessages: Record<EmblorRejection['reason'], string> = {
  empty: 'Enter a value before adding it.',
  'min-length': 'That value is too short.',
  'max-length': 'That value is too long.',
  duplicate: 'That tag already exists.',
  'max-tags': 'The three-tag limit has been reached.',
  custom: 'That value is not accepted.',
};

export function EmblorConstraintsField() {
  const helpId = useId();
  const statusId = useId();
  const [tags, setTags] = useState(['react']);
  const [message, setMessage] = useState('One tag must remain.');

  return (
    <EmblorRoot
      value={tags}
      onValueChange={(value, details) => {
        setTags(value);
        setMessage(
          details.type === 'add-many'
            ? `${details.values.length} tags added from paste.`
            : details.type === 'add'
              ? `${details.value} added.`
              : details.type === 'remove'
                ? `${details.value} removed.`
                : 'Tags cleared.',
        );
      }}
      onInputValueChange={() => setMessage('One tag must remain.')}
      onReject={(rejection) => setMessage(rejectionMessages[rejection.reason])}
      minTags={1}
      maxTags={3}
      allowDuplicates={false}
      delimiters={[',', ';']}
      addOnPaste
      blurBehavior="commit"
      placeholderWhenFull="Three-tag limit reached"
      className="flex w-full max-w-xl flex-col gap-2"
    >
      <div className="flex items-center justify-between gap-3">
        <EmblorLabel className="text-sm font-medium">Project labels</EmblorLabel>
        <span className="font-mono text-xs text-muted-foreground">{tags.length}/3 tags</span>
      </div>
      <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-background px-2.5 py-2 shadow-xs focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
        <EmblorTagList className="flex flex-wrap gap-1.5">
          {(tag, index) => (
            <EmblorTag
              key={`${tag}-${index}`}
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
          aria-describedby={`${helpId} ${statusId}`}
          className="min-w-36 flex-1 bg-transparent text-sm outline-none"
          placeholder="Paste comma-separated tags"
        />
      </div>
      <div className="flex flex-wrap items-start justify-between gap-2 text-sm text-muted-foreground">
        <p id={helpId}>Comma and semicolon add tags. Leaving the field commits the draft.</p>
        <output id={statusId} aria-live="polite" className="font-mono text-xs">
          {message}
        </output>
      </div>
    </EmblorRoot>
  );
}
