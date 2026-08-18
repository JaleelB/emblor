import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmblorInput, EmblorRoot, EmblorTag, EmblorTagList, EmblorTagText } from '../../src';

function createTagParts(onTagRender: () => void) {
  return (
    <>
      <EmblorTagList>
        {(tag, index) => {
          onTagRender();
          return (
            <EmblorTag key={`${tag}-${index}`} index={index}>
              <EmblorTagText />
            </EmblorTag>
          );
        }}
      </EmblorTagList>
      <EmblorInput aria-label="Tags" />
    </>
  );
}

describe('tag render subscription boundary', () => {
  it('does not render committed tag parts for uncontrolled draft changes', () => {
    let tagRenders = 0;
    const children = createTagParts(() => {
      tagRenders += 1;
    });
    render(<EmblorRoot defaultValue={['one', 'two', 'three']}>{children}</EmblorRoot>);

    tagRenders = 0;
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'draft' } });

    expect(tagRenders).toBe(0);
  });

  it('does not render committed tag parts for controlled draft changes with stable children', () => {
    let tagRenders = 0;
    const children = createTagParts(() => {
      tagRenders += 1;
    });
    const values = ['one', 'two', 'three'];

    function ControlledRoot() {
      const [draft, setDraft] = React.useState('');
      return (
        <EmblorRoot value={values} inputValue={draft} onInputValueChange={setDraft}>
          {children}
        </EmblorRoot>
      );
    }

    render(<ControlledRoot />);
    tagRenders = 0;
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'draft' } });

    expect(tagRenders).toBe(0);
  });
});
