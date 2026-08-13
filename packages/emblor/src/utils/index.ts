import * as React from 'react';

export function mergeRefs<ElementType>(...refs: Array<React.Ref<ElementType>>): (node: ElementType | null) => void {
  return function assign(node: ElementType | null) {
    refs.forEach(function assignRef(ref) {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref && typeof ref === 'object') {
        (ref as React.MutableRefObject<ElementType | null>).current = node;
      }
    });
  };
}

export function composeEventHandlers<EventType extends { defaultPrevented: boolean }>(
  consumerHandler: ((event: EventType) => void) | undefined,
  internalHandler: (event: EventType) => void,
  options: { checkForDefaultPrevented?: boolean } = {},
): (event: EventType) => void {
  return function composedHandler(event: EventType) {
    consumerHandler?.(event);
    if (options.checkForDefaultPrevented && event.defaultPrevented) {
      return;
    }
    internalHandler(event);
  };
}

export function countCodePoints(value: string): number {
  return Array.from(value).length;
}

export function arraysEqual(first: string[], second: string[]): boolean {
  if (first === second) {
    return true;
  }
  if (first.length !== second.length) {
    return false;
  }
  return first.every(function same(value, index) {
    return value === second[index];
  });
}

export function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every(function isString(item) {
      return typeof item === 'string';
    })
  );
}

export function isComposingEvent(event: { isComposing?: boolean; nativeEvent?: { isComposing?: boolean } }): boolean {
  return Boolean(event.isComposing || event.nativeEvent?.isComposing);
}

export function isInputLikeNode(node: unknown): node is HTMLInputElement | HTMLTextAreaElement {
  if (!(node instanceof HTMLElement)) {
    return false;
  }
  const tagName = node.tagName.toLowerCase();
  return (
    (tagName === 'input' || tagName === 'textarea') &&
    typeof (node as HTMLInputElement).focus === 'function' &&
    'value' in node &&
    'selectionStart' in node &&
    'selectionEnd' in node
  );
}

export function isNativeButtonNode(node: unknown): node is HTMLButtonElement {
  return Boolean(
    node &&
      typeof node === 'object' &&
      'tagName' in node &&
      typeof (node as { tagName?: unknown }).tagName === 'string' &&
      (node as { tagName: string }).tagName.toLowerCase() === 'button',
  );
}

export function resolveDirection(node: HTMLElement | null): 'ltr' | 'rtl' {
  let current: HTMLElement | null = node;
  while (current) {
    const explicit = current.getAttribute('dir');
    if (explicit === 'rtl' || explicit === 'ltr') {
      return explicit;
    }
    current = current.parentElement;
  }
  const documentDirection = node?.ownerDocument.documentElement.getAttribute('dir');
  return documentDirection === 'rtl' ? 'rtl' : 'ltr';
}

export function defaultAnnouncement(announcement: import('../types').EmblorAnnouncement): string {
  switch (announcement.type) {
    case 'add':
      return `Added tag ${announcement.value}`;
    case 'add-many':
      return `Added tags ${announcement.values.join(', ')}`;
    case 'remove':
      return `Removed tag ${announcement.value}`;
    case 'clear':
      return `Cleared tags ${announcement.values.join(', ')}`;
    case 'reject':
      return `Could not add ${announcement.rejection.value || 'tag'}: ${announcement.rejection.reason}`;
  }
}
