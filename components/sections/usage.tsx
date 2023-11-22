import React from "react";
import { tagInputDemoCode } from "@/app/code-snippets";
import CodeBlock from "../code-block";

export default function Usage() {
  return (
    <section id="usage" className="max-w-5xl w-full py-8">
      <h2 className="font-heading mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
        Usage
      </h2>
      <CodeBlock value={tagInputDemoCode} className="relative w-full" />
    </section>
  );
}
