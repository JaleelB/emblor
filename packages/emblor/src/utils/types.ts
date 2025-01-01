import * as React from 'react';

export interface Tag {
  id: string;
  text: string;
}

export type Props<T extends React.ElementType, P = {}> = {
  as?: T;
} & Omit<React.ComponentPropsWithRef<T>, keyof P | 'as'> &
  P;

export interface TagsInputRootProps {
  /** Current value - controlled */
  value?: Tag[];
  /** Default value - uncontrolled */
  defaultValue?: Tag[];
  /** Change handler for controlled mode */
  onValueChange?: (value: Tag[]) => void;
  /** Maximum number of tags allowed */
  maxTags?: number;
  /** Minimum number of tags required */
  minTags?: number;
  /** Whether to allow duplicate tags */
  allowDuplicates?: boolean;
  /** Custom validation function */
  validateTag?: (text: string) => boolean;
  /** Callback when a tag is added */
  onTagAdd?: (text: string) => void;
  /** Callback when a tag is removed */
  onTagRemove?: (text: string) => void;
  /** Callback when all tags are cleared */
  onClearAll?: () => void;
  /** Keys that trigger tag creation */
  delimiter?: string | string[];
  /** Whether to add tags when text is pasted */
  addOnPaste?: boolean;
  /** Whether to add tags on blur */
  addTagsOnBlur?: boolean;
  /** Whether the input is read-only */
  readOnly?: boolean;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Placeholder text when max tags is reached */
  placeholderWhenFull?: string;
  /** Minimum length for a tag */
  minLength?: number;
  /** Maximum length for a tag */
  maxLength?: number;
  /** Callback when a tag is clicked */
  onTagClick?: (tag: Tag) => void;
  /** Function to generate unique tag IDs */
  generateTagId?: () => string;
  /** Callback for input keydown events */
  onInputKeydown?: (event: React.KeyboardEvent) => void;
  /** Currently focused tag index */
  focusedIndex?: number | null;
  /** Set focused tag index */
  setFocusedIndex?: (index: number | null) => void;
  /** Currently active/selected tag index */
  activeIndex?: number | null;
  /** Set active/selected tag index */
  setActiveIndex?: (index: number | null) => void;
  /** Behavior when input loses focus */
  blurBehavior?: 'add' | 'clear' | 'none';
  /** ID of the associated label element */
  labelId?: string;
}
