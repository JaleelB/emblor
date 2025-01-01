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
      onInputChange,
      onTagAdd,
      delimiter,
      addOnPaste,
      blurBehavior,
      labelId,
      isInvalidInput,
      setActiveIndex,
    } = useTagsInputContext();

    const onCustomKeydown = React.useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.defaultPrevented) return;
        const value = event.currentTarget.value;
        if (!value) return;

        const isAdded = onTagAdd?.(value);
        if (isAdded) {
          event.currentTarget.value = '';
          setActiveIndex?.(null);
        }
      },
      [onTagAdd, setActiveIndex],
    );

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
        {...props}
        onChange={composeEventHandlers(props.onChange, (event) => {
          const target = event.target as HTMLInputElement;
          if (delimiter === target.value.slice(-1)) {
            const value = target.value.slice(0, -1);
            target.value = '';
            if (value) {
              onTagAdd?.(value);
              setActiveIndex?.(null);
            }
          }
          onInputChange?.(event);
        })}
        onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
          if (event.key === 'Enter') onCustomKeydown(event);
          onKeyDown?.(event);
          if (event.key.length === 1) setActiveIndex?.(null);
        })}
        onBlur={composeEventHandlers(props.onBlur, (event) => {
          if (blurBehavior === 'add') {
            const value = event.target.value;
            if (value) {
              const isAdded = onTagAdd?.(value);
              if (isAdded) event.target.value = '';
            }
          }
          if (blurBehavior === 'clear') {
            event.target.value = '';
          }
          onBlur?.(event);
        })}
        onPaste={composeEventHandlers(props.onPaste, (event) => {
          if (addOnPaste) {
            event.preventDefault();
            const value = event.clipboardData.getData('text');
            onTagAdd?.(value, { viaPaste: true });
            setActiveIndex?.(null);
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
