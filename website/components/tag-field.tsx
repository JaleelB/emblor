'use client';

import {
  EmblorClear,
  EmblorInput,
  EmblorLabel,
  EmblorRoot,
  EmblorTag,
  EmblorTagList,
  EmblorTagRemove,
  EmblorTagText,
  type EmblorRejection,
  type EmblorRootProps,
  type EmblorValueChangeDetails,
} from 'emblor';
import { X } from 'lucide-react';
import { useId, useState } from 'react';

import { cn } from '@/lib/utils';

const DEFAULT_TAGS = ['react', 'headless'];

export type FieldEvent =
  | { kind: 'value'; details: EmblorValueChangeDetails; value: string[] }
  | { kind: 'reject'; rejection: EmblorRejection }
  | { kind: 'draft'; value: string }
  | { kind: 'focus'; part: 'Input' | 'Tag' | 'TagRemove' | 'Clear' };

type TagFieldProps = {
  initialTags?: string[];
  label?: string;
  description?: string;
  placeholder?: string;
  invalid?: boolean;
  showOutput?: boolean;
  rootProps?: Omit<
    EmblorRootProps,
    'children' | 'defaultValue' | 'value' | 'inputValue' | 'onInputValueChange' | 'onValueChange'
  >;
  onEvent?: (event: FieldEvent) => void;
};

function describeDetails(details: EmblorValueChangeDetails) {
  if (details.type === 'add') return `add: ${details.value}`;
  if (details.type === 'add-many') return `add-many: ${details.values.join(', ')}`;
  if (details.type === 'remove') return `remove: ${details.value}`;
  return `clear: ${details.values.join(', ')}`;
}

export function TagField({
  initialTags = DEFAULT_TAGS,
  label = 'Topics',
  description = 'Press Enter to commit. Backspace focuses the previous tag.',
  placeholder = 'Add a topic',
  invalid = false,
  showOutput = true,
  rootProps,
  onEvent,
}: TagFieldProps) {
  const hintId = `emblor-field-hint-${useId().replace(/:/g, '')}`;
  const [tags, setTags] = useState(() => [...initialTags]);
  const [draft, setDraft] = useState('');
  const [lastEvent, setLastEvent] = useState('Ready for input');
  const [lastRejection, setLastRejection] = useState<EmblorRejection | null>(null);

  return (
    <EmblorRoot
      {...rootProps}
      className={cn('emblor-field grid gap-2', rootProps?.className)}
      value={tags}
      inputValue={draft}
      onInputValueChange={(value) => {
        setDraft(value);
        setLastRejection(null);
        onEvent?.({ kind: 'draft', value });
      }}
      onValueChange={(value, details) => {
        setTags(value);
        const nextEvent = describeDetails(details);
        setLastEvent(nextEvent);
        setLastRejection(null);
        onEvent?.({ kind: 'value', value, details });
      }}
      onReject={(rejection) => {
        setLastRejection(rejection);
        setLastEvent(`rejected · ${rejection.reason}`);
        onEvent?.({ kind: 'reject', rejection });
      }}
    >
      <EmblorLabel className="field-label text-sm leading-none font-medium text-foreground">{label}</EmblorLabel>
      <div
        className="field-shell flex min-h-10 flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2"
        data-invalid={invalid || lastRejection ? 'true' : 'false'}
      >
        <EmblorTagList className="tag-list flex flex-wrap items-center gap-1.5">
          {(tag, index) => (
            <EmblorTag
              key={`${tag}-${index}`}
              index={index}
              className="tag-chip inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2 py-1 text-sm font-medium text-secondary-foreground"
              onFocus={() => onEvent?.({ kind: 'focus', part: 'Tag' })}
            >
              <EmblorTagText />
              <EmblorTagRemove
                className="tag-remove rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-label={`Remove ${tag}`}
                onFocus={() => onEvent?.({ kind: 'focus', part: 'TagRemove' })}
              >
                <X aria-hidden="true" size={13} />
              </EmblorTagRemove>
            </EmblorTag>
          )}
        </EmblorTagList>
        <EmblorInput
          className="field-input min-w-28 flex-1 rounded-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          placeholder={placeholder}
          aria-describedby={hintId}
          aria-invalid={invalid || Boolean(lastRejection) || undefined}
          onFocus={() => onEvent?.({ kind: 'focus', part: 'Input' })}
        />
        <EmblorClear
          className="field-clear rounded-sm px-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label="Clear all tags"
          onFocus={() => onEvent?.({ kind: 'focus', part: 'Clear' })}
        >
          <span>Clear</span>
        </EmblorClear>
      </div>
      <p
        className={cn(
          lastRejection ? 'field-error text-sm text-destructive' : 'field-hint text-sm text-muted-foreground',
        )}
        id={hintId}
      >
        {lastRejection ? `Rejected "${lastRejection.rawValue}": ${lastRejection.reason}.` : description}
      </p>
      {showOutput && (
        <div className="event-strip" aria-live="polite">
          <div className="event-cell">
            <span className="event-label">Committed value</span>
            <span className="event-value">{JSON.stringify(tags)}</span>
          </div>
          <div className="event-cell">
            <span className="event-label">Last event</span>
            <span className="event-value">{lastEvent}</span>
          </div>
        </div>
      )}
    </EmblorRoot>
  );
}
