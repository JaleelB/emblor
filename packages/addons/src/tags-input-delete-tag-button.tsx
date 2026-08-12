import * as React from 'react';
import { composeEventHandlers, useStoreSelector } from '@emblor/utils';
import type { EmblorTagRemoveProps } from '@emblor/types';
import { useEmblorContext } from '@emblor/core';

export type DeleteTagButtonProps = EmblorTagRemoveProps & {
  labelFormatter?: (value: string, index: number) => string;
};

export const DeleteTagButton = React.forwardRef<HTMLElement, DeleteTagButtonProps>(
  function DeleteTagButton(props, forwardedRef) {
    const { index, labelFormatter = defaultLabelFormatter, onClick, children, ...rest } = props;
    const { store, removeTag, disabled, readOnly } = useEmblorContext('DeleteTagButton');
    const tagValue = useStoreSelector(store, function selectValue(state) {
      const record = state.tags[index];
      return record?.value ?? '';
    });
    const Component = (props.as ?? 'button') as React.ElementType;
    const computedLabel = props.ariaLabel ?? labelFormatter(tagValue, index);
    const isDisabled = Boolean(props.disabled) || disabled || readOnly || tagValue.length === 0;

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

    return (
      <Component
        {...rest}
        ref={forwardedRef as React.Ref<HTMLElement>}
        type={Component === 'button' ? 'button' : undefined}
        aria-label={computedLabel}
        data-disabled={isDisabled ? '' : undefined}
        aria-disabled={isDisabled}
        disabled={Component === 'button' ? (isDisabled ? true : undefined) : undefined}
        onClick={composeEventHandlers(
          onClick as ((event: React.MouseEvent<HTMLElement>) => void) | undefined,
          handleClick,
        )}
      >
        {children ?? 'Delete'}
      </Component>
    );
  },
);

function defaultLabelFormatter(value: string, index: number): string {
  return value.length > 0 ? `Remove ${value}` : `Remove tag ${index + 1}`;
}
