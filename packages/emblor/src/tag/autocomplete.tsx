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
                className="w-full flex items-center gap-2"
                onClick={() => {
                  if (maxTags && tags.length >= maxTags) return;
                  if (!allowDuplicates && tags.some((tag) => tag.text === option.text)) return;
                  setTags([...tags, option]);
                  onTagAdd?.(option.text);
                }}
              >
                {option.text}
                {tags.some((tag) => tag.text === option.text) && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-check"
                  >
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                )}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
{
  /* <svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  className="lucide lucide-check pr-2"
>
  <path d="M20 6 9 17l-5-5"></path>
</svg>; */
}
