import * as React from 'react';
import type { EmblorRootProps, TagValue } from '../../types';
import {
  composeEventHandlers,
  createStore,
  mergeRefs,
  useControllableState,
  useStableCallback,
  useStoreSelector,
} from '../../utils';
import { EmblorProvider, type EmblorAnnouncement, type EmblorStoreState } from '../tags-input-context';

const DEFAULT_DELIMITERS: Array<string> = [',', 'Enter'];
const DEFAULT_INPUT_BLUR_BEHAVIOR: 'commit' | 'discard' | 'noop' = 'commit';

export const EmblorRoot = React.forwardRef<HTMLElement, EmblorRootProps>(function EmblorRoot(props, forwardedRef) {
  const {
    as,
    children,
    className,
    onFocus,
    onBlur,
    value,
    defaultValue,
    onValueChange,
    maxTags,
    minTags,
    allowDuplicates = false,
    validateTag,
    onTagAdd,
    onTagRemove,
    onClearAll,
    delimiter = DEFAULT_DELIMITERS,
    addOnPaste = true,
    readOnly = false,
    disabled = false,
    placeholderWhenFull,
    minLength,
    maxLength,
    onTagClick,
    generateTagId,
    onInputKeydown,
    focusedIndex,
    setFocusedIndex,
    activeIndex,
    setActiveIndex,
    inputBlurBehavior = DEFAULT_INPUT_BLUR_BEHAVIOR,
    labelId,
    id,
  } = props;

  const Component = (as ?? 'div') as React.ElementType;
  const reactId = React.useId();
  const sanitizedReactId = React.useMemo(
    function memoizeId() {
      return reactId.replace(/:/g, '');
    },
    [reactId],
  );
  const rootId = React.useMemo(
    function resolveRootId() {
      return id ?? `emblor-${sanitizedReactId}`;
    },
    [id, sanitizedReactId],
  );
  const inputId = `${rootId}-input`;
  const listId = `${rootId}-list`;

  const [tagValues, setTagValues] = useControllableState<Array<TagValue>>({
    value,
    defaultValue: defaultValue ?? [],
    onChange: onValueChange,
  });

  const [focusedIndexState, setFocusedIndexState] = useControllableState<number | null>({
    value: focusedIndex !== undefined ? focusedIndex : undefined,
    defaultValue: null,
    onChange: setFocusedIndex,
  });

  const [activeIndexState, setActiveIndexState] = useControllableState<number | null>({
    value: activeIndex !== undefined ? activeIndex : undefined,
    defaultValue: null,
    onChange: setActiveIndex,
  });

  const storeRef = React.useRef(
    createStore<EmblorStoreState>({
      tags: [],
      inputValue: '',
      isFocusWithin: false,
      focusedIndex: focusedIndexState,
      activeIndex: activeIndexState,
      isInputFocused: false,
      lastAction: { type: 'none' },
      validationError: null,
    }),
  );
  const store = storeRef.current;

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const listRef = React.useRef<HTMLElement | null>(null);
  const rootRef = React.useRef<HTMLElement | null>(null);
  const tagRefs = React.useRef<Map<number, HTMLElement | null>>(new Map());

  const getTagValue = React.useCallback(
    function resolveTagValue(index: number): string | null {
      return tagValues[index] ?? null;
    },
    [tagValues],
  );

  const generateTagIdCallback = useStableCallback(function resolveTagId(tag: string, index: number): string {
    if (generateTagId) {
      return generateTagId(tag, index);
    }
    return `${rootId}-tag-${index}`;
  });

  const getTagId = React.useCallback(
    function computeTagId(index: number): string {
      const tag = tagValues[index];
      if (tag === undefined) {
        return `${rootId}-tag-${index}`;
      }
      return generateTagIdCallback(tag, index);
    },
    [generateTagIdCallback, rootId, tagValues],
  );

  const setInputValue = React.useCallback(
    function updateInputValue(next: string) {
      store.setState(function apply(prev) {
        if (prev.inputValue === next) {
          return prev;
        }
        return { ...prev, inputValue: next };
      });
    },
    [store],
  );

  const setInputFocused = React.useCallback(
    function updateInputFocused(next: boolean) {
      store.setState(function apply(prev) {
        if (prev.isInputFocused === next) {
          return prev;
        }
        return { ...prev, isInputFocused: next };
      });
    },
    [store],
  );

  const setFocusWithin = React.useCallback(
    function updateFocusWithin(next: boolean) {
      store.setState(function apply(prev) {
        if (prev.isFocusWithin === next) {
          return prev;
        }
        return { ...prev, isFocusWithin: next };
      });
    },
    [store],
  );

  React.useEffect(
    function syncFocusIndex() {
      store.setState(function apply(prev) {
        if (prev.focusedIndex === focusedIndexState) {
          return prev;
        }
        return { ...prev, focusedIndex: focusedIndexState };
      });
    },
    [focusedIndexState, store],
  );

  React.useEffect(
    function syncActiveIndex() {
      store.setState(function apply(prev) {
        if (prev.activeIndex === activeIndexState) {
          return prev;
        }
        return { ...prev, activeIndex: activeIndexState };
      });
    },
    [activeIndexState, store],
  );

  const syncTags = React.useCallback(
    function createTagRecords(values: Array<string>) {
      return values.map(function mapToTag(value: string, index: number) {
        return { id: generateTagIdCallback(value, index), value };
      });
    },
    [generateTagIdCallback],
  );

  React.useEffect(
    function updateTagsInStore() {
      store.setState(function apply(prev) {
        const nextTags = syncTags(tagValues);
        return { ...prev, tags: nextTags };
      });
    },
    [store, syncTags, tagValues],
  );

  const validateTagText = useStableCallback(function runValidation(text: string): { valid: boolean; value: string } {
    let normalized = text.trim();
    if (normalized.length === 0) {
      return { valid: false, value: normalized };
    }
    if (minLength !== undefined && normalized.length < minLength) {
      return { valid: false, value: normalized };
    }
    if (maxLength !== undefined && normalized.length > maxLength) {
      return { valid: false, value: normalized.slice(0, maxLength) };
    }
    if (validateTag) {
      const result = validateTag(normalized);
      if (typeof result === 'string') {
        normalized = result;
      } else if (!result) {
        return { valid: false, value: normalized };
      }
    }
    if (!allowDuplicates) {
      const exists = tagValues.some(function compare(existing) {
        return existing === normalized;
      });
      if (exists) {
        return { valid: false, value: normalized };
      }
    }
    if (maxTags !== undefined && tagValues.length >= maxTags) {
      return { valid: false, value: normalized };
    }
    return { valid: true, value: normalized };
  });

  const commitTag = React.useCallback(
    function handleCommit(rawValue: string, meta?: { source: 'keyboard' | 'paste' | 'blur' }): boolean {
      if (disabled || readOnly) {
        return false;
      }
      const validation = validateTagText(rawValue);
      if (!validation.valid) {
        store.setState(function apply(prev) {
          return { ...prev, validationError: 'invalid' };
        });
        return false;
      }
      const committedValue = validation.value;
      const nextValues = [...tagValues, committedValue];
      const committedIndex = nextValues.length - 1;
      setTagValues(nextValues);
      setInputValue('');
      setFocusedIndexState(committedIndex);
      setActiveIndexState(committedIndex);
      store.setState(function apply(prev) {
        const announcement: EmblorAnnouncement = {
          type: 'tag-added',
          value: committedValue,
          index: committedIndex,
        };
        return {
          ...prev,
          inputValue: '',
          focusedIndex: committedIndex,
          activeIndex: committedIndex,
          lastAction: announcement,
          validationError: null,
        };
      });
      if (onTagAdd) {
        onTagAdd(committedValue, committedIndex);
      }
      return true;
    },
    [
      allowDuplicates,
      disabled,
      onTagAdd,
      readOnly,
      setActiveIndexState,
      setFocusedIndexState,
      setInputValue,
      setTagValues,
      store,
      tagValues,
      validateTagText,
    ],
  );

  const removeTag = React.useCallback(
    function handleRemove(indexToRemove: number) {
      if (disabled || readOnly) {
        return;
      }
      if (minTags !== undefined && tagValues.length <= minTags) {
        return;
      }
      const existing = tagValues[indexToRemove];
      if (existing === undefined) {
        return;
      }
      const nextValues = tagValues.filter(function filterValue(_, index) {
        return index !== indexToRemove;
      });
      setTagValues(nextValues);
      const nextLength = nextValues.length;
      const resolvedFocused = focusedIndexState !== null ? Math.min(focusedIndexState, nextLength - 1) : null;
      const resolvedActive = activeIndexState !== null ? Math.min(activeIndexState, nextLength - 1) : null;
      const nextFocused = resolvedFocused !== null && resolvedFocused >= 0 ? resolvedFocused : null;
      const nextActive = resolvedActive !== null && resolvedActive >= 0 ? resolvedActive : null;
      setFocusedIndexState(nextFocused);
      setActiveIndexState(nextActive);
      store.setState(function apply(prev) {
        const announcement: EmblorAnnouncement = {
          type: 'tag-removed',
          value: existing,
          index: indexToRemove,
        };
        return {
          ...prev,
          focusedIndex: nextFocused,
          activeIndex: nextActive,
          lastAction: announcement,
          validationError: null,
        };
      });
      if (onTagRemove) {
        onTagRemove(existing, indexToRemove);
      }
    },
    [
      activeIndexState,
      disabled,
      focusedIndexState,
      minTags,
      onTagRemove,
      readOnly,
      setActiveIndexState,
      setFocusedIndexState,
      setTagValues,
      store,
      tagValues,
    ],
  );

  const clearTags = React.useCallback(
    function handleClear() {
      if (disabled || readOnly) {
        return;
      }
      setTagValues([]);
      setFocusedIndexState(null);
      setActiveIndexState(null);
      store.setState(function apply(prev) {
        const announcement: EmblorAnnouncement = { type: 'cleared' };
        return {
          ...prev,
          inputValue: '',
          focusedIndex: null,
          activeIndex: null,
          lastAction: announcement,
          validationError: null,
        };
      });
      if (onClearAll) {
        onClearAll();
      }
    },
    [disabled, onClearAll, readOnly, setActiveIndexState, setFocusedIndexState, setTagValues, store],
  );

  const focusTag = React.useCallback(
    function focusByIndex(index: number) {
      const node = tagRefs.current.get(index);
      if (node) {
        node.focus();
      }
      setFocusedIndexState(index);
      setActiveIndexState(index);
      store.setState(function apply(prev) {
        return { ...prev, focusedIndex: index, activeIndex: index };
      });
    },
    [setActiveIndexState, setFocusedIndexState, store],
  );

  const focusInput = React.useCallback(function focusInputNode() {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const registerTagNode = React.useCallback(function register(index: number, node: HTMLElement | null) {
    if (node) {
      tagRefs.current.set(index, node);
      return;
    }
    tagRefs.current.delete(index);
  }, []);

  const providerValue = React.useMemo(
    function memoizeContext() {
      return {
        store,
        disabled,
        readOnly,
        allowDuplicates,
        maxTags,
        minTags,
        placeholderWhenFull,
        minLength,
        maxLength,
        delimiter,
        addOnPaste,
        inputBlurBehavior,
        rootId,
        listId,
        inputId,
        labelId,
        getTagId,
        setInputValue,
        commitTag,
        removeTag,
        clearTags,
        focusTag,
        setFocusedIndex: setFocusedIndexState,
        setActiveIndex: setActiveIndexState,
        setInputFocused,
        focusInput,
        inputRef,
        listRef,
        getTagValue,
        onTagClick,
        onInputKeydown,
        registerTagNode,
      };
    },
    [
      addOnPaste,
      allowDuplicates,
      clearTags,
      commitTag,
      delimiter,
      disabled,
      focusInput,
      focusTag,
      getTagId,
      getTagValue,
      inputBlurBehavior,
      inputId,
      inputRef,
      labelId,
      listId,
      listRef,
      maxLength,
      maxTags,
      minLength,
      minTags,
      onInputKeydown,
      onTagClick,
      placeholderWhenFull,
      readOnly,
      registerTagNode,
      rootId,
      setActiveIndexState,
      setFocusedIndexState,
      setInputFocused,
      setInputValue,
      store,
    ],
  );

  const handleFocusCapture = React.useCallback(
    function onFocusCaptureHandler() {
      setFocusWithin(true);
    },
    [setFocusWithin],
  );

  const handleBlurCapture = React.useCallback(
    function onBlurCaptureHandler(event: React.FocusEvent<HTMLElement>) {
      const relatedTarget = event.relatedTarget as HTMLElement | null;
      if (rootRef.current && relatedTarget && rootRef.current.contains(relatedTarget)) {
        return;
      }
      setFocusWithin(false);
    },
    [setFocusWithin],
  );

  const dataState = React.useMemo(
    function computeDataState() {
      if (disabled) {
        return 'disabled';
      }
      if (readOnly) {
        return 'readonly';
      }
      return 'active';
    },
    [disabled, readOnly],
  );

  const hasError = useStoreSelector(store, function selectError(state) {
    return state.validationError !== null;
  });

  const isFocusWithin = useStoreSelector(store, function selectFocusWithin(state) {
    return state.isFocusWithin;
  });

  const mergedRef = mergeRefs(rootRef, forwardedRef);

  return (
    <EmblorProvider value={providerValue}>
      <Component
        ref={mergedRef as React.Ref<HTMLElement>}
        id={rootId}
        className={className}
        data-state={dataState}
        data-disabled={disabled ? '' : undefined}
        data-readonly={readOnly ? '' : undefined}
        data-has-error={hasError ? '' : undefined}
        data-focus-within={isFocusWithin ? '' : undefined}
        onFocusCapture={composeEventHandlers(onFocus, handleFocusCapture)}
        onBlurCapture={composeEventHandlers(onBlur, handleBlurCapture)}
        aria-labelledby={labelId}
        role="group"
      >
        {children}
      </Component>
    </EmblorProvider>
  );
});
