import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { TagsInputProvider } from '../../src/core/tags-input-context';
import { TagsInputItem } from '../../src/core/tags-input-item';
import { TagsInputItemDelete } from '../../src/core/tags-input-item-delete';
import { Tag } from '../../src/utils/types';

const mockTag: Tag = { id: '1', text: 'Test Tag' };

const renderItem = (props = {}, contextProps = {}) => {
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
    tags: [mockTag],
    maxTags: Infinity,
    onClearTags: vi.fn(),
    setActiveIndex: vi.fn(),
    setFocusedIndex: vi.fn(),
    ...contextProps,
  };

  return render(
    <TagsInputProvider value={defaultContext}>
      <TagsInputItem tag={mockTag} index={0} {...props}>
        <span>{mockTag.text}</span>
        <TagsInputItemDelete aria-label={`Remove ${mockTag.text}`}>×</TagsInputItemDelete>
      </TagsInputItem>
    </TagsInputProvider>,
  );
};

describe('TagsInputItem', () => {
  const user = userEvent.setup();

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      renderItem();
      expect(screen.getByText('Test Tag')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      renderItem({ className: 'custom-item' });
      const item = screen.getByRole('listitem');
      expect(item).toHaveClass('custom-item');
    });

    it('renders delete button', () => {
      renderItem();
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Remove Test Tag');
    });
  });

  describe('Tag Interaction', () => {
    it('handles click events', async () => {
      const onTagClick = vi.fn();
      renderItem({}, { onTagClick });
      await user.click(screen.getByRole('listitem'));
      expect(onTagClick).toHaveBeenCalledWith(mockTag);
    });

    it('handles delete button click', async () => {
      const handleRemoveTag = vi.fn();
      renderItem({}, { handleRemoveTag });
      await user.click(screen.getByRole('button'));
      expect(handleRemoveTag).toHaveBeenCalledWith(mockTag.id);
    });

    it('handles keyboard delete', async () => {
      const handleRemoveTag = vi.fn();
      renderItem({}, { handleRemoveTag });
      const item = screen.getByRole('listitem');
      item.focus();
      await user.keyboard('{Delete}');
      expect(handleRemoveTag).toHaveBeenCalledWith(mockTag.id);
    });

    it('handles keyboard backspace', async () => {
      const handleRemoveTag = vi.fn();
      renderItem({}, { handleRemoveTag });
      const item = screen.getByRole('listitem');
      item.focus();
      await user.keyboard('{Backspace}');
      expect(handleRemoveTag).toHaveBeenCalledWith(mockTag.id);
    });
  });

  describe('Focus Management', () => {
    it('becomes focused when clicked', async () => {
      renderItem();
      const item = screen.getByRole('listitem');
      await user.click(item);
      expect(item).toHaveFocus();
    });

    it('handles focus via keyboard navigation', async () => {
      renderItem({}, { focusedIndex: 0 });
      const item = screen.getByRole('listitem');
      expect(item).toHaveAttribute('data-highlighted', '');
    });

    it('maintains focus after delete button click', async () => {
      const handleRemoveTag = vi.fn();
      renderItem({}, { handleRemoveTag });
      const item = screen.getByRole('listitem');
      const deleteButton = screen.getByRole('button');
      item.focus();
      await user.click(deleteButton);
      expect(deleteButton).toHaveFocus();
    });
  });

  describe('Disabled & ReadOnly States', () => {
    it('prevents interaction when disabled', async () => {
      const onTagClick = vi.fn();
      const handleRemoveTag = vi.fn();
      renderItem({}, { disabled: true, onTagClick, handleRemoveTag });
      const item = screen.getByRole('listitem');
      const deleteButton = screen.getByRole('button');
      await user.click(item);
      await user.click(deleteButton);
      expect(onTagClick).not.toHaveBeenCalled();
      expect(handleRemoveTag).not.toHaveBeenCalled();
    });

    it('prevents interaction when readOnly', async () => {
      const onTagClick = vi.fn();
      const handleRemoveTag = vi.fn();
      renderItem({}, { readOnly: true, onTagClick, handleRemoveTag });
      const item = screen.getByRole('listitem');
      const deleteButton = screen.getByRole('button');
      await user.click(item);
      await user.click(deleteButton);
      expect(onTagClick).not.toHaveBeenCalled();
      expect(handleRemoveTag).not.toHaveBeenCalled();
    });

    it('applies disabled styles', () => {
      renderItem({}, { disabled: true });
      const item = screen.getByRole('listitem');
      expect(item).toHaveAttribute('data-disabled', '');
    });

    it('applies readOnly styles', () => {
      renderItem({}, { readOnly: true });
      const item = screen.getByRole('listitem');
      expect(item).toHaveAttribute('data-readonly', '');
    });
  });

  describe('Keyboard Navigation', () => {
    it('handles arrow keys', async () => {
      const onTagClick = vi.fn();
      renderItem({}, { onTagClick });
      const item = screen.getByRole('listitem');
      item.focus();
      await user.keyboard('{ArrowRight}');
      expect(onTagClick).not.toHaveBeenCalled();
    });

    it('handles space key', async () => {
      const onTagClick = vi.fn();
      renderItem({}, { onTagClick });
      const item = screen.getByRole('listitem');
      item.focus();
      await user.keyboard(' ');
      expect(onTagClick).toHaveBeenCalledWith(mockTag);
    });
  });
});
