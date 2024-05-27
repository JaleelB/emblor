import React from 'react';
import { Command, CommandList, CommandItem, CommandGroup, CommandEmpty } from '../ui/command';
import { type Tag as TagType } from './tag-input';
import { cn } from '../utils';

type AutocompleteProps = {
  tags: TagType[];
  setTags: React.Dispatch<React.SetStateAction<TagType[]>>;
  autocompleteOptions: TagType[];
  maxTags?: number;
  onTagAdd?: (tag: string) => void;
  allowDuplicates: boolean;
  children: React.ReactNode;
};

export const Autocomplete: React.FC<AutocompleteProps> = ({
  tags,
  setTags,
  autocompleteOptions,
  maxTags,
  onTagAdd,
  allowDuplicates,
  children,
}) => {
  return (
    <Command className="border w-full">
      {children}
      <CommandList className={cn('border-t')}>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions" className={cn('overflow-y-auto')}>
          {autocompleteOptions.map((option) => (
            <CommandItem key={option.id} className="cursor-pointer">
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
