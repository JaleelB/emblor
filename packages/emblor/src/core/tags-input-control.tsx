import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';

interface TagsInputControlProps extends React.ComponentPropsWithoutRef<typeof Primitive.div> {}

const TagsInputControl = React.forwardRef<HTMLDivElement, TagsInputControlProps>((props, ref) => {
  return <Primitive.div role="group" {...props} ref={ref} />;
});

TagsInputControl.displayName = 'TagsInputControl';

const Control = TagsInputControl;

export { Control, TagsInputControl };
export type { TagsInputControlProps };
