import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';

import { Props } from '../utils/types';
import { useTagsInputContext } from './tags-input-context';

interface TagsInputListProps extends Props<'ul'> {
  direction?: 'row' | 'column';
}

const TagsInputList = React.forwardRef<HTMLUListElement, TagsInputListProps>(
  ({ direction = 'row', className, ...props }, ref) => {
    const { labelId, disabled, readOnly, activeIndex, setActiveIndex, tags } = useTagsInputContext();

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLUListElement>) => {
        if (disabled || readOnly) return;

        const isArrowLeft = event.key === 'ArrowLeft';
        const isArrowRight = event.key === 'ArrowRight';
        const isArrowUp = event.key === 'ArrowUp';
        const isArrowDown = event.key === 'ArrowDown';

        if (isArrowLeft || isArrowRight || isArrowUp || isArrowDown) {
          event.preventDefault();
          const isHorizontal = direction === 'row';
          const isPrev = isHorizontal ? isArrowLeft : isArrowUp;
          const isNext = isHorizontal ? isArrowRight : isArrowDown;

          if (activeIndex === null) {
            setActiveIndex(0);
          } else if (isPrev) {
            setActiveIndex(Math.max(0, activeIndex - 1));
          } else if (isNext) {
            setActiveIndex(Math.min(tags.length - 1, activeIndex + 1));
          }
        }
      },
      [activeIndex, setActiveIndex, direction, disabled, readOnly, tags.length],
    );

    return (
      <Primitive.ul
        role="list"
        aria-labelledby={labelId}
        data-disabled={disabled ? '' : undefined}
        data-readonly={readOnly ? '' : undefined}
        data-direction={direction}
        className={className}
        {...props}
        ref={ref}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      />
    );
  },
);

TagsInputList.displayName = 'TagsInputList';

export type { TagsInputListProps };
export { TagsInputList };
