import * as React from 'react';
import type { EmblorLabelComponent, EmblorLabelProps } from '../../types';
import { composeEventHandlers, mergeRefs } from '../../utils';
import { useEmblorContext } from '../tags-input-context';

const EmblorLabelImpl = React.forwardRef<HTMLElement, EmblorLabelProps<any>>(function EmblorLabel(props, forwardedRef) {
  const {
    as,
    children,
    id: consumerId,
    htmlFor,
    onClick,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...rest
  } = props;
  const { inputId, focusInput, registerLabel, registerBoundaryNode } = useEmblorContext('EmblorLabel');
  const Component = (as ?? 'label') as React.ElementType;
  const reactId = React.useId().replace(/:/g, '');
  const labelId = consumerId ?? `emblor-${reactId}-label`;
  const automaticallyAssociated = htmlFor === undefined && ariaLabel === undefined && ariaLabelledBy === undefined;
  const resolvedHtmlFor = automaticallyAssociated ? inputId : htmlFor;
  const labelTokenRef = React.useRef(Symbol());
  const boundaryCleanupRef = React.useRef<(() => void) | null>(null);
  const labelNodeRef = React.useRef<HTMLElement | null>(null);
  const assignRef = React.useMemo(
    function createLabelRef() {
      return mergeRefs(forwardedRef as React.Ref<HTMLElement>, function capture(node: HTMLElement | null) {
        labelNodeRef.current = node;
      });
    },
    [forwardedRef],
  );

  React.useLayoutEffect(
    function registerLabelPart() {
      const unregisterLabel = automaticallyAssociated ? registerLabel(labelTokenRef.current, labelId) : undefined;
      boundaryCleanupRef.current?.();
      boundaryCleanupRef.current = registerBoundaryNode(labelNodeRef.current);
      return function cleanupLabelPart() {
        unregisterLabel?.();
        boundaryCleanupRef.current?.();
        boundaryCleanupRef.current = null;
      };
    },
    [automaticallyAssociated, labelId, registerBoundaryNode, registerLabel],
  );

  const handleClick = React.useCallback(
    function handleLabelClick(event: React.MouseEvent<HTMLElement>) {
      if (automaticallyAssociated && Component !== 'label') {
        event.preventDefault();
        focusInput();
      }
    },
    [Component, automaticallyAssociated, focusInput],
  );

  return (
    <Component
      {...(rest as Record<string, unknown>)}
      ref={assignRef}
      id={labelId}
      htmlFor={Component === 'label' ? resolvedHtmlFor : undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      onClick={composeEventHandlers(onClick, handleClick, { checkForDefaultPrevented: true })}
    >
      {children}
    </Component>
  );
});

export const EmblorLabel = EmblorLabelImpl as EmblorLabelComponent;
