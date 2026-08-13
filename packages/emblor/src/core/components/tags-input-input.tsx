import * as React from 'react';
import type { EmblorInputComponent, EmblorInputElementType, EmblorInputProps } from '../../types';
import { isComposingEvent, mergeRefs } from '../../utils';
import { useEmblorContext } from '../tags-input-context';

type SelectionIntent = {
  node: HTMLInputElement | HTMLTextAreaElement;
  sourceDraft: string;
  start: number;
  end: number;
  frameId: number | null;
  timeoutId: ReturnType<typeof setTimeout> | null;
};

const EmblorInputImpl = React.forwardRef<HTMLElement, EmblorInputProps<any>>(function EmblorInput(props, forwardedRef) {
  const {
    as,
    id: consumerId,
    name: _consumerName,
    value: _consumerValue,
    defaultValue: _consumerDefaultValue,
    required: _consumerRequired,
    disabled: _consumerDisabled,
    readOnly: _consumerReadOnly,
    onChange,
    onKeyDown,
    onPaste,
    onFocus,
    onBlur,
    onInvalid,
    onSelect,
    onPointerDown,
    onMouseDown,
    onTouchStart,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-invalid': consumerAriaInvalid,
    ...rest
  } = props as EmblorInputProps<EmblorInputElementType> & {
    onChange?: React.ChangeEventHandler<HTMLElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
    onPaste?: React.ClipboardEventHandler<HTMLElement>;
    onFocus?: React.FocusEventHandler<HTMLElement>;
    onBlur?: React.FocusEventHandler<HTMLElement>;
    onInvalid?: (event: React.InvalidEvent<HTMLElement>) => void;
    onSelect?: React.ReactEventHandler<HTMLElement>;
    onPointerDown?: React.PointerEventHandler<HTMLElement>;
    onMouseDown?: React.MouseEventHandler<HTMLElement>;
    onTouchStart?: React.TouchEventHandler<HTMLElement>;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-invalid'?: React.AriaAttributes['aria-invalid'];
  };
  const {
    values,
    draft,
    disabled,
    readOnly,
    required,
    requiredInvalid,
    hasInvalid,
    maxReached,
    maxTags,
    addOnPaste,
    addOnTab,
    delimiters,
    placeholderWhenFull,
    inputId,
    labelIds,
    inputRef,
    setDraft,
    commitDraft,
    pasteDraft,
    setInputFocused,
    handleInputBlur,
    focusTag,
    getMountedTagIndexes,
    getDirection,
    registerInputNode,
    registerBoundaryNode,
    isWithinRoot,
    focusInput,
  } = useEmblorContext('EmblorInput');

  const Component = (as ?? 'input') as React.ElementType;
  const resolvedId = consumerId ?? inputId;
  const resolvedLabelledBy =
    ariaLabelledBy ?? (ariaLabel ? undefined : labelIds.length > 0 ? labelIds.join(' ') : undefined);
  const resolvedPlaceholder = maxReached && placeholderWhenFull ? placeholderWhenFull : rest.placeholder;
  const inputNodeRef = React.useRef<HTMLElement | null>(null);
  const draftRef = React.useRef(draft);
  const selectionIntentRef = React.useRef<SelectionIntent | null>(null);

  const cancelSelectionIntent = React.useCallback(function cancelSelectionIntentWork() {
    const intent = selectionIntentRef.current;
    if (!intent) {
      return;
    }
    const window = intent.node.ownerDocument.defaultView;
    if (intent.frameId !== null) {
      window?.cancelAnimationFrame(intent.frameId);
    }
    if (intent.timeoutId !== null) {
      clearTimeout(intent.timeoutId);
    }
    selectionIntentRef.current = null;
  }, []);

  const scheduleSelectionIntent = React.useCallback(
    function scheduleSelectionIntentWork(
      node: HTMLInputElement | HTMLTextAreaElement,
      sourceDraft: string,
      start: number,
      end: number,
    ) {
      cancelSelectionIntent();
      const intent: SelectionIntent = {
        node,
        sourceDraft,
        start,
        end,
        frameId: null,
        timeoutId: null,
      };
      selectionIntentRef.current = intent;
      const restore = function restoreCurrentSelection() {
        if (selectionIntentRef.current !== intent) {
          return;
        }
        selectionIntentRef.current = null;
        if (
          inputNodeRef.current !== node ||
          draftRef.current !== sourceDraft ||
          node.value !== sourceDraft ||
          !node.isConnected ||
          node.ownerDocument.activeElement !== node
        ) {
          return;
        }
        try {
          node.setSelectionRange(start, end);
        } catch {
          // A compatible custom input may not support selection restoration in every browser.
        }
      };
      const ownerWindow = node.ownerDocument.defaultView;
      if (ownerWindow && typeof ownerWindow.requestAnimationFrame === 'function') {
        intent.frameId = ownerWindow.requestAnimationFrame(restore);
      } else {
        intent.timeoutId = setTimeout(restore, 0);
      }
    },
    [cancelSelectionIntent],
  );

  React.useLayoutEffect(
    function trackDraftForSelectionIntent() {
      const intent = selectionIntentRef.current;
      if (intent && draft !== intent.sourceDraft) {
        cancelSelectionIntent();
      }
      draftRef.current = draft;
    },
    [cancelSelectionIntent, draft],
  );

  React.useEffect(function listenForSelectionChanges() {
    const node = inputNodeRef.current as HTMLInputElement | HTMLTextAreaElement | null;
    if (!node) {
      return;
    }
    const ownerDocument = node.ownerDocument;
    const handleSelectionChange = function handleSelectionChange() {
      const intent = selectionIntentRef.current;
      if (!intent || intent.node !== node || ownerDocument.activeElement !== node) {
        return;
      }
      if (node.selectionStart !== intent.start || node.selectionEnd !== intent.end) {
        cancelSelectionIntent();
      }
    };
    ownerDocument.addEventListener('selectionchange', handleSelectionChange);
    return function cleanupSelectionChangeListener() {
      ownerDocument.removeEventListener('selectionchange', handleSelectionChange);
    };
  });

  const assignRef = React.useMemo(
    function createInputRef() {
      return mergeRefs(
        inputRef as React.Ref<HTMLElement>,
        forwardedRef as React.Ref<HTMLElement>,
        function register(node: HTMLElement | null) {
          if (inputNodeRef.current !== node) {
            cancelSelectionIntent();
          }
          inputNodeRef.current = node;
          registerInputNode(node, resolvedId);
        },
      );
    },
    [cancelSelectionIntent, forwardedRef, inputRef, registerInputNode, resolvedId],
  );

  React.useLayoutEffect(
    function verifyRegisteredInput() {
      registerInputNode(inputNodeRef.current, resolvedId);
    },
    [registerInputNode, resolvedId],
  );

  React.useLayoutEffect(
    function syncConstraintValidity() {
      const node = inputNodeRef.current;
      if (!node || !('setCustomValidity' in node)) {
        return;
      }
      const message = disabled
        ? ''
        : hasInvalid
          ? requiredInvalid
            ? 'Please add at least one tag.'
            : 'The tag value is invalid.'
          : '';
      (node as HTMLInputElement).setCustomValidity(message);
    },
    [disabled, hasInvalid, requiredInvalid, values.length],
  );

  const handleChange = React.useCallback(
    function handleChange(event: React.ChangeEvent<HTMLElement>) {
      onChange?.(event);
      cancelSelectionIntent();
      setDraft((event.target as HTMLInputElement | HTMLTextAreaElement).value);
    },
    [cancelSelectionIntent, onChange, setDraft],
  );

  const handleKeyDown = React.useCallback(
    function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
      cancelSelectionIntent();
      if (isComposingEvent(event)) {
        return;
      }

      const currentTarget = event.currentTarget as HTMLInputElement | HTMLTextAreaElement;
      const currentValue = currentTarget.value;
      const hasText = currentValue.length > 0;
      const isDelimiter = delimiters.includes(event.key);
      const shouldCommit = event.key === 'Enter' || (event.key === 'Tab' && addOnTab) || isDelimiter;

      if (shouldCommit && hasText) {
        event.preventDefault();
        commitDraft(currentValue, 'keyboard');
        return;
      }

      const mountedIndexes = getMountedTagIndexes();
      if (mountedIndexes.length === 0) {
        return;
      }

      if (event.key === 'Backspace' && currentValue.length === 0) {
        event.preventDefault();
        focusTag(mountedIndexes[mountedIndexes.length - 1]);
        return;
      }

      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
        return;
      }
      if (currentTarget.selectionStart === null || currentTarget.selectionEnd === null) {
        return;
      }
      const atStart = currentTarget.selectionStart === 0 && currentTarget.selectionEnd === 0;
      const atEnd =
        currentTarget.selectionStart === currentValue.length && currentTarget.selectionEnd === currentValue.length;
      const direction = getDirection();
      const entersFromStart = direction === 'ltr' ? event.key === 'ArrowLeft' : event.key === 'ArrowRight';
      if ((atStart && entersFromStart) || (atEnd && !entersFromStart)) {
        event.preventDefault();
        focusTag(entersFromStart ? mountedIndexes[mountedIndexes.length - 1] : mountedIndexes[0]);
      }
    },
    [addOnTab, cancelSelectionIntent, commitDraft, delimiters, focusTag, getDirection, getMountedTagIndexes],
  );

  const handleComposedKeyDown = React.useCallback(
    function handleComposedKeyDown(event: React.KeyboardEvent<HTMLElement>) {
      onKeyDown?.(event);
      cancelSelectionIntent();
      if (!event.defaultPrevented) {
        handleKeyDown(event);
      }
    },
    [cancelSelectionIntent, handleKeyDown, onKeyDown],
  );

  const handlePaste = React.useCallback(
    function handlePaste(event: React.ClipboardEvent<HTMLElement>) {
      onPaste?.(event);
      cancelSelectionIntent();
      if (event.defaultPrevented || !addOnPaste) {
        return;
      }
      const clipboardText = event.clipboardData.getData('text');
      if (!clipboardText) {
        return;
      }
      const currentTarget = event.currentTarget as HTMLInputElement | HTMLTextAreaElement;
      const selectionStart =
        typeof currentTarget.selectionStart === 'number' ? currentTarget.selectionStart : currentTarget.value.length;
      const selectionEnd =
        typeof currentTarget.selectionEnd === 'number' ? currentTarget.selectionEnd : currentTarget.value.length;
      const prospectiveDraft =
        currentTarget.value.slice(0, selectionStart) + clipboardText + currentTarget.value.slice(selectionEnd);
      const result = pasteDraft(prospectiveDraft, currentTarget.value, 'paste');
      if (!result) {
        return;
      }
      event.preventDefault();
      if (!result.accepted && result.rejected) {
        scheduleSelectionIntent(currentTarget, currentTarget.value, selectionStart, selectionEnd);
      }
    },
    [addOnPaste, cancelSelectionIntent, onPaste, pasteDraft, scheduleSelectionIntent],
  );

  const handleFocus = React.useCallback(
    function handleFocus(event: React.FocusEvent<HTMLElement>) {
      onFocus?.(event);
      cancelSelectionIntent();
      setInputFocused();
    },
    [cancelSelectionIntent, onFocus, setInputFocused],
  );

  const handleBlur = React.useCallback(
    function handleBlur(event: React.FocusEvent<HTMLElement>) {
      onBlur?.(event);
      cancelSelectionIntent();
      handleInputBlur(event, event.defaultPrevented);
    },
    [cancelSelectionIntent, handleInputBlur, onBlur],
  );

  const handleInvalid = React.useCallback(
    function handleInvalid(event: React.InvalidEvent<HTMLElement>) {
      onInvalid?.(event);
      focusInput();
    },
    [focusInput, onInvalid],
  );

  const handleSelect = React.useCallback(
    function handleInputSelect(event: React.SyntheticEvent<HTMLElement>) {
      onSelect?.(event);
      cancelSelectionIntent();
    },
    [cancelSelectionIntent, onSelect],
  );

  const handlePointerDown = React.useCallback(
    function handleInputPointerDown(event: React.PointerEvent<HTMLElement>) {
      onPointerDown?.(event);
      cancelSelectionIntent();
    },
    [cancelSelectionIntent, onPointerDown],
  );

  const handleMouseDown = React.useCallback(
    function handleInputMouseDown(event: React.MouseEvent<HTMLElement>) {
      onMouseDown?.(event);
      cancelSelectionIntent();
    },
    [cancelSelectionIntent, onMouseDown],
  );

  const handleTouchStart = React.useCallback(
    function handleInputTouchStart(event: React.TouchEvent<HTMLElement>) {
      onTouchStart?.(event);
      cancelSelectionIntent();
    },
    [cancelSelectionIntent, onTouchStart],
  );

  React.useEffect(
    function cancelSelectionOnUnmount() {
      return function cleanupSelectionIntent() {
        cancelSelectionIntent();
      };
    },
    [cancelSelectionIntent],
  );

  const boundaryCleanupRef = React.useRef<(() => void) | null>(null);
  React.useLayoutEffect(
    function registerBoundary() {
      boundaryCleanupRef.current?.();
      boundaryCleanupRef.current = registerBoundaryNode(inputNodeRef.current);
      return function cleanupBoundary() {
        boundaryCleanupRef.current?.();
        boundaryCleanupRef.current = null;
      };
    },
    [registerBoundaryNode],
  );

  const inputProps = rest as Record<string, unknown>;
  return (
    <Component
      {...inputProps}
      ref={assignRef}
      id={resolvedId}
      role="textbox"
      aria-label={ariaLabel}
      aria-labelledby={resolvedLabelledBy}
      aria-invalid={hasInvalid ? true : consumerAriaInvalid}
      aria-required={required || undefined}
      aria-disabled={disabled || undefined}
      aria-readonly={readOnly || undefined}
      disabled={disabled}
      readOnly={readOnly}
      required={required && !disabled && values.length === 0}
      value={draft}
      onChange={handleChange}
      onKeyDown={handleComposedKeyDown}
      onPaste={handlePaste}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onSelect={handleSelect}
      onPointerDown={handlePointerDown}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onInvalid={handleInvalid}
      placeholder={resolvedPlaceholder}
      data-disabled={disabled ? '' : undefined}
      data-readonly={readOnly ? '' : undefined}
      data-invalid={hasInvalid ? '' : undefined}
      data-max-reached={maxReached ? '' : undefined}
    />
  );
});

export const EmblorInput = EmblorInputImpl as EmblorInputComponent;
