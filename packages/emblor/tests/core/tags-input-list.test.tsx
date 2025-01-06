import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { TagsInputProvider } from '../../src/core/tags-input-context';
import { TagsInputList } from '../../src/core/tags-input-list';
import { TagsInputItem } from '../../src/core/tags-input-item';
import { TagsInputItemDelete } from '../../src/core/tags-input-item-delete';
import { Tag } from '../../src/utils/types';

const mockTags: Tag[] = [
  { id: '1', text: 'Tag 1' },
  { id: '2', text: 'Tag 2' },
  { id: '3', text: 'Tag 3' },
];

const renderList = (props = {}, contextProps = {}) => {
  const defaultContext = {
    disabled: false,
    readOnly: false,
    focusedIndex: null,
    activeIndex: null,
    onTagClick: vi.fn(),
    handleRemoveTag: vi.fn(),
    inputRef: { current: null },
    inputValue: '',
    placeholder: '',
    onKeyDown: vi.fn(),
    onBlur: vi.fn(),
    onInputChange: vi.fn(),
    onTagAdd: vi.fn(),
    delimiter: ',',
    addOnPaste: false,
    blurBehavior: 'none' as const,
    labelId: 'test-label',
    isInvalidInput: false,
    tags: mockTags,
    maxTags: Infinity,
    onClearTags: vi.fn(),
    setActiveIndex: vi.fn(),
    setFocusedIndex: vi.fn(),
    ...contextProps,
  };

  return render(
    <TagsInputProvider value={defaultContext}>
      <TagsInputList {...props}>
        {mockTags.map((tag, index) => (
          <TagsInputItem key={tag.id} tag={tag} index={index}>
            <span>{tag.text}</span>
            <TagsInputItemDelete aria-label={`Remove ${tag.text}`}>×</TagsInputItemDelete>
          </TagsInputItem>
        ))}
      </TagsInputList>
    </TagsInputProvider>,
  );
};

describe('TagsInputList', () => {
  const user = userEvent.setup();

  it('renders list of tags', () => {
    renderList();
    mockTags.forEach((tag) => {
      expect(screen.getByText(tag.text)).toBeInTheDocument();
    });
  });

  it('handles tag click', async () => {
    const onTagClick = vi.fn();
    const tag = mockTags[0]!;
    renderList({}, { onTagClick });
    const tagElement = screen.getByText(tag.text);
    await user.click(tagElement.parentElement!);
    expect(onTagClick).toHaveBeenCalledWith(tag);
  });

  it('handles keyboard navigation', async () => {
    const setActiveIndex = vi.fn();
    renderList({}, { setActiveIndex, activeIndex: null });
    const list = screen.getByRole('list');
    list.focus();
    await user.keyboard('{ArrowRight}');
    expect(setActiveIndex).toHaveBeenCalledWith(0);
  });

  it('handles tag removal via keyboard', async () => {
    const handleRemoveTag = vi.fn();
    const tag = mockTags[0]!;
    renderList({}, { handleRemoveTag, activeIndex: 0, focusedIndex: 0 });
    const tagElement = screen.getByText(tag.text).parentElement!;
    tagElement.focus();
    await user.keyboard('{Delete}');
    expect(handleRemoveTag).toHaveBeenCalledWith(tag.id);
  });

  it('respects readOnly prop', async () => {
    const handleRemoveTag = vi.fn();
    renderList({}, { readOnly: true, handleRemoveTag });
    const list = screen.getByRole('list');
    expect(list).toHaveAttribute('data-readonly', '');
  });

  it('respects disabled prop', async () => {
    const handleRemoveTag = vi.fn();
    renderList({}, { disabled: true, handleRemoveTag });
    const list = screen.getByRole('list');
    expect(list).toHaveAttribute('data-disabled', '');
  });
});
