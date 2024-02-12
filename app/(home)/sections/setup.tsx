import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CodeBlock from "../../../components/code-block";
import { Snippet as SnippetType, allSnippets } from "contentlayer/generated";
import { Snippet } from "../../../components/snippet";

const snippets: SnippetType[] = allSnippets.sort((a, b) => a.order - b.order);

export default function Setup() {
  return (
    <section id="setup" className="max-w-5xl w-full py-8">
      <h2 className="font-heading mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
        Setup
      </h2>
      <div className="w-full">
        <h3 className="font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight">
          Install Shadcn via CLI
        </h3>
        <p className="leading-7 [&amp;:not(:first-child)]:mt-6 text-normal">
          Run the{" "}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            shadcn-ui
          </code>{" "}
          init command to setup your project:
        </p>
        <CodeBlock value={"npx shadcn-ui@latest init"} className="mt-2" />
      </div>
      <div className="w-full">
        <h3 className="font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight">
          Install the necessary Shadcn components:
        </h3>
        <p className="leading-7 [&amp;:not(:first-child)]:mt-6 text-normal">
          Run the{" "}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            shadcn-ui
          </code>{" "}
          add command to add the necessary shadcn components to your project:
        </p>
        <div data-rehype-pretty-code-fragment="">
          <CodeBlock
            className="mt-2"
            value={`npx shadcn-ui@latest add input\nnpx shadcn-ui@latest add button\nnpx shadcn-ui@latest add command\nnpx shadcn-ui@latest add toast\nnpx shadcn-ui@latest add popover`}
          />
        </div>
        <div className="w-full">
          <h3 className="font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight">
            Install the necessary dependencies:
          </h3>
          <p className="leading-7 [&amp;:not(:first-child)]:mt-6 text-normal">
            Run the following command to install the necessary dependencies for
            the tag input component:
          </p>
          <div data-rehype-pretty-code-fragment="">
            <CodeBlock className="mt-2" value={`pnpm i uuid react-easy-sort`} />
          </div>
        </div>
      </div>
      <div className="w-full">
        <h3 className="font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight pb-2">
          To use the tag input component:
        </h3>
        <ul className="list-decimal list-outside ml-5 marker:text-muted-foreground space-y-3 text-sm">
          {snippets.map((snippet) =>
            !snippet.file.includes("demo") ? (
              <li key={snippet.file}>
                Copy & paste{" "}
                <a
                  href={`#${snippet.file}`}
                  className="font-mono underline hover:no-underline"
                >
                  {snippet.file}
                </a>
              </li>
            ) : (
              <li key={snippet.file}>
                Define your <code>TagInput</code> component e.g.{" "}
                <a
                  href={`#${snippet.file}`}
                  className="font-mono underline hover:no-underline"
                >
                  {snippet.file}
                </a>
              </li>
            )
          )}
        </ul>
        <div className="mt-10 flex flex-col">
          <h3 className="font-heading mt-12 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
            Snippets
          </h3>
          <Accordion type="single" collapsible>
            {snippets.map((snippet) => (
              <AccordionItem key={snippet.slug} value={snippet.file}>
                <AccordionTrigger id={snippet.file}>
                  <code>{snippet.file}</code>
                </AccordionTrigger>
                <AccordionContent>
                  <Snippet snippet={snippet} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
