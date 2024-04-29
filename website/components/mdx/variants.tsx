import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';
import { Tag, TagInput } from 'emblor';
import { cn, uuid } from '@/lib/utils';

export default function Variants() {
  const tags: Tag[] = [
    { id: uuid(), text: 'Sports' },
    { id: uuid(), text: 'Travel' },
    { id: uuid(), text: 'Programming' },
  ];
  const [variantTags, setVariantTags] = React.useState<Tag[]>(tags);
  const [sizeTags, setSizeTags] = React.useState<Tag[]>(tags);
  const [shapeTags, setShapeTags] = React.useState<Tag[]>(tags);
  const [borderTags, setBorderTags] = React.useState<Tag[]>(tags);
  const [textCaseTags, setTextCaseTags] = React.useState<Tag[]>(tags);
  const [interactionTags, setInteractionTags] = React.useState<Tag[]>(tags);
  const [animationTags, setAnimationTags] = React.useState<Tag[]>(tags);
  const [textStyleTags, setTextStyleTags] = React.useState<Tag[]>(tags);

  return (
    <section id="variants" className="max-w-5xl w-full py-8">
      <div className="w-full">
        <h3 className="font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Variant</h3>
        <p className="leading-7 [&amp;:not(:first-child)]:mt-4 text-normal">
          Choose from different visual styles like default, primary, and destructive.
        </p>
        <Tabs defaultValue="default" className="w-full mt-4">
          <TabsList className={cn('mb-4 w-full overflow-x-auto h-auto overflow-y-hidden justify-start')}>
            <TabsTrigger value="default">Default</TabsTrigger>
            <TabsTrigger value="primary">Primary</TabsTrigger>
            <TabsTrigger value="destructive">Destructive</TabsTrigger>
          </TabsList>
          <TabsContent value="default">
            <TagInput
              placeholder="Enter a topic"
              tags={variantTags}
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setVariantTags(newTags);
              }}
            />
          </TabsContent>
          <TabsContent value="primary">
            <TagInput
              placeholder="Enter a topic"
              tags={variantTags}
              variant="primary"
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setVariantTags(newTags);
              }}
            />
          </TabsContent>
          <TabsContent value="destructive">
            <TagInput
              placeholder="Enter a topic"
              tags={variantTags}
              variant="destructive"
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setVariantTags(newTags);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
      <div className="w-full">
        <h3 className="font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Size</h3>
        <p className="leading-7 [&amp;:not(:first-child)]:mt-4 text-normal">Adjust the size of the tags.</p>
        <Tabs defaultValue="small" className="w-full mt-4">
          <TabsList className={cn('mb-4 w-full overflow-x-auto h-auto overflow-y-hidden justify-start')}>
            <TabsTrigger value="small">Small</TabsTrigger>
            <TabsTrigger value="medium">Medium</TabsTrigger>
            <TabsTrigger value="large">Large</TabsTrigger>
            <TabsTrigger value="x-large">X-Large</TabsTrigger>
          </TabsList>
          <TabsContent value="small">
            <TagInput
              placeholder="Enter a topic"
              tags={sizeTags}
              size="sm"
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setSizeTags(newTags);
              }}
            />
          </TabsContent>
          <TabsContent value="medium">
            <TagInput
              placeholder="Enter a topic"
              tags={sizeTags}
              size="md"
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setSizeTags(newTags);
              }}
            />
          </TabsContent>
          <TabsContent value="large">
            <TagInput
              placeholder="Enter a topic"
              tags={sizeTags}
              size="lg"
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setSizeTags(newTags);
              }}
            />
          </TabsContent>
          <TabsContent value="x-large">
            <TagInput
              placeholder="Enter a topic"
              tags={sizeTags}
              size="xl"
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setSizeTags(newTags);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
      <div className="w-full">
        <h3 className="font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Shape</h3>
        <p className="leading-7 [&amp;:not(:first-child)]:mt-4 text-normal">Customize the shape of the tags.</p>
        <Tabs defaultValue="default" className="w-full mt-4">
          <TabsList className={cn('mb-4 w-full overflow-x-auto h-auto overflow-y-hidden justify-start')}>
            <TabsTrigger value="default">Default</TabsTrigger>
            <TabsTrigger value="square">Square</TabsTrigger>
            <TabsTrigger value="rounded">Rounded</TabsTrigger>
            <TabsTrigger value="pill">Pill</TabsTrigger>
          </TabsList>
          <TabsContent value="default">
            <TagInput
              placeholder="Enter a topic"
              tags={shapeTags}
              shape="default"
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setShapeTags(newTags);
              }}
            />
          </TabsContent>
          <TabsContent value="square">
            <TagInput
              placeholder="Enter a topic"
              tags={shapeTags}
              shape="square"
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setShapeTags(newTags);
              }}
            />
          </TabsContent>
          <TabsContent value="rounded">
            <TagInput
              placeholder="Enter a topic"
              tags={shapeTags}
              shape="rounded"
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setShapeTags(newTags);
              }}
            />
          </TabsContent>
          <TabsContent value="pill">
            <TagInput
              placeholder="Enter a topic"
              tags={shapeTags}
              shape="pill"
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setShapeTags(newTags);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
      <div className="w-full">
        <h3 className="font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Border styles</h3>
        <p className="leading-7 [&amp;:not(:first-child)]:mt-4 text-normal">
          Choose between different border styles or opt for no border at all.
        </p>
        <Tabs defaultValue="default" className="w-full mt-4">
          <TabsList className={cn('mb-4 w-full overflow-x-auto h-auto overflow-y-hidden justify-start')}>
            <TabsTrigger value="default">Default</TabsTrigger>
            <TabsTrigger value="none">No border</TabsTrigger>
          </TabsList>
          <TabsContent value="default">
            <TagInput
              placeholder="Enter a topic"
              tags={borderTags}
              borderStyle="default"
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setBorderTags(newTags);
              }}
            />
          </TabsContent>
          <TabsContent value="none">
            <TagInput
              placeholder="Enter a topic"
              tags={borderTags}
              borderStyle="none"
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setBorderTags(newTags);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
      <div className="w-full">
        <h3 className="font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Text case</h3>
        <p className="leading-7 [&amp;:not(:first-child)]:mt-4 text-normal">Control the text casing within the tags.</p>
        <Tabs defaultValue="capitalize" className="w-full mt-4">
          <TabsList className={cn('mb-4 w-full overflow-x-auto h-auto overflow-y-hidden justify-start')}>
            <TabsTrigger value="capitalize">Capitalize</TabsTrigger>
            <TabsTrigger value="uppercase">Uppercase</TabsTrigger>
            <TabsTrigger value="lowercase">Lowercase</TabsTrigger>
          </TabsList>
          <TabsContent value="capitalize">
            <TagInput
              placeholder="Enter a topic"
              tags={textCaseTags}
              textCase="capitalize"
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setTextCaseTags(newTags);
              }}
            />
          </TabsContent>
          <TabsContent value="uppercase">
            <TagInput
              placeholder="Enter a topic"
              tags={textCaseTags}
              textCase="uppercase"
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setTextCaseTags(newTags);
              }}
            />
          </TabsContent>
          <TabsContent value="lowercase">
            <TagInput
              placeholder="Enter a topic"
              tags={textCaseTags}
              textCase="lowercase"
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setTextCaseTags(newTags);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
      <div className="w-full">
        <h3 className="font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Interaction</h3>
        <p className="leading-7 [&amp;:not(:first-child)]:mt-4 text-normal">
          Define the interaction style of the tags. Make them clickable or non-clickable.
        </p>
        <Tabs defaultValue="clickable" className="w-full mt-4">
          <TabsList className={cn('mb-4 w-full overflow-x-auto h-auto overflow-y-hidden justify-start')}>
            <TabsTrigger value="clickable">Clickable</TabsTrigger>
            <TabsTrigger value="non-clickable">Non-Clickable</TabsTrigger>
          </TabsList>
          <TabsContent value="clickable">
            <TagInput
              placeholder="Enter a topic"
              tags={interactionTags}
              interaction="clickable"
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setInteractionTags(newTags);
              }}
            />
          </TabsContent>
          <TabsContent value="non-clickable">
            <TagInput
              placeholder="Enter a topic"
              tags={interactionTags}
              interaction="nonClickable"
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setInteractionTags(newTags);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
      <div className="w-full">
        <h3 className="font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Animations</h3>
        <p className="leading-7 [&amp;:not(:first-child)]:mt-4 text-normal">Add animations on render for tags.</p>
        <Tabs defaultValue="none" className="w-full mt-4">
          <TabsList className={cn('mb-4 w-full overflow-x-auto h-auto overflow-y-hidden justify-start')}>
            <TabsTrigger value="none">None</TabsTrigger>
            <TabsTrigger value="bounce">Bounce</TabsTrigger>
            <TabsTrigger value="fade-in">Fade-in</TabsTrigger>
            <TabsTrigger value="slide-in">Slide-in</TabsTrigger>
          </TabsList>
          <TabsContent value="none">
            <TagInput
              placeholder="Enter a topic"
              tags={animationTags}
              animation="none"
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setAnimationTags(newTags);
              }}
            />
          </TabsContent>
          <TabsContent value="bounce">
            <TagInput
              placeholder="Enter a topic"
              tags={animationTags}
              animation="bounce"
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setAnimationTags(newTags);
              }}
            />
          </TabsContent>
          <TabsContent value="fade-in">
            <TagInput
              placeholder="Enter a topic"
              tags={animationTags}
              animation="fadeIn"
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setAnimationTags(newTags);
              }}
            />
          </TabsContent>
          <TabsContent value="slide-in">
            <TagInput
              placeholder="Enter a topic"
              tags={animationTags}
              animation="slideIn"
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setAnimationTags(newTags);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
      <div className="w-full">
        <h3 className="font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight">Text styles</h3>
        <p className="leading-7 [&amp;:not(:first-child)]:mt-4 text-normal">
          Customize the text style within the tags.
        </p>
        <Tabs defaultValue="normal" className="w-full mt-4">
          <TabsList className={cn('mb-4 w-full overflow-x-auto h-auto overflow-y-hidden justify-start')}>
            <TabsTrigger value="normal">Normal</TabsTrigger>
            <TabsTrigger value="bold">Bold</TabsTrigger>
            <TabsTrigger value="italic">Italic</TabsTrigger>
            <TabsTrigger value="underline">Underline</TabsTrigger>
            <TabsTrigger value="line-through">Line through</TabsTrigger>
          </TabsList>
          <TabsContent value="normal">
            <TagInput
              placeholder="Enter a topic"
              tags={textStyleTags}
              textStyle="normal"
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setTextStyleTags(newTags);
              }}
            />
          </TabsContent>
          <TabsContent value="bold">
            <TagInput
              placeholder="Enter a topic"
              tags={textStyleTags}
              textStyle="bold"
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setTextStyleTags(newTags);
              }}
            />
          </TabsContent>
          <TabsContent value="italic">
            <TagInput
              placeholder="Enter a topic"
              tags={textStyleTags}
              textStyle="italic"
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setTextStyleTags(newTags);
              }}
            />
          </TabsContent>
          <TabsContent value="underline">
            <TagInput
              placeholder="Enter a topic"
              tags={textStyleTags}
              textStyle="underline"
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setTextStyleTags(newTags);
              }}
            />
          </TabsContent>
          <TabsContent value="line-through">
            <TagInput
              placeholder="Enter a topic"
              tags={textStyleTags}
              textStyle="lineThrough"
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setTextStyleTags(newTags);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
