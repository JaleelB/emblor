import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Tag, TagsInputRootProps } from '../utils/types';

export function useTagInput({
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
  inputBlurBehavior = 'none',
  labelId,
  onBlur,
  onFocus,
}: TagsInputRootProps) {
  const [tags, setTags] = useControllableState({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  const currentTags = tags ?? [];

  const [inputValue, setInputValue] = useState('');
  const placeholder = useMemo(
    () => (maxTags && currentTags.length >= maxTags ? placeholderWhenFull : ''),
    [currentTags.length, maxTags, placeholderWhenFull],
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(activeIndexProp);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(focusedIndexProp);
  const [isInvalidInput, setIsInvalidInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTagClick = useCallback(
    (tag: Tag) => {
      if (readOnly || disabled) return;
      const index = currentTags.findIndex((t) => t.id === tag.id);
      setActiveIndex(index);
      onTagClick?.(tag);
    },
    [currentTags, readOnly, disabled, onTagClick],
  );

  const getDelimiter = useCallback(
    (forSplit = false) => {
      const defaultDelimiter = ',';
      if (Array.isArray(delimiter)) {
        return delimiter[0] || defaultDelimiter;
      }
      return delimiter || (forSplit ? defaultDelimiter : 'Enter');
    },
    [delimiter],
  );

  const handleAddTag = useCallback(
    (text: string, options?: { viaPaste?: boolean }) => {
      if (readOnly || disabled) return false;
      if (maxTags && (tags ?? []).length >= maxTags) return false;
      if (minLength && text.length < minLength) return false;
      if (maxLength && text.length > maxLength) return false;
      if (validateTag && !validateTag(text)) return false;
      if (!allowDuplicates && currentTags.some((t) => t.text === text)) return false;

      if (addOnPaste && options?.viaPaste) {
        const splitDelimiter = getDelimiter(true);
        const splitValues = text
          .split(splitDelimiter)
          .map((v) => v.trim())
          .filter(Boolean);

        if (currentTags.length + splitValues.length > maxTags) return false;

        const newTags = splitValues
          .filter((v) => !currentTags.some((t) => t.text === v))
          .filter((v) => !validateTag || validateTag(v))
          .map((text) => ({ id: generateTagId(), text }));

        if (newTags.length === 0) return false;

        setTags((prev) => [...(prev ?? []), ...newTags]);
        newTags.forEach((tag) => onTagAdd?.(tag.text, { viaPaste: true }));
        setIsInvalidInput(false);
        setInputValue('');
        return true;
      }

      const newTag: Tag = {
        id: generateTagId(),
        text: text.trim(),
      };

      setTags((prev) => [...(prev ?? []), newTag]);
      onTagAdd?.(text, options);
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
      addOnPaste,
      getDelimiter,
      generateTagId,
      setTags,
      onTagAdd,
    ],
  );

  const handleRemoveTag = useCallback(
    (id: string) => {
      if (readOnly || disabled) return;
      if (minTags && currentTags.length <= minTags) return;

      const tag = currentTags.find((t) => t.id === id);
      if (tag) {
        setTags((prev) => {
          const newTags = (prev ?? []).filter((t) => t.id !== id);
          onValueChange?.(newTags);
          return newTags;
        });
        onTagRemove?.(tag.text);
      }
    },
    [currentTags, minTags, readOnly, disabled, setTags, onTagRemove, onValueChange],
  );

  const handleClearTags = useCallback(() => {
    if (readOnly || disabled) return;
    if (minTags > 0) return;

    setTags([]);
    onClearAll?.();
  }, [minTags, readOnly, disabled, setTags, onClearAll]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      onInputKeydown?.(event);
      if (event.defaultPrevented) return;

      const target = event.target as HTMLInputElement;
      const isDelimiterKey = Array.isArray(delimiter)
        ? delimiter.includes(event.key)
        : event.key === delimiter || event.key === 'Enter';

      if (isDelimiterKey && target.value) {
        event.preventDefault();
        handleAddTag(target.value);
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
    [currentTags, focusedIndex, delimiter, handleAddTag, handleRemoveTag, onInputKeydown],
  );

  const handleInputBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const value = event.target.value.trim();
      if (value && inputBlurBehavior === 'add') {
        handleAddTag(value);
        event.target.value = '';
      } else if (inputBlurBehavior === 'clear') {
        event.target.value = '';
      }
      onBlur?.(event);
    },
    [inputBlurBehavior, handleAddTag, onBlur],
  );

  const handleInputFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      onFocus?.(event);
    },
    [onFocus],
  );

  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setInputValue(newValue);

      if (addOnPaste) {
        const splitDelimiter = getDelimiter(true);
        if (newValue.includes(splitDelimiter)) {
          handleAddTag(newValue, { viaPaste: true });
          event.target.value = '';
          setIsInvalidInput(false);
        }
      }
    },
    [addOnPaste, getDelimiter, handleAddTag],
  );

  return {
    disabled,
    readOnly,
    tags: currentTags,
    inputValue,
    setInputValue,
    placeholder,
    focusedIndex,
    delimiter: Array.isArray(delimiter) ? delimiter[0] : delimiter,
    setFocusedIndex: setFocusedIndexProp ?? setFocusedIndex,
    inputRef,
    onKeyDown,
    onBlur: handleInputBlur,
    onFocus: handleInputFocus,
    onInputChange,
    onTagClick: handleTagClick,
    activeIndex: activeIndexProp ?? activeIndex,
    setActiveIndex: setActiveIndexProp ?? setActiveIndex,
    isInvalidInput,
    setIsInvalidInput,
    inputBlurBehavior,
    labelId,
    addOnPaste,
    maxTags,
    handleRemoveTag,
    onTagAdd: handleAddTag,
    onClearTags: handleClearTags,
  };
}
