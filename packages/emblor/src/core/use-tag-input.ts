import { useCallback, useEffect, useRef, useState } from 'react';
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
  blurBehavior = 'none',
}: TagsInputRootProps) {
  const [tags, setTags] = useControllableState({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  const [focusedIndex, setFocusedIndex] = useState<number | null>(focusedIndexProp);
  const [inputValue, setInputValue] = useState('');
  const [placeholder, setPlaceholder] = useState(placeholderWhenFull);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (maxTags && (tags ?? []).length >= maxTags) {
      setPlaceholder(placeholderWhenFull);
    }
  }, [tags?.length, maxTags, placeholderWhenFull]);

  const handleTagClick = useCallback(
    (tag: Tag) => {
      if (readOnly || disabled) return;
      onTagClick?.(tag);
    },
    [readOnly, disabled, onTagClick],
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

  const onAddTag = useCallback(
    (text: string, options?: { viaPaste?: boolean }) => {
      if (readOnly || disabled) return false;
      if (maxTags && (tags ?? []).length >= maxTags) return false;
      if (minLength && text.length < minLength) return false;
      if (maxLength && text.length > maxLength) return false;
      if (validateTag && !validateTag(text)) return false;
      if (!allowDuplicates && (tags ?? []).some((t) => t.text === text)) return false;

      if (addOnPaste && options?.viaPaste) {
        const splitDelimiter = getDelimiter(true);
        const splitValues = text
          .split(splitDelimiter)
          .map((v) => v.trim())
          .filter(Boolean);

        if ((tags ?? []).length + splitValues.length > maxTags) return false;

        const newTags = splitValues
          .filter((v) => !(tags ?? []).some((t) => t.text === v))
          .filter((v) => !validateTag || validateTag(v))
          .map((text) => ({ id: generateTagId(), text }));

        if (newTags.length === 0) return false;

        setTags((prev) => [...(prev ?? []), ...newTags]);
        newTags.forEach((tag) => onTagAdd?.(tag.text));
        return true;
      }

      const newTag: Tag = {
        id: generateTagId(),
        text: text.trim(),
      };

      setTags((prev) => [...(prev ?? []), newTag]);
      onTagAdd?.(text);
      setInputValue('');
      return true;
    },
    [
      tags,
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

  const onRemoveTag = useCallback(
    (id: string) => {
      if (readOnly || disabled) return;
      if (minTags && (tags ?? []).length <= minTags) return;

      const tag = (tags ?? []).find((t) => t.id === id);
      if (tag) {
        setTags((prev) => (prev ?? []).filter((t) => t.id !== id));
        onTagRemove?.(tag.text);
      }
    },
    [tags, minTags, readOnly, disabled, setTags, onTagRemove],
  );

  const onClearTags = useCallback(() => {
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
        onAddTag(target.value);
        target.value = '';
        return;
      }

      switch (event.key) {
        case 'Backspace':
        case 'Delete': {
          if (target.value) return;
          if (focusedIndex !== null) {
            const tag = (tags ?? [])[focusedIndex];
            if (tag) {
              onRemoveTag(tag.id);
              setFocusedIndex(event.key === 'Backspace' ? focusedIndex - 1 : focusedIndex);
            }
          } else if (event.key === 'Backspace' && (tags ?? []).length > 0) {
            setFocusedIndex((tags ?? []).length - 1);
          }
          break;
        }
        case 'ArrowLeft': {
          if (target.selectionStart !== 0) return;
          if (focusedIndex === null) {
            setFocusedIndex((tags ?? []).length - 1);
          } else {
            setFocusedIndex(focusedIndex === 0 ? (tags ?? []).length - 1 : focusedIndex - 1);
          }
          break;
        }
        case 'ArrowRight': {
          if (focusedIndex === null) {
            setFocusedIndex(0);
          } else {
            setFocusedIndex(focusedIndex === (tags ?? []).length - 1 ? 0 : focusedIndex + 1);
          }
          break;
        }
        case 'Home': {
          setFocusedIndex(0);
          break;
        }
        case 'End': {
          setFocusedIndex((tags ?? []).length - 1);
          break;
        }
        case 'Escape': {
          setFocusedIndex(null);
          target.blur();
          break;
        }
      }
    },
    [tags, focusedIndex, delimiter, onAddTag, onRemoveTag, onInputKeydown],
  );

  const onBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const value = event.target.value.trim();
      if (!value) return;

      if (blurBehavior === 'add') {
        onAddTag(value);
        event.target.value = '';
      } else if (blurBehavior === 'clear') {
        event.target.value = '';
      }

      if (addTagsOnBlur) {
        onAddTag(value);
        event.target.value = '';
      }
    },
    [blurBehavior, addTagsOnBlur, onAddTag],
  );

  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setInputValue(newValue);

      if (addOnPaste) {
        const splitDelimiter = getDelimiter(true);
        if (newValue.includes(splitDelimiter)) {
          onAddTag(newValue, { viaPaste: true });
          event.target.value = '';
        }
      }
    },
    [addOnPaste, getDelimiter, onAddTag],
  );

  return {
    tags: tags ?? [],
    inputValue,
    setInputValue,
    placeholder,
    focusedIndex,
    setFocusedIndex: setFocusedIndexProp ?? setFocusedIndex,
    inputRef,
    onAddTag,
    onRemoveTag,
    onClearTags,
    onKeyDown,
    onBlur,
    onInputChange,
    onTagClick: handleTagClick,
  };
}
