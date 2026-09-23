import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PlaygroundCatalog } from '@/components/playground-catalog';
import { SiteHeader } from '@/components/site-header';
import { getPlaygroundExample, playgroundExamples } from '@/lib/playground-examples';

export function generateStaticParams() {
  return playgroundExamples.map((item) => ({ slug: item.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getPlaygroundExample(slug);
  return { title: item?.title ?? 'Example' };
}
export default async function PlaygroundExamplePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getPlaygroundExample(slug);
  if (!item) notFound();
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="playground-page example-detail">
        <Link href="/playground" className="back-link">
          ← All examples
        </Link>
        <PlaygroundCatalog examples={playgroundExamples} initialSlug={slug} />
      </main>
    </>
  );
}
