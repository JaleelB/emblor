import React, { useRef, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popoever';
import { type Tag as TagType } from './tag-input';
import { TagList, TagListProps } from './tag-list';

type TagPopoverProps = {
  children: React.ReactNode;
  tags: TagType[];
  customTagRenderer?: (tag: TagType) => React.ReactNode;
} & TagListProps;

export const TagPopover: React.FC<TagPopoverProps> = ({ children, tags, customTagRenderer, ...tagProps }) => {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [popoverWidth, setPopoverWidth] = useState<number | undefined>(undefined);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (open && triggerRef.current) {
      setPopoverWidth(triggerRef.current.offsetWidth);
    }
    setIsPopoverOpen(open);
  };

  const handleInputFocus = () => {
    setIsPopoverOpen(true);
  };

  const handleInputBlur = (event: React.FocusEvent) => {
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (relatedTarget && triggerRef.current && triggerRef.current.contains(relatedTarget)) {
      return;
    }
    setIsPopoverOpen(false);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild ref={triggerRef}>
        {React.cloneElement(children as React.ReactElement<any>, {
          onFocus: handleInputFocus,
          onBlur: handleInputBlur,
        })}
      </PopoverTrigger>
      <PopoverContent
        className="w-full space-y-3"
        style={{
          width: `${popoverWidth}px`,
        }}
      >
        <div className="space-y-1">
          <h4 className="text-sm font-medium leading-none">Entered Tags</h4>
          <p className="text-sm text-muted-foreground text-left">These are the tags you&apos;ve entered.</p>
        </div>
        <TagList tags={tags} customTagRenderer={customTagRenderer} {...tagProps} />
      </PopoverContent>
    </Popover>
  );
};
