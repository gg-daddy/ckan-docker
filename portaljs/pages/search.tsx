import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState, useCallback } from 'react';
import Layout from '@/components/Layout';
import FacetSidebar, { MobileFilterDrawer } from '@/components/search/FacetSidebar';
import DatasetListItem, { DatasetListItemSkeleton } from '@/components/search/DatasetListItem';
import {
  searchDatasetsWithFacets,
  getTagsWithCounts,
  getOrganizationsWithCounts,
  getFormatsWithCounts,
  CkanDataset,
  TagWithCount,
  OrganizationWithCount,
  FormatWithCount,
  FacetedSearchResult,
  SORT_OPTIONS,
  SortOption,
} from '@/lib/ckan';

interface SearchPageProps {
  datasets: CkanDataset[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  query: string;
  selectedTags: string[];
  selectedOrganizations: string[];
  selectedFormats: string[];
  sort: SortOption;
  tags: TagWithCount[];
  organizations: OrganizationWithCount[];
  formats: FormatWithCount[];
}

const ITEMS_PER_PAGE = 12;

export default function SearchPage({
  datasets,
  totalCount,
  currentPage,
  totalPages,
  query,
  selectedTags,
  selectedOrganizations,
  selectedFormats,
  sort,
  tags,
  organizations,
  formats,
}: SearchPageProps) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(query);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const hasActiveFilters = selectedTags.length > 0 || selectedOrganizations.length > 0 || selectedFormats.length > 0;
  const activeFilterCount = selectedTags.length + selectedOrganizations.length + selectedFormats.length;

