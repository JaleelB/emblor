import * as React from 'react';

export type Tag = {
  id: string;
  text: string;
};

/**
 * Props that can be passed to any polymorphic component
 */
export type Props<Element extends React.ElementType, Props = {}> = Props & {
  as?: Element;
} & Omit<React.ComponentPropsWithoutRef<Element>, keyof Props | 'as'>;

/**
 * Props for the TagsInputRoot component
 * @typedef {Object} TagsInputRootProps
 */
export interface TagsInputRootProps {
  /** Current value of tags. Use with onValueChange for controlled state */
  value?: Tag[];
  /** Initial value of tags for uncontrolled state */
  defaultValue?: Tag[];
  /** Callback when tags change */
  onValueChange?: (tags: Tag[]) => void;
  /** Maximum number of tags allowed */
  maxTags?: number;
  /** Minimum number of tags required */
  minTags?: number;
  /** Whether to allow duplicate tag values */
  allowDuplicates?: boolean;
  /** Custom validation function for new tags */
  validateTag?: (text: string) => boolean;
  /** Callback when a tag is added */
  onTagAdd?: (text: string) => void;
  /** Callback when a tag is removed */
  onTagRemove?: (text: string) => void;
  /** Callback when all tags are cleared */
  onClearAll?: () => void;
  /** Characters that trigger tag creation */
  delimiter?: string | string[];
  /** Whether to create tags from pasted text */
  addOnPaste?: boolean;
  /** Whether to create tags on input blur */
  addTagsOnBlur?: boolean;
  /** Whether the input is read-only */
  readOnly?: boolean;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Placeholder shown when max tags is reached */
  placeholderWhenFull?: string;
  /** Minimum length for new tags */
  minLength?: number;
  /** Maximum length for new tags */
  maxLength?: number;
  /** Callback when a tag is clicked */
  onTagClick?: (tag: Tag) => void;
  /** Function to generate unique tag IDs */
  generateTagId?: () => string;
  /** Callback for input keydown events */
  onInputKeydown?: (event: React.KeyboardEvent) => void;
  /** Currently focused tag index */
  focusedIndex?: number | null;
  /** Callback to set focused tag index */
  setFocusedIndex?: (index: number | null) => void;
  /** Currently active/selected tag index */
  activeIndex?: number | null;
  /** Callback to set active tag index */
  setActiveIndex?: (index: number | null) => void;
  /** Behavior when input loses focus */
  blurBehavior?: 'add' | 'clear' | 'none';
  /** ID for accessibility labelling */
  labelId?: string;
}
