'use client';

import { useDocsSearch } from 'fumadocs-core/search/client';
import { fetchClient } from 'fumadocs-core/search/client/fetch';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';

export function FumadocsSearchDialog(props: SharedProps) {
  const { search, setSearch, query } = useDocsSearch({ client: fetchClient() });
  const emptyMessage = query.isLoading
    ? 'Searching documentation…'
    : search.trim()
      ? `No results for “${search.trim()}”. Try a component, prop, or guide name.`
      : 'Search pages, headings, props, and examples.';

  return (
    <SearchDialog {...props} search={search} onSearchChange={setSearch} isLoading={query.isLoading}>
      <SearchDialogOverlay className="fumadocs-search-overlay" />
      <SearchDialogContent className="fumadocs-search-dialog">
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput aria-label="Search documentation" />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList
          items={query.data !== 'empty' ? query.data : null}
          Empty={() => <p className="search-empty-state">{emptyMessage}</p>}
        />
      </SearchDialogContent>
    </SearchDialog>
  );
}
