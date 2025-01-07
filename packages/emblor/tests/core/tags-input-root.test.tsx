/// <reference types="@testing-library/jest-dom" />
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TagsInputItemDelete } from '../../src/core/tags-input-item-delete';
import { Tag } from '../../src/utils/types';
import { TagsInputInput, TagsInputItem, TagsInputList, TagsInputRoot } from '../../src/core';

describe('TagsInputRoot', () => {
  // Test data
  const mockTags: Tag[] = [
    { id: '1', text: 'Tag 1' },
    { id: '2', text: 'Tag 2' },
  ];

  // Helper function to render the component
  const renderTagsInput = (props: { value?: Tag[]; defaultValue?: Tag[]; [key: string]: any } = {}) => {
    return render(
      <TagsInputRoot {...props}>
        <TagsInputInput placeholder="Add tags..." />
        <TagsInputList>
          {(props.value || props.defaultValue || []).map((tag: Tag, index: number) => (
            <TagsInputItem key={tag.id} tag={tag} index={index}>
              {tag.text}
              <TagsInputItemDelete />
            </TagsInputItem>
          ))}
        </TagsInputList>
      </TagsInputRoot>,
    );
  };

  describe('Uncontrolled Mode', () => {
    it('renders with defaultValue', () => {
      renderTagsInput({ defaultValue: mockTags });
      expect(screen.getByText('Tag 1')).toBeInTheDocument();
      expect(screen.getByText('Tag 2')).toBeInTheDocument();
    });

    it('adds tags via input', async () => {
      const user = userEvent.setup();
      const onTagAdd = vi.fn();
      renderTagsInput({ defaultValue: [], onTagAdd });

      const input = screen.getByPlaceholderText('Add tags...');
      await user.type(input, 'New Tag{enter}');

      expect(onTagAdd).toHaveBeenCalledWith('New Tag', undefined);
    });

    it('removes tags via delete button', async () => {
      const user = userEvent.setup();
      const onTagRemove = vi.fn();
      renderTagsInput({ defaultValue: mockTags, onTagRemove });

      const deleteButtons = screen.getAllByRole('button');
      await user.click(deleteButtons[0]!);

      expect(onTagRemove).toHaveBeenCalledWith('Tag 1');
    });
  });

  describe('Controlled Mode', () => {
    it('renders with value prop', () => {
      renderTagsInput({ value: mockTags });
      expect(screen.getByText('Tag 1')).toBeInTheDocument();
      expect(screen.getByText('Tag 2')).toBeInTheDocument();
    });

    it('updates when value prop changes', () => {
      const { rerender } = renderTagsInput({ value: mockTags });

      const newTags = [{ id: '3', text: 'Tag 3' }];
      rerender(
        <TagsInputRoot value={newTags}>
          <TagsInputInput placeholder="Add tags..." />
          <TagsInputList>
            {newTags.map((tag, index) => (
              <TagsInputItem key={tag.id} tag={tag} index={index}>
                {tag.text}
                <TagsInputItemDelete />
              </TagsInputItem>
            ))}
          </TagsInputList>
        </TagsInputRoot>,
      );

      expect(screen.queryByText('Tag 1')).not.toBeInTheDocument();
      expect(screen.getByText('Tag 3')).toBeInTheDocument();
    });
  });

  describe('Validation & Constraints', () => {
    it('respects maxTags limit', async () => {
      const user = userEvent.setup();
      const onTagAdd = vi.fn();
      renderTagsInput({ defaultValue: mockTags, maxTags: 2, onTagAdd });

      const input = screen.getByPlaceholderText('Add tags...');
      await user.type(input, 'New Tag{enter}');

      expect(onTagAdd).not.toHaveBeenCalled();
    });

    it('validates tags using validateTag prop', async () => {
      const user = userEvent.setup();
      const validateTag = (tag: string) => tag.length >= 3;
      const onTagAdd = vi.fn();

      renderTagsInput({ defaultValue: [], validateTag, onTagAdd });

      const input = screen.getByPlaceholderText('Add tags...');
      await user.clear(input);
      await user.type(input, 'valid{enter}');
      expect(onTagAdd).toHaveBeenCalledWith('valid', undefined);
    });

    it('prevents duplicate tags', async () => {
      const user = userEvent.setup();
      const onTagAdd = vi.fn();

      renderTagsInput({ defaultValue: mockTags, onTagAdd });

      const input = screen.getByPlaceholderText('Add tags...');
      await user.type(input, 'Tag 1{enter}');
      expect(onTagAdd).not.toHaveBeenCalled();
    });
  });

  describe('Disabled & ReadOnly States', () => {
    it('prevents tag addition when disabled', async () => {
      const user = userEvent.setup();
      const onTagAdd = vi.fn();

      renderTagsInput({ defaultValue: mockTags, disabled: true, onTagAdd });

      const input = screen.getByPlaceholderText('Add tags...');
      await user.type(input, 'New Tag{enter}');
      expect(onTagAdd).not.toHaveBeenCalled();
    });

    it('prevents tag removal when disabled', async () => {
      const user = userEvent.setup();
      const onTagRemove = vi.fn();

      renderTagsInput({ defaultValue: mockTags, disabled: true, onTagRemove });
      const deleteButtons = screen.getAllByRole('button');
      await user.click(deleteButtons[0]!);
      expect(onTagRemove).not.toHaveBeenCalled();
    });

    it('prevents tag addition when readOnly', async () => {
      const user = userEvent.setup();
      const onTagAdd = vi.fn();

      renderTagsInput({ defaultValue: mockTags, readOnly: true, onTagAdd });

      const input = screen.getByPlaceholderText('Add tags...');
      await user.type(input, 'New Tag{enter}');
      expect(onTagAdd).not.toHaveBeenCalled();
    });

    it('prevents tag removal when readOnly', async () => {
      const user = userEvent.setup();
      const onTagRemove = vi.fn();

      renderTagsInput({ defaultValue: mockTags, readOnly: true, onTagRemove });
      const deleteButtons = screen.getAllByRole('button');
      await user.click(deleteButtons[0]!);
      expect(onTagRemove).not.toHaveBeenCalled();
    });
  });

  describe('Event Handlers', () => {
    it('calls onFocus when input is focused', async () => {
      const user = userEvent.setup();
      const onFocus = vi.fn();

      renderTagsInput({ defaultValue: [], onFocus });

      const input = screen.getByPlaceholderText('Add tags...');
      await user.click(input);
      expect(onFocus).toHaveBeenCalled();
    });

    it('calls onBlur when input loses focus', async () => {
      const user = userEvent.setup();
      const onBlur = vi.fn();

      renderTagsInput({ defaultValue: [], onBlur });

      const input = screen.getByPlaceholderText('Add tags...');
      await user.click(input);
      await user.tab();
      expect(onBlur).toHaveBeenCalled();
    });

    it('calls onChange when tags are modified', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();

      renderTagsInput({ defaultValue: mockTags, onValueChange: onChange });
      const deleteButtons = screen.getAllByRole('button');
      await user.click(deleteButtons[0]!);
      expect(onChange).toHaveBeenCalled();
    });
  });

  it('applies className to root element', () => {
    render(
      <TagsInputRoot className="test-class">
        <TagsInputInput />
      </TagsInputRoot>,
    );
    expect(document.querySelector('.test-class')).toBeInTheDocument();
  });
});
