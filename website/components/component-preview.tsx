'use client';

import React, { useState, useMemo, useEffect, use, useCallback } from 'react';
import { cn, uuid } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tag, TagInput, TagInputProps } from '../../packages/emblor/src';
// import { TagInput, TagInputProps, Tag } from 'emblor';
import CodeBlock from './code-block';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ComponentPreviewProps
  extends Omit<TagInputProps, 'tags' | 'setTags' | 'activeTagIndex' | 'setActiveTagIndex'> {
  propName?: string;
  selectOptions?: Array<string>;
}

export function ComponentPreview({ className, selectOptions, propName, ...otherProps }: ComponentPreviewProps) {
  const tags: Tag[] = useMemo(
    () => [
      { id: uuid(), text: 'Sports' },
      { id: uuid(), text: 'Programming' },
      { id: uuid(), text: 'Travel' },
    ],
    [],
  );
  const [defaultTags, setDefaultTags] = useState<Tag[]>(tags);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
  const [selectedPropValue, setSelectedPropValue] = useState(selectOptions?.[0] || '');
  //   const [codeString, setCodeString] = useState('');

  const defaultProps: TagInputProps & {
    [key: string]: any;
  } = useMemo(() => {
    const props: TagInputProps = {
      tags: defaultTags,
      setTags: (newTags) => {
        setDefaultTags(newTags);
      },
      placeholder: 'Add a tag',
      className: 'w-full',
      activeTagIndex: activeTagIndex,
      setActiveTagIndex: setActiveTagIndex,
      autocompleteOptions: tags,
      //   ...otherProps,
    };

    return props;
  }, [defaultTags, activeTagIndex, tags]);

  const props: Partial<TagInputProps> & {
    [key: string]: any;
  } = useMemo(() => {
    const props: Partial<TagInputProps> = {
      ...otherProps,
    };

    if (propName && selectedPropValue) {
      props[propName as keyof TagInputProps] = selectedPropValue;
    }

    return props;
  }, [otherProps, propName, selectedPropValue]);

  const codeString = useMemo(() => {
    function serializeProp(value: any): string {
      if (typeof value === 'function') {
        // Converts function to a string representation, removing possible function body clutter
        const funcString = value.toString().replace(/\{\s*\[native code\]\s*\}/g, '{}');
        // Optionally, trim the function to make it cleaner in display if needed
        return funcString;
      } else if (Array.isArray(value)) {
        // Serialize arrays to a more readable format
        return `[${value.map(serializeProp).join(', ')}]`;
      } else if (typeof value === 'object' && value !== null) {
        // JSON stringify the object with indentation for readability
        return `{${Object.entries(value)
          .map(([key, val]) => `\n  ${key}: ${serializeProp(val)}`)
          .join(',\n')}\n}`;
      } else if (typeof value === 'string') {
        // Return strings with proper quotes
        return `"${value.replace(/"/g, '\\"')}"`;
      } else {
        // Return other types directly, wrapping them in braces if they are not simple literals
        return `{${String(value)}}`;
      }
    }

    const customRendererPlaceholder = `
    (tag, isActiveTag) => (
      <div
        key={tag.id}
        className={\`px-2 py-1 bg-red-500 rounded-full \${isActiveTag ? "ring-ring ring-offset-2 ring-2 ring-offset-background" : ""}\`}
      >
        <span className="text-white text-sm mr-1">{tag.text}</span>
      </div>
    )
    `;

    const propEntries = Object.entries(props)
      .map(([key, value]) => {
        if (key === 'customTagRenderer') {
          return `${key}={${customRendererPlaceholder}}`;
        }
        return `${key}={${serializeProp(value)}}`;
      })
      .join('\n            ');

    return `
        import React, { useState } from 'react';
        import { TagInput } from 'emblor';

          const Example = () => {
              const tags = ${JSON.stringify(defaultTags, null, 2)};
              const [exampleTags, setExampleTags] = useState<Tag[]>(tags);
              const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

              return (
                  <TagInput
                      tags={exampleTags}
                      setTags={(newTags) => {
                          setExampleTags(newTags);
                      }}
                      placeholder="Add a tag"
                      className="sm:max-w-[350px]"
                      activeTagIndex={activeTagIndex}
                      setActiveTagIndex={setActiveTagIndex}
                      ${propEntries}
                  />
              );
          };
          `;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultTags, otherProps, propName, selectedPropValue]);

  // useEffect(() => {
  //   if (propName) {
  //     defaultProps[propName as keyof TagInputProps] = selectedPropValue;
  //   }

  //   function serializeProp(value: any): string {
  //     if (typeof value === 'function') {
  //       // Converts function to a string representation, removing possible function body clutter
  //       const funcString = value.toString().replace(/\{\s*\[native code\]\s*\}/g, '{}');
  //       // Optionally, trim the function to make it cleaner in display if needed
  //       return funcString;
  //     } else if (Array.isArray(value)) {
  //       // Serialize arrays to a more readable format
  //       return `[${value.map(serializeProp).join(', ')}]`;
  //     } else if (typeof value === 'object' && value !== null) {
  //       // JSON stringify the object with indentation for readability
  //       return `{${Object.entries(value)
  //         .map(([key, val]) => `\n  ${key}: ${serializeProp(val)}`)
  //         .join(',\n')}\n}`;
  //     } else if (typeof value === 'string') {
  //       // Return strings with proper quotes
  //       return `"${value.replace(/"/g, '\\"')}"`;
  //     } else {
  //       // Return other types directly, wrapping them in braces if they are not simple literals
  //       return `{${String(value)}}`;
  //     }
  //   }

  //   const customRendererPlaceholder = `
  //   (tag, isActiveTag) => (
  //     <div
  //       key={tag.id}
  //       className={\`px-2 py-1 bg-red-500 rounded-full \${isActiveTag ? "ring-ring ring-offset-2 ring-2 ring-offset-background" : ""}\`}
  //     >
  //       <span className="text-white text-sm mr-1">{tag.text}</span>
  //     </div>
  //   )
  //   `;

  //   const propEntries = Object.entries(defaultProps || {})
  //     .map(([key, value]) => {
  //       if (key === 'customTagRenderer') {
  //         return `${key}={${customRendererPlaceholder}}`;
  //       }
  //       return `${key}={${serializeProp(value)}}`;
  //     })
  //     .join('\n            ');

  //   const newCodeString = `
  //   import React, { useState } from 'react';
  //   import { TagInput } from 'emblor';

  //     const Example = () => {
  //         const tags = ${JSON.stringify(defaultTags, null, 2)};
  //         const [exampleTags, setExampleTags] = useState<Tag[]>(tags);
  //         const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  //         return (
  //             <TagInput
  //                 tags={exampleTags}
  //                 setTags={(newTags) => {
  //                     setExampleTags(newTags);
  //                 }}
  //                 placeholder="Add a tag"
  //                 className="sm:max-w-[350px]"
  //                 activeTagIndex={activeTagIndex}
  //                 setActiveTagIndex={setActiveTagIndex}
  //                 ${propEntries}
  //             />
  //         );
  //     };
  //   `;
  //   setCodeString(newCodeString);
  // }, [defaultTags, activeTagIndex, otherProps, propName, selectedPropValue, defaultProps]);

  return (
    <div className={cn('group relative my-4 flex flex-col space-y-2', className)} {...otherProps}>
      <Tabs defaultValue="preview" className="relative mr-auto w-full">
        <div className="flex items-center justify-between pb-3">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="preview"
              className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Preview
            </TabsTrigger>
            <TabsTrigger
              value="code"
              className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Code
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="preview" className="relative rounded-md border">
          {propName && selectOptions && (
            <div className="w-full p-4 text-sm">
              <Select value={selectedPropValue} onValueChange={(value) => setSelectedPropValue(value)}>
                <SelectTrigger className="w-fit h-7" pr-4>
                  <span className="text-muted-foreground mr-1">{propName}: </span>
                  <SelectValue placeholder={`Select a ${propName}`} className="mr-1" />{' '}
                </SelectTrigger>
                <SelectContent>
                  {selectOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div
            className={cn('preview flex min-h-[350px] w-full justify-center p-10', {
              'items-center': true,
            })}
          >
            <TagInput {...defaultProps} {...props} />
          </div>
        </TabsContent>
        <TabsContent value="code">
          <div className="flex flex-col space-y-4">
            <div className="w-full rounded-md [&_pre]:my-0 [&_pre]:max-h-[350px] [&_pre]:overflow-auto">
              {/* <CodeBlock value={codeString} /> */}
              <CodeBlock value={codeString} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
