import * as React from 'react';
import { EmblorRoot, EmblorInput, EmblorTagList, EmblorTag, EmblorTagRemove, EmblorClearTrigger } from '@emblor/core';

export function CoreOnlyExample(): JSX.Element {
  const [tags, setTags] = React.useState<Array<string>>(['design', 'system', 'radix']);
  const labelId = React.useId().replace(/:/g, '');

  return (
    <section>
      <header>
        <h2>Core primitives</h2>
      </header>
      <EmblorRoot
        labelId={labelId}
        value={tags}
        onValueChange={setTags}
        maxTags={8}
        placeholderWhenFull="No more tags allowed"
        delimiter={[',', 'Enter', 'Tab']}
      >
        <label id={labelId}>Project tags</label>
        <div data-layout="stack" aria-live="polite">
          <EmblorTagList>
            {tags.map(function renderTag(tag, index) {
              return (
                <EmblorTag key={`${tag}-${index}`} index={index} data-test-id="core-tag">
                  <span>{tag}</span>
                  <EmblorTagRemove index={index} aria-label={`Remove ${tag}`} />
                </EmblorTag>
              );
            })}
          </EmblorTagList>
          <EmblorInput placeholder="Add a tag" />
        </div>
        <footer>
          <EmblorClearTrigger>Clear all</EmblorClearTrigger>
        </footer>
      </EmblorRoot>
    </section>
  );
}
