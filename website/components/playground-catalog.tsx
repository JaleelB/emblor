'use client';
import { ArrowRight, ArrowUpRight, Maximize2, Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { FocusedPreviewDialog } from '@/components/focused-preview-dialog';
import { InstallSheet } from '@/components/install-sheet';
import { LazyPreview } from '@/components/lazy-preview';
import { playgroundPreviews, type PlaygroundExample } from '@/components/playground-examples';
import { PreviewTabs } from '@/components/preview-tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const categories = [
  ['all', 'All examples'],
  ['essentials', 'Essentials'],
  ['behavior', 'Behavior & accessibility'],
  ['forms', 'Forms'],
  ['integrations', 'Integrations'],
] as const;

const examplePaths = [
  ['Starting from scratch', 'Basic compound field', 'tag-input-basic'],
  ['Owning application state', 'Controlled state', 'tag-input-controlled'],
  ['Using a form library', 'React Hook Form + Zod', 'tag-input-react-hook-form'],
  ['Adding suggestions', 'Command + Popover', 'tag-input-popover'],
  ['Handling limits and paste', 'Limits and bulk entry', 'tag-input-constraints'],
  ['Changing tag order', 'Drag to reorder', 'tag-input-reorder'],
] as const;

const subscribeToHydration = () => () => undefined;

export function PlaygroundCatalog({ examples, initialSlug }: { examples: PlaygroundExample[]; initialSlug?: string }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [selected, setSelected] = useState<PlaygroundExample | null>(null);
  const [focused, setFocused] = useState<PlaygroundExample | null>(null);
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const installButtonRef = useRef<HTMLButtonElement | null>(null);
  const deepLinked = initialSlug ? examples.find((example) => example.slug === initialSlug) : undefined;
  const visibleExamples = useMemo(() => {
    const source = deepLinked ? [deepLinked] : examples;
    const search = query.toLowerCase().trim();
    return source.filter(
      (example) =>
        (category === 'all' || example.category === category) &&
        (example.title + ' ' + example.description + ' ' + example.tags.join(' ')).toLowerCase().includes(search),
    );
  }, [category, deepLinked, examples, query]);

  return (
    <div className="playground-catalog" data-hydrated={hydrated || undefined}>
      {!deepLinked && (
        <>
          <section className="example-chooser" aria-labelledby="example-chooser-title">
            <div className="example-chooser-heading">
              <p className="section-eyebrow">Choose by task</p>
              <h2 id="example-chooser-title">Start with the example closest to your product.</h2>
              <p>Each path opens runnable code you can inspect and install.</p>
            </div>
            <div className="example-chooser-grid">
              {examplePaths.map(([need, title, slug]) => (
                <Card key={slug} className="example-choice-card">
                  <CardHeader>
                    <CardDescription>{need}</CardDescription>
                    <CardTitle>{title}</CardTitle>
                  </CardHeader>
                  <CardFooter>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/playground/${slug}`}>
                        Open example
                        <ArrowRight data-icon="inline-end" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
          <div className="catalog-filters">
            <label className="catalog-search">
              <Search aria-hidden="true" />
              <span className="sr-only">Search examples</span>
              <input
                type="search"
                placeholder="Search examples…"
                disabled={!hydrated}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <ToggleGroup
              type="single"
              value={category}
              onValueChange={(value) => {
                if (value) setCategory(value);
              }}
              variant="outline"
              size="sm"
              spacing={1}
              disabled={!hydrated}
              tabIndex={0}
              aria-label="Playground categories"
            >
              {categories.map(([value, label]) => (
                <ToggleGroupItem key={value} value={value}>
                  {label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <p className="catalog-count">{visibleExamples.length} examples</p>
          </div>
        </>
      )}
      <div className={deepLinked ? 'example-grid example-grid-single' : 'example-grid'}>
        {visibleExamples.map((example, index) => {
          const Preview = playgroundPreviews[example.slug];
          return (
            <section className="catalog-example" id={example.slug} key={example.slug} aria-label={example.title}>
              <div className="example-heading">
                {deepLinked ? <h1>{example.title}</h1> : <h2>{example.title}</h2>}
                <p>{example.description}</p>
                <div className="example-tags" aria-label="Example topics">
                  {example.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
                {deepLinked ? (
                  <dl className="example-requirements">
                    <div>
                      <dt>Dependencies</dt>
                      <dd>
                        {example.dependencies.map((dependency) => (
                          <code key={dependency}>{dependency}</code>
                        ))}
                      </dd>
                    </div>
                    {example.registryDependencies.length ? (
                      <div>
                        <dt>shadcn</dt>
                        <dd>
                          {example.registryDependencies.map((dependency) => (
                            <code key={dependency}>{dependency}</code>
                          ))}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                ) : null}
              </div>
              <PreviewTabs
                label={example.title}
                filename={example.slug + '.tsx'}
                rawCode={example.code}
                preview={
                  <LazyPreview eager={Boolean(deepLinked) || index === 0}>
                    <div className="example-field">{Preview ? <Preview /> : <p>Preview unavailable.</p>}</div>
                  </LazyPreview>
                }
                actions={
                  <>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Focus ${example.title} preview`}
                      disabled={!hydrated}
                      onClick={() => setFocused(example)}
                    >
                      <Maximize2 />
                    </Button>
                    {!deepLinked && (
                      <Button asChild variant="ghost" size="icon-sm">
                        <Link href={'/playground/' + example.slug} aria-label={'Open ' + example.title + ' detail'}>
                          <ArrowUpRight />
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!hydrated}
                      onClick={(event) => {
                        installButtonRef.current = event.currentTarget;
                        setSelected(example);
                      }}
                    >
                      Install
                    </Button>
                  </>
                }
              />
            </section>
          );
        })}
      </div>
      {!visibleExamples.length && (
        <div className="catalog-empty">
          <h2>No examples found</h2>
          <p>Try another search or browse all examples.</p>
          <Button
            variant="outline"
            onClick={() => {
              setQuery('');
              setCategory('all');
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
      <InstallSheet
        example={selected}
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        returnFocusRef={installButtonRef}
      />
      <FocusedPreviewDialog
        example={focused}
        open={Boolean(focused)}
        onOpenChange={(open) => {
          if (!open) setFocused(null);
        }}
      />
    </div>
  );
}
