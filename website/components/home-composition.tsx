'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MarketingSpecimen } from '@/components/marketing-specimen';
import { Button } from '@/components/ui/button';

const ANATOMY_PARTS = [
  { id: 'root', name: '<EmblorRoot>', role: 'State & context' },
  { id: 'list', name: '<EmblorTagList>', role: 'Tag collection' },
  { id: 'tag', name: '<EmblorTag />', role: 'Roving focus item' },
  { id: 'input', name: '<EmblorInput />', role: 'Draft text input' },
] as const;

type PartId = (typeof ANATOMY_PARTS)[number]['id'];

export function HomeComposition() {
  const [activePart, setActivePart] = useState<PartId | null>(null);

  return (
    <section
      className="home-composition container"
      aria-labelledby="composition-title"
      data-highlight-part={activePart ?? undefined}
    >
      <div className="section-intro home-composition-intro">
        <p className="section-eyebrow">Compose your field</p>
        <h2 id="composition-title">
          The behavior is handled.
          <br />
          <span>The design is up to you.</span>
        </h2>
        <p>
          Start with a few small components. Add your classes, connect your state, and make it feel at home in your app.
        </p>
        <Button asChild variant="outline" data-spotlight>
          <Link href="/docs/anatomy">
            Explore the API
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>

        <ol className="composition-anatomy" aria-hidden="true" onMouseLeave={() => setActivePart(null)}>
          {ANATOMY_PARTS.map(({ id, name, role }, idx) => (
            <li
              key={id}
              data-depth={idx === 0 ? 0 : idx === 2 ? 2 : 1}
              data-active={activePart === id || undefined}
              onMouseEnter={() => setActivePart(id)}
            >
              <code>{name}</code>
              <span>{role}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="home-specimen-stage" data-spotlight>
        {activePart && (
          <div className="specimen-inspector-badge" aria-hidden="true">
            <span>Inspecting</span>
            <code>{ANATOMY_PARTS.find((p) => p.id === activePart)?.name}</code>
          </div>
        )}
        <MarketingSpecimen />
      </div>
    </section>
  );
}