  // Build URL with current filters
  const buildSearchUrl = useCallback((updates: Partial<{
    q: string;
    tags: string[];
    org: string[];
    format: string[];
    sort: SortOption;
    page: number;
  }>) => {
    const params = new URLSearchParams();

    const q = updates.q !== undefined ? updates.q : query;
    const t = updates.tags !== undefined ? updates.tags : selectedTags;
    const o = updates.org !== undefined ? updates.org : selectedOrganizations;
    const f = updates.format !== undefined ? updates.format : selectedFormats;
    const s = updates.sort !== undefined ? updates.sort : sort;
    const p = updates.page !== undefined ? updates.page : 1;

    if (q) params.set('q', q);
    if (t.length > 0) params.set('tags', t.join(','));
    if (o.length > 0) params.set('org', o.join(','));
    if (f.length > 0) params.set('format', f.join(','));
    if (s !== 'relevance') params.set('sort', s);
    if (p > 1) params.set('page', p.toString());

    return `/search${params.toString() ? `?${params.toString()}` : ''}`;
  }, [query, selectedTags, selectedOrganizations, selectedFormats, sort]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildSearchUrl({ q: searchInput, page: 1 }));
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    router.push(buildSearchUrl({ tags: newTags, page: 1 }));
  };

  const handleOrganizationToggle = (org: string) => {
    const newOrgs = selectedOrganizations.includes(org)
      ? selectedOrganizations.filter(o => o !== org)
      : [...selectedOrganizations, org];
    router.push(buildSearchUrl({ org: newOrgs, page: 1 }));
  };

  const handleFormatToggle = (format: string) => {
    const newFormats = selectedFormats.includes(format)
      ? selectedFormats.filter(f => f !== format)
      : [...selectedFormats, format];
    router.push(buildSearchUrl({ format: newFormats, page: 1 }));
  };

  const handleClearAll = () => {
    router.push(buildSearchUrl({ tags: [], org: [], format: [], page: 1 }));
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortOpen(false);
    router.push(buildSearchUrl({ sort: newSort, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    router.push(buildSearchUrl({ page }));
  };

  const currentSortLabel = SORT_OPTIONS.find(s => s.value === sort)?.label || 'Relevance';

  return (
    <Layout
      title="Search Datasets"
      description={`Search through ${totalCount} datasets`}
    >
      {/* Search header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container-main py-6">
          <form onSubmit={handleSearch} className="search-container max-w-2xl">
            <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search datasets..."
              className="search-input"
            />
          </form>
        </div>
      </div>

      {/* Main content */}
      <div className="container-main py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <FacetSidebar
              tags={tags}
              organizations={organizations}
              formats={formats}
              selectedTags={selectedTags}
              selectedOrganizations={selectedOrganizations}
              selectedFormats={selectedFormats}
              onTagToggle={handleTagToggle}
              onOrganizationToggle={handleOrganizationToggle}
              onFormatToggle={handleFormatToggle}
              onClearAll={handleClearAll}
            />
          </div>

          {/* Results section */}
          <div className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                {/* Mobile filter button */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden btn-secondary"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-1 bg-primary-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Results count */}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {totalCount > 0 ? (
                    <>
                      <span className="font-medium">{totalCount}</span> datasets
                      {query && (
                        <> for &quot;<span className="font-medium">{query}</span>&quot;</>
                      )}
                    </>
                  ) : (
                    <>No datasets found</>
                  )}
                </p>
              </div>

              {/* Sort dropdown */}
              <div className="dropdown">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="btn-secondary"
                >
                  <span>Sort: {currentSortLabel}</span>
                  <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {sortOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
                    <div className="dropdown-menu">
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleSortChange(option.value)}
                          className={sort === option.value ? 'dropdown-item-active w-full text-left' : 'dropdown-item w-full text-left'}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Applied filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedTags.map(tag => (
                  <span key={`tag-${tag}`} className="applied-filter">
                    {tag}
                    <button
                      onClick={() => handleTagToggle(tag)}
                      className="applied-filter-remove"
                      aria-label={`Remove ${tag} filter`}
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
                {selectedOrganizations.map(org => (
                  <span key={`org-${org}`} className="applied-filter">
                    {organizations.find(o => o.name === org)?.title || org}
                    <button
                      onClick={() => handleOrganizationToggle(org)}
                      className="applied-filter-remove"
                      aria-label={`Remove ${org} filter`}
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
                {selectedFormats.map(format => (
                  <span key={`format-${format}`} className="applied-filter">
                    {format}
                    <button
                      onClick={() => handleFormatToggle(format)}
                      className="applied-filter-remove"
                      aria-label={`Remove ${format} filter`}
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Results list */}
            {datasets.length > 0 ? (
              <div className="card divide-y divide-gray-100 dark:divide-gray-700">
                {datasets.map((dataset) => (
                  <DatasetListItem key={dataset.id} dataset={dataset} />
                ))}
              </div>
            ) : (
              <div className="card text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  No datasets found
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  {hasActiveFilters
                    ? 'Try removing some filters to see more results.'
                    : 'Try adjusting your search terms.'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearAll}
                    className="mt-4 btn-primary"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="mt-6 flex justify-center">
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={
                      currentPage === 1
                        ? 'pagination-btn-disabled'
                        : 'pagination-btn'
                    }
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={
                          currentPage === pageNum
                            ? 'pagination-btn-active'
                            : 'pagination-btn'
                        }
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={
                      currentPage === totalPages
                        ? 'pagination-btn-disabled'
                        : 'pagination-btn'
                    }
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </nav>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <MobileFilterDrawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        tags={tags}
        organizations={organizations}
        formats={formats}
        selectedTags={selectedTags}
        selectedOrganizations={selectedOrganizations}
        selectedFormats={selectedFormats}
        onTagToggle={handleTagToggle}
        onOrganizationToggle={handleOrganizationToggle}
        onFormatToggle={handleFormatToggle}
        onClearAll={handleClearAll}
      />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<SearchPageProps> = async ({
  query,
}) => {
  const searchQuery = (query.q as string) || '';
  const page = parseInt(query.page as string) || 1;
  const sort = (query.sort as SortOption) || 'relevance';

  // Parse filter arrays from comma-separated strings
  const selectedTags = query.tags ? (query.tags as string).split(',').filter(Boolean) : [];
  const selectedOrganizations = query.org ? (query.org as string).split(',').filter(Boolean) : [];
  const selectedFormats = query.format ? (query.format as string).split(',').filter(Boolean) : [];

  try {
    // Fetch search results and facet data in parallel
    const [searchResult, tags, organizations, formats] = await Promise.all([
      searchDatasetsWithFacets({
        q: searchQuery,
        tags: selectedTags,
        organization: selectedOrganizations,
        format: selectedFormats,
        sort,
        page,
        pageSize: ITEMS_PER_PAGE,
      }),
      getTagsWithCounts(),
      getOrganizationsWithCounts(),
      getFormatsWithCounts(),
    ]);

    return {
      props: {
        datasets: searchResult.results,
        totalCount: searchResult.count,
        currentPage: page,
        totalPages: searchResult.totalPages,
        query: searchQuery,
        selectedTags,
        selectedOrganizations,
        selectedFormats,
        sort,
        tags,
        organizations,
        formats,
      },
    };
  } catch (error) {
    console.error('Error searching datasets:', error);
    return {
      props: {
        datasets: [],
        totalCount: 0,
        currentPage: 1,
        totalPages: 0,
        query: searchQuery,
        selectedTags,
        selectedOrganizations,
        selectedFormats,
        sort,
        tags: [],
        organizations: [],
        formats: [],
      },
    };
  }
};
