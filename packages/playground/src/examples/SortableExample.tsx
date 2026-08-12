import * as React from 'react';
import { EmblorRoot, EmblorInput, EmblorTagList, EmblorTag, EmblorTagRemove } from '@emblor/core';
import { reorderArray, useKeyboardSortable } from '@emblor/sortable';

export function SortableExample(): JSX.Element {
  const [tags, setTags] = React.useState<Array<string>>(['priority', 'status', 'owner']);
  const labelId = React.useId().replace(/:/g, '');

  const getSortableProps = useKeyboardSortable({
    itemCount: tags.length,
    onReorder({ fromIndex, toIndex }) {
      setTags(function update(previous) {
        return reorderArray({ items: previous, fromIndex, toIndex });
      });
    },
  });

  return (
    <section>
      <header>
        <h2>Sortable integration (alt + arrow keys)</h2>
      </header>
      <EmblorRoot labelId={labelId} value={tags} onValueChange={setTags} allowDuplicates={false}>
        <span id={labelId}>Sort tags</span>
        <EmblorTagList>
          {tags.map(function renderTag(tag, index) {
            return (
              <EmblorTag key={`${tag}-${index}`} index={index} {...getSortableProps(index)}>
                <span>{tag}</span>
                <EmblorTagRemove index={index} aria-label={`Remove ${tag}`} />
              </EmblorTag>
            );
          })}
        </EmblorTagList>
        <EmblorInput placeholder="Add field" />
      </EmblorRoot>
    </section>
  );
}
