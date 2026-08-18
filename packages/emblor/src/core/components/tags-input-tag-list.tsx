import * as React from 'react';
import type { EmblorTagListComponent, EmblorTagListProps } from '../../types';
import { mergeRefs } from '../../utils';
import { useEmblorTagsContext } from '../tags-input-context';

const EmblorTagListImpl = React.forwardRef<HTMLElement, EmblorTagListProps<any>>(
  function EmblorTagList(props, forwardedRef) {
    const { as, children, 'aria-labelledby': ariaLabelledBy, ...rest } = props;
    const { values, disabled, readOnly, labelIds, registerTagListNode } = useEmblorTagsContext('EmblorTagList');
    const Component = (as ?? 'div') as React.ElementType;
    const listNodeRef = React.useRef<HTMLElement | null>(null);
    const registeredCleanupRef = React.useRef<(() => void) | null>(null);
    const assignRef = React.useMemo(
      function createListRef() {
        return mergeRefs(forwardedRef as React.Ref<HTMLElement>, function capture(node: HTMLElement | null) {
          listNodeRef.current = node;
        });
      },
      [forwardedRef],
    );

    React.useLayoutEffect(
      function registerList() {
        registeredCleanupRef.current?.();
        registeredCleanupRef.current = registerTagListNode(listNodeRef.current);
        return function cleanupList() {
          registeredCleanupRef.current?.();
          registeredCleanupRef.current = null;
        };
      },
      [registerTagListNode],
    );

    const resolvedChildren =
      typeof children === 'function'
        ? values.map(function renderTag(tag, index) {
            return children(tag, index);
          })
        : children;
    const resolvedLabelledBy = ariaLabelledBy ?? (labelIds.length > 0 ? labelIds.join(' ') : undefined);

    return (
      <Component
        {...(rest as Record<string, unknown>)}
        ref={assignRef}
        role="list"
        aria-labelledby={resolvedLabelledBy}
        data-empty={values.length === 0 ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        data-readonly={readOnly ? '' : undefined}
      >
        {resolvedChildren}
      </Component>
    );
  },
);

export const EmblorTagList = EmblorTagListImpl as EmblorTagListComponent;
