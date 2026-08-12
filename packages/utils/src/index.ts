import * as React from 'react';

export type ControllableStateOptions<Value> = {
  value?: Value;
  defaultValue: Value;
  onChange?: (value: Value) => void;
};

export function useControllableState<Value>(options: ControllableStateOptions<Value>): [Value, (next: Value) => void] {
  const { value, defaultValue, onChange } = options;
  const [uncontrolledValue, setUncontrolledValue] = React.useState<Value>(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? (value as Value) : uncontrolledValue;
  const onChangeRef = React.useRef(onChange);

  React.useEffect(
    function syncOnChangeRef() {
      onChangeRef.current = onChange;
    },
    [onChange],
  );

  const setValue = React.useCallback(
    function updateValue(next: Value) {
      if (!isControlled) {
        setUncontrolledValue(next);
      }
      if (onChangeRef.current) {
        onChangeRef.current(next);
      }
    },
    [isControlled],
  );

  return [currentValue, setValue];
}

export type EmblorStore<State> = {
  getState: () => State;
  setState: (updater: (state: State) => State) => void;
  subscribe: (listener: () => void) => () => void;
};

export function createStore<State>(initialState: State): EmblorStore<State> {
  let state = initialState;
  const listeners = new Set<() => void>();

  function getState(): State {
    return state;
  }

  function setState(updater: (state: State) => State): void {
    state = updater(state);
    listeners.forEach(function notify(listener) {
      listener();
    });
  }

  function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return function unsubscribe() {
      listeners.delete(listener);
    };
  }

  return { getState, setState, subscribe };
}

export type EqualityChecker<Value> = (a: Value, b: Value) => boolean;

export function useStoreSelector<State, Selection>(
  store: EmblorStore<State>,
  selector: (state: State) => Selection,
  equalityFn: EqualityChecker<Selection> = Object.is,
): Selection {
  const subscription = React.useCallback(
    function subscribe(listener: () => void) {
      return store.subscribe(listener);
    },
    [store],
  );

  const getSnapshot = React.useCallback(
    function snapshot() {
      return selector(store.getState());
    },
    [selector, store],
  );

  const prevSelectionRef = React.useRef<Selection>(getSnapshot());
  const selection = React.useSyncExternalStore(subscription, getSnapshot, getSnapshot);

  const isEqual = equalityFn(prevSelectionRef.current, selection);
  if (!isEqual) {
    prevSelectionRef.current = selection;
  }

  return isEqual ? prevSelectionRef.current : selection;
}

export function useStableCallback<Args extends Array<unknown>, Result>(
  callback: (...args: Args) => Result,
): (...args: Args) => Result {
  const callbackRef = React.useRef(callback);
  React.useEffect(
    function syncCallback() {
      callbackRef.current = callback;
    },
    [callback],
  );

  return React.useCallback(function invoke(...args: Args) {
    return callbackRef.current(...args);
  }, []);
}

export function mergeRefs<ElementType>(...refs: Array<React.Ref<ElementType>>): (node: ElementType | null) => void {
  return function assign(node: ElementType | null) {
    refs.forEach(function setRef(ref) {
      if (typeof ref === 'function') {
        ref(node);
        return;
      }
      if (ref && typeof ref === 'object') {
        (ref as React.MutableRefObject<ElementType | null>).current = node;
      }
    });
  };
}

export function composeEventHandlers<EventType extends { defaultPrevented: boolean }>(
  first?: (event: EventType) => void,
  second?: (event: EventType) => void,
  options: { checkForDefaultPrevented?: boolean } = {},
): (event: EventType) => void {
  return function handle(event: EventType) {
    if (first) {
      first(event);
    }
    if (options.checkForDefaultPrevented && event.defaultPrevented) {
      return;
    }
    if (second) {
      second(event);
    }
  };
}

export function isInputEventValueEmpty(value: string): boolean {
  return value.trim().length === 0;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
