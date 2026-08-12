import * as React from 'react';
import type { EmblorTag } from '../types';
import type { EmblorStore } from '../utils';

export type EmblorAnnouncement =
  | { type: 'tag-added'; value: string; index: number }
  | { type: 'tag-removed'; value: string; index: number }
  | { type: 'cleared' }
  | { type: 'none' };

export type EmblorStoreState = {
  tags: Array<EmblorTag>;
  inputValue: string;
  isFocusWithin: boolean;
  focusedIndex: number | null;
  activeIndex: number | null;
  isInputFocused: boolean;
  lastAction: EmblorAnnouncement;
  validationError: string | null;
};

export type EmblorContextValue = {
  store: EmblorStore<EmblorStoreState>;
  disabled: boolean;
  readOnly: boolean;
  allowDuplicates: boolean;
  maxTags?: number;
  minTags?: number;
  placeholderWhenFull?: string;
  minLength?: number;
  maxLength?: number;
  delimiter: Array<string>;
  addOnPaste: boolean;
  inputBlurBehavior: 'commit' | 'discard' | 'noop';
  rootId: string;
  listId: string;
  inputId: string;
  labelId?: string;
  getTagId: (index: number) => string;
  setInputValue: (value: string) => void;
  commitTag: (value: string, meta?: { source: 'keyboard' | 'paste' | 'blur' }) => boolean;
  removeTag: (index: number) => void;
  clearTags: () => void;
  focusTag: (index: number) => void;
  setFocusedIndex: (index: number | null) => void;
  setActiveIndex: (index: number | null) => void;
  setInputFocused: (value: boolean) => void;
  focusInput: () => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  listRef: React.MutableRefObject<HTMLElement | null>;
  getTagValue: (index: number) => string | null;
  onTagClick?: (tag: string, index: number) => void;
  onInputKeydown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  registerTagNode: (index: number, node: HTMLElement | null) => void;
};

const EmblorContext = React.createContext<EmblorContextValue | null>(null);

export function EmblorProvider({
  value,
  children,
}: {
  value: EmblorContextValue;
  children: React.ReactNode;
}): JSX.Element {
  return <EmblorContext.Provider value={value}>{children}</EmblorContext.Provider>;
}

export function useEmblorContext(component: string): EmblorContextValue {
  const context = React.useContext(EmblorContext);
  if (!context) {
    throw new Error(`${component} must be used within <Emblor.Root> component`);
  }
  return context;
}
