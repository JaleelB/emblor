import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tag } from '../../src/utils/types';
import { TagsInputRoot } from '../../src/core/tags-input-root';
import { TagsInputInput } from '../../src/core/tags-input-input';
import { TagsInputList } from '../../src/core/tags-input-list';
import { TagsInputItem } from '../../src/core/tags-input-item';
import { TagsInputItemDelete } from '../../src/core/tags-input-item-delete';

describe('TagsInputInput', () => {
  const mockTag: Tag = { id: '1', text: 'Test Tag' };

  // Helper function to render the component
  const renderInput = (props = {}, rootProps = {}) => {
    return render(
      <TagsInputRoot defaultValue={[mockTag]} {...rootProps}>
        <TagsInputInput {...props} />
        <TagsInputList>
          <TagsInputItem tag={mockTag} index={0}>
            {mockTag.text}
            <TagsInputItemDelete />
          </TagsInputItem>
        </TagsInputList>
      </TagsInputRoot>,
    );
  };

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      renderInput();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders with placeholder', () => {
      renderInput({ placeholder: 'Enter tags...' });
      expect(screen.getByPlaceholderText('Enter tags...')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      renderInput({ className: 'custom-input' });
      expect(screen.getByRole('textbox')).toHaveClass('custom-input');
    });
  });

  describe('Input Behavior', () => {
    it('handles value changes', async () => {
      const user = userEvent.setup();
      renderInput();

      const input = screen.getByRole('textbox');
      await user.type(input, 'New Tag');
      expect(input).toHaveValue('New Tag');
    });

    it('clears input after tag addition', async () => {
      const user = userEvent.setup();
      renderInput();

      const input = screen.getByRole('textbox');
      await user.type(input, 'New Tag{enter}');
      expect(input).toHaveValue('');
    });

    it('handles paste event with addOnPaste', async () => {
      const user = userEvent.setup();
      const onTagAdd = vi.fn();
      renderInput({}, { addOnPaste: true, onTagAdd });

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.paste('Tag 1, Tag 2');

      expect(onTagAdd).toHaveBeenCalledWith('Tag 1', { viaPaste: true });
      expect(onTagAdd).toHaveBeenCalledWith('Tag 2', { viaPaste: true });
    });
  });

  describe('Keyboard Navigation', () => {
    it('adds tag on Enter key', async () => {
      const user = userEvent.setup();
      const onTagAdd = vi.fn();
      renderInput({}, { onTagAdd });

      const input = screen.getByRole('textbox');
      await user.type(input, 'New Tag{enter}');
      expect(onTagAdd).toHaveBeenCalledWith('New Tag', undefined);
    });

    it('adds tag on delimiter key', async () => {
      const user = userEvent.setup();
      const onTagAdd = vi.fn();
      renderInput({}, { delimiters: [','], onTagAdd });

      const input = screen.getByRole('textbox');
      await user.type(input, 'New Tag,');
      expect(onTagAdd).toHaveBeenCalledWith('New Tag', undefined);
    });

    it('handles backspace to focus last tag', async () => {
      const user = userEvent.setup();
      renderInput();

      const input = screen.getByRole('textbox');
      await user.type(input, '{backspace}');
      // Add assertion for focused tag once implemented
    });
  });

  describe('Blur Behavior', () => {
    it('adds tag on blur when blurBehavior is "add"', async () => {
      const user = userEvent.setup();
      const onTagAdd = vi.fn();
      renderInput({}, { inputBlurBehavior: 'add', onTagAdd });

      const input = screen.getByRole('textbox');
      await user.type(input, 'New Tag');
      await user.tab();

      expect(onTagAdd).toHaveBeenCalledWith('New Tag', undefined);
    });

    it('clears input on blur when blurBehavior is "clear"', async () => {
      const user = userEvent.setup();
      renderInput({}, { inputBlurBehavior: 'clear' });

      const input = screen.getByRole('textbox');
      await user.type(input, 'New Tag');
      await user.tab();

      expect(input).toHaveValue('');
    });

    it('maintains input value on blur when blurBehavior is "maintain"', async () => {
      const user = userEvent.setup();
      renderInput({}, { inputBlurBehavior: 'maintain' });

      const input = screen.getByRole('textbox');
      await user.type(input, 'New Tag');
      await user.tab();

      expect(input).toHaveValue('New Tag');
    });
  });

  describe('Disabled & ReadOnly States', () => {
    it('respects disabled state from root', () => {
      renderInput({}, { disabled: true });
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('respects readOnly state from root', () => {
      renderInput({}, { readOnly: true });
      expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
    });

    it('prevents input when disabled', async () => {
      const user = userEvent.setup();
      renderInput({}, { disabled: true });

      const input = screen.getByRole('textbox');
      await user.type(input, 'New Tag');
      expect(input).toHaveValue('');
    });
  });

  describe('Event Handlers', () => {
    it('calls onFocus handler', async () => {
      const user = userEvent.setup();
      const onFocus = vi.fn();
      renderInput({ onFocus });

      const input = screen.getByRole('textbox');
      await user.click(input);
      expect(onFocus).toHaveBeenCalled();
    });

    it('calls onBlur handler', async () => {
      const user = userEvent.setup();
      const onBlur = vi.fn();
      renderInput({ onBlur });

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.tab();
      expect(onBlur).toHaveBeenCalled();
    });

    it('calls onKeyDown handler', async () => {
      const user = userEvent.setup();
      const onKeyDown = vi.fn();
      renderInput({ onKeyDown });

      const input = screen.getByRole('textbox');
      await user.type(input, 'a');
      expect(onKeyDown).toHaveBeenCalled();
    });
  });
});
