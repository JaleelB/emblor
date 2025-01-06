import * as React from 'react';
import { Tag } from '../utils/types';

export interface TagsInputContextValue {
  disabled?: boolean;
  readOnly?: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  inputValue: string;
  placeholder: string;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent) => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTagAdd?: (text: string, options?: { viaPaste?: boolean }) => boolean;
  delimiter?: string;
  addOnPaste?: boolean;
  inputBlurBehavior?: 'add' | 'clear' | 'none';
  labelId?: string;
  isInvalidInput?: boolean;
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
  tags: Tag[];
  maxTags?: number;
  focusedIndex: number | null;
  setFocusedIndex: (index: number | null) => void;
  onTagClick: (tag: Tag) => void;
  handleRemoveTag: (id: string) => void;
  onClearTags: () => void;
}

const TagsInputContext = React.createContext<TagsInputContextValue | null>(null);

export const TagsInputProvider = TagsInputContext.Provider;

export const useTagsInputContext = () => {
  const context = React.useContext(TagsInputContext);
  if (!context) {
    throw new Error('useTagsInputContext must be used within a TagsInputProvider');
  }
  return context;
};
