import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import { Tag } from '../utils/types';
import { useTagsInputContext } from './tags-input-context';
import { composeEventHandlers } from '../utils/compose-event-handlers';

const ITEM_NAME = 'TagsInputItem';

interface TagsInputItemContextValue {
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

interface TagsInputItemProps extends React.ComponentPropsWithoutRef<typeof Primitive.li> {
  tag: Tag;
  index: number;
  disabled?: boolean;
  children: React.ReactNode;
}

const TagsInputItem = React.forwardRef<HTMLLIElement, TagsInputItemProps>(
  ({ tag, index, disabled: itemDisabled, children, ...props }, ref) => {
    const textId = React.useId();
    const {
      focusedIndex,
      activeIndex,
      setActiveIndex,
      readOnly,
      disabled: contextDisabled,
      onTagClick,
      handleRemoveTag,
    } = useTagsInputContext();
    const isHighlighted = index === focusedIndex;
    const isActive = index === activeIndex;
    const disabled = itemDisabled || readOnly || contextDisabled;

    const contextValue = React.useMemo(
      () => ({
        tag,
        index,
        isHighlighted,
        isEditing: false,
        disabled,
        textId,
      }),
      [tag, index, isHighlighted, disabled, textId],
    );

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLLIElement>) => {
        event.stopPropagation();
        if (!disabled) {
          setActiveIndex(index);
          onTagClick?.(tag);
        }
      },
      [disabled, index, onTagClick, setActiveIndex, tag],
    );

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLLIElement>) => {
        if (disabled) return;

        switch (event.key) {
          case 'Delete':
          case 'Backspace': {
            event.preventDefault();
            handleRemoveTag(tag.id);
            break;
          }
          case 'Space':
          case ' ':
          case 'Enter': {
            event.preventDefault();
            onTagClick?.(tag);
            break;
          }
        }
      },
      [disabled, handleRemoveTag, tag.id, onTagClick, tag],
    );

    return (
      <TagsInputItemContext.Provider value={contextValue}>
        <Primitive.li
          role="listitem"
          tabIndex={0}
          aria-selected={isActive}
          aria-labelledby={textId}
          data-highlighted={isHighlighted ? '' : undefined}
          data-active={isActive ? '' : undefined}
          data-disabled={disabled ? '' : undefined}
          data-readonly={readOnly ? '' : undefined}
          {...props}
          ref={ref}
          onClick={composeEventHandlers(props.onClick, handleClick)}
          onKeyDown={composeEventHandlers(props.onKeyDown, handleKeyDown)}
        >
          {children}
        </Primitive.li>
      </TagsInputItemContext.Provider>
    );
  },
);

TagsInputItem.displayName = ITEM_NAME;

const Item = TagsInputItem;

export { Item, TagsInputItem };
export type { TagsInputItemProps };
