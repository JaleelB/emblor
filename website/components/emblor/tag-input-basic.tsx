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
} from 'emblor';

type PreviewState = 'default' | 'disabled' | 'readonly' | 'invalid' | 'capacity';

export function EmblorBasicField({ previewState = 'default' }: { previewState?: PreviewState }) {
  const atCapacity = previewState === 'capacity';
  const values = atCapacity ? ['react', 'typescript', 'accessibility'] : ['react', 'typescript'];

  return (
    <EmblorRoot
      key={previewState}
      defaultValue={values}
      disabled={previewState === 'disabled'}
      readOnly={previewState === 'readonly'}
      invalid={previewState === 'invalid'}
      maxTags={atCapacity ? values.length : undefined}
      placeholderWhenFull="Maximum reached"
      className="flex w-full max-w-xl flex-col gap-2"
    >
      <EmblorLabel className="text-sm font-medium">Skills</EmblorLabel>
      <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-background px-2.5 py-2 shadow-xs has-[[data-invalid]]:border-destructive has-[[data-invalid]]:ring-2 has-[[data-invalid]]:ring-destructive/20">
        <EmblorTagList className="flex flex-wrap gap-1.5">
          {(tag, index) => (
            <EmblorTag
              key={tag}
              index={index}
              className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm font-medium text-secondary-foreground"
            >
              <EmblorTagText />
              <EmblorTagRemove
                aria-label={`Remove ${tag}`}
                className="rounded-sm px-0.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                ×
              </EmblorTagRemove>
            </EmblorTag>
          )}
        </EmblorTagList>
        <EmblorInput
          className="min-w-28 flex-1 bg-transparent text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Add a skill"
        />
        <EmblorClear className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground">
          Clear
        </EmblorClear>
      </div>
      <p className="text-sm text-muted-foreground">
        {previewState === 'disabled'
          ? 'Disabled fields cannot be focused or changed.'
          : previewState === 'readonly'
            ? 'Read-only fields remain focusable but cannot be changed.'
            : previewState === 'invalid'
              ? 'The field exposes its invalid state to assistive technology.'
              : atCapacity
                ? 'The maximum of three skills has been reached.'
                : 'Press Enter to add a skill. Press Backspace to select the last tag.'}
      </p>
    </EmblorRoot>
  );
}
