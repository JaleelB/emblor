'use client';

import React, { useState, useMemo } from 'react';
import { cn, uuid } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TagInput, TagInputProps, Tag } from 'emblor';
import CodeBlock from './code-block';

interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  description?: string;
  props?: Partial<TagInputProps>;
}

export function ComponentPreview({ name, description, props, className, ...otherProps }: ComponentPreviewProps) {
  const tags: Tag[] = useMemo(
    () => [
      { id: uuid(), text: 'Sports' },
      { id: uuid(), text: 'Programming' },
      { id: uuid(), text: 'Travel' },
    ],
    [],
  );
  const [defaultTags, setDefaultTags] = useState<Tag[]>(tags);
  const [activeTagIndex, setActiveTagIndex] = React.useState<number | null>(null);

  const defaultProps: TagInputProps = {
    tags: defaultTags,
    setTags: (newTags) => {
      setDefaultTags(newTags);
    },
    placeholder: 'Add a tag',
    className: 'max-w-[250px]',
    activeTagIndex: activeTagIndex,
    setActiveTagIndex: setActiveTagIndex,
    ...props,
  };

  const codeString = useMemo(() => {
    const propEntries = Object.entries(props || {})
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}={${JSON.stringify(value)}}`;
        } else if (typeof value === 'object') {
          return `${key}={${JSON.stringify(value)}}`;
        } else {
          return `${key}="${value}"`;
        }
      })
      .join('\n            ');

    return `
import React, { useState } from 'react';
import { TagInput } from 'emblor';

const Example = () => {
    const [exampleTags, setExampleTags] = useState<Tag[]>(
        ${JSON.stringify(defaultTags, null, 2)}
    );
    const [activeTagIndex, setActiveTagIndex] = React.useState<number | null>(null);

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
  }, [defaultTags, props]);

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
          <div
            className={cn('preview flex min-h-[350px] w-full justify-center p-10', {
              'items-center': true,
            })}
          >
            <TagInput {...defaultProps} />
          </div>
        </TabsContent>
        <TabsContent value="code">
          <div className="flex flex-col space-y-4">
            <div className="w-full rounded-md [&_pre]:my-0 [&_pre]:max-h-[350px] [&_pre]:overflow-auto">
              <CodeBlock value={codeString} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
