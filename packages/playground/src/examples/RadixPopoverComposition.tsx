import * as React from 'react';
import { EmblorRoot, EmblorInput, EmblorTagList, EmblorTag, EmblorTagRemove } from '@emblor/core';

export function RadixPopoverCompositionExample(): JSX.Element {
  const [open, setOpen] = React.useState<boolean>(false);
  const [tags, setTags] = React.useState<Array<string>>(['review', 'triage']);
  const labelId = React.useId().replace(/:/g, '');

  return (
    <section>
      <header>
        <h2>Popover composition</h2>
      </header>
      <div data-popover-root>
        <button
          type="button"
          data-popover-trigger
          onClick={function toggle() {
            setOpen(function invert(prev) {
              return !prev;
            });
          }}
        >
          Filters
        </button>
        {open ? (
          <div role="dialog" aria-modal="false" data-popover-content>
            <EmblorRoot labelId={labelId} value={tags} onValueChange={setTags} delimiter={[',', 'Enter']}>
              <span id={labelId}>Workflow filters</span>
              <EmblorTagList>
                {tags.map(function renderTag(tag, index) {
                  return (
                    <EmblorTag key={`${tag}-${index}`} index={index} data-popover-tag>
                      <span>{tag}</span>
                      <EmblorTagRemove index={index} aria-label={`Remove ${tag}`} />
                    </EmblorTag>
                  );
                })}
              </EmblorTagList>
              <EmblorInput placeholder="Add filter" />
            </EmblorRoot>
            <button
              type="button"
              onClick={function close() {
                setOpen(false);
              }}
            >
              Close
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
