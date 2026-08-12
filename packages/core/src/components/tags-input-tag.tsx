import * as React from 'react';
import type { EmblorTagProps } from '@emblor/types';
import { composeEventHandlers, mergeRefs, useStoreSelector } from '@emblor/utils';
import { useEmblorContext } from '../tags-input-context';

export const EmblorTag = React.forwardRef<HTMLElement, EmblorTagProps>(function EmblorTag(props, forwardedRef) {
  const { as, index, children, onKeyDown, onClick, onFocus, ...rest } = props;
  const {
    store,
    disabled,
    readOnly,
    setFocusedIndex,
    setActiveIndex,
    focusInput,
    focusTag,
    removeTag,
    onTagClick,
    getTagValue,
    registerTagNode,
  } = useEmblorContext('Emblor.Tag');

  const Component = (as ?? 'div') as React.ElementType;
  const tagRecord = useStoreSelector(store, function selectTag(state) {
    return state.tags[index] ?? null;
  });
  const isFocused = useStoreSelector(store, function selectFocus(state) {
    return state.focusedIndex === index;
  });
  const isActive = useStoreSelector(store, function selectActive(state) {
    return state.activeIndex === index;
  });

  const tagRef = React.useRef<HTMLElement | null>(null);
  const combinedRef = mergeRefs(tagRef, forwardedRef);

  React.useEffect(
    function registerNode() {
      registerTagNode(index, tagRef.current);
      return function cleanup() {
        registerTagNode(index, null);
      };
    },
    [index, registerTagNode],
  );

  const handleClick = React.useCallback(
    function onClickHandler(event: React.MouseEvent<HTMLElement>) {
      if (disabled) {
        return;
      }
      setFocusedIndex(index);
      setActiveIndex(index);
      if (onTagClick && tagRecord) {
        onTagClick(tagRecord.value, index);
      }
    },
    [disabled, index, onTagClick, setActiveIndex, setFocusedIndex, tagRecord],
  );

  const handleFocus = React.useCallback(
    function onFocusHandler() {
      setFocusedIndex(index);
      setActiveIndex(index);
    },
    [index, setActiveIndex, setFocusedIndex],
  );

  const handleKeyDown = React.useCallback(
    function onKeyDownHandler(event: React.KeyboardEvent<HTMLElement>) {
      if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        removeTag(index);
        focusInput();
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const previousIndex = index - 1;
        if (previousIndex >= 0) {
          focusTag(previousIndex);
          return;
        }
        focusInput();
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        const nextIndex = index + 1;
        const nextValue = getTagValue(nextIndex);
        if (nextValue !== null) {
          focusTag(nextIndex);
          return;
        }
        focusInput();
        return;
      }
      if (event.key === 'Home') {
        event.preventDefault();
        focusTag(0);
        return;
      }
      if (event.key === 'End') {
        event.preventDefault();
        const state = store.getState();
        const lastIndex = Math.max(state.tags.length - 1, 0);
        focusTag(lastIndex);
      }
    },
    [focusInput, focusTag, getTagValue, index, removeTag, store],
  );

  if (!tagRecord) {
    return null;
  }

  const dataState = isFocused ? 'focused' : isActive ? 'active' : 'idle';

  return (
    <Component
      {...rest}
      ref={combinedRef}
      id={tagRecord.id}
      role="listitem"
      tabIndex={isFocused ? 0 : -1}
      data-index={index}
      data-state={dataState}
      data-focused={isFocused ? '' : undefined}
      data-active={isActive ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-readonly={readOnly ? '' : undefined}
      aria-disabled={disabled}
      aria-readonly={readOnly}
      onClick={composeEventHandlers(onClick, handleClick)}
      onFocus={composeEventHandlers(onFocus, handleFocus)}
      onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
    >
      {children ?? tagRecord.value}
    </Component>
  );
});
