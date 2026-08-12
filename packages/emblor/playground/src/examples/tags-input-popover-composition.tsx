import * as React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { EmblorRoot, EmblorInput, EmblorTagList, EmblorTag, EmblorTagRemove } from 'emblor/core';

export function RadixPopoverCompositionExample(): JSX.Element {
  const [tags, setTags] = React.useState<Array<string>>(['review', 'triage']);
  const labelId = React.useId().replace(/:/g, '');

  return (
    <div className="story-preview">
      <Popover.Root>
        <Popover.Trigger className="ti-button" aria-label="Open workflow filters">
          Filters
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="popover-content" sideOffset={12} align="end">
            <EmblorRoot
              className="ti-root"
              labelId={labelId}
              value={tags}
              onValueChange={setTags}
              delimiter={[',', 'Enter']}
            >
              <div className="ti-label-group">
                <label id={labelId} className="ti-label">
                  Workflow filters
                </label>
                <p className="ti-helper">Combine quick filters without leaving the table.</p>
              </div>
              <EmblorTagList className="ti-tag-list">
                {tags.map(function renderTag(tag, index) {
                  return (
                    <EmblorTag key={`${tag}-${index}`} index={index} className="ti-tag">
                      <span>{tag}</span>
                      <EmblorTagRemove
                        index={index}
                        aria-label={`Remove ${tag}`}
                        className="ti-tag-remove ti-tag-remove--subtle"
                      />
                    </EmblorTag>
                  );
                })}
              </EmblorTagList>
              <EmblorInput className="ti-input" placeholder="Add filter" />
            </EmblorRoot>
            <div className="popover-footer">
              <Popover.Close className="ti-button ti-button--ghost">Close</Popover.Close>
            </div>
            <Popover.Arrow className="popover-arrow" width={14} height={7} />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
