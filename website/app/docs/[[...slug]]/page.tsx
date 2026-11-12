import { notFound, redirect } from 'next/navigation';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { DocsBody, DocsDescription, DocsPage as DocsPageLayout, DocsTitle } from 'fumadocs-ui/page';

import { getMDXComponents } from '@/mdx-components';
import { source } from '@/lib/source';

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const page = source.getPage(slug ?? []);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}

export default async function DocsPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;

  if (!slug?.length) redirect('/docs/introduction');
  if (slug.length === 1 && slug[0] === 'guides') redirect('/docs/guides/styling');
  if (slug.length === 1 && slug[0] === 'reference') redirect('/docs/reference/api');

  const page = source.getPage(slug ?? []);

  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPageLayout
      toc={page.data.toc}
      breadcrumb={{ enabled: false }}
      tableOfContent={{ container: { role: 'navigation', 'aria-label': 'On this page' } }}
    >
      <span id="main-content" className="docs-content-anchor" tabIndex={-1} />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPageLayout>
  );
}
