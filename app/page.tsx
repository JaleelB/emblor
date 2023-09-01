"use client"
import Link from 'next/link'
import { Button, buttonVariants } from "@/components/ui/button"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { toast } from "@/components/ui/use-toast"
import useClipboard from '@/hooks/use-copy'

const FormSchema = z.object({
  topics: z.array(z.string()),
})

export default function Home() {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema)
  })

  const [tags, setTags] = React.useState<string[]>([]);
  const { isCopied, copyToClipboard } = useClipboard();

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

  const TagInputCodeSnippet = `
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

  const TagInputDemoSnippet = `
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

  return (
    <>
      <main className="container flex min-h-screen flex-col items-center justify-between py-40 px-4 scroll-smooth">
        <section className="z-10 max-w-4xl w-full flex flex-col items-center text-center gap-5">
          <h1 className='scroll-m-20 text-4xl font-bold tracking-tight'>Shadcn Tag Input</h1>
          <p className='text-muted-foreground max-w-[450px]'>An implementation of a Tag Input component built on top of Shadcn UI&apos;s input component.</p>
          <div className='flex gap-2 mt-1'>
            <Link 
              href="#try"
              className={`${buttonVariants({ variant: "default", size: "lg" })} min-w-[150px] shadow-sm`}
            >
              Try it out
            </Link>
            <Link 
              href="https://github.com/JaleelB/shadcn-tag-input"
              className={`${buttonVariants({ variant: "secondary", size: "lg" })} shadow-sm`}
            >
              Github
            </Link>
          </div>
        </section>

        <section id="try" className="max-w-4xl w-full py-8">
          <div className='w-full relative my-4 flex flex-col space-y-2'>
            <div className='preview flex min-h-[350px] w-full justify-center p-10 items-center mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative rounded-md border'>
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
            </div>
          </div>
        </section>
        
        <section className="max-w-4xl w-full py-8">
          <h2 className='font-heading mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0'>Setup</h2>
          <div>
            <h3 className='font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight'>Install Shadcn via CLI</h3>
            <p className="leading-7 [&amp;:not(:first-child)]:mt-6 text-normal">
              Run the <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">shadcn-ui</code> init command to setup your project:
            </p>
            <div data-rehype-pretty-code-fragment="">
              <pre className="relative mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900">
              <Button 
                  className='absolute top-2 right-2 px-3 hover:bg-white/40'
                  variant='ghost'
                  onClick={async() =>{
                    await copyToClipboard('npx shadcn-ui@latest init');
                    if(isCopied){
                        toast({
                            title: 'Copied to clipboard',
                            description: 'The command has been copied to your clipboard.',
                            variant: 'default'
                        });
                    }
                }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className='h-4 w-4' viewBox="0 0 24 24">
                    <g fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1">
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                    </g>
                  </svg>
                </Button>
                <code className="relative rounded bg-transparent text-white py-[0.2rem] font-mono text-sm px-4">
                  npx shadcn-ui@latest init
                </code>
              </pre>
            </div> 
          </div>
          <div>
            <h3 className='font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight'>
              Install Shadcn&apos;s input component:
            </h3>
            <p className="leading-7 [&amp;:not(:first-child)]:mt-6 text-normal">
              Run the <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">shadcn-ui</code> add command to add the tag input component to your project:
            </p>
            <div data-rehype-pretty-code-fragment="">
              <pre className="relative mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900">
              <Button 
                  className='absolute top-2 right-2 px-3 hover:bg-white/40'
                  variant='ghost'
                  onClick={async() =>{
                    await copyToClipboard('npx shadcn-ui@latest add input');
                    if(isCopied){
                        toast({
                            title: 'Copied to clipboard',
                            description: 'The command has been copied to your clipboard.',
                            variant: 'default'
                        });
                    }
                }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className='h-4 w-4' viewBox="0 0 24 24">
                    <g fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1">
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                    </g>
                  </svg>
                </Button>
                <code className="relative rounded bg-transparent text-white py-[0.2rem] font-mono text-sm px-4">
                  npx shadcn-ui@latest add input
                </code>
              </pre>
            </div> 
          </div>
          <div>
            <h3 className='font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight'>
              Create a new tag input component:
            </h3>
            <p className="leading-7 [&amp;:not(:first-child)]:mt-6 text-normal">
              Copy and paste the folowing code into a new file:
            </p>
            <div data-rehype-pretty-code-fragment="">
              <pre className="mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900">
                <Button 
                    className='absolute top-2 right-2 px-3 hover:bg-white/40'
                    variant='ghost'
                    onClick={async() =>{
                      await copyToClipboard(TagInputCodeSnippet);
                      if(isCopied){
                          toast({
                              title: 'Copied to clipboard',
                              description: 'The command has been copied to your clipboard.',
                              variant: 'default'
                          });
                      }
                  }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className='h-4 w-4' viewBox="0 0 24 24">
                      <g fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                      </g>
                    </svg>
                  </Button>
                <code 
                  className="relative rounded bg-transparent text-white py-[0.2rem] max-h-[400px] overscroll-y-auto font-mono text-sm px-4"
                >
                  {TagInputCodeSnippet.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </code>
              </pre>
            </div> 
          </div>
        </section>

        <section className="max-w-4xl w-full py-8">
          <h2 className='font-heading mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0'>Usage</h2>
          <div>
            <div data-rehype-pretty-code-fragment="">
              <pre className="mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900">
                <code className="relative rounded bg-transparent text-white py-[0.2rem] font-mono text-sm px-4">
                  npx shadcn-ui@latest init
                </code>
              </pre>
            </div> 
            <div data-rehype-pretty-code-fragment="">
              <pre className="mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900">
                <code className="relative rounded bg-transparent text-white py-[0.2rem] font-mono text-sm px-4">
                { `import { TagInput } from "@/components/tag-input"`}
                </code>
                <code className="relative w-full rounded bg-transparent text-white py-[0.2rem] font-mono text-sm px-4 max-h-[350px]">
                  {TagInputDemoSnippet.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </code>
              </pre>
            </div> 
          </div>
        </section>
      </main>
      <footer className='py-6 md:px-8 md:py-0 border-t'>
        <div className="container max-w-4xl flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <a
              href={"https://twitter.com/jal_eelll"}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Jaleel Bennett
            </a>
            .
          </p>
        </div>
      </footer>
    </>
  )
}
