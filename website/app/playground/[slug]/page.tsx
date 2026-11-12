import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PlaygroundCatalog } from '@/components/playground-catalog';
import { SiteHeader } from '@/components/site-header';
import { siteConfig } from '@/config/site-config';
import { getPlaygroundExample, playgroundExamples } from '@/lib/playground-examples';
import { SpotlightRegistrator } from '@/lib/spotlight';

export function generateStaticParams() {
  return playgroundExamples.map((item) => ({ slug: item.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getPlaygroundExample(slug);
  return { title: item?.title ?? 'Example' };
}
export default function PlaygroundExamplePage({ params }: { params: Promise<{ slug: string }> }) {
  return <PlaygroundExampleContent params={params} />;
}

async function PlaygroundExampleContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getPlaygroundExample(slug);
  if (!item) notFound();
  return (
    <div className="playground-shell">
      <SpotlightRegistrator />
      <SiteHeader />
      <main id="main-content" className="main example-detail">
        <div className="example-detail-nav container">
          <Link href="/playground" className="back-link">
            <ArrowLeft aria-hidden="true" />
            All examples
          </Link>
        </div>
        <PlaygroundCatalog examples={playgroundExamples} initialSlug={slug} />
        <footer className="site-footer container">
          <p>
            Emblor <span>by {siteConfig.author}</span>
          </p>
          <nav aria-label="Footer navigation">
            <Link href="/docs/guides/migration">Migration</Link>
            <a href={siteConfig.links.npm}>npm</a>
            <a href={siteConfig.links.github}>GitHub</a>
          </nav>
        </footer>
      </main>
    </div>
  );
}
