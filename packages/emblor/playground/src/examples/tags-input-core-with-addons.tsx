import * as React from 'react';
import { EmblorRoot, EmblorInput, EmblorTagList, EmblorTag, EmblorTagRemove } from 'emblor/core';
import { TagCount, ClearButton } from 'emblor/addons';

export function CoreWithAddonsExample(): JSX.Element {
  const [tags, setTags] = React.useState<Array<string>>(['engineering', 'docs', 'a11y']);
  const labelId = React.useId().replace(/:/g, '');

  return (
    <div className="story-preview">
      <EmblorRoot
        className="ti-root"
        labelId={labelId}
        value={tags}
        onValueChange={setTags}
        maxTags={6}
        allowDuplicates={false}
        onTagAdd={function announce(tag) {
          console.info(`Tag added: ${tag}`);
        }}
      >
        <div className="ti-label-group">
          <label id={labelId} className="ti-label">
            Team topics
          </label>
          <p className="ti-helper">Left/Right from the input moves into the tag list; Home/End jump to edges.</p>
        </div>
        <div className="ti-stack">
          <div className="ti-metrics" aria-live="polite">
            <div className="ti-metric">
              <span>Total tags</span>
              <TagCount className="ti-metric__value" />
            </div>
            <div className="ti-metric">
              <span>Remaining</span>
              <TagCount mode="remaining" className="ti-metric__value" />
            </div>
          </div>
          <EmblorTagList className="ti-tag-list">
            {tags.map(function renderTag(tag, index) {
              return (
                <EmblorTag key={`${tag}-${index}`} index={index} className="ti-tag">
                  <span>{tag}</span>
                  <EmblorTagRemove index={index} aria-label={`Remove ${tag}`} className="ti-tag-remove" />
                </EmblorTag>
              );
            })}
          </EmblorTagList>
          <div className="ti-row">
            <EmblorInput className="ti-input" placeholder="Add a topic" />
            <ClearButton className="ti-button ti-button--ghost">Clear tags</ClearButton>
          </div>
        </div>
      </EmblorRoot>
    </div>
  );
}
