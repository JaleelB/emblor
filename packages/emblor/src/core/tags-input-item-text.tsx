import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import { useTagsInputItem } from './tags-input-item';

const ITEM_TEXT_NAME = 'TagsInputItemText';

interface TagsInputItemTextProps extends React.ComponentPropsWithoutRef<typeof Primitive.span> {}

const TagsInputItemText = React.forwardRef<HTMLSpanElement, TagsInputItemTextProps>((props, ref) => {
  const { textId, tag } = useTagsInputItem(ITEM_TEXT_NAME);

  return (
    <Primitive.span id={textId} {...props} ref={ref}>
      {props.children ?? tag.text}
    </Primitive.span>
  );
});

TagsInputItemText.displayName = ITEM_TEXT_NAME;

const ItemText = TagsInputItemText;

export { ItemText, TagsInputItemText };
export type { TagsInputItemTextProps };
