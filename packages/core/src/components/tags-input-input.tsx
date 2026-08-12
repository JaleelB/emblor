import * as React from 'react';
import type { EmblorInputProps } from '@emblor/types';
import { composeEventHandlers, mergeRefs, useStoreSelector } from '@emblor/utils';
import { useEmblorContext } from '../tags-input-context';

function normalizeDelimiterForPaste(value: string): string {
  if (value === 'Enter') {
    return '\n';
  }
  if (value === 'Tab') {
    return '\t';
  }
  return value;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const EmblorInput = React.forwardRef<HTMLInputElement, EmblorInputProps>(
  function EmblorInput(props, forwardedRef) {
    const { as, value, onValueChange, placeholder, ariaDescribedBy, onKeyDown, onPaste, ...rest } = props;
    const {
      store,
      disabled,
      readOnly,
      setInputValue,
      commitTag,
      setFocusedIndex,
      setActiveIndex,
      focusTag,
      setInputFocused,
      inputBlurBehavior,
      delimiter,
      addOnPaste,
      onInputKeydown,
      inputId,
      inputRef,
      listId,
      labelId,
      placeholderWhenFull,
      maxTags,
    } = useEmblorContext('Emblor.Input');

    const Component = (as ?? 'input') as React.ElementType;

    const tagCount = useStoreSelector(store, function selectTagCount(state) {
      return state.tags.length;
    });
    const inputValueFromStore = useStoreSelector(store, function selectInputValue(state) {
      return state.inputValue;
    });

    const displayValue = value !== undefined ? value : inputValueFromStore;
    const isMaxed = typeof maxTags === 'number' ? tagCount >= maxTags : false;
    const resolvedPlaceholder = isMaxed && placeholderWhenFull ? placeholderWhenFull : placeholder;

    React.useEffect(
      function syncControlledValue() {
        if (value !== undefined) {
          setInputValue(value);
        }
      },
      [setInputValue, value],
    );

    const combinedRef = mergeRefs(inputRef, forwardedRef);

    const handleChange = React.useCallback(
      function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const nextValue = event.target.value;
        if (value === undefined) {
          setInputValue(nextValue);
        }
        if (onValueChange) {
          onValueChange(nextValue);
        }
      },
      [onValueChange, setInputValue, value],
    );

    const handleKeyDown = React.useCallback(
      function onKeyDownHandler(event: React.KeyboardEvent<HTMLInputElement>) {
        if (onInputKeydown) {
          onInputKeydown(event);
        }
        if (delimiter.includes(event.key)) {
          if (displayValue.trim().length > 0) {
            event.preventDefault();
            commitTag(displayValue, { source: 'keyboard' });
          }
          return;
        }
        if (event.key === 'Backspace' && displayValue.length === 0 && tagCount > 0) {
          event.preventDefault();
          setFocusedIndex(tagCount - 1);
          setActiveIndex(tagCount - 1);
          focusTag(tagCount - 1);
          return;
        }
        if (event.key === 'ArrowLeft' && event.currentTarget.selectionStart === 0 && tagCount > 0) {
          event.preventDefault();
          setFocusedIndex(tagCount - 1);
          setActiveIndex(tagCount - 1);
          focusTag(tagCount - 1);
          return;
        }
      },
      [commitTag, delimiter, displayValue, focusTag, onInputKeydown, setActiveIndex, setFocusedIndex, tagCount],
    );

    const handleFocus = React.useCallback(
      function onFocusHandler() {
        setInputFocused(true);
        setFocusedIndex(null);
        setActiveIndex(null);
      },
      [setActiveIndex, setFocusedIndex, setInputFocused],
    );

    const handleBlur = React.useCallback(
      function onBlurHandler(event: React.FocusEvent<HTMLInputElement>) {
        setInputFocused(false);
        if (inputBlurBehavior === 'commit' && displayValue.trim().length > 0) {
          commitTag(displayValue, { source: 'blur' });
          return;
        }
        if (inputBlurBehavior === 'discard' && value === undefined) {
          setInputValue('');
        }
      },
      [commitTag, displayValue, inputBlurBehavior, setInputFocused, setInputValue, value],
    );

    const handlePaste = React.useCallback(
      function onPasteHandler(event: React.ClipboardEvent<HTMLInputElement>) {
        if (!addOnPaste) {
          return;
        }
        const text = event.clipboardData.getData('text');
        if (!text) {
          return;
        }
        event.preventDefault();
        const normalizedSeparators = delimiter.map(normalizeDelimiterForPaste);
        const pattern = new RegExp(normalizedSeparators.map(escapeRegex).join('|'));
        const segments = text.split(pattern).map(function trim(segment) {
          return segment.trim();
        });
        segments.forEach(function iterate(segment) {
          if (segment.length === 0) {
            return;
          }
          commitTag(segment, { source: 'paste' });
        });
      },
      [addOnPaste, commitTag, delimiter],
    );

    const resolvedOnKeyDown = composeEventHandlers(onKeyDown, handleKeyDown, {
      checkForDefaultPrevented: true,
    });
    const resolvedOnPaste = composeEventHandlers(onPaste, handlePaste);

    return (
      <Component
        {...rest}
        ref={combinedRef}
        id={inputId}
        role="textbox"
        aria-autocomplete="list"
        aria-controls={listId}
        aria-expanded={false}
        aria-activedescendant={null}
        aria-describedby={ariaDescribedBy}
        aria-labelledby={labelId}
        aria-disabled={disabled}
        aria-readonly={readOnly}
        disabled={disabled}
        readOnly={readOnly}
        value={displayValue}
        onChange={handleChange}
        onKeyDown={resolvedOnKeyDown}
        onFocus={composeEventHandlers(props.onFocus, handleFocus)}
        onBlur={composeEventHandlers(props.onBlur, handleBlur)}
        onPaste={resolvedOnPaste}
        placeholder={resolvedPlaceholder}
        data-disabled={disabled ? '' : undefined}
        data-readonly={readOnly ? '' : undefined}
        data-max-reached={isMaxed ? '' : undefined}
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        inputMode="text"
      />
    );
  },
);
