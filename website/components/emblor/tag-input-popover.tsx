'use client';

import { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import {
  EmblorClear,
  EmblorInput,
  EmblorLabel,
  EmblorRoot,
  EmblorTag,
  EmblorTagList,
  EmblorTagRemove,
  EmblorTagText,
} from 'emblor';

const suggestions = ['react', 'typescript', 'accessibility', 'design systems'];

export function EmblorSuggestionField() {
  const [tags, setTags] = useState(['react']);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const matches = suggestions.filter(
    (suggestion) => !tags.includes(suggestion) && suggestion.includes(query.toLowerCase()),
  );

  function choose(value: string) {
    setTags((current) => [...current, value]);
    setQuery('');
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="w-full max-w-xl">
          <EmblorRoot
            value={tags}
            onValueChange={setTags}
            inputValue={query}
            onInputValueChange={(value) => {
              setQuery(value);
              setOpen(true);
            }}
            className="flex flex-col gap-2"
          >
            <EmblorLabel className="text-sm font-medium">Technologies</EmblorLabel>
            <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-lg border border-input bg-background px-2.5 py-2 shadow-xs">
              <EmblorTagList className="flex flex-wrap gap-1.5">
                {(tag, index) => (
                  <EmblorTag
                    key={tag}
                    index={index}
                    className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm font-medium"
                  >
                    <EmblorTagText />
                    <EmblorTagRemove
                      aria-label={`Remove ${tag}`}
                      className="rounded-sm px-0.5 text-muted-foreground hover:bg-accent"
                    >
                      ×
                    </EmblorTagRemove>
                  </EmblorTag>
                )}
              </EmblorTagList>
              <EmblorInput
                className="min-w-28 flex-1 bg-transparent text-sm outline-none"
                onFocus={() => setOpen(true)}
                placeholder="Search suggestions"
              />
              <EmblorClear className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent">
                Clear
              </EmblorClear>
            </div>
          </EmblorRoot>
        </div>
      </PopoverAnchor>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start" sideOffset={6}>
        <Command>
          <CommandList>
            <CommandEmpty>No matching suggestions.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {matches.map((suggestion) => (
                <CommandItem key={suggestion} value={suggestion} onSelect={() => choose(suggestion)}>
                  {suggestion}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
