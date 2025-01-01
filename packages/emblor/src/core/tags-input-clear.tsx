import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import { useTagsInputContext } from './tags-input-context';
import { composeEventHandlers } from '../utils/compose-event-handlers';

const CLEAR_NAME = 'TagsInputClear';

interface TagsInputClearProps extends React.ComponentPropsWithoutRef<typeof Primitive.button> {}

const TagsInputClear = React.forwardRef<HTMLButtonElement, TagsInputClearProps>((props, ref) => {
  const { disabled, readOnly, onClearTags, tags } = useTagsInputContext();

  return (
    <Primitive.button
      type="button"
      disabled={disabled || readOnly || !tags.length}
      aria-label="Clear tags"
      {...props}
      ref={ref}
      onClick={composeEventHandlers(props.onClick, (event) => {
        event.stopPropagation();
        if (!disabled && !readOnly && tags.length) {
          onClearTags();
        }
      })}
    />
  );
});

TagsInputClear.displayName = CLEAR_NAME;

const Clear = TagsInputClear;

export { Clear, TagsInputClear };
export type { TagsInputClearProps };
