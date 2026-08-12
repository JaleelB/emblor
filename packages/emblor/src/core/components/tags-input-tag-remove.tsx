import * as React from 'react';
import type { EmblorTagRemoveProps } from '../../types';
import { composeEventHandlers } from '../../utils';
import { useEmblorContext } from '../tags-input-context';

export const EmblorTagRemove = React.forwardRef<HTMLElement, EmblorTagRemoveProps>(
  function EmblorTagRemove(props, forwardedRef) {
    const { as, index, children, ariaLabel = 'Remove tag', onClick, disabled: disabledProp, ...rest } = props;
    const { store, removeTag, disabled, readOnly } = useEmblorContext('Emblor.TagRemove');
    const tagRecord = store.getState().tags[index];
    const Component = (as ?? 'button') as React.ElementType;
    const isDisabled = Boolean(disabledProp) || disabled || readOnly;

    const handleClick = React.useCallback(
      function onClickHandler(event: React.MouseEvent<HTMLElement>) {
        event.stopPropagation();
        if (isDisabled) {
          return;
        }
        removeTag(index);
      },
      [index, isDisabled, removeTag],
    );

    if (!tagRecord) {
      return null;
    }

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
        {children ?? '×'}
      </Component>
    );
  },
);
