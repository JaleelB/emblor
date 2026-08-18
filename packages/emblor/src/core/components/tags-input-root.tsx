import * as React from 'react';
import type {
  EmblorAnnouncement,
  EmblorRejection,
  EmblorRootProps,
  EmblorRootComponent,
  EmblorValueChangeDetails,
} from '../../types';
import {
  arraysEqual,
  composeEventHandlers,
  defaultAnnouncement,
  isInputLikeNode,
  mergeRefs,
  resolveDirection,
} from '../../utils';
import { evaluateBatch, evaluateCandidate } from '../evaluator';
import {
  EmblorProvider,
  type EmblorContextValue,
  type EmblorInputNode,
  type EmblorTagsContextValue,
} from '../tags-input-context';

const DEFAULT_DELIMITERS = [','];
const DEFAULT_BLUR_BEHAVIOR = 'noop' as const;
const ANNOUNCEMENT_INTERVAL_MS = 100;

type OwnedState<T> = {
  value: T;
  controlled: boolean;
  set: (value: T) => void;
  reset: () => void;
};

function useOwnedState<T>({
  controlledValue,
  defaultValue,
  onChange,
  label,
}: {
  controlledValue: T | undefined;
  defaultValue: T;
  onChange?: (value: T) => void;
  label: string;
}): OwnedState<T> {
  const controlled = controlledValue !== undefined;
  const modeRef = React.useRef(controlled);
  const defaultRef = React.useRef(defaultValue);
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);

  if (modeRef.current !== controlled) {
    throw new Error(`EmblorRoot ${label} state cannot switch between controlled and uncontrolled after mount.`);
  }

  const set = React.useCallback(
    function setOwnedValue(next: T) {
      if (!controlled) {
        setUncontrolledValue(next);
      }
      onChange?.(next);
    },
    [controlled, onChange],
  );

  const reset = React.useCallback(
    function resetOwnedValue() {
      if (!controlled) {
        setUncontrolledValue(defaultRef.current);
      }
    },
    [controlled],
  );

  return {
    value: controlled ? (controlledValue as T) : uncontrolledValue,
    controlled,
    set,
    reset,
  };
}

function assertStringArray(value: unknown, propName: string): asserts value is string[] {
  if (
    !Array.isArray(value) ||
    value.some(function isNotString(item) {
      return typeof item !== 'string';
    })
  ) {
    throw new Error(`EmblorRoot ${propName} must be an array containing only strings.`);
  }
}

function assertBound(value: number | undefined, propName: string): void {
  if (value === undefined) {
    return;
  }
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0) {
    throw new Error(`EmblorRoot ${propName} must be a finite, non-negative integer.`);
  }
}

function resolveDelimiters(value: string[] | undefined): string[] {
  const input = value ?? DEFAULT_DELIMITERS;
  if (!Array.isArray(input)) {
    throw new Error('EmblorRoot delimiters must be an array of single Unicode code points.');
  }

  const unique: string[] = [];
  input.forEach(function validateDelimiter(delimiter) {
    if (typeof delimiter !== 'string' || Array.from(delimiter).length !== 1) {
      throw new Error('EmblorRoot delimiters must contain exactly one Unicode code point per entry.');
    }
    if (!unique.includes(delimiter)) {
      unique.push(delimiter);
    }
  });
  return unique;
}

function getDefaultAnnouncement(announcement: EmblorAnnouncement): string {
  return defaultAnnouncement(announcement);
}

type PendingFocus =
  | {
      type: 'remove';
      previous: string[];
      requested: string[];
      removedIndex: number;
      origin: HTMLElement | null;
    }
  | {
      type: 'clear';
      previous: string[];
      requested: string[];
      origin: HTMLElement | null;
    };

type QueuedAnnouncement = {
  id: number;
  message: string;
};

type RegisteredLabel = {
  node: HTMLElement;
  id: string;
  order: number;
};

