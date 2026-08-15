import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EmblorInput, EmblorRoot, EmblorTag, EmblorTagList, EmblorTagRemove } from '../../src';

const suppressAnnouncements = () => '';

function MinimalField(
  props: React.ComponentProps<typeof EmblorRoot> & { inputOnPaste?: React.ClipboardEventHandler<HTMLInputElement> },
) {
  const { inputOnPaste, ...rootProps } = props;
  return (
    <EmblorRoot getAnnouncement={suppressAnnouncements} {...rootProps}>
      <EmblorTagList>
        {(tag, index) => (
          <EmblorTag key={`${tag}-${index}`} index={index}>
            <span>{tag}</span>
            <EmblorTagRemove />
          </EmblorTag>
        )}
      </EmblorTagList>
      <EmblorInput placeholder="value" onPaste={inputOnPaste} />
    </EmblorRoot>
  );
}

describe('Emblor constraints and interaction boundaries', () => {
  it.each([
    ['minTags', { minTags: -1 }],
    ['maxTags', { maxTags: 1.5 }],
    ['minLength', { minLength: Number.NaN }],
    ['maxLength', { maxLength: Number.POSITIVE_INFINITY }],
    ['min/max tags', { minTags: 2, maxTags: 1 }],
    ['min/max length', { minLength: 2, maxLength: 1 }],
  ])('throws for invalid %s constraints', (_name, props) => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      expect(() => render(<MinimalField {...props} />)).toThrow(/EmblorRoot/);
    } finally {
      consoleError.mockRestore();
    }
  });

  it('validates literal delimiters and permits an empty delimiter list', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      expect(() => render(<MinimalField delimiters={['::']} />)).toThrow(/Unicode code point/);
      expect(() => render(<MinimalField delimiters={['Enter']} />)).toThrow(/Unicode code point/);
      expect(() => render(<MinimalField delimiters={['😀', '😀']} />)).not.toThrow();
    } finally {
      consoleError.mockRestore();
    }
  });

  it('splits paste with deduplicated literal delimiters and supports whole-draft mode', () => {
    const onValueChange = vi.fn();
    const first = render(<MinimalField delimiters={['|', '.', '😀', '|']} onValueChange={onValueChange} />);
    fireEvent.paste(screen.getByRole('textbox'), {
      clipboardData: { getData: () => 'one|two.three😀four' },
    });
    expect(onValueChange).toHaveBeenCalledWith(['one', 'two', 'three', 'four'], {
      type: 'add-many',
      values: ['one', 'two', 'three', 'four'],
      startIndex: 0,
      source: 'paste',
    });
    first.unmount();

    const wholeDraftChange = vi.fn();
    render(<MinimalField delimiters={[]} onValueChange={wholeDraftChange} />);
    fireEvent.paste(screen.getByRole('textbox'), {
      clipboardData: { getData: () => 'one,two' },
    });
    expect(wholeDraftChange.mock.calls[0][0]).toEqual(['one,two']);
  });

  it('does not interpret commands while composing', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<MinimalField defaultValue={['one']} onValueChange={onValueChange} />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'draft');
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
    expect(onValueChange).not.toHaveBeenCalled();
    expect(input).toHaveValue('draft');
  });

  it('keeps the default blur behavior noop and supports opt-in commit after leaving the root', async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <div>
        <MinimalField blurBehavior="noop" />
        <button type="button">Outside</button>
      </div>,
    );
    const input = screen.getByRole('textbox');
    await user.type(input, 'draft');
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByText('draft')).not.toBeInTheDocument();
    expect(input).toHaveValue('draft');

    unmount();
    render(
      <div>
        <MinimalField blurBehavior="commit" />
        <button type="button">Outside</button>
      </div>,
    );
    const commitInput = screen.getByRole('textbox');
    await user.type(commitInput, 'committed');
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.getByText('committed')).toBeInTheDocument();
  });

  it('honors consumer paste cancellation and prospective draft selection', () => {
    const onValueChange = vi.fn();
    const onPaste = vi.fn((event: React.ClipboardEvent<HTMLInputElement>) => event.preventDefault());
    render(<MinimalField onValueChange={onValueChange} inputOnPaste={onPaste} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'prefixsuffix' } });
    input.setSelectionRange(6, 12);
    fireEvent.paste(input, { clipboardData: { getData: () => 'tag' } });
    expect(onPaste).toHaveBeenCalled();
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
