import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useCallback, useRef, useEffect } from 'react';
import Layout from '@/components/Layout';
import { MobileFilterDrawer } from '@/components/search/FacetSidebar';
import DatasetListItem, { DatasetListItemSkeleton } from '@/components/search/DatasetListItem';
import ResourceBadge from '@/components/ResourceBadge';
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

// Filter dropdown component
function FilterDropdown({
  label,
  options,
  selectedValues,
  onToggle,
  countKey = 'count',
}: {
  label: string;
  options: { name: string; display_name?: string; title?: string; count: number }[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  countKey?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCount = selectedValues.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
          selectedCount > 0
            ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        <span>{label}</span>
        {selectedCount > 0 && (
          <span className="bg-primary-600 text-white text-xs px-1.5 py-0.5 rounded-full">
            {selectedCount}
          </span>
        )}
        <svg className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 max-h-72 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-2">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                No options available
              </div>
            ) : (
              options.map((option) => {
                const displayName = option.display_name || option.title || option.name;
                const isSelected = selectedValues.includes(option.name);

                return (
                  <button
                    key={option.name}
                    onClick={() => {
                      onToggle(option.name);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-left transition-colors ${
                      isSelected
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? 'bg-primary-600 border-primary-600'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {isSelected && (
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="flex-1 truncate">{displayName}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{option.count}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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
  const [selectedDataset, setSelectedDataset] = useState<CkanDataset | null>(null);

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
      {/* Page Header */}
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container-main py-8">
          {/* Breadcrumb */}
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                  Home
                </Link>
              </li>
              <li className="flex items-center">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="ml-2 text-gray-900 dark:text-white font-medium">Datasets</span>
              </li>
            </ol>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Datasets
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore and download open data from our portal
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="mt-6 max-w-2xl">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search datasets by name, description, or tags..."
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="sticky top-16 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="container-main py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left: Filters */}
            <div className="flex items-center gap-2">
              {/* Mobile filter button */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-primary-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Desktop filter dropdowns */}
              <div className="hidden lg:flex items-center gap-2">
                <FilterDropdown
                  label="Topic"
                  options={tags}
                  selectedValues={selectedTags}
                  onToggle={handleTagToggle}
                />
                <FilterDropdown
                  label="Organization"
                  options={organizations}
                  selectedValues={selectedOrganizations}
                  onToggle={handleOrganizationToggle}
                />
                <FilterDropdown
                  label="Format"
                  options={formats}
                  selectedValues={selectedFormats}
                  onToggle={handleFormatToggle}
                />
              </div>

              {/* Clear all */}
              {hasActiveFilters && (
                <button
                  onClick={handleClearAll}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium whitespace-nowrap"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Right: Results count and sort */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                <span className="font-semibold text-gray-900 dark:text-white">{totalCount}</span> datasets
              </span>

              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <span>Sort: {currentSortLabel}</span>
                  <svg className={`h-4 w-4 transition-transform ${sortOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {sortOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                      <div className="p-1">
                        {SORT_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleSortChange(option.value)}
                            className={`w-full px-3 py-2 text-sm text-left rounded-md transition-colors ${
                              sort === option.value
                                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Applied filters tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedTags.map(tag => (
                <span key={`tag-${tag}`} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                  {tag}
                  <button
                    onClick={() => handleTagToggle(tag)}
                    className="hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full p-0.5 transition-colors"
                    aria-label={`Remove ${tag} filter`}
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
              {selectedOrganizations.map(org => (
                <span key={`org-${org}`} className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
                  {organizations.find(o => o.name === org)?.title || org}
                  <button
                    onClick={() => handleOrganizationToggle(org)}
                    className="hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5 transition-colors"
                    aria-label={`Remove ${org} filter`}
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
              {selectedFormats.map(format => (
                <span key={`format-${format}`} className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm">
                  {format}
                  <button
                    onClick={() => handleFormatToggle(format)}
                    className="hover:bg-orange-200 dark:hover:bg-orange-800 rounded-full p-0.5 transition-colors"
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
        </div>
      </div>

      {/* Results */}
      <div className="bg-gray-50 dark:bg-gray-900 min-h-[50vh]">
        <div className="container-main py-6">
          {datasets.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
              {datasets.map((dataset) => (
                <DatasetListItem key={dataset.id} dataset={dataset} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center py-16">
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
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                No datasets found
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                {hasActiveFilters
                  ? 'Try removing some filters or adjusting your search.'
                  : query
                  ? 'Try different keywords or browse all datasets.'
                  : 'No datasets are available at this time.'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleClearAll}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-6 flex justify-center">
              <div className="inline-flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md transition-colors ${
                    currentPage === 1
                      ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                      className={`min-w-[40px] py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                        currentPage === pageNum
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md transition-colors ${
                    currentPage === totalPages
                      ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </nav>
          )}
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
