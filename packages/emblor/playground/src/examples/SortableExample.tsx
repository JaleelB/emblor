import * as React from 'react';
import { EmblorRoot, EmblorInput, EmblorTagList, EmblorTag, EmblorTagRemove } from 'emblor/core';
import { reorderArray, useKeyboardSortable } from 'emblor/sortable';

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
    <div className="story-preview">
      <EmblorRoot
        className="ti-root"
        labelId={labelId}
        value={tags}
        onValueChange={setTags}
        allowDuplicates={false}
      >
        <div className="ti-label-group">
          <label id={labelId} className="ti-label">
            Sort tags
          </label>
          <p className="ti-helper">Use Alt + Arrow keys while a tag is focused to reorder.</p>
        </div>
        <EmblorTagList className="ti-tag-list" data-sortable="true">
          {tags.map(function renderTag(tag, index) {
            return (
              <EmblorTag
                key={`${tag}-${index}`}
                index={index}
                className="ti-tag"
                data-interactive="true"
                {...getSortableProps(index)}
              >
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
        <EmblorInput className="ti-input" placeholder="Add field" />
      </EmblorRoot>
    </div>
  );
}