function getDocumentOrderedLabelIds(
  labels: Map<symbol, RegisteredLabel>,
  ownerDocument: Document | undefined,
): string[] {
  return Array.from(labels.values())
    .filter(function keepConnectedLabel(label) {
      return label.node.isConnected && (!ownerDocument || label.node.ownerDocument === ownerDocument);
    })
    .sort(function compareLabels(first, second) {
      if (first.node.ownerDocument !== second.node.ownerDocument) {
        return first.order - second.order;
      }
      const position = first.node.compareDocumentPosition(second.node);
      if (position & 4) {
        return -1;
      }
      if (position & 2) {
        return 1;
      }
      return first.order - second.order;
    })
    .map(function getLabelId(label) {
      return label.id;
    });
}

const EmblorRootImpl = React.forwardRef<HTMLElement, EmblorRootProps<any>>(function EmblorRoot(props, forwardedRef) {
  const {
    as,
    children,
    value,
    defaultValue,
    onValueChange,
    inputValue,
    defaultInputValue = '',
    onInputValueChange,
    transform,
    validate,
    invalid = false,
    onReject,
    maxTags,
    minTags,
    allowDuplicates = false,
    minLength,
    maxLength,
    delimiters: delimiterProp,
    addOnPaste = true,
    addOnTab = false,
    blurBehavior = DEFAULT_BLUR_BEHAVIOR,
    placeholderWhenFull,
    name,
    required = false,
    readOnly = false,
    disabled = false,
    getAnnouncement,
    dir,
    id: consumerRootId,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    onFocusCapture,
    onBlurCapture,
    onInvalidCapture,
    onReset,
    ...rest
  } = props;

  if (value !== undefined) {
    assertStringArray(value, 'value');
  }
  if (defaultValue !== undefined) {
    assertStringArray(defaultValue, 'defaultValue');
  }
  if (typeof inputValue !== 'undefined' && typeof inputValue !== 'string') {
    throw new Error('EmblorRoot inputValue must be a string.');
  }
  if (typeof defaultInputValue !== 'string') {
    throw new Error('EmblorRoot defaultInputValue must be a string.');
  }

  assertBound(maxTags, 'maxTags');
  assertBound(minTags, 'minTags');
  assertBound(minLength, 'minLength');
  assertBound(maxLength, 'maxLength');
  if (minTags !== undefined && maxTags !== undefined && minTags > maxTags) {
    throw new Error('EmblorRoot minTags cannot be greater than maxTags.');
  }
  if (minLength !== undefined && maxLength !== undefined && minLength > maxLength) {
    throw new Error('EmblorRoot minLength cannot be greater than maxLength.');
  }

  const delimiters = React.useMemo(() => resolveDelimiters(delimiterProp), [delimiterProp]);
  const Component = (as ?? 'div') as React.ElementType;
  const reactId = React.useId().replace(/:/g, '');
  const rootId = consumerRootId ?? `emblor-${reactId}`;
  const generatedInputId = `${rootId}-input`;

  const tagsState = useOwnedState<string[]>({
    controlledValue: value,
    defaultValue: defaultValue ?? [],
    onChange: undefined,
    label: 'value',
  });
  const draftState = useOwnedState<string>({
    controlledValue: inputValue,
    defaultValue: defaultInputValue,
    onChange: onInputValueChange,
    label: 'inputValue',
  });
  const values = tagsState.value;
  const draft = draftState.value;
  const tagsControlled = tagsState.controlled;
  const setOwnedTags = tagsState.set;

  const rootRef = React.useRef<HTMLElement | null>(null);
  const inputRef = React.useRef<EmblorInputNode | null>(null);
  const inputIdRef = React.useRef(generatedInputId);
  const tagListRef = React.useRef<HTMLElement | null>(null);
  const inputRegistrationRef = React.useRef<EmblorInputNode | null>(null);
  const tagRegistryRef = React.useRef(new Map<number, { node: HTMLElement; token: symbol }>());
  const tagListRegistrationRef = React.useRef<HTMLElement | null>(null);
  const boundaryNodesRef = React.useRef(new Set<HTMLElement>());
  const labelRegistryRef = React.useRef(new Map<symbol, RegisteredLabel>());
  const [rootElement, setRootElement] = React.useState<HTMLElement | null>(null);
  const [inputId, setInputId] = React.useState(generatedInputId);
  const [labelIds, setLabelIds] = React.useState<string[]>([]);
  const labelIdsRef = React.useRef<string[]>([]);
  const [actualFocusedIndex, setActualFocusedIndex] = React.useState<number | null>(null);
  const [focusWithin, setFocusWithin] = React.useState(false);
  const [lastRejection, setLastRejection] = React.useState<EmblorRejection | null>(null);
  const [liveMessage, setLiveMessage] = React.useState('');
  const [liveSequence, setLiveSequence] = React.useState(0);
  const [announcementQueue, setAnnouncementQueue] = React.useState<QueuedAnnouncement[]>([]);
  const [registryVersion, setRegistryVersion] = React.useState(0);
  const [labelRegistryVersion, setLabelRegistryVersion] = React.useState(0);
  const mountedRef = React.useRef(true);
  const pendingFocusRef = React.useRef<PendingFocus | null>(null);
  const blurSequenceRef = React.useRef(0);
  const announcementIdRef = React.useRef(0);
  const displayedAnnouncementIdRef = React.useRef<number | null>(null);
  const labelOrderRef = React.useRef(0);

  const transientInvalid = lastRejection !== null;
  const requiredInvalid = required && !disabled && values.length === 0;
  const hasInvalid = Boolean(invalid || transientInvalid || requiredInvalid);
  const maxReached = maxTags !== undefined && values.length >= maxTags;

  const setRootNode = React.useCallback(function setRootNode(node: HTMLElement | null) {
    rootRef.current = node;
    setRootElement(node);
  }, []);

  const rootMergedRef = React.useMemo(
    function createRootRef() {
      return mergeRefs(setRootNode, forwardedRef);
    },
    [forwardedRef, setRootNode],
  );

  const getDirection = React.useCallback(function getRootDirection(): 'ltr' | 'rtl' {
    return resolveDirection(rootRef.current);
  }, []);

  const registerBoundaryNode = React.useCallback(function registerBoundaryNode(node: HTMLElement | null): () => void {
    if (!node) {
      return function noop() {};
    }
    boundaryNodesRef.current.add(node);
    return function unregisterBoundaryNode() {
      boundaryNodesRef.current.delete(node);
    };
  }, []);

  const isWithinRoot = React.useCallback(function isWithinRoot(node: Node | null): boolean {
    if (!node) {
      return false;
    }
    if (rootRef.current?.contains(node)) {
      return true;
    }
    for (const boundary of boundaryNodesRef.current) {
      if (boundary.contains(node)) {
        return true;
      }
    }
    return false;
  }, []);

  const registerInputNode = React.useCallback(function registerInputNode(node: HTMLElement | null, id: string) {
    if (node) {
      if (!isInputLikeNode(node)) {
        throw new Error(
          'EmblorInput must render an input-like element or a ref-forwarding compatible custom component.',
        );
      }
      if (inputRegistrationRef.current && inputRegistrationRef.current !== node) {
        throw new Error('EmblorRoot allows exactly one EmblorInput.');
      }
      inputRegistrationRef.current = node;
      inputRef.current = node;
      inputIdRef.current = id;
      boundaryNodesRef.current.add(node);
      setInputId(function updateInputId(previous) {
        return previous === id ? previous : id;
      });
      return;
    }

    inputRegistrationRef.current = null;
    inputRef.current = null;
    setRegistryVersion(function increment(version) {
      return version + 1;
    });
  }, []);

  const registerTagListNode = React.useCallback(function registerTagListNode(node: HTMLElement | null): () => void {
    if (!node) {
      return function noop() {};
    }
    if (tagListRegistrationRef.current && tagListRegistrationRef.current !== node) {
      throw new Error('EmblorRoot allows at most one EmblorTagList.');
    }
    tagListRegistrationRef.current = node;
    tagListRef.current = node;
    boundaryNodesRef.current.add(node);
    setRegistryVersion(function increment(version) {
      return version + 1;
    });
    return function unregisterTagList() {
      if (tagListRegistrationRef.current === node) {
        tagListRegistrationRef.current = null;
        tagListRef.current = null;
        boundaryNodesRef.current.delete(node);
        setRegistryVersion(function increment(version) {
          return version + 1;
        });
      }
    };
  }, []);

  const registerTagNode = React.useCallback(function registerTagNode(
    index: number,
    node: HTMLElement | null,
    token: symbol,
  ): () => void {
    if (!node) {
      return function noop() {};
    }
    const existing = tagRegistryRef.current.get(index);
    if (existing && existing.token !== token) {
      throw new Error(`EmblorTag index ${index} is registered more than once.`);
    }
    tagRegistryRef.current.set(index, { node, token });
    boundaryNodesRef.current.add(node);
    setRegistryVersion(function increment(version) {
      return version + 1;
    });
    return function unregisterTag() {
      const current = tagRegistryRef.current.get(index);
      if (current?.token === token) {
        tagRegistryRef.current.delete(index);
        boundaryNodesRef.current.delete(node);
        setRegistryVersion(function increment(version) {
          return version + 1;
        });
      }
    };
  }, []);

  const refreshLabelIds = React.useCallback(function refreshLabelIds() {
    const nextLabelIds = getDocumentOrderedLabelIds(labelRegistryRef.current, rootRef.current?.ownerDocument);
    if (arraysEqual(labelIdsRef.current, nextLabelIds)) {
      return;
    }
    labelIdsRef.current = nextLabelIds;
    setLabelIds(nextLabelIds);
  }, []);

  const registerLabel = React.useCallback(
    function registerLabel(token: symbol, node: HTMLElement | null, id: string): () => void {
      if (!node) {
        return function noop() {};
      }
      labelRegistryRef.current.set(token, {
        node,
        id,
        order: labelOrderRef.current++,
      });
      setLabelRegistryVersion(function increment(version) {
        return version + 1;
      });
      refreshLabelIds();
      return function unregisterLabel() {
        if (labelRegistryRef.current.delete(token)) {
          setLabelRegistryVersion(function increment(version) {
            return version + 1;
          });
          refreshLabelIds();
        }
      };
    },
    [refreshLabelIds],
  );

  const getMountedTagIndexes = React.useCallback(function getMountedTagIndexes(): number[] {
    return Array.from(tagRegistryRef.current.keys()).sort(function ascending(first, second) {
      return first - second;
    });
  }, []);

  const focusTag = React.useCallback(
    function focusTagByIndex(index: number) {
      const node = tagRegistryRef.current.get(index)?.node;
      if (!node || disabled) {
        return;
      }
      pendingFocusRef.current = null;
      node.focus();
      setActualFocusedIndex(index);
    },
    [disabled],
  );

  const focusInput = React.useCallback(function focusInputNode() {
    pendingFocusRef.current = null;
    inputRef.current?.focus();
    setActualFocusedIndex(null);
  }, []);

  const setDraft = React.useCallback(
    function setRootDraft(next: string) {
      if (next === draft) {
        return;
      }
      setLastRejection(null);
      draftState.set(next);
    },
    [draft, draftState],
  );

  const clearDraftAfterSuccessfulAddition = React.useCallback(
    function clearDraftAfterSuccessfulAdditionTransition() {
      setLastRejection(null);
      if (draft.length > 0) {
        draftState.set('');
      }
    },
    [draft, draftState],
  );

  const announce = React.useCallback(
    function announceMutation(announcement: EmblorAnnouncement) {
      const message = getAnnouncement ? getAnnouncement(announcement) : getDefaultAnnouncement(announcement);
      if (typeof message !== 'string') {
        throw new Error('EmblorRoot getAnnouncement must return a string.');
      }
      if (message.length === 0) {
        return;
      }
      const id = announcementIdRef.current + 1;
      announcementIdRef.current = id;
      setAnnouncementQueue(function enqueue(queue) {
        return [...queue, { id, message }];
      });
    },
    [getAnnouncement],
  );

  const announceRejection = React.useCallback(
    function announceRejectionEvent(rejection: EmblorRejection) {
      setLastRejection(rejection);
      onReject?.(rejection);
      announce({ type: 'reject', rejection });
    },
    [announce, onReject],
  );

  const setTags = React.useCallback(
    function setRootTags(next: string[], details: EmblorValueChangeDetails) {
      if (!tagsControlled) {
        setOwnedTags(next);
      }
      onValueChange?.(next, details);
    },
    [onValueChange, setOwnedTags, tagsControlled],
  );

  const commitDraft = React.useCallback(
    function commitRootDraft(rawValue: string, source: 'keyboard' | 'blur'): boolean {
      if (disabled || readOnly || rawValue.length === 0) {
        return false;
      }
      const result = evaluateCandidate({
        rawValue,
        values,
        source,
        minLength,
        maxLength,
        maxTags,
        allowDuplicates,
        transform,
        validate,
      });
      if (!result.accepted) {
        announceRejection(result.rejection);
        return false;
      }

      const nextValues = [...values, result.value];
      const details: EmblorValueChangeDetails = {
        type: 'add',
        value: result.value,
        index: values.length,
        source,
      };
      setTags(nextValues, details);
      clearDraftAfterSuccessfulAddition();
      announce({ type: 'add', value: result.value });
      return true;
    },
    [
      allowDuplicates,
      announce,
      announceRejection,
      clearDraftAfterSuccessfulAddition,
      disabled,
      maxLength,
      maxTags,
      minLength,
      readOnly,
      setTags,
      transform,
      validate,
      values,
    ],
  );

  const pasteDraft = React.useCallback(
    function pasteRootDraft(
      prospectiveDraft: string,
      sourceDraft: string,
    ): { accepted: boolean; rejected: boolean } | null {
      if (disabled || readOnly) {
        return null;
      }
      const pattern =
        delimiters.length > 0
          ? new RegExp(
              delimiters
                .map(function escape(delimiter) {
                  return delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                })
                .join('|'),
            )
          : null;
      const candidates = pattern ? prospectiveDraft.split(pattern) : [prospectiveDraft];
      const batch = evaluateBatch({
        candidates,
        values,
        minLength,
        maxLength,
        maxTags,
        allowDuplicates,
        transform,
        validate,
        source: 'paste',
      });
      batch.rejections.forEach(function report(rejection) {
        announceRejection(rejection);
      });
      if (batch.values.length === 0) {
        return { accepted: false, rejected: batch.rejections.length > 0 };
      }

      const details: EmblorValueChangeDetails = {
        type: 'add-many',
        values: batch.values,
        startIndex: values.length,
        source: 'paste',
      };
      setTags([...values, ...batch.values], details);
      clearDraftAfterSuccessfulAddition();
      announce({ type: 'add-many', values: batch.values });
      void sourceDraft;
      return { accepted: true, rejected: batch.rejections.length > 0 };
    },
    [
      allowDuplicates,
      announce,
      announceRejection,
      clearDraftAfterSuccessfulAddition,
      delimiters,
      disabled,
      maxLength,
      maxTags,
      minLength,
      readOnly,
      setTags,
      transform,
      validate,
      values,
    ],
  );

  const removeTag = React.useCallback(
    function removeRootTag(index: number, source: 'keyboard' | 'pointer') {
      if (disabled || readOnly || (minTags !== undefined && values.length <= minTags)) {
        return;
      }
      const removedValue = values[index];
      if (removedValue === undefined) {
        return;
      }
      const nextValues = values.filter(function keep(_, valueIndex) {
        return valueIndex !== index;
      });
      pendingFocusRef.current = {
        type: 'remove',
        previous: [...values],
        requested: nextValues,
        removedIndex: index,
        origin: (rootRef.current?.ownerDocument.activeElement as HTMLElement | null) ?? null,
      };
      setTags(nextValues, { type: 'remove', value: removedValue, index, source });
      announce({ type: 'remove', value: removedValue });
    },
    [announce, disabled, minTags, readOnly, setTags, values],
  );

  const clearTags = React.useCallback(
    function clearRootTags(source: 'keyboard' | 'pointer') {
      if (disabled || readOnly || values.length === 0 || (minTags !== undefined && minTags > 0)) {
        return;
      }
      pendingFocusRef.current = {
        type: 'clear',
        previous: [...values],
        requested: [],
        origin: (rootRef.current?.ownerDocument.activeElement as HTMLElement | null) ?? null,
      };
      setTags([], { type: 'clear', values: [...values], source });
      setDraft('');
      announce({ type: 'clear', values: [...values] });
    },
    [announce, disabled, minTags, readOnly, setDraft, setTags, values],
  );

  const setInputFocused = React.useCallback(function setInputFocusedState() {
    setActualFocusedIndex(null);
  }, []);

  const setTagFocused = React.useCallback(function setTagFocusedState(index: number | null) {
    setActualFocusedIndex(index);
  }, []);

  const handleInputBlur = React.useCallback(
    function handleRootInputBlur(event: React.FocusEvent<HTMLElement>, cancelled: boolean) {
      setActualFocusedIndex(null);
      if (cancelled || disabled || readOnly || blurBehavior === 'noop') {
        return;
      }
      const sequence = blurSequenceRef.current + 1;
      blurSequenceRef.current = sequence;
      const relatedTarget = event.relatedTarget as Node | null;
      if (relatedTarget && isWithinRoot(relatedTarget)) {
        return;
      }
      const runAfterFocusSettles = function runAfterFocusSettles() {
        if (!mountedRef.current || blurSequenceRef.current !== sequence) {
          return;
        }
        const activeElement = rootRef.current?.ownerDocument.activeElement;
        if (activeElement && isWithinRoot(activeElement)) {
          return;
        }
        if (blurBehavior === 'commit') {
          commitDraft(draft, 'blur');
        } else if (blurBehavior === 'discard') {
          setDraft('');
        }
      };
      if (typeof queueMicrotask === 'function') {
        queueMicrotask(runAfterFocusSettles);
      } else {
        setTimeout(runAfterFocusSettles, 0);
      }
    },
    [blurBehavior, commitDraft, disabled, draft, isWithinRoot, readOnly, setDraft],
  );

  const resetUncontrolledState = React.useCallback(
    function resetUncontrolledState() {
      pendingFocusRef.current = null;
      setLastRejection(null);
      setLiveMessage('');
      setAnnouncementQueue([]);
      if (!tagsState.controlled) {
        tagsState.reset();
      }
      if (!draftState.controlled) {
        draftState.reset();
      }
    },
    [draftState, tagsState],
  );

  const handleFocusCapture = React.useCallback(function handleFocusCapture(event: React.FocusEvent<HTMLElement>) {
    setFocusWithin(true);
    const pending = pendingFocusRef.current;
    if (pending && event.target !== pending.origin) {
      pendingFocusRef.current = null;
    }
  }, []);

  const handleBlurCapture = React.useCallback(
    function handleBlurCapture(event: React.FocusEvent<HTMLElement>) {
      const relatedTarget = event.relatedTarget as Node | null;
      if (relatedTarget && isWithinRoot(relatedTarget)) {
        return;
      }
      const settle = function settleRootFocus() {
        const activeElement = rootRef.current?.ownerDocument.activeElement;
        if (!activeElement || !isWithinRoot(activeElement)) {
          setFocusWithin(false);
          setActualFocusedIndex(null);
        }
      };
      if (typeof queueMicrotask === 'function') {
        queueMicrotask(settle);
      } else {
        setTimeout(settle, 0);
      }
    },
    [isWithinRoot],
  );

  const handleInvalidCapture = React.useCallback(
    function handleInvalidCapture(event: React.InvalidEvent<HTMLElement>) {
      if (event.target === inputRef.current || !isWithinRoot(event.target)) {
        inputRef.current?.focus();
      }
    },
    [isWithinRoot],
  );

  const handleReset = React.useCallback(
    function handleReset(event: React.FormEvent<HTMLElement>) {
      if (!event.defaultPrevented) {
        resetUncontrolledState();
      }
    },
    [resetUncontrolledState],
  );

  React.useEffect(function markMounted() {
    mountedRef.current = true;
    return function markUnmounted() {
      mountedRef.current = false;
    };
  }, []);

  React.useLayoutEffect(
    function drainAnnouncementQueue() {
      const next = announcementQueue[0];
      if (!next) {
        return;
      }
      if (displayedAnnouncementIdRef.current !== next.id) {
        displayedAnnouncementIdRef.current = next.id;
        setLiveMessage(next.message);
        setLiveSequence(function increment(sequence) {
          return sequence + 1;
        });
      }
      const timer = setTimeout(function advanceAnnouncementQueue() {
        setAnnouncementQueue(function removeDisplayed(queue) {
          return queue[0]?.id === next.id ? queue.slice(1) : queue;
        });
      }, ANNOUNCEMENT_INTERVAL_MS);
      return function cancelAdvance() {
        clearTimeout(timer);
      };
    },
    [announcementQueue],
  );

  React.useEffect(
    function listenForNativeFormReset() {
      const root = rootRef.current;
      const form = root instanceof HTMLFormElement ? root : root?.closest('form');
      if (!form) {
        return;
      }
      const resetListener = function resetListener(event: Event) {
        if (!event.defaultPrevented) {
          resetUncontrolledState();
        }
      };
      form.addEventListener('reset', resetListener);
      return function cleanupResetListener() {
        form.removeEventListener('reset', resetListener);
      };
    },
    [resetUncontrolledState, rootElement],
  );

  React.useLayoutEffect(
    function observeLabelOrder() {
      if (!rootElement || labelRegistryRef.current.size === 0) {
        return;
      }
      refreshLabelIds();
      const ownerDocument = rootElement.ownerDocument;
      const MutationObserverConstructor = ownerDocument.defaultView?.MutationObserver;
      if (!MutationObserverConstructor) {
        return;
      }
      const observer = new MutationObserverConstructor(function handleDomMutation() {
        refreshLabelIds();
      });
      observer.observe(ownerDocument, { childList: true, subtree: true });
      return function disconnectLabelObserver() {
        observer.disconnect();
      };
    },
    [labelRegistryVersion, refreshLabelIds, rootElement],
  );

  React.useLayoutEffect(
    function verifyInputRegistration() {
      if (!inputRegistrationRef.current) {
        throw new Error('EmblorRoot requires exactly one EmblorInput.');
      }
    },
    [children, registryVersion, rootElement],
  );

  React.useLayoutEffect(
    function restorePendingFocus() {
      const pending = pendingFocusRef.current;
      if (!pending) {
        return;
      }
      if (!arraysEqual(values, pending.requested)) {
        if (tagsState.controlled && !arraysEqual(values, pending.previous)) {
          pendingFocusRef.current = null;
        }
        return;
      }
      const ownerDocument = rootRef.current?.ownerDocument;
      const documentActiveElement = ownerDocument?.activeElement as HTMLElement | null;
      const focusStayedOnOrigin = Boolean(pending.origin && documentActiveElement === pending.origin);
      const focusFellAwayWithOrigin = Boolean(
        pending.origin &&
          ownerDocument &&
          (documentActiveElement === ownerDocument.body || documentActiveElement === ownerDocument.documentElement) &&
          (!pending.origin.isConnected || (pending.type === 'clear' && pending.origin.matches(':disabled'))),
      );
      if (!focusStayedOnOrigin && !focusFellAwayWithOrigin) {
        pendingFocusRef.current = null;
        return;
      }
      if (pending.type === 'clear') {
        pendingFocusRef.current = null;
        inputRef.current?.focus();
        setActualFocusedIndex(null);
        return;
      }
      const mountedIndexes = getMountedTagIndexes();
      const nextIndex =
        mountedIndexes.find(function findNext(index) {
          return index >= pending.removedIndex;
        }) ??
        [...mountedIndexes].reverse().find(function findPrevious(index) {
          return index < pending.removedIndex;
        });
      pendingFocusRef.current = null;
      if (nextIndex === undefined) {
        inputRef.current?.focus();
        setActualFocusedIndex(null);
      } else {
        const node = tagRegistryRef.current.get(nextIndex)?.node;
        node?.focus();
        setActualFocusedIndex(nextIndex);
      }
    },
    [getMountedTagIndexes, registryVersion, tagsState.controlled, values],
  );

  const providerValue = React.useMemo<EmblorContextValue>(
    function createProviderValue() {
      return {
        values,
        draft,
        disabled,
        readOnly,
        required,
        requiredInvalid,
        invalid,
        transientInvalid,
        hasInvalid,
        maxReached,
        maxTags,
        minTags,
        minLength,
        maxLength,
        allowDuplicates,
        delimiters,
        addOnPaste,
        addOnTab,
        blurBehavior,
        placeholderWhenFull,
        name,
        inputId,
        labelIds,
        actualFocusedIndex,
        inputRef,
        rootRef,
        setDraft,
        commitDraft,
        pasteDraft,
        removeTag,
        clearTags,
        setInputFocused,
        setTagFocused,
        handleInputBlur,
        focusTag,
        focusInput,
        getMountedTagIndexes,
        getDirection,
        isWithinRoot,
        registerInputNode,
        registerTagListNode,
        registerTagNode,
        registerBoundaryNode,
        registerLabel,
        announce,
        announceRejection,
        onValueChange,
        getTagValue: function getTagValue(index: number) {
          return values[index] ?? '';
        },
      };
    },
    [
      actualFocusedIndex,
      addOnPaste,
      addOnTab,
      allowDuplicates,
      announce,
      announceRejection,
      blurBehavior,
      clearTags,
      commitDraft,
      delimiters,
      disabled,
      draft,
      focusInput,
      focusTag,
      getDirection,
      getMountedTagIndexes,
      handleInputBlur,
      hasInvalid,
      inputId,
      invalid,
      isWithinRoot,
      labelIds,
      maxLength,
      maxReached,
      maxTags,
      minLength,
      minTags,
      name,
      onValueChange,
      pasteDraft,
      placeholderWhenFull,
      readOnly,
      registerBoundaryNode,
      registerInputNode,
      registerLabel,
      registerTagListNode,
      registerTagNode,
      removeTag,
      required,
      requiredInvalid,
      setDraft,
      setInputFocused,
      setTagFocused,
      transientInvalid,
      values,
    ],
  );

  const tagsProviderValue = React.useMemo<EmblorTagsContextValue>(
    function createTagsProviderValue() {
      return {
        values,
        disabled,
        readOnly,
        labelIds,
        registerTagListNode,
        minTags,
        actualFocusedIndex,
        setTagFocused,
        focusInput,
        focusTag,
        removeTag,
        getMountedTagIndexes,
        getDirection,
        registerTagNode,
        registerBoundaryNode,
      };
    },
    [
      actualFocusedIndex,
      disabled,
      focusInput,
      focusTag,
      getDirection,
      getMountedTagIndexes,
      labelIds,
      minTags,
      readOnly,
      registerBoundaryNode,
      registerTagListNode,
      registerTagNode,
      removeTag,
      setTagFocused,
      values,
    ],
  );

  const hiddenValues =
    name === undefined
      ? null
      : values.map(function renderFormValue(tag, index) {
          return (
            <input
              key={`${name}-${index}`}
              type="hidden"
              name={name}
              value={tag}
              disabled={disabled}
              aria-hidden="true"
              tabIndex={-1}
            />
          );
        });

  const autoLabelledBy = labelIds.length > 0 ? labelIds.join(' ') : undefined;
  const rootState = disabled ? 'disabled' : readOnly ? 'readonly' : hasInvalid ? 'invalid' : 'active';
  const rootProps = rest as Record<string, unknown>;

  return (
    <EmblorProvider value={providerValue} tagsValue={tagsProviderValue}>
      <Component
        {...rootProps}
        ref={rootMergedRef}
        id={consumerRootId}
        role="group"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy ?? autoLabelledBy}
        aria-invalid={hasInvalid || undefined}
        aria-disabled={disabled || undefined}
        data-state={rootState}
        data-disabled={disabled ? '' : undefined}
        data-readonly={readOnly ? '' : undefined}
        data-invalid={hasInvalid ? '' : undefined}
        data-max-reached={maxReached ? '' : undefined}
        data-focus-within={focusWithin ? '' : undefined}
        dir={dir}
        disabled={Component === 'fieldset' ? disabled : undefined}
        onFocus={rootProps.onFocus as React.FocusEventHandler<HTMLElement> | undefined}
        onBlur={rootProps.onBlur as React.FocusEventHandler<HTMLElement> | undefined}
        onFocusCapture={composeEventHandlers(onFocusCapture, handleFocusCapture)}
        onBlurCapture={composeEventHandlers(onBlurCapture, handleBlurCapture)}
        onInvalidCapture={composeEventHandlers(onInvalidCapture, handleInvalidCapture)}
        onReset={composeEventHandlers(onReset, handleReset)}
      >
        {children}
        {hiddenValues}
        <span
          key={liveSequence}
          aria-live="polite"
          aria-atomic="true"
          data-emblor-live-region=""
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: 'hidden',
            clip: 'rect(0 0 0 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        >
          {liveMessage}
        </span>
      </Component>
    </EmblorProvider>
  );
});

export const EmblorRoot = EmblorRootImpl as EmblorRootComponent;
