'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

export function LazyPreview({ children, eager = false }: { children: ReactNode; eager?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(eager);

  useEffect(() => {
    if (eager || shouldRender) return;

    const node = containerRef.current;
    if (!node || !('IntersectionObserver' in window)) {
      setShouldRender(true);
      return;
    }

    const reveal = () => {
      setShouldRender(true);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        reveal();
        observer.disconnect();
      },
      { rootMargin: '480px 0px' },
    );

    // WebKit can defer IntersectionObserver delivery after an imperative
    // scroll. Keep the same 480px threshold as a deterministic fallback.
    const revealWhenNearViewport = () => {
      const bounds = node.getBoundingClientRect();
      if (bounds.top > window.innerHeight + 480 || bounds.bottom < -480) return;
      reveal();
      observer.disconnect();
    };

    observer.observe(node);
    window.addEventListener('scroll', revealWhenNearViewport, { capture: true, passive: true });
    window.addEventListener('resize', revealWhenNearViewport, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', revealWhenNearViewport, true);
      window.removeEventListener('resize', revealWhenNearViewport);
    };
  }, [eager, shouldRender]);

  return (
    <div ref={containerRef} className="lazy-preview" data-rendered={shouldRender || undefined}>
      {shouldRender ? children : <div className="preview-placeholder" aria-hidden="true" />}
    </div>
  );
}
