import * as React from 'react';
import type { EmblorTagRemoveComponent, EmblorTagRemoveProps } from '../../types';
import { composeEventHandlers, isComposingEvent, isNativeButtonNode, mergeRefs } from '../../utils';
import { useEmblorTagContext, useEmblorTagsContext } from '../tags-input-context';

const EmblorTagRemoveImpl = React.forwardRef<HTMLElement, EmblorTagRemoveProps<any>>(
  function EmblorTagRemove(props, forwardedRef) {
    const { as, children, disabled: disabledProp, onClick, onKeyDown, 'aria-label': ariaLabel, ...rest } = props;
    const { index, value } = useEmblorTagContext('EmblorTagRemove');
    const { values, disabled, readOnly, minTags, removeTag, registerBoundaryNode } =
      useEmblorTagsContext('EmblorTagRemove');
    const Component = (as ?? 'button') as React.ElementType;
    const [isNativeButton, setIsNativeButton] = React.useState(Component === 'button');
    const isDisabled = Boolean(
      disabledProp || disabled || readOnly || (minTags !== undefined && values.length <= minTags),
    );
    const nodeRef = React.useRef<HTMLElement | null>(null);
    const boundaryCleanupRef = React.useRef<(() => void) | null>(null);
    const assignRef = React.useMemo(
      function createRemoveRef() {
        return mergeRefs(forwardedRef as React.Ref<HTMLElement>, function capture(node: HTMLElement | null) {
          nodeRef.current = node;
          if (node) {
            setIsNativeButton(function syncNativeButton(current) {
              const next = isNativeButtonNode(node);
              return current === next ? current : next;
            });
          }
        });
      },
      [forwardedRef],
    );

    React.useLayoutEffect(
      function registerBoundary() {
        boundaryCleanupRef.current?.();
        boundaryCleanupRef.current = registerBoundaryNode(nodeRef.current);
        return function cleanupBoundary() {
          boundaryCleanupRef.current?.();
          boundaryCleanupRef.current = null;
        };
      },
      [registerBoundaryNode],
    );

    const resolveSource = React.useCallback(function resolveSource(event: React.MouseEvent<HTMLElement>) {
      return event.detail === 0 ? ('keyboard' as const) : ('pointer' as const);
    }, []);

    const handleClick = React.useCallback(
      function handleRemoveClick(event: React.MouseEvent<HTMLElement>) {
        event.stopPropagation();
        if (!isDisabled) {
          removeTag(index, resolveSource(event));
        }
      },
      [index, isDisabled, removeTag, resolveSource],
    );

    const handleNonButtonKeyDown = React.useCallback(
      function handleNonButtonKeyDown(event: React.KeyboardEvent<HTMLElement>) {
        if (
          isNativeButtonNode(event.currentTarget) ||
          isComposingEvent(event) ||
          (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Spacebar')
        ) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        if (!isDisabled) {
          removeTag(index, 'keyboard');
        }
      },
      [index, isDisabled, removeTag],
    );

    return (
      <Component
        {...(rest as Record<string, unknown>)}
        ref={assignRef}
        type={isNativeButton ? 'button' : undefined}
        role={isNativeButton ? undefined : 'button'}
        tabIndex={isNativeButton ? undefined : isDisabled ? -1 : 0}
        aria-label={ariaLabel ?? `Remove ${value}`}
        aria-disabled={isDisabled || undefined}
        disabled={isNativeButton ? isDisabled || undefined : undefined}
        data-disabled={isDisabled ? '' : undefined}
        onClick={composeEventHandlers(onClick, handleClick, { checkForDefaultPrevented: true })}
        onKeyDown={composeEventHandlers(onKeyDown, handleNonButtonKeyDown, { checkForDefaultPrevented: true })}
      >
        {children !== undefined ? children : '×'}
      </Component>
    );
  },
);

export const EmblorTagRemove = EmblorTagRemoveImpl as EmblorTagRemoveComponent;
