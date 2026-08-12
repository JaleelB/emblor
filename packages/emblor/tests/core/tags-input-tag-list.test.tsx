import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import {
  EmblorRoot,
  EmblorInput,
  EmblorTagList,
  EmblorTag,
  EmblorTagRemove,
} from '../../src/core';

describe('EmblorTagList', () => {
  test('marks list as empty when no tags are present', async () => {
    function Harness() {
      const [tags, setTags] = React.useState<Array<string>>(['one']);
      const labelId = React.useId().replace(/:/g, '');
      return (
        <EmblorRoot labelId={labelId} value={tags} onValueChange={setTags} delimiter={[',']}>
          <label id={labelId}>Tags</label>
          <EmblorTagList>
            {tags.map((tag, index) => (
              <EmblorTag key={tag} index={index}>
                <span>{tag}</span>
                <EmblorTagRemove index={index} aria-label={`Remove ${tag}`} />
              </EmblorTag>
            ))}
          </EmblorTagList>
          <EmblorInput placeholder="Add" />
        </EmblorRoot>
      );
    }

    render(<Harness />);
    const user = userEvent.setup();

    const list = screen.getByRole('list');
    expect(list).not.toHaveAttribute('data-empty');

    const removeButton = within(list).getByRole('button', { name: /remove tag/i });
    await user.click(removeButton);

    expect(list).toHaveAttribute('data-empty', '');
  });
});
