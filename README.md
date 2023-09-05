https://github.com/JaleelB/shadcn-tag-input/assets/78449846/7f678789-ef5e-4913-b26c-9317003d6dbc

[Shadcn Tag Input](https://shadcn-tag-input.vercel.app/) is a tag input component implementation of Shadcn's input component. It's customizable, but styled by default (Shadcn's default styling).

## Features

- Customizable: Easily style your tags with various options.
- Autocomplete: Enable autocomplete with a list of suggestions.
- Validation: Validate tags based on custom logic.
- Tag Count: Display the number of tags.
- Delimiter Support: Use custom delimiters to separate tags.
- Accessibility: Built with accessibility in mind.

## Why

To be honest, I needed a tagging component for a project. I looked around for any tagging components that used Shadcn's design system, but I couldn't find any. So, I decided to make one myself. I hope you find it useful!

## Setup

Run the shadcn-ui init command to setup your project:

```bash
npx shadcn-ui@latest init
```

Run the shadcn-ui add command to add the tag input component to your project:

```bash
npx shadcn-ui@latest add input
```

Copy and paste the folowing code into a new file:

```jsx
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
            <div className={`flex flex-wrap gap-2 rounded-md ${tags.length !== 0 && 'mb-3'}`}>
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

```

## Usage

Here's a sample implementation that initializes the component with a list of initial tags and suggestions list. Apart from this, there are multiple events, handlers for which need to be set.

```jsx
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
```

## Tag Variants

This section describes the various variants you can use with the `TagInput` component. Each variant has a unique set of properties that allow you to customize the appearance and behavior of the tags.

### Variant

#### Default
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Primary
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="bg-primary border-primary text-primary-foreground hover:bg-primary/90"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Destructive
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="bg-destructive border-destructive text-destructive-foreground hover:bg-destructive/90"
  setTags={(newTags) => setTags(newTags)}
/>
```

### Size

#### Small (sm)
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="text-xs h-7"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Medium (md)
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="text-sm h-8"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Large (lg)
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="text-base h-9"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Extra Large (xl)
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="text-lg h-10"
  setTags={(newTags) => setTags(newTags)}
/>
```

### Shape

#### Default
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="rounded-sm"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Rounded
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="rounded-full"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Square
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="rounded-none"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Pill
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="rounded-lg"
  setTags={(newTags) => setTags(newTags)}
/>
```

### Border Style

#### Default
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="border-solid"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### None
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="border-none"
  setTags={(newTags) => setTags(newTags)}
/>
```

### Text Case

#### Uppercase
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="uppercase"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Lowercase
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="lowercase"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Capitalize
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="capitalize"
  setTags={(newTags) => setTags(newTags)}
/>
```

### Interaction

#### Clickable
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="cursor-pointer hover:shadow-md"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Non-Clickable
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="cursor-default"
  setTags={(newTags) => setTags(newTags)}
/>
```

### Animation

#### None
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className=""
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Fade In
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="animate-fadeIn"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Slide In
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="animate-slideIn"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Bounce
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="animate-bounce"
  setTags={(newTags) => setTags(newTags)}
/>
```

### Text Style

#### Normal
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="font-normal"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Bold
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="font-bold"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Italic
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="italic"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Underline
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="underline"
  setTags={(newTags) => setTags(newTags)}
/>
```

#### Line Through
```jsx
<TagInput
  placeholder="Enter a topic"
  tags={tags}
  className="line-through"
  setTags={(newTags) => setTags(newTags)}
/>
```


## Props
| Option               | Type                                      | Default | Description                                                    |
|----------------------|-------------------------------------------|---------|----------------------------------------------------------------|
| placeholder          | string                                    | `""`    | Placeholder text for the input.                                 |
| tags                 | Array                                     | `[]`    | An array of tags that are displayed as pre-selected.           |
| setTags              | React.Dispatch<React.SetStateAction<string[]>> | `null`  | Function to set the state of tags.                              |
| enableAutocomplete    | boolean                                   | `false` | Enable autocomplete feature. Must be used with autocompleteOptions. |
| autocompleteOptions   | Array                                     | `[]`    | List of options for autocomplete. Must be used with enableAutocomplete. |
| maxTags              | number                                    | `null`  | Maximum number of tags allowed.                                 |
| minTags              | number                                    | `null`  | Minimum number of tags required.                                |
| readOnly             | boolean                                   | `false` | Make the input read-only.                                       |
| disabled             | boolean                                   | `false` | Disable the input.                                             |
| onTagAdd             | Function                                  | `null`  | Callback function when a tag is added.                          |
| onTagRemove          | Function                                  | `null`  | Callback function when a tag is removed.                        |
| allowDuplicates      | boolean                                   | `false` | Allow duplicate tags.                                           |
| maxLength            | number                                    | `null`  | Maximum length of a tag.                                        |
| minLength            | number                                    | `null`  | Maximum length of a tag.                                        |
| validateTag          | Function                                  | `null`  | Function to validate a tag.                                     |
| delimiter            | Delimiter                                 | `null`  | Character used to separate tags.                                |
| showCount            | boolean                                   | `false` | Show the count of tags.                                         |
| placeholderWhenFull  | string                                    | `""`    | Placeholder text when tag limit is reached.                     |
| sortTags            | boolean                                   | `false` | Sort tags alphabetically.                                       |
| delimiterList        | Array                                     | `[]`    | List of characters that can be used as delimiters.              |
| truncate             | number                                    | `null`  | Truncate tag text to a certain length.                           |
| autocompleteFilter   | Function                                  | `null`  | Function to filter autocomplete options.                         |


