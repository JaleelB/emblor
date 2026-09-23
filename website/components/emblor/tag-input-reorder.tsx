'use client';

import { useRef, useState } from 'react';
import SortableList, { SortableItem } from 'react-easy-sort';
import { EmblorInput, EmblorLabel, EmblorRoot, EmblorTag, EmblorTagList, EmblorTagText } from 'emblor';

type Entry = { id: string; value: string };

export function EmblorReorderField() {
  const nextId = useRef(3);
  const [entries, setEntries] = useState<Entry[]>([
    { id: 'tag-1', value: 'react' },
    { id: 'tag-2', value: 'typescript' },
  ]);

  function move(from: number, to: number) {
    if (from === to) return;
    setEntries((current) => {
      const next = [...current];
      const [entry] = next.splice(from, 1);
      next.splice(to, 0, entry);
      return next;
    });
  }

  function updateValues(values: string[]) {
    setEntries((current) =>
      values.map((value) => current.find((entry) => entry.value === value) ?? { id: `tag-${nextId.current++}`, value }),
    );
  }

  return (
    <EmblorRoot
      value={entries.map((entry) => entry.value)}
      onValueChange={updateValues}
      className="flex w-full max-w-xl flex-col gap-2"
    >
      <EmblorLabel className="text-sm font-medium">Priority technologies</EmblorLabel>
      <div className="rounded-lg border border-input bg-background p-2.5 shadow-xs">
        <EmblorTagList>
          <SortableList onSortEnd={move} className="flex flex-wrap gap-1.5">
            {entries.map((entry, index) => (
              <SortableItem key={entry.id}>
                <EmblorTag
                  as="div"
                  index={index}
                  className="inline-flex cursor-grab items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm font-medium active:cursor-grabbing"
                >
                  <span aria-hidden="true" className="text-muted-foreground">
                    ⋮⋮
                  </span>
                  <EmblorTagText />
                  <button
                    type="button"
                    aria-label={`Move ${entry.value} left`}
                    disabled={index === 0}
                    onClick={() => move(index, index - 1)}
                    className="rounded-sm px-1 text-muted-foreground disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label={`Move ${entry.value} right`}
                    disabled={index === entries.length - 1}
                    onClick={() => move(index, index + 1)}
                    className="rounded-sm px-1 text-muted-foreground disabled:opacity-30"
                  >
                    →
                  </button>
                </EmblorTag>
              </SortableItem>
            ))}
          </SortableList>
        </EmblorTagList>
        <EmblorInput className="mt-2 w-full bg-transparent text-sm outline-none" placeholder="Add a technology" />
      </div>
      <p className="text-sm text-muted-foreground">Drag tags, or use the arrow buttons to reorder with a keyboard.</p>
    </EmblorRoot>
  );
}
