import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, test } from 'vitest';
import * as React from 'react';
import { EmblorRoot, EmblorInput, EmblorTagList, EmblorTag, EmblorTagRemove } from '../../src/core';

describe('EmblorInput', () => {
  test('invokes onValueChange while typing', async () => {
    function Harness() {
      const [value, setValue] = React.useState('');
      return (
        <EmblorRoot value={[]} onValueChange={() => {}}>
          <EmblorTagList />
          <EmblorInput placeholder="Add tag" value={value} onValueChange={setValue} />
        </EmblorRoot>
      );
    }

    render(<Harness />);
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText('Add tag');

    await user.type(input, 'design');

    expect(input).toHaveValue('design');
  });

  test('switches placeholder when max tags reached', async () => {
    function Harness() {
      const [tags, setTags] = React.useState<Array<string>>(['a', 'b']);
      return (
        <EmblorRoot
          value={tags}
          onValueChange={setTags}
          maxTags={2}
          placeholderWhenFull="Limit reached"
          delimiter={[',']}
        >
          <EmblorTagList>
            {tags.map((tag, index) => (
              <EmblorTag key={tag} index={index}>
                <span>{tag}</span>
                <EmblorTagRemove index={index} aria-label={`Remove ${tag}`} />
              </EmblorTag>
            ))}
          </EmblorTagList>
          <EmblorInput placeholder="Add tag" />
        </EmblorRoot>
      );
    }

    render(<Harness />);

    expect(screen.getByPlaceholderText('Limit reached')).toBeInTheDocument();
  });
});
