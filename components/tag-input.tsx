import React from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';                                                    
import { cva, type VariantProps } from 'class-variance-authority';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command"
  

const tagVariants = cva(
  'transition-all border inline-flex items-center text-sm pl-2 rounded-md',
  {
    variants: {
        variant: {
            default: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            primary: 'bg-primary border-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive border-destructive text-destructive-foreground hover:bg-destructive/90',
        },
        size: {
            sm: 'text-xs h-7',
            md: 'text-sm h-8',
            lg: 'text-base h-9',
            xl: 'text-lg h-10',
        },
        shape: {
            default: 'rounded-md',
            rounded: 'rounded-full',
            square: 'rounded-none',
            pill: 'rounded-lg',
        },
        borderStyle: {
            default: 'border-solid',
            none: 'border-none',
        },
        textCase: {
            uppercase: 'uppercase',
            lowercase: 'lowercase',
            capitalize: 'capitalize',
        },
        interaction: {
            clickable: 'cursor-pointer hover:shadow-md',
            nonClickable: 'cursor-default',
        },
        animation: {
            none: '',
            fadeIn: 'animate-fadeIn',
            slideIn: 'animate-slideIn',
            bounce: 'animate-bounce',
        },
        textStyle: {
            normal: 'font-normal',
            bold: 'font-bold',
            italic: 'italic',
            underline: 'underline',
            lineThrough: 'line-through',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'md',
        shape: 'default',
        borderStyle: 'default',
        textCase: 'capitalize',
        interaction: 'nonClickable',
        animation: 'fadeIn',
        textStyle: 'normal',
    },
  }
);

export enum Delimiter {
    Comma = ',',
    Enter = 'Enter',
    Space = ' '
}

type OmittedInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>;

export interface TagInputProps extends OmittedInputProps, VariantProps<typeof tagVariants> {
    placeholder?: string;
    tags: string[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
    enableAutocomplete?: boolean;
    autocompleteOptions?: string[];
    maxTags?: number;
    minTags?: number;
    readOnly?: boolean;
    disabled?: boolean;
    onTagAdd?: (tag: string) => void;
    onTagRemove?: (tag: string) => void;
    allowDuplicates?: boolean;
    maxLength?: number;
    validateTag?: (tag: string) => boolean;
    delimiter?: Delimiter;
    showCount?: boolean;
    placeholderWhenFull?: string;
    sortTags?: boolean;
    delimiterList?: string[];
    truncate?: number;
    autocompleteFilter?: (option: string) => boolean;
}

const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>((props, ref) => {

    const { 
        placeholder, 
        tags, 
        setTags, 
        variant, 
        size, 
        className, 
        enableAutocomplete, 
        autocompleteOptions,
        maxTags,
        delimiter = Delimiter.Comma,
        onTagAdd,
        onTagRemove,
        allowDuplicates,
        showCount,
        validateTag,
        placeholderWhenFull = 'Max tags reached',
        sortTags,
        delimiterList,
        truncate,
        autocompleteFilter,
    } = props;

    const [inputValue, setInputValue] = React.useState('');
    const [tagCount, setTagCount] = React.useState(tags.length);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (delimiterList ? delimiterList.includes(e.key) : e.key === delimiter || e.key === Delimiter.Enter) {
            e.preventDefault();
            const newTag = inputValue.trim();
        
            if (validateTag && !validateTag(newTag)) {
                return;
            }
        
            if (newTag && (allowDuplicates || !tags.includes(newTag)) && (maxTags === undefined || tags.length < maxTags)) {
                setTags([...tags, newTag]);
                onTagAdd?.(newTag);
                setTagCount((prevTagCount) => prevTagCount + 1);
            }
            setInputValue('');
        }
    };
    
    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
        onTagRemove?.(tagToRemove);
        setTagCount((prevTagCount) => prevTagCount - 1);
    };

    const filteredAutocompleteOptions = autocompleteFilter
    ? autocompleteOptions?.filter(autocompleteFilter)
    : autocompleteOptions;

    const displayedTags = sortTags ? [...tags].sort() : tags;

    const truncatedTags = truncate
        ? displayedTags.map((tag) => (tag.length > truncate ? `${tag.substring(0, truncate)}...` : tag))
        : displayedTags;

    return (
        <div>
            <div className={`flex flex-wrap gap-2 rounded-md ${tags.length !== 0 && 'mb-3'}`}>
                {truncatedTags.map((tag, index) => (
                    <span 
                    key={index} 
                    className={cn(tagVariants({ variant, size }))}
                    >
                        {tag}
                        <Button
                            type="button" 
                            variant="ghost"
                            onClick={() => removeTag(tag)}
                            className={cn("py-1 px-3 h-full hover:bg-transparent")}
                        >
                            <X size={14} />
                        </Button>
                    </span>
                ))}
            </div>
            {enableAutocomplete ? (
                <Command className='border mt-2 sm:min-w-[450px]'>
                    <CommandInput placeholder={maxTags !== undefined && tags.length >= maxTags ? placeholderWhenFull : placeholder}  />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Suggestions">
                            {filteredAutocompleteOptions?.map((option, index) => (
                                <CommandItem 
                                    key={index}
                                    className='cursor-pointer'
                                >
                                    <div
                                        className='w-full'
                                        onClick={() => {
                                            if(!tags.includes(option)){
                                                setTags([...tags, option])
                                            }
                                        }}
                                    >
                                        {option}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    {maxTags && <div className='flex'>
                       <span className='text-muted-foreground text-sm mt-1 ml-auto'>{`${tagCount}`}/{`${maxTags}`}</span>
                    </div>}
              </Command>
            ): (
                <>
                    <Input
                        ref={inputRef}
                        type="text"
                        placeholder={maxTags !== undefined && tags.length >= maxTags ? placeholderWhenFull : placeholder}
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className={className}
                        autoComplete={enableAutocomplete ? 'on' : 'off'}
                        list={enableAutocomplete ? 'autocomplete-options' : undefined}
                        disabled={maxTags !== undefined && tags.length >= maxTags}
                    />
                    {showCount && maxTags && <div className='flex'>
                       <span className='text-muted-foreground text-sm mt-1 ml-auto'>{`${tagCount}`}/{`${maxTags}`}</span>
                    </div>}
                </>
            )}
        </div>
    );
});

TagInput.displayName = 'TagInput';

export { TagInput };