import type React from 'react';

export type TagValue = string;

export type EmblorTag = {
  id: string;
  value: TagValue;
};

export type EmblorTagValidationResult = boolean | string;

export type EmblorDelimiter = string;

export type EmblorRootPublicProps = {
  as?: React.ElementType;
  children?: React.ReactNode;
  onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
  className?: string;
  value?: Array<TagValue>;
  defaultValue?: Array<TagValue>;
  onValueChange?: (next: Array<TagValue>) => void;
  maxTags?: number;
  minTags?: number;
  allowDuplicates?: boolean;
  validateTag?: (text: string) => EmblorTagValidationResult;
  onTagAdd?: (tag: TagValue, index: number) => void;
  onTagRemove?: (tag: TagValue, index: number) => void;
  onClearAll?: () => void;
  delimiter?: Array<EmblorDelimiter>;
  addOnPaste?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  placeholderWhenFull?: string;
  minLength?: number;
  maxLength?: number;
  onTagClick?: (tag: TagValue, index: number) => void;
  generateTagId?: (tag: TagValue, index: number) => string;
  onInputKeydown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  focusedIndex?: number;
  setFocusedIndex?: (next: number | null) => void;
  activeIndex?: number;
  setActiveIndex?: (next: number | null) => void;
  inputBlurBehavior?: 'commit' | 'discard' | 'noop';
  labelId?: string;
};

export type EmblorRootProps = EmblorRootPublicProps & {
  id?: string;
};

export type EmblorInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange'
> & {
  as?: React.ElementType;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  ariaDescribedBy?: string;
};

export type EmblorTagListProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
  as?: React.ElementType;
  id?: string;
  children?: React.ReactNode;
};

export type EmblorTagProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
  as?: React.ElementType;
  index: number;
  children?: React.ReactNode;
};

export type EmblorTagRemoveProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  as?: React.ElementType;
  index: number;
  children?: React.ReactNode;
  ariaLabel?: string;
};

export type EmblorClearTriggerProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  as?: React.ElementType;
  children?: React.ReactNode;
  ariaLabel?: string;
};

export type EmblorKeyboardNavigationProps = {
  type: 'list' | 'input';
};

export type EmblorTagCountMode = 'total' | 'remaining';

export type EmblorTagCountProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
  as?: React.ElementType;
  mode?: EmblorTagCountMode;
  maxTags?: number;
  formatter?: (count: number, max?: number) => string;
};
