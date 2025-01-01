import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import { useTagsInputItem } from './tags-input-item';
import { useTagsInputContext } from './tags-input-context';
import { composeEventHandlers } from '../utils/compose-event-handlers';

const ITEM_DELETE_NAME = 'TagsInputItemDelete';

interface TagsInputItemDeleteProps extends React.ComponentPropsWithoutRef<typeof Primitive.button> {}

const TagsInputItemDelete = React.forwardRef<HTMLButtonElement, TagsInputItemDeleteProps>((props, ref) => {
  const { handleRemoveTag } = useTagsInputContext();
  const { tag, textId, disabled } = useTagsInputItem(ITEM_DELETE_NAME);

  return (
    <Primitive.button
      type="button"
      tabIndex={-1}
      aria-labelledby={textId}
      aria-label={`Remove ${tag.text}`}
      data-disabled={disabled ? '' : undefined}
      {...props}
      ref={ref}
      onClick={composeEventHandlers(props.onClick, (event) => {
        event.stopPropagation();
        if (!disabled) {
          handleRemoveTag(tag.id);
        }
      })}
    />
  );
});

TagsInputItemDelete.displayName = ITEM_DELETE_NAME;

const ItemDelete = TagsInputItemDelete;

export { ItemDelete, TagsInputItemDelete };
export type { TagsInputItemDeleteProps };
