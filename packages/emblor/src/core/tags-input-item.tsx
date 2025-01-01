import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import { Tag } from '../utils/types';
import { useTagsInputContext } from './tags-input-context';
import { composeEventHandlers } from '../utils/compose-event-handlers';

const ITEM_NAME = 'TagsInputItem';

interface TagsInputItemContextValue {
  id: string;
  tag: Tag;
  index: number;
  isHighlighted: boolean;
  isEditing: boolean;
  disabled?: boolean;
  textId: string;
}

const TagsInputItemContext = React.createContext<TagsInputItemContextValue | null>(null);

export const useTagsInputItem = (componentName: string) => {
  const context = React.useContext(TagsInputItemContext);
  if (!context) {
    throw new Error(`${componentName} must be used within a TagsInputItem`);
  }
  return context;
};

interface TagsInputItemProps extends React.ComponentPropsWithoutRef<typeof Primitive.div> {
  tag: Tag;
  index: number;
  disabled?: boolean;
}

const TagsInputItem = React.forwardRef<HTMLDivElement, TagsInputItemProps>(
  ({ tag, index, disabled, ...props }, ref) => {
    const id = React.useId();
    const textId = `${id}-text`;
    const { activeIndex, setActiveIndex, readOnly, disabled: contextDisabled } = useTagsInputContext();
    const isHighlighted = index === activeIndex;
    const itemDisabled = disabled || readOnly || contextDisabled;

    const contextValue = React.useMemo(
      () => ({
        id,
        tag,
        index,
        isHighlighted,
        isEditing: false,
        disabled: itemDisabled,
        textId,
      }),
      [id, tag, index, isHighlighted, itemDisabled, textId],
    );

    return (
      <TagsInputItemContext.Provider value={contextValue}>
        <Primitive.div
          role="listitem"
          aria-labelledby={textId}
          aria-selected={isHighlighted}
          data-highlighted={isHighlighted ? '' : undefined}
          data-disabled={itemDisabled ? '' : undefined}
          {...props}
          ref={ref}
          onClick={composeEventHandlers(props.onClick, (event) => {
            event.stopPropagation();
            if (!itemDisabled) {
              setActiveIndex(index);
            }
          })}
        />
      </TagsInputItemContext.Provider>
    );
  },
);

TagsInputItem.displayName = ITEM_NAME;

const Item = TagsInputItem;

export { Item, TagsInputItem };
export type { TagsInputItemProps };
