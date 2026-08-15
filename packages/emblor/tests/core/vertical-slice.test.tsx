import * as React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  EmblorClear,
  EmblorInput,
  EmblorLabel,
  EmblorRoot,
  EmblorTag,
  EmblorTagList,
  EmblorTagRemove,
  EmblorTagText,
  type EmblorRejection,
  type EmblorValueChangeDetails,
} from '../../src';

const suppressAnnouncements = () => '';

const CustomButton = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<'button'>>(
  function CustomButton(props, ref) {
    return <button {...props} ref={ref} />;
  },
);

function Field(props: React.ComponentProps<typeof EmblorRoot> & { inputPlaceholder?: string }) {
  const { inputPlaceholder = 'Add tag', children, ...rootProps } = props;
  return (
    <EmblorRoot getAnnouncement={suppressAnnouncements} {...rootProps}>
      <EmblorLabel>Tags</EmblorLabel>
      <EmblorTagList>
        {(tag, index) => (
          <EmblorTag key={`${tag}-${index}`} index={index}>
            <EmblorTagText />
            <EmblorTagRemove />
          </EmblorTag>
        )}
      </EmblorTagList>
      <EmblorInput placeholder={inputPlaceholder} />
      {children}
    </EmblorRoot>
  );
}

describe('Emblor v2 vertical slice', () => {
  it('renders controlled and uncontrolled values through the TagList render function', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [values, setValues] = React.useState(['one']);
      return <Field value={values} onValueChange={(next) => setValues(next)} />;
    }

    render(
      <>
        <Controlled />
        <Field defaultValue={['two']} />
      </>,
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    const inputs = screen.getAllByRole('textbox');
    await user.type(inputs[1], 'three{enter}');
    expect(screen.getByText('three')).toBeInTheDocument();
  });

  it('uses Root-owned draft state and emits one metadata-rich add transition', async () => {
    const user = userEvent.setup();
    const changes: Array<{ values: string[]; details: EmblorValueChangeDetails }> = [];
    render(<Field onValueChange={(values, details) => changes.push({ values, details })} />);

    const input = screen.getByRole('textbox');
    await user.type(input, ' alpha {enter}');

    expect(screen.getByText('alpha')).toBeInTheDocument();
    expect(input).toHaveValue('');
    expect(changes).toEqual([
      { values: ['alpha'], details: { type: 'add', value: 'alpha', index: 0, source: 'keyboard' } },
    ]);
  });

  it('transforms before validation and reports structured rejections without truncating drafts', async () => {
    const user = userEvent.setup();
    const rejections: EmblorRejection[] = [];
    render(
      <Field
        maxLength={3}
        transform={(value) => value.toLowerCase()}
        validate={(value) => value !== 'bad'}
        onReject={(rejection) => rejections.push(rejection)}
      />,
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'TOOLONG{enter}');
    expect(input).toHaveValue('TOOLONG');
    expect(rejections[0]).toMatchObject({
      rawValue: 'TOOLONG',
      value: 'toolong',
      reason: 'max-length',
      source: 'keyboard',
    });

    await user.clear(input);
    await user.type(input, 'bad{enter}');
    expect(rejections[1]).toMatchObject({ value: 'bad', reason: 'custom' });
    expect(screen.queryByText('bad')).not.toBeInTheDocument();
  });

  it('partially accepts paste candidates in order and batches the transition', () => {
    const onValueChange = vi.fn();
    const onReject = vi.fn();
    render(<Field maxTags={3} value={['existing']} onValueChange={onValueChange} onReject={onReject} />);
    const input = screen.getByRole('textbox');

    fireEvent.paste(input, {
      clipboardData: { getData: () => ' first,existing,second,third' },
    });

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0][0]).toEqual(['existing', 'first', 'second']);
    expect(onValueChange.mock.calls[0][1]).toEqual({
      type: 'add-many',
      values: ['first', 'second'],
      startIndex: 1,
      source: 'paste',
    });
    expect(onReject).toHaveBeenCalledWith(expect.objectContaining({ reason: 'duplicate', value: 'existing' }));
    expect(onReject).toHaveBeenCalledWith(expect.objectContaining({ reason: 'max-tags', value: 'third' }));
  });

  it('keeps the input editable at capacity and exposes invalid state', async () => {
    const user = userEvent.setup();
    const onReject = vi.fn();
    render(<Field defaultValue={['one']} maxTags={1} onReject={onReject} placeholderWhenFull="Full" />);
    const input = screen.getByPlaceholderText('Full');
    expect(input).not.toBeDisabled();
    await user.type(input, 'two{enter}');
    expect(input).toHaveValue('two');
    expect(input).toHaveAttribute('data-invalid', '');
    expect(onReject).toHaveBeenCalledWith(expect.objectContaining({ reason: 'max-tags' }));
  });

  it('uses private Tag context for text and removal, and restores focus after removal', async () => {
    const user = userEvent.setup();
    render(<Field defaultValue={['one', 'two']} />);
    const items = screen.getAllByRole('listitem');
    const remove = within(items[0]).getByRole('button', { name: 'Remove one' });
    await user.click(remove);
    expect(screen.queryByText('one')).not.toBeInTheDocument();
    expect(screen.getByText('two').closest('[role="listitem"]')).toHaveFocus();
  });

  it('keeps tag focus state synchronized with the actual focused DOM element', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Field defaultValue={['one']} />
        <button type="button">Outside</button>
      </div>,
    );
    const tag = screen.getByRole('listitem');
    const remove = within(tag).getByRole('button', { name: 'Remove one' });

    act(() => tag.focus());
    expect(tag).toHaveAttribute('data-focused', '');
    expect(tag).toHaveAttribute('tabindex', '0');

    act(() => remove.focus());
    expect(tag).not.toHaveAttribute('data-focused');
    expect(tag).toHaveAttribute('tabindex', '-1');

    act(() => tag.focus());
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(tag).not.toHaveAttribute('data-focused');
    expect(tag).toHaveAttribute('tabindex', '-1');
  });

  it('retains controlled focus intent through unchanged renders until exact acknowledgement', async () => {
    vi.useFakeTimers();
    try {
      function DelayedControlledField() {
        const [values, setValues] = React.useState(['one', 'two']);
        return (
          <Field
            value={values}
            onValueChange={(next) => {
              setTimeout(() => setValues(next), 50);
            }}
          />
        );
      }

      render(<DelayedControlledField />);
      const first = screen.getAllByRole('listitem')[0];
      const remove = within(first).getByRole('button', { name: 'Remove one' });
      act(() => {
        remove.focus();
        fireEvent.click(remove);
      });
      expect(screen.getByText('one')).toBeInTheDocument();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(50);
      });
      expect(screen.queryByText('one')).not.toBeInTheDocument();
      expect(screen.getByText('two').closest('[role="listitem"]')).toHaveFocus();
    } finally {
      vi.useRealTimers();
    }
  });

  it('does not override deliberate consumer focus before controlled acknowledgement', async () => {
    vi.useFakeTimers();
    try {
      function ConsumerFocusedField() {
        const [values, setValues] = React.useState(['one', 'two']);
        const outsideRef = React.useRef<HTMLButtonElement>(null);
        return (
          <>
            <Field
              value={values}
              onValueChange={(next) => {
                setTimeout(() => {
                  outsideRef.current?.focus();
                  setValues(next);
                }, 50);
              }}
            />
            <button ref={outsideRef} type="button">
              Consumer target
            </button>
          </>
        );
      }

      render(<ConsumerFocusedField />);
      const first = screen.getAllByRole('listitem')[0];
      const remove = within(first).getByRole('button', { name: 'Remove one' });
      act(() => {
        remove.focus();
        fireEvent.click(remove);
      });
      await act(async () => {
        await vi.advanceTimersByTimeAsync(50);
      });
      expect(screen.getByRole('button', { name: 'Consumer target' })).toHaveFocus();
    } finally {
      vi.useRealTimers();
    }
  });

  it('restores Input focus only after a controlled clear is acknowledged', async () => {
    vi.useFakeTimers();
    try {
      function DelayedControlledClear() {
        const [values, setValues] = React.useState(['one']);
        return (
          <Field
            value={values}
            onValueChange={(next) => {
              setTimeout(() => setValues(next), 50);
            }}
          >
            <EmblorClear />
          </Field>
        );
      }

      render(<DelayedControlledClear />);
      const clear = screen.getByRole('button', { name: 'Clear all tags' });
      act(() => {
        clear.focus();
        fireEvent.click(clear);
      });
      expect(clear).toHaveFocus();
      await act(async () => {
        await vi.advanceTimersByTimeAsync(50);
      });
      expect(screen.getByRole('textbox')).toHaveFocus();
    } finally {
      vi.useRealTimers();
    }
  });

  it('restores Input focus after an accepted uncontrolled clear', () => {
    render(
      <Field defaultValue={['one']}>
        <EmblorClear />
      </Field>,
    );
    const clear = screen.getByRole('button', { name: 'Clear all tags' });
    act(() => {
      clear.focus();
      fireEvent.click(clear);
    });
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('preserves native button safety for custom action components', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <EmblorRoot defaultValue={['one']} onValueChange={onValueChange}>
          <EmblorTagList>
            {(tag, index) => (
              <EmblorTag key={tag} index={index}>
                <EmblorTagText />
                <EmblorTagRemove as={CustomButton} />
              </EmblorTag>
            )}
          </EmblorTagList>
          <EmblorInput />
          <EmblorClear as={CustomButton} />
        </EmblorRoot>
      </form>,
    );

    const remove = screen.getByRole('button', { name: 'Remove one' });
    const clear = screen.getByRole('button', { name: 'Clear all tags' });
    expect(remove).toHaveAttribute('type', 'button');
    expect(clear).toHaveAttribute('type', 'button');

    act(() => remove.focus());
    await user.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(clear).toBeDisabled();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 110));
    });
  });

  it('renders every partial-paste announcement in rejection-then-batch order', async () => {
    vi.useFakeTimers();
    try {
      render(<Field defaultValue={['existing']} maxTags={3} getAnnouncement={undefined} />);
      const getLiveRegion = () => document.querySelector('[aria-live="polite"]') as HTMLElement;
      fireEvent.paste(screen.getByRole('textbox'), {
        clipboardData: { getData: () => 'first,existing,second,third' },
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });
      expect(getLiveRegion()).toHaveTextContent('Could not add existing: duplicate');
      await act(async () => {
        await vi.advanceTimersByTimeAsync(100);
      });
      expect(getLiveRegion()).toHaveTextContent('Could not add third: max-tags');
      await act(async () => {
        await vi.advanceTimersByTimeAsync(100);
      });
      expect(getLiveRegion()).toHaveTextContent('Added tags first, second');
    } finally {
      vi.useRealTimers();
    }
  });

  it('supports repeated native form values, required validity, and clear guards', async () => {
    const user = userEvent.setup();
    const formRef = React.createRef<HTMLFormElement>();
    render(
      <form ref={formRef}>
        <Field name="skills" defaultValue={['react', 'typescript']} required>
          <EmblorClear />
        </Field>
      </form>,
    );
    const form = formRef.current as HTMLFormElement;
    expect(Array.from(new FormData(form).getAll('skills'))).toEqual(['react', 'typescript']);
    await user.click(screen.getByRole('button', { name: 'Clear all tags' }));
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    act(() => {
      expect(form.checkValidity()).toBe(false);
    });
  });

  it('forwards polymorphic semantics and supports labels without a labelId prop', async () => {
    const user = userEvent.setup();
    render(
      <EmblorRoot as="section" defaultValue={['one']} data-test="root">
        <EmblorLabel as="div">Custom label</EmblorLabel>
        <EmblorTagList as="ul">
          {(tag, index) => (
            <EmblorTag as="li" key={`${tag}-${index}`} index={index}>
              <EmblorTagText />
            </EmblorTag>
          )}
        </EmblorTagList>
        <EmblorInput as="textarea" placeholder="Custom editor" />
        <EmblorClear as="span">Clear</EmblorClear>
      </EmblorRoot>,
    );
    expect(screen.getByRole('group')).toHaveAttribute('data-test', 'root');
    expect(screen.getByRole('list')).toBeInstanceOf(HTMLUListElement);
    expect(screen.getByRole('textbox')).toBeInstanceOf(HTMLTextAreaElement);
    const clear = screen.getByRole('button', { name: 'Clear all tags' });
    await user.click(clear);
    expect(screen.queryByText('one')).not.toBeInTheDocument();
  });
});
