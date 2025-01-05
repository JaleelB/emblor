import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';

import { Props } from '../utils/types';
import { useTagsInputItem } from './tags-input-item';
import { useTagsInputContext } from './tags-input-context';

const ITEM_DELETE_NAME = 'TagsInputItemDelete';
interface TagsInputItemDeleteProps extends Props<'button'> {
  children?: React.ReactNode;
}

const TagsInputItemDelete = React.forwardRef<HTMLButtonElement, TagsInputItemDeleteProps>(
  ({ as: Component = 'button', className, children, ...props }, ref) => {
    const { tag, textId, disabled } = useTagsInputItem('TagsInputItemDelete');
    const { handleRemoveTag } = useTagsInputContext();

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (!disabled) {
          handleRemoveTag(tag.id);
        }
      },
      [disabled, handleRemoveTag, tag.id],
    );

    return (
      <Primitive.button
        type="button"
        ref={ref}
        className={className}
        aria-label={`Remove ${tag.text}`}
        aria-labelledby={textId}
        tabIndex={-1}
        disabled={disabled}
        {...props}
        onClick={handleClick}
      >
        {children}
      </Primitive.button>
    );
  },
);

TagsInputItemDelete.displayName = ITEM_DELETE_NAME;

const ItemDelete = TagsInputItemDelete;

export { ItemDelete, TagsInputItemDelete };
export type { TagsInputItemDeleteProps };
