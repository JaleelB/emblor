import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import { Props, TagsInputRootProps } from '../utils/types';
import { TagsInputProvider } from './tags-input-context';
import { useTagInput } from '../utils/use-tag-input';

const TagsInputRoot = React.forwardRef<HTMLDivElement, Props<'div', TagsInputRootProps>>(
  (
    {
      as: Component = 'div',
      children,
      onFocus,
      onBlur,
      className,
      // Component props
      value,
      defaultValue,
      onValueChange,
      maxTags,
      minTags,
      allowDuplicates,
      validateTag,
      onTagAdd,
      onTagRemove,
      onClearAll,
      delimiter,
      addOnPaste,
      readOnly,
      disabled,
      placeholderWhenFull,
      minLength,
      maxLength,
      onTagClick,
      generateTagId,
      onInputKeydown,
      focusedIndex,
      setFocusedIndex,
      activeIndex,
      setActiveIndex,
      inputBlurBehavior,
      labelId,
      ...htmlProps
    },
    forwardedRef,
  ) => {
    const context = useTagInput({
      value,
      defaultValue,
      onValueChange,
      maxTags,
      minTags,
      allowDuplicates,
      validateTag,
      onTagAdd,
      onTagRemove,
      onClearAll,
      delimiter,
      addOnPaste,
      readOnly,
      disabled,
      placeholderWhenFull,
      minLength,
      maxLength,
      onTagClick,
      generateTagId,
      onInputKeydown,
      focusedIndex,
      setFocusedIndex,
      activeIndex,
      setActiveIndex,
      inputBlurBehavior,
      labelId,
      onFocus,
      onBlur,
    });

    return (
      <TagsInputProvider value={context}>
        <Primitive.div ref={forwardedRef} className={className} {...htmlProps}>
          {children}
        </Primitive.div>
      </TagsInputProvider>
    );
  },
);

TagsInputRoot.displayName = 'TagsInputRoot';

const Root = TagsInputRoot;

export { Root, TagsInputRoot };
export type { TagsInputRootProps };
