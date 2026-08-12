import { render, screen, within } from '@testing-library/react';
import * as React from 'react';
import { EmblorRoot, EmblorTagList, EmblorTag, EmblorTagRemove } from '../../src/core';

describe('EmblorTagRemove', () => {
  test('does not remove tags when list is readOnly', async () => {
    function Harness() {
      const [tags, setTags] = React.useState<Array<string>>(['alpha']);
      return (
        <EmblorRoot value={tags} onValueChange={setTags} readOnly>
          <EmblorTagList>
            {tags.map((tag, index) => (
              <EmblorTag key={tag} index={index}>
                <span>{tag}</span>
                <EmblorTagRemove index={index} aria-label={`Remove ${tag}`} />
              </EmblorTag>
            ))}
          </EmblorTagList>
        </EmblorRoot>
      );
    }

    render(<Harness />);

    const removeButton = within(screen.getByRole('listitem')).getByRole('button', {
      name: /remove tag/i,
    });

    expect(removeButton).toBeDisabled();
    expect(screen.getByText('alpha')).toBeInTheDocument();
  });
});
