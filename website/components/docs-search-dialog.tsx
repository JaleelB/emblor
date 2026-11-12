'use client';

import { Search } from 'lucide-react';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { Button } from '@/components/ui/button';

export function DocsSearchDialog() {
  const { setOpenSearch } = useSearchContext();
  return (
    <Button
      variant="outline"
      size="sm"
      className="search-trigger"
      aria-label="Search documentation"
      onClick={() => setOpenSearch(true)}
    >
      <Search data-icon="inline-start" />
      <span>Search docs</span>
      <kbd>Ctrl K</kbd>
    </Button>
  );
}
