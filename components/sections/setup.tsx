import React from "react";
import { tagInputCode } from "@/app/code-snippets";
import CodeBlock from "../code-block";

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
          Install necessary Shadcn components:
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
            value={`npx shadcn-ui@latest add input\nnpx shadcn-ui@latest add button\nnpx shadcn-ui@latest add command\nnpx shadcn-ui@latest add toast`}
          />
        </div>
      </div>
      <div className="w-full">
        <h3 className="font-heading mt-8 scroll-m-20 text-lg font-semibold tracking-tight">
          Create a new tag input component:
        </h3>
        <p className="leading-7 [&amp;:not(:first-child)]:mt-6 text-normal">
          Copy and paste the folowing code into a new file:
        </p>
        <CodeBlock value={tagInputCode} className="relative w-full mt-2" />
      </div>
    </section>
  );
}
