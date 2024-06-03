import React from 'react';
// import { Tag, TagInput } from 'emblor';
import { Tag, TagInput } from '../../../packages/emblor/src';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, uuid } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

export default function Props() {
  const tags: Tag[] = [
    { id: uuid(), text: 'Sports' },
    { id: uuid(), text: 'Programming' },
    { id: uuid(), text: 'Travel' },
  ];

  const autoCompleteOptions = [
    ...tags,
    { id: uuid(), text: 'Food' },
    { id: uuid(), text: 'Movies' },
    { id: uuid(), text: 'Art' },
    { id: uuid(), text: 'Books' },
  ];

  const [autocompleteTags, setAutocompleteTags] = React.useState<Tag[]>([]);
  const [maxTags, setMaxTags] = React.useState<Tag[]>([]);
  const [truncateTags, setTruncateTags] = React.useState<Tag[]>(tags);
  const [allowDuplicatesTags, setAllowDuplicatesTags] = React.useState<Tag[]>([]);
  const [directionTags, setDirectionTags] = React.useState<Tag[]>(tags);
  const [customRenderTags, setCustomRenderTags] = React.useState<Tag[]>(tags);
  const [allowDraggableTags, setAllowDraggableTags] = React.useState<Tag[]>(tags);
  const [clearAllTags, setClearAllTags] = React.useState<Tag[]>(tags);
  const [inputFieldPositionTags, setInputFieldPositionTags] = React.useState<Tag[]>(tags);
  const [usePopoverTags, setUsePopoverTags] = React.useState<Tag[]>([]);
  const [inlineTags, setInlineTags] = React.useState<Tag[]>([
    ...tags,
    { id: uuid(), text: 'Music' },
    { id: uuid(), text: 'Dance' },
  ]);

  const [activeTagIndex, setActiveTagIndex] = React.useState<number | null>(null);

  const renderCustomTag = (tag: Tag, isActiveTag: boolean) => {
    return (
      <div
        key={tag.id}
        className={`flex items-center gap-2 p-2 rounded bg-red-500
        ${isActiveTag ? 'ring-ring ring-offset-2 ring-2 ring-offset-background' : ''}`}
      >
        <CheckCircle size={16} className="text-white" />
        <span className="text-white text-sm mr-2">{tag.text}</span>
      </div>
    );
  };

  return (
    <section id="props" className="w-full py-8">
      <div className="w-full">
        <h3 className="font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Autocomplete</h3>
        <p className="leading-7 [&amp;:not(:first-child)]:mt-4 text-normal">
          Enable or disable the autocomplete feature for the tag input.
        </p>
        <div className="preview flex min-h-[350px] w-full justify-center p-10 items-center mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border">
          <div className="space-y-2 w-full max-w-[450px]">
            <Label htmlFor="">Topics</Label>
            <TagInput
              placeholder="Enter a topic"
              tags={autocompleteTags}
              enableAutocomplete
              includeTagsInInput
              restrictTagsToAutocompleteOptions
              autocompleteOptions={autoCompleteOptions}
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setAutocompleteTags(newTags);
              }}
              activeTagIndex={activeTagIndex}
              setActiveTagIndex={setActiveTagIndex}
            />
          </div>
        </div>
      </div>
      <div className="w-full">
        <h3 className="font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Include Tags In Input</h3>
        <p className="leading-7 [&amp;:not(:first-child)]:mt-4 text-normal">
          Allows users to display tags inside the input field for a more compact and inline appearance.
        </p>
        <div className="preview flex min-h-[350px] w-full justify-center p-10 items-center mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border">
          <div className="space-y-2 w-full max-w-[450px]">
            <Label htmlFor="">Topics</Label>
            <TagInput
              placeholder="Enter a topic"
              tags={inlineTags}
              includeTagsInInput
              className="w-full"
              setTags={(newTags) => {
                setInlineTags(newTags);
              }}
              activeTagIndex={activeTagIndex}
              setActiveTagIndex={setActiveTagIndex}
            />
          </div>
        </div>
      </div>
      <div className="w-full">
        <h3 className="font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Custom tag render</h3>
        <p className="leading-7 [&amp;:not(:first-child)]:mt-4 text-normal">
          Replace the standard tag appearance with your own custom-designed tags.
        </p>
        <div className="preview flex min-h-[350px] w-full justify-center p-10 items-center mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border">
          <div className="space-y-2  w-full max-w-[450px]">
            <Label htmlFor="">Topics</Label>
            <TagInput
              placeholder="Enter a topic"
              tags={customRenderTags}
              customTagRenderer={renderCustomTag}
              className="w-full"
              setTags={(newTags) => {
                setCustomRenderTags(newTags);
              }}
              activeTagIndex={activeTagIndex}
              setActiveTagIndex={setActiveTagIndex}
            />
          </div>
        </div>
      </div>
      <div className="w-full">
        <h3 className="font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Max tags</h3>
        <p className="leading-7 [&amp;:not(:first-child)]:mt-4 text-normal">
          Set the maximum number of tags that can be added.
        </p>
        <div className="preview flex min-h-[350px] w-full justify-center p-10 items-center mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border">
          <div className="space-y-2  w-full max-w-[450px]">
            <Label htmlFor="">Topics</Label>
            <TagInput
              placeholder="Enter a topic"
              tags={maxTags}
              maxTags={5}
              showCount
              className="w-full"
              setTags={(newTags) => {
                setMaxTags(newTags);
              }}
              activeTagIndex={activeTagIndex}
              setActiveTagIndex={setActiveTagIndex}
            />
          </div>
        </div>
      </div>
      <div className="w-full">
        <h3 className="font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Draggable</h3>
        <p className="leading-7 [&amp;:not(:first-child)]:mt-4 text-normal">
          Allow tags to be dragged and dropped to reorder them.
        </p>
        <div className="preview flex min-h-[350px] w-full justify-center p-10 items-center mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border">
          <div className="space-y-2  w-full max-w-[450px]">
            <Label htmlFor="">Topics</Label>
            <TagInput
              placeholder="Enter a topic"
              tags={allowDraggableTags}
              draggable
              className="w-full"
              setTags={(newTags) => {
                setAllowDraggableTags(newTags);
              }}
              activeTagIndex={activeTagIndex}
              setActiveTagIndex={setActiveTagIndex}
            />
          </div>
        </div>
      </div>
      <div className="w-full">
        <h3 className="font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Tag Popover</h3>
        <p className="leading-7 [&amp;:not(:first-child)]:mt-4 text-normal">
          Allows users to view all entered tags in a popover overlay, offering easier management of tags.
        </p>
        <div className="preview flex min-h-[350px] w-full justify-center p-10 items-center mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border">
          <div className="space-y-2  w-full max-w-[450px]">
            <Label htmlFor="">Topics</Label>
            <TagInput
              placeholder="Enter a topic"
              tags={usePopoverTags}
              usePopoverForTags
              className="w-full"
              setTags={(newTags) => {
                setUsePopoverTags(newTags);
              }}
              activeTagIndex={activeTagIndex}
              setActiveTagIndex={setActiveTagIndex}
            />
          </div>
        </div>
      </div>
      <div className="w-full">
        <h3 className="font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Truncate</h3>
        <p className="leading-7 [&amp;:not(:first-child)]:mt-4 text-normal">
          Prevent tags from overflowing the tag input by specifying the maximum number of characters to display.
        </p>
        <div className="preview flex min-h-[350px] w-full justify-center p-10 items-center mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border">
          <div className="space-y-2  w-full max-w-[450px]">
            <Label htmlFor="">Topics</Label>
            <TagInput
              placeholder="Enter a topic"
              tags={truncateTags}
              truncate={4}
              className="w-full"
              setTags={(newTags) => {
                setTruncateTags(newTags);
              }}
              activeTagIndex={activeTagIndex}
              setActiveTagIndex={setActiveTagIndex}
            />
          </div>
        </div>
      </div>
      <div className="w-full">
        <h3 className="font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Clear all tags</h3>
        <p className="leading-7 [&amp;:not(:first-child)]:mt-4 text-normal">Clear all tags from the tag input.</p>
        <div className="preview flex min-h-[350px] w-full justify-center p-10 items-center mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border">
          <div className="space-y-2  w-full max-w-[450px]">
            <Label htmlFor="">Topics</Label>
            <TagInput
              placeholder="Enter a topic"
              tags={clearAllTags}
              clearAll
              onClearAll={() => {
                setClearAllTags([]);
              }}
              className="w-full"
              setTags={(newTags) => {
                setClearAllTags(newTags);
              }}
              activeTagIndex={activeTagIndex}
              setActiveTagIndex={setActiveTagIndex}
            />
          </div>
        </div>
      </div>
      <div className="w-full">
        <h3 className="font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Allow duplicate tags</h3>
        <p className="leading-7 [&amp;:not(:first-child)]:mt-4 text-normal">
          Allow duplicate tags to be added to the tag input.
        </p>
        <div className="preview flex min-h-[350px] w-full justify-center p-10 items-center mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border">
          <div className="space-y-2 w-full max-w-[450px]">
            <Label htmlFor="">Topics</Label>
            <TagInput
              placeholder="Enter a topic"
              tags={allowDuplicatesTags}
              allowDuplicates
              className="w-full"
              setTags={(newTags) => {
                setAllowDuplicatesTags(newTags);
              }}
              activeTagIndex={activeTagIndex}
              setActiveTagIndex={setActiveTagIndex}
            />
          </div>
        </div>
      </div>
      <div className="w-full">
        <h3 className="font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Input field position</h3>
        <p className="leading-7 [&amp;:not(:first-child)]:mt-4 text-normal">
          Change the position of the input field to be inline or stacked in relation to the tags.
        </p>
        <div className="preview flex min-h-[350px] w-full justify-center p-10 items-center mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border">
          <Tabs defaultValue="bottom" className="w-full mt-4">
            <TabsList className={cn('mb-4 w-full overflow-x-auto h-auto overflow-y-hidden justify-start')}>
              <TabsTrigger value="bottom">Bottom</TabsTrigger>
              <TabsTrigger value="top">Top</TabsTrigger>
              <TabsTrigger value="inline">Inline</TabsTrigger>
            </TabsList>
            <TabsContent value="bottom" className="space-y-2 w-full max-w-[450px]">
              <Label htmlFor="">Topics</Label>
              <TagInput
                placeholder="Enter a topic"
                tags={inputFieldPositionTags}
                size="md"
                className="w-full"
                setTags={(newTags) => {
                  setInputFieldPositionTags(newTags);
                }}
                activeTagIndex={activeTagIndex}
                setActiveTagIndex={setActiveTagIndex}
              />
            </TabsContent>
            <TabsContent value="top" className="space-y-2  w-full max-w-[450px]">
              <Label htmlFor="">Topics</Label>
              <TagInput
                placeholder="Enter a topic"
                tags={directionTags}
                size="md"
                inputFieldPosition="top"
                className="w-full"
                setTags={(newTags) => {
                  setDirectionTags(newTags);
                }}
                activeTagIndex={activeTagIndex}
                setActiveTagIndex={setActiveTagIndex}
              />
            </TabsContent>
            <TabsContent value="inline" className="space-y-2  w-full max-w-[450px]">
              <Label htmlFor="">Topics</Label>
              <TagInput
                placeholder="Enter a topic"
                tags={inputFieldPositionTags}
                size="md"
                inputFieldPosition="inline"
                className="w-full"
                setTags={(newTags) => {
                  setInputFieldPositionTags(newTags);
                }}
                activeTagIndex={activeTagIndex}
                setActiveTagIndex={setActiveTagIndex}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="w-full">
        <h3 className="font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Tag direction</h3>
        <p className="leading-7 [&amp;:not(:first-child)]:mt-4 text-normal">
          Change the direction of the tag layout from row to column.
        </p>
        <div className="preview flex min-h-[350px] w-full justify-center p-10 items-center mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border">
          <Tabs defaultValue="row" className="w-full mt-4">
            <TabsList className={cn('mb-4 w-full overflow-x-auto h-auto overflow-y-hidden justify-start')}>
              <TabsTrigger value="row">Row</TabsTrigger>
              <TabsTrigger value="column">Column</TabsTrigger>
            </TabsList>
            <TabsContent value="row" className="space-y-2  w-full max-w-[450px]">
              <Label htmlFor="">Topics</Label>
              <TagInput
                placeholder="Enter a topic"
                tags={directionTags}
                size="md"
                className="w-full"
                setTags={(newTags) => {
                  setDirectionTags(newTags);
                }}
                activeTagIndex={activeTagIndex}
                setActiveTagIndex={setActiveTagIndex}
              />
            </TabsContent>
            <TabsContent value="column" className="space-y-2  w-full max-w-[450px]">
              <Label htmlFor="">Topics</Label>
              <TagInput
                placeholder="Enter a topic"
                tags={directionTags}
                size="md"
                direction="column"
                className="w-full"
                setTags={(newTags) => {
                  setDirectionTags(newTags);
                }}
                activeTagIndex={activeTagIndex}
                setActiveTagIndex={setActiveTagIndex}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
