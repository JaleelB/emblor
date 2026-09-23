import type { Metadata } from 'next';
import { PlaygroundCatalog } from '@/components/playground-catalog';
import { SiteHeader } from '@/components/site-header';
import { playgroundExamples } from '@/lib/playground-examples';
export const metadata: Metadata = {
  title: 'Playground',
  description: 'Live tag input examples. Preview, copy, and install compositions for your React app.',
};
export default function PlaygroundPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="playground-page">
        <section className="playground-intro">
          <p className="section-eyebrow">The playground</p>
          <h1>Find your next tag input.</h1>
          <p>
            Working examples for the way you build.
            <br />
            Try one, read the code, make it yours.
          </p>
        </section>
        <PlaygroundCatalog examples={playgroundExamples} />
      </main>
    </>
  );
}
