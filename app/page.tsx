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

const FormSchema = z.object({
  topics: z.array(z.string()),
})

export default function Home() {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema)
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

  return (
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
      
    </main>
  )
}
