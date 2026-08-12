import * as React from 'react';
import { EmblorRoot, EmblorInput, EmblorTagList, EmblorTag } from '@emblor/core';
import { TagCount, ClearButton, DeleteTagButton, KeyboardNavigation } from '@emblor/addons';

export function CoreWithAddonsExample(): JSX.Element {
  const [tags, setTags] = React.useState<Array<string>>(['engineering', 'docs', 'a11y']);
  const labelId = React.useId().replace(/:/g, '');

  return (
    <section>
      <header>
        <h2>Core + Addons</h2>
      </header>
      <EmblorRoot
        labelId={labelId}
        value={tags}
        onValueChange={setTags}
        maxTags={6}
        allowDuplicates={false}
        onTagAdd={function announce(tag) {
          console.info(`Tag added: ${tag}`);
        }}
      >
        <label id={labelId}>Team topics</label>
        <div data-layout="stack">
          <div data-layout="row" aria-live="polite">
            <TagCount mode="total" />
            <TagCount mode="remaining" />
          </div>
          <EmblorTagList data-variant="addon">
            <KeyboardNavigation type="list" />
            {tags.map(function renderTag(tag, index) {
              return (
                <EmblorTag key={`${tag}-${index}`} index={index} data-addon-tag>
                  <span>{tag}</span>
                  <DeleteTagButton index={index} />
                </EmblorTag>
              );
            })}
          </EmblorTagList>
          <div data-layout="row">
            <KeyboardNavigation type="input" />
            <EmblorInput placeholder="Add a topic" />
            <ClearButton>Clear tags</ClearButton>
          </div>
        </div>
      </EmblorRoot>
    </section>
  );
}
