import type { Metadata } from 'next';
import Link from 'next/link';
import { PlaygroundCatalog } from '@/components/playground-catalog';
import { SiteHeader } from '@/components/site-header';
import { siteConfig } from '@/config/site-config';
import { playgroundExamples } from '@/lib/playground-examples';
import { SpotlightRegistrator } from '@/lib/spotlight';

export const metadata: Metadata = {
  title: 'Playground',
  description: 'Live tag input examples. Preview, copy, and install compositions for your React app.',
};

export default function PlaygroundPage() {
  return (
    <div className="playground-shell">
      <SpotlightRegistrator />
      <SiteHeader />
      <main id="main-content" className="main">
        <section className="playground-hero container" aria-labelledby="playground-title">
          <div className="playground-hero-ambient" aria-hidden="true" />
          <div className="playground-hero-inner">
            <p className="section-eyebrow">The playground</p>
            <h1 id="playground-title">Find your next tag input.</h1>
            <p className="playground-hero-description">
              Working examples for the way you build. Try one, read the code, make it yours.
            </p>
          </div>
        </section>
        <PlaygroundCatalog examples={playgroundExamples} />
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
