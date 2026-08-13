import * as React from 'react';
import { createPortal } from 'react-dom';
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
} from '../../src';
import { defaultAnnouncement } from '../../src/utils';

function Tags({ sparse = false }: { sparse?: boolean }) {
  return (
    <EmblorTagList data-part="list">
      {(tag, index) =>
        !sparse || index !== 1 ? (
          <EmblorTag key={tag} index={index} data-part="tag">
            <EmblorTagText data-part="text" />
            <EmblorTagRemove data-part="remove" />
          </EmblorTag>
        ) : null
      }
    </EmblorTagList>
  );
}

function Field(props: React.ComponentProps<typeof EmblorRoot> & { sparse?: boolean }) {
  const { sparse, children, ...rootProps } = props;
  return (
    <EmblorRoot {...rootProps}>
      <Tags sparse={sparse} />
      <EmblorInput aria-label="Tags input" />
      {children}
    </EmblorRoot>
  );
}

function expectRenderError(node: React.ReactNode, message: RegExp) {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  try {
    expect(() => render(node)).toThrow(message);
  } finally {
    consoleError.mockRestore();
  }
}

describe('verification hardening', () => {
  it('separates Enter, opt-in Tab, native Tab, and literal delimiters', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Field delimiters={[';']} />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'one{tab}');
    expect(input).toHaveValue('one');
    act(() => input.focus());
    await user.keyboard('{Enter}');
    expect(screen.getByText('one')).toBeInTheDocument();

    rerender(<Field delimiters={[';']} addOnTab />);
    await user.type(input, 'two{tab}');
    expect(screen.getByText('two')).toBeInTheDocument();
    act(() => input.focus());
    await user.type(input, 'three;');
    expect(screen.getByText('three')).toBeInTheDocument();
  });

  it('forwards applicable native, ARIA, data, style, and event props on every part', () => {
    const events = vi.fn();
    render(
      <EmblorRoot className="root" data-root="yes" style={{ color: 'red' }} onClick={events} defaultValue={['one']}>
        <EmblorLabel className="label" data-label="yes">
          Tags
        </EmblorLabel>
        <EmblorTagList className="list" data-list="yes">
          {(tag, index) => (
            <EmblorTag className="tag" data-tag="yes" key={tag} index={index}>
              <EmblorTagText className="text" data-text="yes" />
              <EmblorTagRemove className="remove" data-remove="yes" />
            </EmblorTag>
          )}
        </EmblorTagList>
        <EmblorInput className="input" data-input="yes" aria-describedby="help" />
        <EmblorClear className="clear" data-clear="yes" />
      </EmblorRoot>,
    );
    expect(screen.getByRole('group')).toHaveClass('root');
    expect(screen.getByText('Tags')).toHaveAttribute('data-label', 'yes');
    expect(screen.getByRole('list')).toHaveAttribute('data-list', 'yes');
    expect(screen.getByRole('listitem')).toHaveAttribute('data-tag', 'yes');
    expect(screen.getByText('one')).toHaveAttribute('data-text', 'yes');
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'help');
    expect(screen.getByRole('button', { name: 'Remove one' })).toHaveAttribute('data-remove', 'yes');
    fireEvent.click(screen.getByRole('button', { name: 'Clear all tags' }));
    expect(events).toHaveBeenCalled();
  });

  it('preserves disabled/read-only form participation and resets only uncontrolled state', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [values] = React.useState(['controlled']);
      const [draft] = React.useState('controlled draft');
      return <Field value={values} inputValue={draft} name="controlled" />;
    }
    const formRef = React.createRef<HTMLFormElement>();
    render(
      <form ref={formRef}>
        <Field disabled defaultValue={['disabled']} name="disabled" />
        <Field readOnly defaultValue={['readonly']} name="readonly" />
        <Field defaultValue={['initial']} defaultInputValue="initial draft" name="uncontrolled" />
        <Controlled />
        <button type="reset">Reset</button>
      </form>,
    );
    const form = formRef.current as HTMLFormElement;
    expect(new FormData(form).getAll('disabled')).toEqual([]);
    expect(new FormData(form).getAll('readonly')).toEqual(['readonly']);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[2], { target: { value: 'changed draft' } });
    await user.click(within(screen.getAllByRole('listitem')[2]).getByRole('button', { name: 'Remove initial' }));
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByText('initial')).toBeInTheDocument();
    expect(inputs[2]).toHaveValue('initial draft');
    expect(screen.getByText('controlled')).toBeInTheDocument();
    expect(inputs[3]).toHaveValue('controlled draft');
  });

  it('recomputes valid dynamic constraints without mutating or emitting', () => {
    const onValueChange = vi.fn();
    const onReject = vi.fn();
    const getAnnouncement = vi.fn(() => 'announcement');
    const { rerender } = render(
      <Field
        defaultValue={['one', 'two']}
        defaultInputValue="draft"
        onValueChange={onValueChange}
        onReject={onReject}
        getAnnouncement={getAnnouncement}
      />,
    );
    rerender(
      <Field
        defaultValue={['one', 'two']}
        defaultInputValue="draft"
        maxTags={2}
        minTags={2}
        maxLength={2}
        onValueChange={onValueChange}
        onReject={onReject}
        getAnnouncement={getAnnouncement}
      />,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('textbox')).toHaveValue('draft');
    expect(screen.getByRole('textbox')).toHaveAttribute('data-max-reached', '');
    expect(screen.getAllByRole('button', { name: /Remove/ })[0]).toBeDisabled();
    expect(onValueChange).not.toHaveBeenCalled();
    expect(onReject).not.toHaveBeenCalled();
    expect(getAnnouncement).not.toHaveBeenCalled();
  });

  it('combines persistent and transient invalid state and clears transient state on edit and success', () => {
    const { rerender } = render(<Field defaultValue={['one']} invalid />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    fireEvent.change(input, { target: { value: 'one' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(input).toHaveAttribute('data-invalid', '');
    rerender(<Field defaultValue={['one']} invalid={false} />);
    expect(input).toHaveAttribute('data-invalid', '');
    fireEvent.change(input, { target: { value: 'two' } });
    expect(input).not.toHaveAttribute('data-invalid');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(input).not.toHaveAttribute('data-invalid');
  });

  it('supports portal descendants and Strict Mode singleton registration', async () => {
    const user = userEvent.setup();
    const portal = document.createElement('div');
    document.body.append(portal);
    try {
      render(
        <React.StrictMode>
          <EmblorRoot defaultValue={['one']} blurBehavior="discard" defaultInputValue="draft">
            <Tags />
            <EmblorInput aria-label="Tags input" />
            {createPortal(<EmblorLabel as="button">Portal label</EmblorLabel>, portal)}
          </EmblorRoot>
        </React.StrictMode>,
      );
      const input = screen.getByRole('textbox');
      act(() => input.focus());
      await user.click(screen.getByRole('button', { name: 'Portal label' }));
      expect(input).toHaveValue('draft');
    } finally {
      portal.remove();
    }
  });

  it('registers the singleton Input and TagList through a portal with repeated labels and actions', () => {
    const portal = document.createElement('div');
    document.body.append(portal);
    try {
      render(
        <EmblorRoot defaultValue={['one']}>
          <EmblorLabel>First label</EmblorLabel>
          <EmblorLabel>Second label</EmblorLabel>
          {createPortal(
            <>
              <Tags />
              <EmblorInput />
              <EmblorClear>First clear</EmblorClear>
              <EmblorClear>Second clear</EmblorClear>
            </>,
            portal,
          )}
        </EmblorRoot>,
      );
      expect(screen.getByRole('textbox')).toHaveAccessibleName('First label Second label');
      expect(screen.getAllByRole('button', { name: 'Clear all tags' })).toHaveLength(2);
    } finally {
      portal.remove();
    }
  });

  it('throws for missing/duplicate structure, incompatible custom Input, and duplicate Tag indexes', () => {
    expectRenderError(<EmblorRoot />, /requires exactly one EmblorInput/);
    expectRenderError(
      <EmblorRoot>
        <EmblorInput />
        <EmblorInput />
      </EmblorRoot>,
      /allows exactly one EmblorInput/,
    );
    expectRenderError(
      <EmblorRoot>
        <EmblorTagList />
        <EmblorTagList />
        <EmblorInput />
      </EmblorRoot>,
      /at most one EmblorTagList/,
    );
    const BadInput = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>((props, ref) => (
      <div {...props} ref={ref} />
    ));
    expectRenderError(
      <EmblorRoot>
        <EmblorInput as={BadInput} />
      </EmblorRoot>,
      /input-like element/,
    );
    expectRenderError(
      <EmblorRoot defaultValue={['one']}>
        <EmblorTag index={0} />
        <EmblorTag index={0} />
        <EmblorInput />
      </EmblorRoot>,
      /registered more than once/,
    );
  });

  it('allows atomic Input and TagList replacement', () => {
    function ReplacingField() {
      const [alternate, setAlternate] = React.useState(false);
      return (
        <EmblorRoot>
          <EmblorTagList key={alternate ? 'list-b' : 'list-a'} />
          <EmblorInput key={alternate ? 'input-b' : 'input-a'} aria-label="Tags input" />
          <button type="button" onClick={() => setAlternate((current) => !current)}>
            Replace
          </button>
        </EmblorRoot>
      );
    }
    render(<ReplacingField />);
    expect(() => fireEvent.click(screen.getByRole('button', { name: 'Replace' }))).not.toThrow();
  });

  it('activates non-button actions exactly once with Enter and Space and guards disabled actions', () => {
    const onValueChange = vi.fn();
    render(
      <EmblorRoot defaultValue={['one', 'two']} onValueChange={onValueChange}>
        <EmblorTagList>
          {(tag, index) => (
            <EmblorTag key={tag} index={index}>
              <EmblorTagText />
              <EmblorTagRemove as="span" />
            </EmblorTag>
          )}
        </EmblorTagList>
        <EmblorInput />
        <EmblorClear as="span" />
      </EmblorRoot>,
    );
    const firstRemove = screen.getAllByRole('button', { name: /Remove/ })[0];
    fireEvent.keyDown(firstRemove, { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledTimes(1);
    const clear = screen.getByRole('button', { name: 'Clear all tags' });
    const space = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
    act(() => clear.dispatchEvent(space));
    expect(space.defaultPrevented).toBe(true);
    expect(onValueChange).toHaveBeenCalledTimes(2);

    const guarded = render(
      <Field defaultValue={['one']} minTags={1}>
        <EmblorClear as="span" />
      </Field>,
    );
    const guardedClear = guarded.container.querySelector('[aria-label="Clear all tags"]') as HTMLElement;
    expect(guardedClear).toHaveAttribute('aria-disabled', 'true');
    expect(guardedClear).toHaveAttribute('tabindex', '-1');
  });

  it('uses selection-aware prospective paste and restores draft selection after total rejection', async () => {
    vi.useFakeTimers();
    try {
      const onValueChange = vi.fn();
      const firstView = render(<Field defaultInputValue="prefix,suffix" onValueChange={onValueChange} />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      act(() => input.focus());
      input.setSelectionRange(7, 13);
      fireEvent.paste(input, { clipboardData: { getData: () => 'accepted' } });
      expect(onValueChange.mock.calls[0][0]).toEqual(['prefix', 'accepted']);

      firstView.unmount();
      render(<Field defaultValue={['duplicate']} defaultInputValue="draft" onValueChange={onValueChange} />);
      const rejectedInput = screen.getByRole('textbox') as HTMLInputElement;
      act(() => rejectedInput.focus());
      rejectedInput.setSelectionRange(0, 5);
      fireEvent.paste(rejectedInput, { clipboardData: { getData: () => 'duplicate' } });
      await act(async () => vi.runAllTimersAsync());
      expect(rejectedInput).toHaveValue('draft');
      expect(rejectedInput.selectionStart).toBe(0);
      expect(rejectedInput.selectionEnd).toBe(5);
    } finally {
      vi.useRealTimers();
    }
  });

  it('falls back to the end of the draft when selection offsets are unavailable', () => {
    const onValueChange = vi.fn();
    render(<Field defaultInputValue="prefix," onValueChange={onValueChange} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    Object.defineProperty(input, 'selectionStart', { configurable: true, value: null });
    Object.defineProperty(input, 'selectionEnd', { configurable: true, value: null });
    fireEvent.paste(input, { clipboardData: { getData: () => 'one,two' } });
    expect(onValueChange.mock.calls[0][0]).toEqual(['prefix', 'one', 'two']);
  });

  it('leaves cancelled, disabled, read-only, and addOnPaste-off paste native', () => {
    const cancel = vi.fn((event: React.ClipboardEvent<HTMLInputElement>) => event.preventDefault());
    const cases = [
      <Field key="cancel" onPaste={undefined}>
        <span />
      </Field>,
      <Field key="disabled" disabled />,
      <Field key="readonly" readOnly />,
      <Field key="off" addOnPaste={false} />,
    ];
    const { unmount } = render(
      <EmblorRoot>
        <EmblorInput aria-label="Tags input" onPaste={cancel} />
      </EmblorRoot>,
    );
    expect(fireEvent.paste(screen.getByRole('textbox'), { clipboardData: { getData: () => 'one,two' } })).toBe(false);
    unmount();
    void cases;
    for (const props of [{ disabled: true }, { readOnly: true }, { addOnPaste: false }]) {
      const view = render(<Field {...props} />);
      expect(fireEvent.paste(screen.getByRole('textbox'), { clipboardData: { getData: () => 'one,two' } })).toBe(true);
      view.unmount();
    }
  });

  it('applies blur only outside registered boundaries with ordering, cancellation, guards, and unmount silence', async () => {
    const onValueChange = vi.fn();
    const portal = document.createElement('div');
    document.body.append(portal);
    const view = render(
      <div>
        <EmblorRoot blurBehavior="commit" defaultInputValue="draft" onValueChange={onValueChange}>
          <Tags />
          <EmblorInput aria-label="Tags input" />
          {createPortal(<EmblorClear />, portal)}
        </EmblorRoot>
        <button type="button">Outside</button>
      </div>,
    );
    const input = screen.getByRole('textbox');
    fireEvent.blur(input, { relatedTarget: screen.getByRole('button', { name: 'Clear all tags' }) });
    await act(async () => Promise.resolve());
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.blur(input, { relatedTarget: screen.getByRole('button', { name: 'Outside' }) });
    await act(async () => Promise.resolve());
    expect(onValueChange.mock.calls[0][1]).toMatchObject({ type: 'add', source: 'blur' });
    view.unmount();
    portal.remove();

    const cancelled = render(
      <EmblorRoot blurBehavior="discard" defaultInputValue="keep">
        <Tags />
        <EmblorInput aria-label="Tags input" onBlur={(event) => event.preventDefault()} />
      </EmblorRoot>,
    );
    const cancelledInput = screen.getByRole('textbox');
    fireEvent.blur(cancelledInput);
    await act(async () => Promise.resolve());
    expect(cancelledInput).toHaveValue('keep');
    cancelled.unmount();

    const silent = vi.fn();
    const guarded = render(<Field blurBehavior="commit" defaultInputValue="draft" disabled onValueChange={silent} />);
    fireEvent.blur(screen.getByRole('textbox'));
    guarded.unmount();
    await act(async () => Promise.resolve());
    expect(silent).not.toHaveBeenCalled();

    const readOnly = render(<Field blurBehavior="commit" defaultInputValue="draft" readOnly onValueChange={silent} />);
    fireEvent.blur(screen.getByRole('textbox'));
    await act(async () => Promise.resolve());
    expect(silent).not.toHaveBeenCalled();
    readOnly.unmount();
  });

  it('trusts external arrays, stays callback-silent, and rejects ownership switching', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<Field value={[' external ']} inputValue="draft" onValueChange={onValueChange} />);
    expect(screen.getByText((_content, element) => element?.textContent === ' external ')).toBeInTheDocument();
    rerender(<Field value={['changed']} inputValue="changed draft" onValueChange={onValueChange} />);
    expect(screen.getByText('changed')).toBeInTheDocument();
    expect(onValueChange).not.toHaveBeenCalled();
    expectRenderError(<Field value={null as unknown as string[]} />, /array containing only strings/);

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      expect(() => rerender(<Field defaultValue={['changed']} defaultInputValue="changed draft" />)).toThrow(
        /cannot switch/,
      );
    } finally {
      consoleError.mockRestore();
    }
  });

  it('supports sparse indexes for navigation and validates indexes', () => {
    render(<Field defaultValue={['zero', 'hidden', 'two']} sparse />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    act(() => input.focus());
    input.setSelectionRange(0, 0);
    fireEvent.keyDown(input, { key: 'ArrowLeft' });
    expect(screen.getByText('two').closest('[role="listitem"]')).toHaveFocus();
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'Home' });
    expect(screen.getByText('zero').closest('[role="listitem"]')).toHaveFocus();
    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'ArrowRight' });
    expect(screen.getByText('two').closest('[role="listitem"]')).toHaveFocus();
    expectRenderError(
      <EmblorRoot defaultValue={['one']}>
        <EmblorTag index={1} />
        <EmblorInput />
      </EmblorRoot>,
      /valid position/,
    );
  });

  it('uses Home/End independent of direction and observes inherited runtime direction changes', () => {
    const { rerender } = render(
      <div dir="rtl">
        <Field defaultValue={['zero', 'one']} />
      </div>,
    );
    const zero = screen.getByText('zero').closest('[role="listitem"]') as HTMLElement;
    const one = screen.getByText('one').closest('[role="listitem"]') as HTMLElement;
    act(() => zero.focus());
    fireEvent.keyDown(zero, { key: 'ArrowLeft' });
    expect(one).toHaveFocus();
    fireEvent.keyDown(one, { key: 'Home' });
    expect(zero).toHaveFocus();
    fireEvent.keyDown(zero, { key: 'End' });
    expect(one).toHaveFocus();
    rerender(
      <div dir="ltr">
        <Field defaultValue={['zero', 'one']} />
      </div>,
    );
    fireEvent.keyDown(one, { key: 'ArrowLeft' });
    expect(zero).toHaveFocus();
  });

  it('keeps controlled refusal focused and cancels pending restoration on divergence', () => {
    const { rerender } = render(<Field value={['one', 'two']} onValueChange={() => undefined} />);
    const remove = screen.getAllByRole('button', { name: /Remove/ })[0];
    act(() => remove.focus());
    fireEvent.click(remove);
    expect(remove).toHaveFocus();
    rerender(<Field value={['different']} onValueChange={() => undefined} />);
    expect(document.activeElement).not.toBe(screen.getByText('different').closest('[role="listitem"]'));
  });

  it('rejects draft ownership switching independently from tag ownership', () => {
    const view = render(<Field defaultValue={[]} inputValue="controlled" />);
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      expect(() => view.rerender(<Field defaultValue={[]} defaultInputValue="uncontrolled" />)).toThrow(
        /inputValue state cannot switch/,
      );
    } finally {
      consoleError.mockRestore();
    }
  });

  it('defines every default announcement variant', () => {
    expect(defaultAnnouncement({ type: 'add', value: 'one' })).toBe('Added tag one');
    expect(defaultAnnouncement({ type: 'add-many', values: ['one', 'two'] })).toBe('Added tags one, two');
    expect(defaultAnnouncement({ type: 'remove', value: 'one' })).toBe('Removed tag one');
    expect(defaultAnnouncement({ type: 'clear', values: ['one', 'two'] })).toBe('Cleared tags one, two');
    expect(
      defaultAnnouncement({
        type: 'reject',
        rejection: { rawValue: 'one', value: 'one', reason: 'duplicate', source: 'keyboard' },
      }),
    ).toBe('Could not add one: duplicate');
  });

  it('supports default, custom, suppressed, repeated, and guarded announcements', async () => {
    vi.useFakeTimers();
    try {
      const formatter = vi.fn((announcement: { type: string }) =>
        announcement.type === 'remove' ? '' : `custom ${announcement.type}`,
      );
      const { rerender } = render(<Field defaultValue={['one']} getAnnouncement={formatter} />);
      fireEvent.click(screen.getByRole('button', { name: 'Remove one' }));
      await act(async () => vi.advanceTimersByTimeAsync(0));
      expect(document.querySelector('[aria-live="polite"]')).toHaveTextContent('');
      rerender(<Field defaultValue={['one']} getAnnouncement={() => 'same'} />);
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'two' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      await act(async () => vi.advanceTimersByTimeAsync(0));
      expect(document.querySelector('[aria-live="polite"]')).toHaveTextContent('same');
      expect(document.querySelector('[aria-live="polite"]')).toHaveAttribute('aria-atomic', 'true');
    } finally {
      vi.useRealTimers();
    }
  });
});
