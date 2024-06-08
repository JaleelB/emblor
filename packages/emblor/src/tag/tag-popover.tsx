import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popoever';
import { type Tag as TagType } from './tag-input';
import { TagList, TagListProps } from './tag-list';
import { Button } from '../ui/button';

type TagPopoverProps = {
  children: React.ReactNode;
  tags: TagType[];
  customTagRenderer?: (tag: TagType, isActiveTag: boolean) => React.ReactNode;
  activeTagIndex?: number | null;
  setActiveTagIndex?: (index: number | null) => void;
} & TagListProps;

export const TagPopover: React.FC<TagPopoverProps> = ({
  children,
  tags,
  customTagRenderer,
  activeTagIndex,
  setActiveTagIndex,
  ...tagProps
}) => {
  const triggerContainerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [popoverWidth, setPopoverWidth] = useState<number>(0);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open && triggerContainerRef.current) {
        setPopoverWidth(triggerContainerRef.current.offsetWidth);
      }

      if (open) {
        inputRef.current?.focus();
        setIsPopoverOpen(open);
      }
    },
    [inputFocused],
  );

  const handleInputFocus = () => {
    // Only set inputFocused to true if the popover is already open.
    // This will prevent the popover from opening due to an input focus if it was initially closed.
    if (isPopoverOpen) {
      setInputFocused(true);
    }

    const userOnFocus = (children as React.ReactElement<any>).props.onFocus;
    if (userOnFocus) userOnFocus(event);
  };

  const handleInputBlur = () => {
    setInputFocused(false);

    // Allow the popover to close if no other interactions keep it open
    if (!isPopoverOpen) {
      setIsPopoverOpen(false);
    }

    const userOnBlur = (children as React.ReactElement<any>).props.onBlur;
    if (userOnBlur) userOnBlur(event);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={handleOpenChange}>
      <div
        className="relative flex items-center rounded-md border border-input bg-transparent pr-3"
        ref={triggerContainerRef}
      >
        {/* {children} */}
        {React.cloneElement(children as React.ReactElement<any>, {
          onFocus: handleInputFocus,
          onBlur: handleInputBlur,
          ref: inputRef,
        })}
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="ghost"
            size="icon"
            role="combobox"
            className="hover:bg-transparent"
            aria-expanded={open as unknown as boolean}
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-chevron-down h-4 w-4 shrink-0 opacity-50"
            >
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent
        className="w-full space-y-3"
        style={{
          marginLeft: `-${popoverWidth - triggerRef?.current?.offsetWidth}px`,
          width: `${popoverWidth}px`,
        }}
      >
        <div className="space-y-1">
          <h4 className="text-sm font-medium leading-none">Entered Tags</h4>
          <p className="text-sm text-muted-foregrounsd text-left">These are the tags you&apos;ve entered.</p>
        </div>
        <TagList
          tags={tags}
          customTagRenderer={customTagRenderer}
          activeTagIndex={activeTagIndex}
          setActiveTagIndex={setActiveTagIndex}
          {...tagProps}
        />
      </PopoverContent>
    </Popover>
  );
};
