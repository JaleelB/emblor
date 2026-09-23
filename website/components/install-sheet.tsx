'use client';
import type { RefObject } from 'react';
import Link from 'next/link';
import { CodeBlock } from '@/components/code-block';
import type { PlaygroundExample } from '@/components/playground-examples';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { siteConfig } from '@/config/site-config';

export function InstallSheet({
  example,
  open,
  onOpenChange,
  returnFocusRef,
}: {
  example: PlaygroundExample | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
}) {
  if (!example) return null;
  const registryURL = siteConfig.url + '/r/' + example.slug + '.json';
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="installation-sheet w-full sm:max-w-xl"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          returnFocusRef.current?.focus();
        }}
      >
        <SheetHeader className="px-7 pt-8 pb-6 pr-14">
          <p className="section-eyebrow">Add to your project</p>
          <SheetTitle>{example.title}</SheetTitle>
          <SheetDescription>
            Copy this example into your app with the shadcn CLI. The source is yours to customize.
          </SheetDescription>
        </SheetHeader>
        <div className="installation-body">
          <section>
            <h3>Install the example</h3>
            <p>Run this in a project configured for shadcn/ui. The CLI adds the source and its dependencies.</p>
            <CodeBlock title="Terminal" language="bash" value={'pnpm dlx shadcn@latest add ' + registryURL} />
          </section>
          <section>
            <h3>Using the @emblor namespace?</h3>
            <p>
              Add the registry to your existing <code>components.json</code>.
            </p>
            <CodeBlock
              title="components.json"
              language="json"
              value={JSON.stringify({ registries: { '@emblor': siteConfig.url + '/r/{name}.json' } }, null, 2)}
            />
            <CodeBlock title="Terminal" language="bash" value={'pnpm dlx shadcn@latest add @emblor/' + example.slug} />
          </section>
          <section>
            <h3>Prefer to copy the source?</h3>
            <p>Install the dependencies, then copy the complete example from the Code tab.</p>
            <CodeBlock title="Terminal" language="bash" value={'pnpm add ' + example.dependencies.join(' ')} />
            {example.registryDependencies.length ? (
              <CodeBlock
                title="shadcn components"
                language="bash"
                value={'pnpm dlx shadcn@latest add ' + example.registryDependencies.join(' ')}
              />
            ) : null}
          </section>
          <Link className="inline-doc-link" href="/docs/installation">
            Read the installation guide →
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
