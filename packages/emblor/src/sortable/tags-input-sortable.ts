import * as React from 'react';

export type ReorderArgs<Item> = {
  items: Array<Item>;
  fromIndex: number;
  toIndex: number;
};

export function reorderArray<Item>(args: ReorderArgs<Item>): Array<Item> {
  const { items, fromIndex, toIndex } = args;
  if (fromIndex === toIndex) {
    return [...items];
  }
  const nextItems = [...items];
  const [moved] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, moved);
  return nextItems;
}

export type KeyboardSortableOptions = {
  onReorder: (payload: { fromIndex: number; toIndex: number }) => void;
  itemCount: number;
};

export function useKeyboardSortable(options: KeyboardSortableOptions) {
  const { onReorder, itemCount } = options;

  return React.useCallback(
    function getProps(index: number) {
      return {
        onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
          if (!event.altKey) {
            return;
          }
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            const targetIndex = Math.max(index - 1, 0);
            if (targetIndex !== index) {
              onReorder({ fromIndex: index, toIndex: targetIndex });
            }
            return;
          }
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            const targetIndex = Math.min(index + 1, itemCount - 1);
            if (targetIndex !== index) {
              onReorder({ fromIndex: index, toIndex: targetIndex });
            }
          }
        },
      };
    },
    [itemCount, onReorder],
  );
}
