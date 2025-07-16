import React from 'react';
import { Command, CommandList, CommandItem, CommandGroup, CommandEmpty } from '@/components/ui/command';
import { type Tag as TagType } from './tag-input';

type AutocompleteProps = {
  tags: TagType[];
  setTags: React.Dispatch<React.SetStateAction<TagType[]>>;
  autocompleteOptions: TagType[];
  autocompleteTitle?: string;
  autocompleteNotFound?: string;
  maxTags?: number;
  onTagAdd?: (tag: string) => void;
  allowDuplicates: boolean;
  children: React.ReactNode;
};

export const Autocomplete: React.FC<AutocompleteProps> = ({
  tags,
  setTags,
  autocompleteOptions,
  autocompleteNotFound = "No results found.",
  autocompleteTitle = "Suggestions",
  maxTags,
  onTagAdd,
  allowDuplicates,
  children,
}) => {
  return (
    <Command className="border min-w-[400px]">
      {children}
      <CommandList>
        <CommandEmpty>{autocompleteNotFound}</CommandEmpty>
        <CommandGroup heading={autocompleteTitle}>
          {autocompleteOptions.map((option) => (
            <CommandItem key={option.id}>
              <div
                className="w-full"
                onClick={() => {
                  if (maxTags && tags.length >= maxTags) return;
                  if (!allowDuplicates && tags.some((tag) => tag.text === option.text)) return;
                  setTags([...tags, option]);
                  onTagAdd?.(option.text);
                }}
              >
                {option.text}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
