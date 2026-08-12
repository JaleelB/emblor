import * as React from 'react';
import type { EmblorKeyboardNavigationProps } from '@emblor/types';
import { useEmblorContext } from '@emblor/core';

export function KeyboardNavigation(props: EmblorKeyboardNavigationProps): null {
  const { type } = props;
  const { focusTag, focusInput, store, inputRef, listRef } = useEmblorContext('KeyboardNavigation');
  const target = type === 'list' ? listRef.current : inputRef.current;

  React.useEffect(
    function bindKeyboardHandlers() {
      if (!target) {
        return;
      }
      function handleKeyDown(event: KeyboardEvent) {
        const state = store.getState();
        if (type === 'input') {
          if (event.key === 'ArrowDown' && state.tags.length > 0) {
            event.preventDefault();
            focusTag(0);
            return;
          }
          if (event.key === 'End' && state.tags.length > 0 && (event as KeyboardEvent).metaKey) {
            event.preventDefault();
            focusTag(state.tags.length - 1);
            return;
          }
        }
        if (type === 'list') {
          if (event.key === 'Escape') {
            event.preventDefault();
            focusInput();
            return;
          }
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            const activeIndex = state.activeIndex ?? 0;
            const nextIndex = Math.min(activeIndex + 1, state.tags.length - 1);
            focusTag(nextIndex);
            return;
          }
          if (event.key === 'ArrowUp') {
            event.preventDefault();
            const activeIndex = state.activeIndex ?? state.tags.length - 1;
            const nextIndex = Math.max(activeIndex - 1, 0);
            focusTag(nextIndex);
            return;
          }
        }
      }
      target.addEventListener('keydown', handleKeyDown);
      return function cleanup() {
        target.removeEventListener('keydown', handleKeyDown);
      };
    },
    [focusInput, focusTag, store, target, type],
  );

  return null;
}
