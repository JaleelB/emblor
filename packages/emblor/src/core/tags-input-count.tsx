import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';

import { Props } from '../utils/types';
import { useTagsInputContext } from './tags-input-context';

interface TagsInputCountProps extends React.ComponentPropsWithoutRef<typeof Primitive.span> {
  render?: (count: number, maxTags?: number) => React.ReactNode;
}

const TagsInputCount = React.forwardRef<HTMLSpanElement, Props<'span', TagsInputCountProps>>(
  ({ as: Component = 'span', className, render, ...props }, ref) => {
    const { tags, maxTags } = useTagsInputContext();

    const content = render ? render(tags.length, maxTags) : maxTags ? `${tags.length}/${maxTags}` : tags.length;

    return (
      <Primitive.span ref={ref} className={className} aria-live="polite" aria-atomic="true" {...props}>
        {content}
      </Primitive.span>
    );
  },
);

TagsInputCount.displayName = 'TagsInputCount';

const Count = TagsInputCount;

export { Count, TagsInputCount };
export type { TagsInputCountProps };
