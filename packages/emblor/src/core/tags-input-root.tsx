import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import { Props, TagsInputRootProps } from '../utils/types';
import { TagsInputProvider } from './tags-input-context';
import { useTagInput } from '../utils/use-tag-input';

const TagsInputRoot = React.forwardRef<HTMLDivElement, Props<'div', TagsInputRootProps>>(
  ({ as: Component = 'div', children, onFocus, onBlur, ...props }, forwardedRef) => {
    const context = useTagInput({ ...props, onFocus, onBlur });

    return (
      <TagsInputProvider value={context}>
        <Primitive.div ref={forwardedRef}>{children}</Primitive.div>
      </TagsInputProvider>
    );
  },
);

TagsInputRoot.displayName = 'TagsInputRoot';

const Root = TagsInputRoot;

export { Root, TagsInputRoot };
export type { TagsInputRootProps };
