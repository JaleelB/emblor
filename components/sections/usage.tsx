import useClipboard from "@/hooks/use-copy";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import React from "react";
import { tagInputDemoCode } from "@/app/code-snippets";
import { Copy } from "lucide-react";

export default function Usage(){

    const { isCopied, copyToClipboard } = useClipboard();
    
    return (
        <section id="usage" className="max-w-5xl w-full py-8">
            <h2 className='font-heading mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0'>Usage</h2>
            <div className="w-full">
                <div className="relative w-full">
                    <Button 
                        className='absolute z-40 top-2 right-2 px-3 hover:bg-white/40'
                        variant='ghost'
                        onClick={async() =>{
                            await copyToClipboard(tagInputDemoCode);
                            if(isCopied){
                                toast({
                                    title: 'Copied to clipboard',
                                    description: 'The command has been copied to your clipboard.',
                                    variant: 'default'
                                });
                            }
                        }}
                    >
                        <Copy className="text-white/70 h-4 w-4"/>
                    </Button>
                    <pre className="relative mb-4 mt-6 max-h-[650px] overflow-y-auto rounded-lg border bg-zinc-950 p-8 dark:bg-zinc-900">
                        
                        <code className="relative w-full rounded bg-transparent text-white py-[0.2rem] font-mono text-sm px-4 max-h-[350px]">
                            {tagInputDemoCode.split('\n').map((line: string, index: number) => (
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