import * as React from 'react';
import type { EmblorClearComponent, EmblorClearProps } from '../../types';
import { composeEventHandlers, isComposingEvent, isNativeButtonNode, mergeRefs } from '../../utils';
import { useEmblorContext } from '../tags-input-context';

const EmblorClearImpl = React.forwardRef<HTMLElement, EmblorClearProps<any>>(function EmblorClear(props, forwardedRef) {
  const { as, children, disabled: disabledProp, onClick, onKeyDown, 'aria-label': ariaLabel, ...rest } = props;
  const { values, disabled, readOnly, minTags, clearTags, registerBoundaryNode } = useEmblorContext('EmblorClear');
  const Component = (as ?? 'button') as React.ElementType;
  const [isNativeButton, setIsNativeButton] = React.useState(Component === 'button');
  const isDisabled = Boolean(
    disabledProp || disabled || readOnly || values.length === 0 || (minTags !== undefined && minTags > 0),
  );
  const nodeRef = React.useRef<HTMLElement | null>(null);
  const boundaryCleanupRef = React.useRef<(() => void) | null>(null);
  const assignRef = React.useMemo(
    function createClearRef() {
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

  const handleClick = React.useCallback(
    function handleClearClick(event: React.MouseEvent<HTMLElement>) {
      if (!isDisabled) {
        clearTags(event.detail === 0 ? 'keyboard' : 'pointer');
      }
    },
    [clearTags, isDisabled],
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
      if (!isDisabled) {
        clearTags('keyboard');
      }
    },
    [clearTags, isDisabled],
  );

  return (
    <Component
      {...(rest as Record<string, unknown>)}
      ref={assignRef}
      type={isNativeButton ? 'button' : undefined}
      role={isNativeButton ? undefined : 'button'}
      tabIndex={isNativeButton ? undefined : isDisabled ? -1 : 0}
      aria-label={ariaLabel ?? 'Clear all tags'}
      aria-disabled={isDisabled || undefined}
      disabled={isNativeButton ? isDisabled || undefined : undefined}
      data-disabled={isDisabled ? '' : undefined}
      onClick={composeEventHandlers(onClick, handleClick, { checkForDefaultPrevented: true })}
      onKeyDown={composeEventHandlers(onKeyDown, handleNonButtonKeyDown, { checkForDefaultPrevented: true })}
    >
      {children !== undefined ? children : 'Clear'}
    </Component>
  );
});

export const EmblorClear = EmblorClearImpl as EmblorClearComponent;
