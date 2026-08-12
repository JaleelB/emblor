import * as React from 'react';
import { EmblorRoot, EmblorInput, EmblorTagList, EmblorTag, EmblorTagRemove, EmblorClearTrigger } from 'emblor/core';

export function CoreOnlyExample(): JSX.Element {
  const [tags, setTags] = React.useState<Array<string>>(['design', 'system', 'radix']);
  const labelId = React.useId().replace(/:/g, '');

  return (
    <div className="story-preview">
      <EmblorRoot
        className="ti-root"
        labelId={labelId}
        value={tags}
        onValueChange={setTags}
        maxTags={8}
        placeholderWhenFull="No more tags allowed"
        delimiter={[',', 'Enter', 'Tab']}
      >
        <div className="ti-label-group">
          <label id={labelId} className="ti-label">
            Project tags
          </label>
          <p className="ti-helper">Comma, Enter, or Tab commits a new tag. Left/Right arrows jump between tags.</p>
        </div>
        <div className="ti-stack" aria-live="polite">
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
          <EmblorInput className="ti-input" placeholder="Add a tag" />
        </div>
        <footer className="ti-footer">
          <span className="ti-notation">{tags.length} tags</span>
          <EmblorClearTrigger className="ti-button" aria-label="Clear all project tags">
            Clear all
          </EmblorClearTrigger>
        </footer>
      </EmblorRoot>
    </div>
  );
}
