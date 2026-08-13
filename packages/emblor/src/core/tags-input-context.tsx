import * as React from 'react';
import type {
  EmblorAnnouncement,
  EmblorBlurBehavior,
  EmblorInputElementType,
  EmblorRejection,
  EmblorValueChangeDetails,
} from '../types';

export type EmblorInputNode = HTMLInputElement | HTMLTextAreaElement;

export type EmblorPasteResult = {
  accepted: boolean;
  rejected: boolean;
};

export type EmblorContextValue = {
  values: string[];
  draft: string;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  requiredInvalid: boolean;
  invalid: boolean;
  transientInvalid: boolean;
  hasInvalid: boolean;
  maxReached: boolean;
  maxTags?: number;
  minTags?: number;
  minLength?: number;
  maxLength?: number;
  allowDuplicates: boolean;
  delimiters: string[];
  addOnPaste: boolean;
  addOnTab: boolean;
  blurBehavior: EmblorBlurBehavior;
  placeholderWhenFull?: string;
  name?: string;
  inputId: string;
  labelIds: string[];
  actualFocusedIndex: number | null;
  inputRef: React.MutableRefObject<EmblorInputNode | null>;
  rootRef: React.MutableRefObject<HTMLElement | null>;
  setDraft: (value: string) => void;
  commitDraft: (rawValue: string, source: 'keyboard' | 'blur') => boolean;
  pasteDraft: (prospectiveDraft: string, sourceDraft: string, source: 'paste') => EmblorPasteResult | null;
  removeTag: (index: number, source: 'keyboard' | 'pointer') => void;
  clearTags: (source: 'keyboard' | 'pointer') => void;
  setInputFocused: () => void;
  setTagFocused: (index: number | null) => void;
  handleInputBlur: (event: React.FocusEvent<HTMLElement>, cancelled: boolean) => void;
  focusTag: (index: number) => void;
  focusInput: () => void;
  getMountedTagIndexes: () => number[];
  getDirection: () => 'ltr' | 'rtl';
  isWithinRoot: (node: Node | null) => boolean;
  registerInputNode: (node: HTMLElement | null, id: string) => void;
  registerTagListNode: (node: HTMLElement | null) => () => void;
  registerTagNode: (index: number, node: HTMLElement | null, token: symbol) => () => void;
  registerBoundaryNode: (node: HTMLElement | null) => () => void;
  registerLabel: (token: symbol, id: string) => () => void;
  announce: (announcement: EmblorAnnouncement) => void;
  announceRejection: (rejection: EmblorRejection) => void;
  onValueChange?: (value: string[], details: EmblorValueChangeDetails) => void;
  getTagValue: (index: number) => string;
};

const EmblorContext = React.createContext<EmblorContextValue | null>(null);

export function EmblorProvider({ value, children }: { value: EmblorContextValue; children: React.ReactNode }) {
  return <EmblorContext.Provider value={value}>{children}</EmblorContext.Provider>;
}

export function useEmblorContext(component: string): EmblorContextValue {
  const context = React.useContext(EmblorContext);
  if (!context) {
    throw new Error(`${component} must be used within <EmblorRoot>`);
  }
  return context;
}

export type EmblorTagContextValue = {
  index: number;
  value: string;
};

const EmblorTagContext = React.createContext<EmblorTagContextValue | null>(null);

export function EmblorTagProvider({ value, children }: { value: EmblorTagContextValue; children: React.ReactNode }) {
  return <EmblorTagContext.Provider value={value}>{children}</EmblorTagContext.Provider>;
}

export function useEmblorTagContext(component: string): EmblorTagContextValue {
  const context = React.useContext(EmblorTagContext);
  if (!context) {
    throw new Error(`${component} must be used within <EmblorTag>`);
  }
  return context;
}
