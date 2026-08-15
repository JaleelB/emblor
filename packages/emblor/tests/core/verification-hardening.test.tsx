import * as React from 'react';
import { createPortal } from 'react-dom';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
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

const suppressAnnouncements = () => '';

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
    <EmblorRoot getAnnouncement={suppressAnnouncements} {...rootProps}>
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
  it('runs whitespace through transform for keyboard, blur, and paste commits', async () => {
    const onValueChange = vi.fn();
    const onReject = vi.fn();
    const transform = (value: string) => value || 'fallback';
    const view = render(<Field transform={transform} onValueChange={onValueChange} onReject={onReject} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledWith(['fallback'], {
      type: 'add',
      value: 'fallback',
      index: 0,
      source: 'keyboard',
    });

    view.unmount();
    const blurView = render(
      <>
        <Field transform={transform} blurBehavior="commit" defaultInputValue="   " onValueChange={onValueChange} />
        <button type="button">Outside</button>
      </>,
    );
    fireEvent.blur(screen.getByRole('textbox'), { relatedTarget: screen.getByRole('button', { name: 'Outside' }) });
    await act(async () => Promise.resolve());
    expect(onValueChange).toHaveBeenLastCalledWith(['fallback'], {
      type: 'add',
      value: 'fallback',
      index: 0,
      source: 'blur',
    });
    blurView.unmount();

    const pasteChange = vi.fn();
    const pasteView = render(<Field transform={transform} onValueChange={pasteChange} />);
    fireEvent.paste(screen.getByRole('textbox'), {
      clipboardData: { getData: () => 'one,   ,two' },
    });
    expect(pasteChange).toHaveBeenCalledWith(['one', 'fallback', 'two'], {
      type: 'add-many',
      values: ['one', 'fallback', 'two'],
      startIndex: 0,
      source: 'paste',
    });
    pasteView.unmount();
  });

  it('reports transformed whitespace as empty while keeping a truly empty draft silent', () => {
    const onReject = vi.fn();
    render(<Field transform={() => ''} onReject={onReject} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onReject).toHaveBeenCalledWith({
      rawValue: '   ',
      value: '',
      reason: 'empty',
      source: 'keyboard',
    });
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onReject).toHaveBeenCalledTimes(1);
  });

  it('preserves transient rejection through unrelated removal', () => {
    render(<Field defaultValue={['one', 'two']} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'one' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(input).toHaveAttribute('data-invalid', '');
    fireEvent.click(within(screen.getByText('two').closest('[role="listitem"]') as HTMLElement).getByRole('button'));
    expect(screen.getByRole('textbox')).toHaveAttribute('data-invalid', '');
  });

  it('preserves transient rejection when Clear does not change an empty draft', () => {
    const onInputValueChange = vi.fn();
    render(
      <Field defaultValue={['one']} onInputValueChange={onInputValueChange}>
        <EmblorClear />
      </Field>,
    );
    const input = screen.getByRole('textbox');
    fireEvent.paste(input, { clipboardData: { getData: () => 'one' } });
    expect(input).toHaveValue('');
    expect(input).toHaveAttribute('data-invalid', '');
    fireEvent.click(screen.getByRole('button', { name: 'Clear all tags' }));
    expect(input).toHaveValue('');
    expect(input).toHaveAttribute('data-invalid', '');
    expect(onInputValueChange).not.toHaveBeenCalled();
  });

  it('clears transient rejection when Clear actually changes the draft', () => {
    const onInputValueChange = vi.fn();
    render(
      <Field defaultValue={['one']} onInputValueChange={onInputValueChange}>
        <EmblorClear />
      </Field>,
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'one' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(input).toHaveAttribute('data-invalid', '');
    fireEvent.click(screen.getByRole('button', { name: 'Clear all tags' }));
    expect(input).toHaveValue('');
    expect(input).not.toHaveAttribute('data-invalid');
    expect(onInputValueChange).toHaveBeenLastCalledWith('');
  });

  it('keeps controlled draft callback order aligned with Root-owned mutations', () => {
    const events: string[] = [];
    function ControlledDraftField() {
      const [draft, setDraft] = React.useState('');
      return (
        <Field
          inputValue={draft}
          onInputValueChange={(next) => {
            events.push(`draft:${next}`);
            setDraft(next);
          }}
          onValueChange={(_next, details) => events.push(`tags:${details.type}`)}
        />
      );
    }

    render(<ControlledDraftField />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'one' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(events).toEqual(['draft:one', 'tags:add', 'draft:']);
    expect(input).toHaveValue('');
  });

  it('keeps rejected and guarded transitions callback-silent', () => {
    const onValueChange = vi.fn();
    const onReject = vi.fn();
    const { rerender } = render(
      <Field value={['one']} maxTags={1} onValueChange={onValueChange} onReject={onReject} />,
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'two' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onValueChange).not.toHaveBeenCalled();
    expect(onReject).toHaveBeenCalledTimes(1);
    rerender(<Field value={['externally supplied']} onValueChange={onValueChange} />);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(onReject).toHaveBeenCalledTimes(1);
  });

  it('orders automatic labels by connected DOM position across reverse-mounted portals', async () => {
    const firstPortal = document.createElement('div');
    const secondPortal = document.createElement('div');
    document.body.append(firstPortal, secondPortal);
    const view = render(
      <EmblorRoot>
        <EmblorInput />
        {createPortal(<EmblorLabel>Later label</EmblorLabel>, secondPortal)}
        {createPortal(<EmblorLabel>Earlier label</EmblorLabel>, firstPortal)}
      </EmblorRoot>,
    );
    try {
      await act(async () => Promise.resolve());
      expect(screen.getByRole('textbox')).toHaveAccessibleName('Earlier label Later label');
    } finally {
      act(() => {
        view.unmount();
        firstPortal.remove();
        secondPortal.remove();
      });
    }
  });

  it('recomputes automatic label order after connected portal containers are reordered', async () => {
    const firstPortal = document.createElement('div');
    const secondPortal = document.createElement('div');
    document.body.append(firstPortal, secondPortal);
    const view = render(
      <EmblorRoot>
        <EmblorInput />
        {createPortal(<EmblorLabel>First label</EmblorLabel>, firstPortal)}
        {createPortal(<EmblorLabel>Second label</EmblorLabel>, secondPortal)}
      </EmblorRoot>,
    );
    try {
      expect(screen.getByRole('textbox')).toHaveAccessibleName('First label Second label');
      act(() => {
        document.body.insertBefore(secondPortal, firstPortal);
      });
      await act(async () => Promise.resolve());
      expect(screen.getByRole('textbox')).toHaveAccessibleName('Second label First label');
    } finally {
      act(() => {
        view.unmount();
        firstPortal.remove();
        secondPortal.remove();
      });
    }
  });

  it('keeps automatic naming when a polymorphic Label replaces its host node', async () => {
    function ReplacingLabel() {
      const [alternate, setAlternate] = React.useState(false);
      return (
        <EmblorRoot>
          <EmblorLabel as={alternate ? 'div' : 'label'}>Name</EmblorLabel>
          <EmblorInput />
          <button type="button" onClick={() => setAlternate((current) => !current)}>
            Replace label host
          </button>
        </EmblorRoot>
      );
    }

    render(<ReplacingLabel />);
    expect(screen.getByRole('textbox')).toHaveAccessibleName('Name');
    fireEvent.click(screen.getByRole('button', { name: 'Replace label host' }));
    await waitFor(() => expect(screen.getByRole('textbox')).toHaveAccessibleName('Name'));
  });

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

  it('suppresses every Emblor command during composition and resumes on a later ordinary key', () => {
    const onValueChange = vi.fn();
    render(<Field defaultValue={['one']} onValueChange={onValueChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'draft' } });
    for (const key of ['Enter', 'Tab', ',', 'Backspace', 'Delete', 'Home', 'End', 'ArrowLeft', 'ArrowRight']) {
      fireEvent.keyDown(input, { key, isComposing: true });
    }
    expect(onValueChange).not.toHaveBeenCalled();
    expect(input).toHaveValue('draft');

    const tag = screen.getByText('one').closest('[role="listitem"]') as HTMLElement;
    act(() => tag.focus());
    fireEvent.keyDown(tag, { key: 'Delete', isComposing: true });
    expect(screen.getByText('one')).toBeInTheDocument();

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledWith(['one', 'draft'], {
      type: 'add',
      value: 'draft',
      index: 1,
      source: 'keyboard',
    });
  });

  it('moves from Input boundaries according to physical direction', () => {
    render(
      <div dir="rtl">
        <Field defaultValue={['first', 'last']} />
      </div>,
    );
    const input = screen.getByRole('textbox') as HTMLInputElement;
    const first = screen.getByText('first').closest('[role="listitem"]') as HTMLElement;
    const last = screen.getByText('last').closest('[role="listitem"]') as HTMLElement;
    act(() => input.focus());
    input.setSelectionRange(0, 0);
    fireEvent.keyDown(input, { key: 'ArrowRight' });
    expect(last).toHaveFocus();
    act(() => input.focus());
    input.setSelectionRange(input.value.length, input.value.length);
    fireEvent.keyDown(input, { key: 'ArrowLeft' });
    expect(first).toHaveFocus();
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

  it('keeps consumer-first cancellation across label and action activation', () => {
    const onValueChange = vi.fn();
    const cancel = vi.fn((event: React.SyntheticEvent) => event.preventDefault());
    render(
      <>
        <EmblorRoot defaultValue={['one']} onValueChange={onValueChange}>
          <EmblorLabel as="button" onClick={cancel}>
            Cancel label
          </EmblorLabel>
          <EmblorTagList>
            {(tag, index) => (
              <EmblorTag key={tag} index={index}>
                <EmblorTagText />
                <EmblorTagRemove onClick={cancel} />
              </EmblorTag>
            )}
          </EmblorTagList>
          <EmblorInput role="combobox" />
          <EmblorClear onClick={cancel} />
        </EmblorRoot>
        <button type="button">Outside</button>
      </>,
    );
    const input = screen.getByRole('textbox');
    const remove = screen.getByRole('button', { name: 'Remove one' });
    const clear = screen.getByRole('button', { name: 'Clear all tags' });
    const outside = screen.getByRole('button', { name: 'Outside' });
    act(() => outside.focus());
    fireEvent.click(screen.getByRole('button', { name: 'Cancel label' }));
    expect(input).not.toHaveFocus();
    fireEvent.click(remove);
    fireEvent.click(clear);
    expect(screen.getByText('one')).toBeInTheDocument();
    expect(onValueChange).not.toHaveBeenCalled();
    expect(cancel).toHaveBeenCalledTimes(3);
    expect(input).toHaveAttribute('role', 'textbox');
  });

  it('keeps automatic labels out of naming when explicit naming overrides are supplied', () => {
    render(
      <EmblorRoot>
        <EmblorLabel>Ignored automatic label</EmblorLabel>
        <EmblorLabel htmlFor="unrelated">Explicit native label</EmblorLabel>
        <EmblorInput aria-label="Consumer name" />
      </EmblorRoot>,
    );
    expect(screen.getByRole('textbox')).toHaveAccessibleName('Consumer name');
    expect(screen.getByRole('group')).toHaveAccessibleName('Ignored automatic label');
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

  it('keeps minTags as a mutation guard even for externally supplied below-minimum values', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<Field value={['one']} minTags={2} onValueChange={onValueChange} />);
    const remove = screen.getByRole('button', { name: 'Remove one' });
    expect(remove).toBeDisabled();
    fireEvent.click(remove);
    expect(onValueChange).not.toHaveBeenCalled();

    rerender(<Field value={['one']} minTags={1} onValueChange={onValueChange} />);
    expect(screen.getByRole('button', { name: 'Remove one' })).toBeDisabled();
    rerender(<Field value={['one']} minTags={0} onValueChange={onValueChange} />);
    expect(screen.getByRole('button', { name: 'Remove one' })).not.toBeDisabled();
  });

  it('preserves bracket names and omitted values in native form submission', () => {
    const formRef = React.createRef<HTMLFormElement>();
    render(
      <form ref={formRef}>
        <Field name="skills[]" defaultValue={['one', 'two', 'three']} sparse />
      </form>,
    );
    expect(new FormData(formRef.current as HTMLFormElement).getAll('skills[]')).toEqual(['one', 'two', 'three']);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('one')).toBeInTheDocument();
    expect(screen.getByText('three')).toBeInTheDocument();
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
    const view = render(
      <React.StrictMode>
        <EmblorRoot defaultValue={['one']} blurBehavior="discard" defaultInputValue="draft">
          <Tags />
          <EmblorInput aria-label="Tags input" />
          {createPortal(<EmblorLabel as="button">Portal label</EmblorLabel>, portal)}
        </EmblorRoot>
      </React.StrictMode>,
    );
    try {
      const input = screen.getByRole('textbox');
      act(() => input.focus());
      await user.click(screen.getByRole('button', { name: 'Portal label' }));
      expect(input).toHaveValue('draft');
    } finally {
      act(() => {
        view.unmount();
        portal.remove();
      });
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

  it('cancels total-rejection selection restoration after a later caret decision', async () => {
    vi.useFakeTimers();
    try {
      render(<Field defaultValue={['duplicate']} defaultInputValue="draft" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      act(() => input.focus());
      input.setSelectionRange(0, 5);
      fireEvent.paste(input, { clipboardData: { getData: () => 'duplicate' } });
      input.setSelectionRange(2, 2);
      fireEvent.select(input);
      await act(async () => vi.runAllTimersAsync());
      expect(input.selectionStart).toBe(2);
      expect(input.selectionEnd).toBe(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it('cancels selection restoration even when a consumer prevents a later keydown', async () => {
    vi.useFakeTimers();
    try {
      render(
        <EmblorRoot defaultValue={['duplicate']} defaultInputValue="draft">
          <Tags />
          <EmblorInput
            aria-label="Tags input"
            onKeyDown={(event) => {
              event.preventDefault();
            }}
          />
        </EmblorRoot>,
      );
      const input = screen.getByRole('textbox') as HTMLInputElement;
      act(() => input.focus());
      input.setSelectionRange(0, 5);
      fireEvent.paste(input, { clipboardData: { getData: () => 'duplicate' } });
      input.setSelectionRange(2, 2);
      fireEvent.keyDown(input, { key: 'ArrowLeft' });
      await act(async () => vi.runAllTimersAsync());
      expect(input.selectionStart).toBe(2);
      expect(input.selectionEnd).toBe(2);
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
