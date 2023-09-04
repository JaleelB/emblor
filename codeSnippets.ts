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