import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import * as React from 'react';
import { EmblorRoot, EmblorInput, EmblorTagList, EmblorTag, EmblorTagRemove, EmblorClearTrigger } from '../../src/core';

function CoreHarness({ initial }: { initial: Array<string> }) {
  const [tags, setTags] = React.useState<Array<string>>(initial);
  const labelId = React.useId().replace(/:/g, '');

  return (
    <EmblorRoot labelId={labelId} value={tags} onValueChange={setTags} delimiter={[',', 'Enter']}>
      <label id={labelId}>Project tags</label>
      <EmblorTagList>
        {tags.map((tag, index) => (
          <EmblorTag key={`${tag}-${index}`} index={index}>
            <span>{tag}</span>
            <EmblorTagRemove index={index} aria-label={`Remove ${tag}`} />
          </EmblorTag>
        ))}
      </EmblorTagList>
      <EmblorInput placeholder="Add a tag" />
      <EmblorClearTrigger aria-label="Clear all tags">Clear</EmblorClearTrigger>
    </EmblorRoot>
  );
}

describe('Emblor core primitives', () => {
  test('renders the provided tags', () => {
    render(<CoreHarness initial={['design', 'system', 'radix']} />);

    const tagItems = screen.getAllByRole('listitem');
    expect(tagItems).toHaveLength(3);
    expect(screen.getByText('design')).toBeInTheDocument();
    expect(screen.getByText('system')).toBeInTheDocument();
    expect(screen.getByText('radix')).toBeInTheDocument();
  });

  test('commits a tag when typing delimiter in the input', async () => {
    render(<CoreHarness initial={['design']} />);
    const user = userEvent.setup();

    const input = screen.getByPlaceholderText('Add a tag');
    await user.type(input, 'accessibility{enter}');

    expect(screen.getByText('accessibility')).toBeInTheDocument();
    const tagItems = screen.getAllByRole('listitem');
    expect(tagItems).toHaveLength(2);
  });

  test('removes a tag when clicking the remove button', async () => {
    render(<CoreHarness initial={['design', 'system']} />);
    const user = userEvent.setup();

    const tagItems = screen.getAllByRole('listitem');
    const removeButton = within(tagItems[1]).getByRole('button', { name: /remove tag/i });
    await user.click(removeButton);

    expect(screen.queryByText('system')).not.toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  test('focuses the last tag when backspace is pressed on an empty input', async () => {
    render(<CoreHarness initial={['design', 'system', 'radix']} />);
    const input = screen.getByPlaceholderText('Add a tag');

    await act(async () => {
      input.focus();
    });
    await act(async () => {
      fireEvent.keyDown(input, { key: 'Backspace' });
    });

    const lastTag = screen.getByText('radix').parentElement as HTMLElement;
    expect(lastTag).toHaveAttribute('data-focused', '');
  });

  test('clears all tags via clear trigger', async () => {
    render(<CoreHarness initial={['design', 'system']} />);
    const user = userEvent.setup();

    const clearButton = screen.getByRole('button', { name: /clear all tags/i });
    await user.click(clearButton);

    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    expect(screen.getByPlaceholderText('Add a tag')).toHaveValue('');
  });
});
