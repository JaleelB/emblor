import * as React from 'react';
import type { EmblorClearTriggerProps } from '@emblor/types';
import { composeEventHandlers, useStoreSelector } from '@emblor/utils';
import { useEmblorContext } from '@emblor/core';

export type ClearButtonProps = EmblorClearTriggerProps;

export const ClearButton = React.forwardRef<HTMLElement, ClearButtonProps>(function ClearButton(props, forwardedRef) {
  const { as, children, ariaLabel = 'Clear selected tags', onClick, ...rest } = props;
  const { store, clearTags, disabled, readOnly, minTags } = useEmblorContext('ClearButton');
  const Component = (as ?? 'button') as React.ElementType;
  const tagCount = useStoreSelector(store, function selectCount(state) {
    return state.tags.length;
  });
  const isDisabled =
    Boolean(props.disabled) || disabled || readOnly || tagCount === 0 || (minTags !== undefined && tagCount <= minTags);

  const handleClick = React.useCallback(
    function onClickHandler(event: React.MouseEvent<HTMLElement>) {
      event.preventDefault();
      if (isDisabled) {
        return;
      }
      clearTags();
    },
    [clearTags, isDisabled],
  );

  return (
    <Component
      {...rest}
      ref={forwardedRef as React.Ref<HTMLElement>}
      type={Component === 'button' ? 'button' : undefined}
      aria-label={ariaLabel}
      data-disabled={isDisabled ? '' : undefined}
      aria-disabled={isDisabled}
      disabled={Component === 'button' ? (isDisabled ? true : undefined) : undefined}
      onClick={composeEventHandlers(
        onClick as ((event: React.MouseEvent<HTMLElement>) => void) | undefined,
        handleClick,
      )}
    >
      {children ?? 'Clear'}
    </Component>
  );
});
