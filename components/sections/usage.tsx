import useClipboard from "@/hooks/use-copy";
import { Button } from "../ui/button";
import { TagInputDemoSnippet } from "@/codeSnippets";
import { toast } from "../ui/use-toast";
import React from "react";

export default function Usage(){

    const { isCopied, copyToClipboard } = useClipboard();

    return (
        <section id="usage" className="max-w-5xl w-full py-8">
            <h2 className='font-heading mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0'>Usage</h2>
            <div className="w-full">
                <div data-rehype-pretty-code-fragment="">
                    <pre className="relative mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900">
                        <Button 
                            className='absolute top-2 right-2 px-3 hover:bg-white/40'
                            variant='ghost'
                            onClick={async() =>{
                                await copyToClipboard(TagInputDemoSnippet);
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
    )
}