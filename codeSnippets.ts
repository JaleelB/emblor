export const TagInputCodeSnippet = `
    import React from 'react';
    import { Input } from './ui/input';
    import { Button } from './ui/button';
    import { X } from 'lucide-react';
    import { cn } from '@/lib/utils';

    interface TagInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
      placeholder?: string;
      tags: string[];
      setTags: React.Dispatch<React.SetStateAction<string[]>>;
    }

    const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>((props, ref) => {

        const { placeholder, tags, setTags, className } = props;

        const [inputValue, setInputValue] = React.useState('');
        const inputRef = React.useRef<HTMLInputElement>(null);

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.target.value);
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            
            if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                const newTag = inputValue.trim();
                if (newTag && !tags.includes(newTag)) {
                    setTags([...tags, newTag]);
                }
                setInputValue('');
            }
        };

        const removeTag = (tagToRemove: string) => {
            setTags(tags.filter((tag) => tag !== tagToRemove));
        };

        return (
            <div>
                <div className={flex flex-wrap gap-2 rounded-md}>
                    {tags.map((tag, index) => (
                        <span key={index} className="transition-all border bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex h-8 items-center text-sm pl-2 rounded-md">
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
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className={className}
                />
            </div>
        );
    });

    TagInput.displayName = 'TagInput';

    export { TagInput };
`;

export const TagInputDemoSnippet = `
    import {
      Form,
      FormControl,
      FormDescription,
      FormField,
      FormItem,
      FormLabel,
      FormMessage,
    } from "@/components/ui/form"
    import React from 'react'
    import { TagInput } from '@/components/tag-input'

    const FormSchema = z.object({
      topics: z.array(z.string()),
    })

    const [tags, setTags] = React.useState<string[]>([]);

    const { setValue } = form;

    function onSubmit(data: z.infer<typeof FormSchema>) {
      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      })
    }

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="topics"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topics</FormLabel>
              <FormControl>
                <TagInput
                  {...field}
                  placeholder="Enter a topic"
                  tags={tags}
                  className='sm:min-w-[450px]'
                  setTags={(newTags) => {
                    setTags(newTags);
                    setValue("topics", newTags as [string, ...string[]]);
                  }} 
                />
              </FormControl>
              <FormDescription>
                These are the topics that you&apos;re interested in.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
`;

export type propOption = {
  option: string;
  type: string;
  default: string;
  description: string;
}

export const tagInputProps: propOption[] = [
  {
    option: "placeholder",
    type: "string",
    default: '""',
    description: "Placeholder text for the input."
  },
  {
    option: "tags",
    type: "Array",
    default: "[]",
    description: "An array of tags that are displayed as pre-selected."
  },
  {
    option: "setTags",
    type: "React.Dispatch<React.SetStateAction<string[]>>",
    default: "null",
    description: "Function to set the state of tags."
  },
  {
    option: "enableAutocomplete",
    type: "boolean",
    default: "false",
    description: "Enable autocomplete feature."
  },
  {
    option: "autocompleteOptions",
    type: "Array",
    default: "[]",
    description: "List of options for autocomplete."
  },
  {
    option: "maxTags",
    type: "number",
    default: "null",
    description: "Maximum number of tags allowed."
  },
  {
    option: "minTags",
    type: "number",
    default: "null",
    description: "Minimum number of tags required."
  },
  {
    option: "readOnly",
    type: "boolean",
    default: "false",
    description: "Make the input read-only."
  },
  {
    option: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable the input."
  },
  {
    option: "onTagAdd",
    type: "Function",
    default: "null",
    description: "Callback function when a tag is added."
  },
  {
    option: "onTagRemove",
    type: "Function",
    default: "null",
    description: "Callback function when a tag is removed."
  },
  {
    option: "allowDuplicates",
    type: "boolean",
    default: "false",
    description: "Allow duplicate tags."
  },
  {
    option: "maxLength",
    type: "number",
    default: "null",
    description: "Maximum length of a tag."
  },
  {
    option: "minLength",
    type: "number",
    default: "null",
    description: "Maximum length of  tag."
  },
  {
    option: "validateTag",
    type: "Function",
    default: "null",
    description: "Function to validate a tag."
  },
  {
    option: "delimiter",
    type: "Delimiter",
    default: "null",
    description: "Character used to separate tags."
  },
  {
    option: "showCount",
    type: "boolean",
    default: "false",
    description: "Show the count of tags."
  },
  {
    option: "placeholderWhenFull",
    type: "string",
    default: '""',
    description: "Placeholder text when tag limit is reached."
  },
  {
    option: "sortTags",
    type: "boolean",
    default: "false",
    description: "Sort tags alphabetically."
  },
  {
    option: "delimiterList",
    type: "Array",
    default: "[]",
    description: "List of characters that can be used as delimiters."
  },
  {
    option: "truncate",
    type: "number",
    default: "null",
    description: "Truncate tag text to a certain length."
  },
  {
    option: "autocompleteFilter",
    type: "Function",
    default: "null",
    description: "Function to filter autocomplete options."
  }
];
