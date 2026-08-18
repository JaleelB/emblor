import * as React from 'react';
import type { EmblorTagComponent, EmblorTagProps } from '../../types';
import { composeEventHandlers, isComposingEvent, mergeRefs } from '../../utils';
import { EmblorTagProvider, useEmblorTagsContext } from '../tags-input-context';

const EmblorTagImpl = React.forwardRef<HTMLElement, EmblorTagProps<any>>(function EmblorTag(props, forwardedRef) {
  const { as, index, children, onKeyDown, onClick, onFocus, onBlur, ...rest } = props;
  const {
    values,
    disabled,
    readOnly,
    actualFocusedIndex,
    setTagFocused,
    focusInput,
    focusTag,
    removeTag,
    getMountedTagIndexes,
    getDirection,
    registerTagNode,
  } = useEmblorTagsContext('EmblorTag');

  if (!Number.isFinite(index) || !Number.isInteger(index) || index < 0 || index >= values.length) {
    throw new Error(`EmblorTag index ${index} must be a valid position in the current EmblorRoot value.`);
  }

  const tagValue = values[index];
  const tagTokenRef = React.useRef(Symbol());
  const tagNodeRef = React.useRef<HTMLElement | null>(null);
  const registeredCleanupRef = React.useRef<(() => void) | null>(null);
  const assignRef = React.useMemo(
    function createTagRef() {
      return mergeRefs(forwardedRef as React.Ref<HTMLElement>, function capture(node: HTMLElement | null) {
        tagNodeRef.current = node;
      });
    },
    [forwardedRef],
  );

  React.useLayoutEffect(
    function registerTag() {
      registeredCleanupRef.current?.();
      registeredCleanupRef.current = registerTagNode(index, tagNodeRef.current, tagTokenRef.current);
      return function cleanupTag() {
        registeredCleanupRef.current?.();
        registeredCleanupRef.current = null;
      };
    },
    [index, registerTagNode],
  );

  const handleClick = React.useCallback(
    function handleTagClick(event: React.MouseEvent<HTMLElement>) {
      if (disabled) {
        return;
      }
      event.currentTarget.focus();
      setTagFocused(index);
    },
    [disabled, index, setTagFocused],
  );

  const handleFocus = React.useCallback(
    function handleTagFocus(event: React.FocusEvent<HTMLElement>) {
      if (event.target === event.currentTarget) {
        setTagFocused(index);
      }
    },
    [index, setTagFocused],
  );

  const handleBlur = React.useCallback(
    function handleTagBlur(event: React.FocusEvent<HTMLElement>) {
      if (event.target === event.currentTarget) {
        setTagFocused(null);
      }
    },
    [setTagFocused],
  );

  const handleKeyDown = React.useCallback(
    function handleTagKeyDown(event: React.KeyboardEvent<HTMLElement>) {
      if (isComposingEvent(event)) {
        return;
      }
      const mountedIndexes = getMountedTagIndexes();
      const position = mountedIndexes.indexOf(index);

      if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        removeTag(index, 'keyboard');
        return;
      }
      if (event.key === 'Home') {
        event.preventDefault();
        if (mountedIndexes[0] !== undefined) {
          focusTag(mountedIndexes[0]);
        }
        return;
      }
      if (event.key === 'End') {
        event.preventDefault();
        const lastIndex = mountedIndexes[mountedIndexes.length - 1];
        if (lastIndex !== undefined) {
          focusTag(lastIndex);
        }
        return;
      }
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
        return;
      }

      event.preventDefault();
      const direction = getDirection();
      const movesForward = direction === 'ltr' ? event.key === 'ArrowRight' : event.key === 'ArrowLeft';
      const targetPosition = position + (movesForward ? 1 : -1);
      const targetIndex = mountedIndexes[targetPosition];
      if (targetIndex === undefined) {
        focusInput();
      } else {
        focusTag(targetIndex);
      }
    },
    [focusInput, focusTag, getDirection, getMountedTagIndexes, index, removeTag],
  );

  const isFocused = actualFocusedIndex === index;
  const Component = (as ?? 'div') as React.ElementType;

  return (
    <EmblorTagProvider value={{ index, value: tagValue }}>
      <Component
        {...(rest as Record<string, unknown>)}
        ref={assignRef}
        role="listitem"
        tabIndex={isFocused ? 0 : -1}
        data-index={index}
        data-state={isFocused ? 'focused' : 'idle'}
        data-focused={isFocused ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        data-readonly={readOnly ? '' : undefined}
        aria-disabled={disabled || undefined}
        aria-readonly={readOnly || undefined}
        onClick={composeEventHandlers(onClick, handleClick, { checkForDefaultPrevented: true })}
        onFocus={composeEventHandlers(onFocus, handleFocus)}
        onBlur={composeEventHandlers(onBlur, handleBlur)}
        onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown, { checkForDefaultPrevented: true })}
      >
        {children}
      </Component>
    </EmblorTagProvider>
  );
});

export const EmblorTag = EmblorTagImpl as EmblorTagComponent;
