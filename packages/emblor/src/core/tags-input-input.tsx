import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import { composeEventHandlers } from '../utils/compose-event-handlers';

import { Props } from '../utils/types';
import { useTagsInputContext } from './tags-input-context';

interface TagsInputInputProps extends React.ComponentPropsWithoutRef<typeof Primitive.input> {
  className?: string;
  placeholder?: string;
}

const TagsInputInput = React.forwardRef<HTMLInputElement, Props<'input', TagsInputInputProps>>(
  ({ as: Component = 'input', className, placeholder, autoFocus, ...props }, forwardedRef) => {
    const {
      disabled,
      readOnly,
      inputRef,
      inputValue,
      placeholder: contextPlaceholder,
      onKeyDown,
      onBlur,
      onFocus,
      onInputChange,
      onTagAdd,
      delimiter,
      addOnPaste,
      inputBlurBehavior,
      labelId,
      isInvalidInput,
      setActiveIndex,
    } = useTagsInputContext();

    React.useEffect(() => {
      if (!autoFocus) return;
      const id = requestAnimationFrame(() => inputRef?.current?.focus());
      return () => cancelAnimationFrame(id);
    }, [autoFocus, inputRef]);

    return (
      <Primitive.input
        ref={forwardedRef}
        type="text"
        role="textbox"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        aria-labelledby={labelId}
        data-invalid={isInvalidInput ? '' : undefined}
        disabled={disabled}
        readOnly={readOnly}
        value={inputValue}
        placeholder={placeholder || contextPlaceholder}
        className={className}
        {...props}
        onFocus={composeEventHandlers(props.onFocus, onFocus)}
        onChange={composeEventHandlers(props.onChange, (event) => {
          const target = event.target as HTMLInputElement;
          if (delimiter === target.value.slice(-1)) {
            const value = target.value.slice(0, -1);
            if (value) {
              onTagAdd?.(value);
              setActiveIndex?.(null);
            }
          }
          onInputChange?.(event);
        })}
        onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
          const isDelimiterKey = Array.isArray(delimiter)
            ? delimiter.includes(event.key)
            : event.key === delimiter || event.key === 'Enter';

          if (isDelimiterKey) {
            event.preventDefault();
            const value = event.currentTarget.value;
            if (value) {
              const isAdded = onTagAdd?.(value);
              if (isAdded) setActiveIndex?.(null);
            }
          }
          onKeyDown?.(event);
          if (event.key.length === 1) setActiveIndex?.(null);
        })}
        onBlur={composeEventHandlers(props.onBlur, (event) => {
          if (inputBlurBehavior === 'add') {
            const value = event.target.value;
            if (value) {
              const isAdded = onTagAdd?.(value);
              if (isAdded) setActiveIndex?.(null);
            }
          }
          if (inputBlurBehavior === 'clear') {
            onInputChange?.({
              ...event,
              target: { ...event.target, value: '' },
            } as React.ChangeEvent<HTMLInputElement>);
          }
          onBlur?.(event);
        })}
        onPaste={composeEventHandlers(props.onPaste, (event) => {
          if (addOnPaste) {
            event.preventDefault();
            const value = event.clipboardData.getData('text');
            if (value) {
              onTagAdd?.(value, { viaPaste: true });
              setActiveIndex?.(null);
            }
          }
        })}
      />
    );
  },
);

TagsInputInput.displayName = 'TagsInputInput';

const Input = TagsInputInput;

export { Input, TagsInputInput };
export type { TagsInputInputProps };
