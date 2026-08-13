import type * as React from 'react';

export type TagValue = string;

export type EmblorMutationSource = 'keyboard' | 'pointer' | 'blur';

export type EmblorValueChangeDetails =
  | {
      type: 'add';
      value: string;
      index: number;
      source: 'keyboard' | 'blur';
    }
  | {
      type: 'add-many';
      values: string[];
      startIndex: number;
      source: 'paste';
    }
  | {
      type: 'remove';
      value: string;
      index: number;
      source: 'keyboard' | 'pointer';
    }
  | {
      type: 'clear';
      values: string[];
      source: 'keyboard' | 'pointer';
    };

export type EmblorRejectReason = 'empty' | 'min-length' | 'max-length' | 'duplicate' | 'max-tags' | 'custom';

export type EmblorRejection = {
  rawValue: string;
  value: string;
  reason: EmblorRejectReason;
  source: 'keyboard' | 'paste' | 'blur';
};

export type EmblorAnnouncement =
  | { type: 'add'; value: string }
  | { type: 'add-many'; values: string[] }
  | { type: 'remove'; value: string }
  | { type: 'clear'; values: string[] }
  | { type: 'reject'; rejection: EmblorRejection };

export type EmblorAnnouncementFormatter = (announcement: EmblorAnnouncement) => string;

export type EmblorBlurBehavior = 'commit' | 'discard' | 'noop';

export type PolymorphicRef<ElementType extends React.ElementType> = React.ComponentPropsWithRef<ElementType>['ref'];

export type PolymorphicProps<ElementType extends React.ElementType, OwnProps extends object = object> = OwnProps & {
  as?: ElementType;
} & Omit<React.ComponentPropsWithoutRef<ElementType>, keyof OwnProps | 'as'> & {
    ref?: PolymorphicRef<ElementType>;
  };

export type PolymorphicComponent<DefaultElement extends React.ElementType, OwnProps extends object> = {
  <ElementType extends React.ElementType = DefaultElement>(
    props: PolymorphicProps<ElementType, OwnProps>,
  ): React.ReactElement | null;
};

export type EmblorRootOwnProps = {
  children?: React.ReactNode;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[], details: EmblorValueChangeDetails) => void;
  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?: (value: string) => void;
  transform?: (value: string) => string;
  validate?: (value: string) => boolean;
  invalid?: boolean;
  onReject?: (rejection: EmblorRejection) => void;
  maxTags?: number;
  minTags?: number;
  allowDuplicates?: boolean;
  minLength?: number;
  maxLength?: number;
  delimiters?: string[];
  addOnPaste?: boolean;
  addOnTab?: boolean;
  blurBehavior?: EmblorBlurBehavior;
  placeholderWhenFull?: string;
  name?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  getAnnouncement?: EmblorAnnouncementFormatter;
  dir?: 'ltr' | 'rtl';
};

export type EmblorRootProps<ElementType extends React.ElementType = 'div'> = PolymorphicProps<
  ElementType,
  EmblorRootOwnProps
>;
export type EmblorRootComponent = PolymorphicComponent<'div', EmblorRootOwnProps>;

export type EmblorLabelOwnProps = {
  children?: React.ReactNode;
};

export type EmblorLabelProps<ElementType extends React.ElementType = 'label'> = PolymorphicProps<
  ElementType,
  EmblorLabelOwnProps
>;
export type EmblorLabelComponent = PolymorphicComponent<'label', EmblorLabelOwnProps>;

export type EmblorTagListOwnProps = {
  children?: React.ReactNode | ((tag: string, index: number) => React.ReactNode);
};

export type EmblorTagListProps<ElementType extends React.ElementType = 'div'> = PolymorphicProps<
  ElementType,
  EmblorTagListOwnProps
>;
export type EmblorTagListComponent = PolymorphicComponent<'div', EmblorTagListOwnProps>;

export type EmblorTagOwnProps = {
  index: number;
  children?: React.ReactNode;
};

export type EmblorTagProps<ElementType extends React.ElementType = 'div'> = PolymorphicProps<
  ElementType,
  EmblorTagOwnProps
>;
export type EmblorTagComponent = PolymorphicComponent<'div', EmblorTagOwnProps>;

export type EmblorTagTextOwnProps = {
  children?: React.ReactNode;
};

export type EmblorTagTextProps<ElementType extends React.ElementType = 'span'> = PolymorphicProps<
  ElementType,
  EmblorTagTextOwnProps
>;
export type EmblorTagTextComponent = PolymorphicComponent<'span', EmblorTagTextOwnProps>;

export type EmblorInputElementType = 'input' | 'textarea' | React.JSXElementConstructor<any>;

export type EmblorInputOwnProps = {
  children?: never;
};

export type EmblorInputProps<ElementType extends EmblorInputElementType = 'input'> = EmblorInputOwnProps & {
  as?: ElementType;
} & Omit<
    React.ComponentPropsWithoutRef<ElementType>,
    keyof EmblorInputOwnProps | 'as' | 'value' | 'defaultValue' | 'name' | 'required' | 'disabled' | 'readOnly'
  > & {
    ref?: PolymorphicRef<ElementType>;
  };
export type EmblorInputComponent = {
  <ElementType extends EmblorInputElementType = 'input'>(
    props: EmblorInputProps<ElementType>,
  ): React.ReactElement | null;
};

export type EmblorTagRemoveOwnProps = {
  children?: React.ReactNode;
  disabled?: boolean;
};

export type EmblorTagRemoveProps<ElementType extends React.ElementType = 'button'> = EmblorTagRemoveOwnProps & {
  as?: ElementType;
} & Omit<React.ComponentPropsWithoutRef<ElementType>, keyof EmblorTagRemoveOwnProps | 'as' | 'type'> & {
    ref?: PolymorphicRef<ElementType>;
  };
export type EmblorTagRemoveComponent = PolymorphicComponent<'button', EmblorTagRemoveOwnProps>;

export type EmblorClearOwnProps = {
  children?: React.ReactNode;
  disabled?: boolean;
};

export type EmblorClearProps<ElementType extends React.ElementType = 'button'> = EmblorClearOwnProps & {
  as?: ElementType;
} & Omit<React.ComponentPropsWithoutRef<ElementType>, keyof EmblorClearOwnProps | 'as' | 'type'> & {
    ref?: PolymorphicRef<ElementType>;
  };
export type EmblorClearComponent = PolymorphicComponent<'button', EmblorClearOwnProps>;
