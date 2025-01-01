import * as React from 'react';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Primitive } from '@radix-ui/react-primitive';

import { Props, Tag, TagsInputRootProps } from '../utils/types';
import { TagsInputProvider } from './tags-input-context';

const TagsInputRoot = React.forwardRef<HTMLDivElement, Props<'div', TagsInputRootProps>>(
  (
    {
      as: Component = 'div',
      value,
      defaultValue = [],
      onValueChange,
      maxTags = Number.POSITIVE_INFINITY,
      minTags = 0,
      allowDuplicates = false,
      validateTag,
      onTagAdd,
      onTagRemove,
      onClearAll,
      delimiter = [',', 'Enter'],
      addOnPaste = false,
      addTagsOnBlur = false,
      readOnly = false,
      disabled = false,
      placeholderWhenFull = '',
      minLength,
      maxLength,
      onTagClick,
      generateTagId = () => crypto.randomUUID(),
      onInputKeydown,
      focusedIndex: focusedIndexProp = null,
      setFocusedIndex: setFocusedIndexProp,
      activeIndex: activeIndexProp = null,
      setActiveIndex: setActiveIndexProp,
      blurBehavior = 'none',
      labelId,
      children,
      ...rootProps
    },
    forwardedRef,
  ) => {
    const [tags, setTags] = useControllableState({
      prop: value,
      defaultProp: defaultValue,
      onChange: onValueChange,
    });

    const currentTags = tags ?? [];

    const [inputValue, setInputValue] = React.useState('');
    const placeholder = React.useMemo(
      () => (maxTags && currentTags.length >= maxTags ? placeholderWhenFull : ''),
      [currentTags.length, maxTags, placeholderWhenFull],
    );
    const [activeIndex, setActiveIndex] = React.useState<number | null>(activeIndexProp);
    const [focusedIndex, setFocusedIndex] = React.useState<number | null>(focusedIndexProp);
    const [isInvalidInput, setIsInvalidInput] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleTagClick = React.useCallback(
      (tag: Tag) => {
        if (readOnly || disabled) return;
        const index = currentTags.findIndex((t) => t.id === tag.id);
        setActiveIndex(index);
        onTagClick?.(tag);
      },
      [currentTags, readOnly, disabled, onTagClick],
    );

    const handleRemoveTag = React.useCallback(
      (id: string) => {
        if (readOnly || disabled) return;
        if (minTags && currentTags.length <= minTags) return;

        const tag = currentTags.find((t) => t.id === id);
        if (tag) {
          setTags((prev) => (prev ?? []).filter((t) => t.id !== id));
          onTagRemove?.(tag.text);
        }
      },
      [currentTags, minTags, readOnly, disabled, setTags, onTagRemove],
    );

    const handleTagAdd = React.useCallback(
      (text: string) => {
        if (readOnly || disabled) return false;
        if (maxTags && currentTags.length >= maxTags) return false;
        if (minLength && text.length < minLength) return false;
        if (maxLength && text.length > maxLength) return false;
        if (validateTag && !validateTag(text)) {
          setIsInvalidInput(true);
          return false;
        }
        if (!allowDuplicates && currentTags.some((t) => t.text === text)) return false;

        const newTag: Tag = {
          id: generateTagId(),
          text: text.trim(),
        };

        setTags((prev) => [...(prev ?? []), newTag]);
        onTagAdd?.(text);
        setIsInvalidInput(false);
        setInputValue('');
        return true;
      },
      [
        currentTags,
        maxTags,
        minLength,
        maxLength,
        validateTag,
        allowDuplicates,
        readOnly,
        disabled,
        generateTagId,
        setTags,
        onTagAdd,
      ],
    );

    const handleInputChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
      setIsInvalidInput(false);
    }, []);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent) => {
        onInputKeydown?.(event);
        if (event.defaultPrevented) return;

        const target = event.target as HTMLInputElement;
        const isDelimiterKey = Array.isArray(delimiter)
          ? delimiter.includes(event.key)
          : event.key === delimiter || event.key === 'Enter';

        if (isDelimiterKey && target.value) {
          event.preventDefault();
          handleTagAdd(target.value);
          target.value = '';
          return;
        }

        switch (event.key) {
          case 'Backspace':
          case 'Delete': {
            if (target.value) return;
            if (focusedIndex !== null) {
              const tag = currentTags[focusedIndex];
              if (tag) {
                handleRemoveTag(tag.id);
                setFocusedIndex(event.key === 'Backspace' ? focusedIndex - 1 : focusedIndex);
              }
            } else if (event.key === 'Backspace' && currentTags.length > 0) {
              setFocusedIndex(currentTags.length - 1);
            }
            break;
          }
          case 'ArrowLeft': {
            if (target.selectionStart !== 0) return;
            if (focusedIndex === null) {
              setFocusedIndex(currentTags.length - 1);
            } else {
              setFocusedIndex(focusedIndex === 0 ? currentTags.length - 1 : focusedIndex - 1);
            }
            break;
          }
          case 'ArrowRight': {
            if (focusedIndex === null) {
              setFocusedIndex(0);
            } else {
              setFocusedIndex(focusedIndex === currentTags.length - 1 ? 0 : focusedIndex + 1);
            }
            break;
          }
          case 'Home': {
            setFocusedIndex(0);
            break;
          }
          case 'End': {
            setFocusedIndex(currentTags.length - 1);
            break;
          }
          case 'Escape': {
            setFocusedIndex(null);
            target.blur();
            break;
          }
        }
      },
      [currentTags, focusedIndex, delimiter, handleTagAdd, handleRemoveTag, onInputKeydown, setFocusedIndex],
    );

    const handleBlur = React.useCallback(
      (event: React.FocusEvent) => {
        if (addTagsOnBlur) {
          const value = (event.target as HTMLInputElement).value.trim();
          if (value) handleTagAdd(value);
        }
      },
      [addTagsOnBlur, handleTagAdd],
    );

    const handleClearTags = React.useCallback(() => {
      if (readOnly || disabled) return;
      setTags([]);
      onClearAll?.();
    }, [readOnly, disabled, setTags, onClearAll]);

    const contextValue = React.useMemo(
      () => ({
        disabled,
        readOnly,
        inputRef,
        inputValue,
        placeholder,
        onKeyDown: handleKeyDown,
        onBlur: handleBlur,
        onInputChange: handleInputChange,
        onTagAdd: handleTagAdd,
        delimiter: Array.isArray(delimiter) ? delimiter[0] : delimiter,
        addOnPaste,
        blurBehavior,
        labelId,
        isInvalidInput,
        activeIndex,
        setActiveIndex,
        tags: currentTags,
        maxTags,
        focusedIndex,
        setFocusedIndex,
        onTagClick: handleTagClick,
        handleRemoveTag,
        onClearTags: handleClearTags,
      }),
      [
        disabled,
        readOnly,
        inputValue,
        placeholder,
        handleKeyDown,
        handleBlur,
        handleInputChange,
        handleTagAdd,
        delimiter,
        addOnPaste,
        blurBehavior,
        labelId,
        isInvalidInput,
        activeIndex,
        setActiveIndex,
        currentTags,
        maxTags,
        focusedIndex,
        setFocusedIndex,
        handleTagClick,
        handleRemoveTag,
        handleClearTags,
      ],
    );

    return (
      <TagsInputProvider value={contextValue}>
        <Primitive.div ref={forwardedRef} {...rootProps}>
          {children}
        </Primitive.div>
      </TagsInputProvider>
    );
  },
);

TagsInputRoot.displayName = 'TagsInputRoot';

const Root = TagsInputRoot;

export { Root, TagsInputRoot };
export type { TagsInputRootProps };
