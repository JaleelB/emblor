import type { MDXComponents } from 'mdx/types';
import { Callout } from 'fumadocs-ui/components/callout';
import { Pre } from 'fumadocs-ui/components/codeblock';
import defaultMdxComponents from 'fumadocs-ui/mdx';

import { AnatomyBench } from '@/components/anatomy-bench';
import { CodeBlock as SiteCodeBlock } from '@/components/code-block';
import { DemoFrame } from '@/components/demo-frame';
import { FumadocsCodeBlock } from '@/components/fumadocs-code-block';
import { ResponsiveTable } from '@/components/responsive-table';
import { TagField } from '@/components/tag-field';
import { registryItems } from '@/registry/registry';

function DocsCallout({
  type = 'note',
  children,
}: {
  type?: 'note' | 'warning' | 'boundary';
  children: React.ReactNode;
}) {
  const calloutType = type === 'note' ? 'info' : type === 'boundary' ? 'idea' : 'warning';

  return (
    <Callout className="docs-callout" type={calloutType}>
      {children}
    </Callout>
  );
}

function RegistryCode({ name }: { name: string }) {
  const item = registryItems.find((candidate) => candidate.name === name);
  if (!item) throw new Error(`Unknown registry example: ${name}`);

  return <SiteCodeBlock value={item.files[0].content} title={`${item.name}.tsx`} label={`Copy ${item.title} source`} />;
}

export function getMDXComponents(components: MDXComponents = {}): MDXComponents {
  return {
    ...defaultMdxComponents,
    pre: (props) => (
      <FumadocsCodeBlock {...props}>
        <Pre>{props.children}</Pre>
      </FumadocsCodeBlock>
    ),
    table: ResponsiveTable,
    AnatomyBench,
    CodeBlock: SiteCodeBlock,
    DemoFrame,
    DocsCallout,
    RegistryCode,
    TagField,
    ...components,
  };
}
