import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import { useTagsInputContext } from './tags-input-context';

interface TagsInputListProps extends React.ComponentPropsWithoutRef<typeof Primitive.ul> {
  direction?: 'row' | 'column';
}

const TagsInputList = React.forwardRef<HTMLUListElement, TagsInputListProps>(({ direction = 'row', ...props }, ref) => {
  const { labelId, disabled, readOnly } = useTagsInputContext();

  return (
    <Primitive.ul
      role="list"
      aria-labelledby={labelId}
      data-disabled={disabled ? '' : undefined}
      data-readonly={readOnly ? '' : undefined}
      data-direction={direction}
      {...props}
      ref={ref}
    />
  );
});

TagsInputList.displayName = 'TagsInputList';

const List = TagsInputList;

export { List, TagsInputList };
export type { TagsInputListProps };
