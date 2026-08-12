import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, test } from 'vitest';
import {
  EmblorRoot,
  EmblorTagList,
  EmblorTag,
  EmblorTagRemove,
  EmblorClearTrigger,
  EmblorInput,
  useEmblorContext,
} from '../../src/core';
import { useStoreSelector } from '../../src/utils';

describe('EmblorClearTrigger', () => {
  test('respects minTags requirement before clearing', async () => {
    function ControlledList() {
      const { store } = useEmblorContext('Test');
      const tags = useStoreSelector(store, (state) => state.tags);
      return (
        <EmblorTagList>
          {tags.map((tag, index) => (
            <EmblorTag key={tag.id} index={index}>
              <span>{tag.value}</span>
              <EmblorTagRemove index={index} aria-label={`Remove tag`} />
            </EmblorTag>
          ))}
        </EmblorTagList>
      );
    }

    function Harness() {
      return (
        <EmblorRoot minTags={1}>
          <ControlledList />
          <EmblorInput placeholder="Add tag" />
          <EmblorClearTrigger aria-label="Clear all tags">Clear</EmblorClearTrigger>
        </EmblorRoot>
      );
    }

    render(<Harness />);
    const user = userEvent.setup();

    const clearButton = screen.getByRole('button', { name: /clear all tags/i });
    const input = screen.getByPlaceholderText('Add tag');

    await user.type(input, 'alpha{enter}beta{enter}');

    // confirm initial render contains both tags
    const initialItems = await screen.findAllByRole('listitem');
    expect(initialItems).toHaveLength(2);

    expect(clearButton).not.toBeDisabled();

    await user.click(clearButton);
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    expect(clearButton).toBeDisabled();

    await user.type(input, 'gamma{enter}');
    expect(await screen.findAllByRole('listitem')).toHaveLength(1);
    expect(clearButton).toBeDisabled();
  });
});
