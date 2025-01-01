import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import { useTagsInputContext } from './tags-input-context';

interface TagsInputLabelProps extends React.ComponentPropsWithoutRef<typeof Primitive.label> {}

const TagsInputLabel = React.forwardRef<HTMLLabelElement, TagsInputLabelProps>((props, ref) => {
  const { labelId } = useTagsInputContext();
  return <Primitive.label id={labelId} {...props} ref={ref} />;
});

TagsInputLabel.displayName = 'TagsInputLabel';

const Label = TagsInputLabel;

export { Label, TagsInputLabel };
export type { TagsInputLabelProps };
