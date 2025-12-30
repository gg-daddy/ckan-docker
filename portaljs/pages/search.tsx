import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import DatasetCard from '@/components/DatasetCard';
import SearchBar from '@/components/SearchBar';
import { searchDatasets, CkanDataset } from '@/lib/ckan';

interface SearchPageProps {
  datasets: CkanDataset[];
  totalCount: number;
  currentPage: number;
  query: string;
}

const ITEMS_PER_PAGE = 12;

export default function SearchPage({
  datasets,
  totalCount,
  currentPage,
  query,
}: SearchPageProps) {
  const router = useRouter();
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    params.set('page', page.toString());
    router.push(`/search?${params.toString()}`);
  };

  return (
    <Layout
      title="Search Datasets"
      description={`Search through ${totalCount} datasets`}
    >
      <div className="bg-white border-b border-gray-200">
        <div className="container-main py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Search Datasets
          </h1>
          <SearchBar
            initialQuery={query}
            placeholder="Search by keyword, title, or description..."
            className="max-w-2xl"
          />
        </div>
      </div>

      <div className="container-main py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">
            {totalCount > 0 ? (
              <>
                Showing{' '}
                <span className="font-medium">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)}
                </span>{' '}
                of <span className="font-medium">{totalCount}</span> results
                {query && (
                  <>
                    {' '}
                    for &quot;<span className="font-medium">{query}</span>&quot;
                  </>
                )}
              </>
            ) : (
              <>No results found{query && <> for &quot;{query}&quot;</>}</>
            )}
          </p>
        </div>

        {/* Results Grid */}
        {datasets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {datasets.map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
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
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No datasets found
            </h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search terms or browse all datasets.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-8 flex justify-center">
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
                Previous
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
                Next
              </button>
            </div>
          </nav>
        )}
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<SearchPageProps> = async ({
  query,
}) => {
  const searchQuery = (query.q as string) || '';
  const page = parseInt(query.page as string) || 1;
  const fq = query.fq as string;

  try {
    const result = await searchDatasets({
      q: searchQuery,
      rows: ITEMS_PER_PAGE,
      start: (page - 1) * ITEMS_PER_PAGE,
      fq,
      sort: 'metadata_modified desc',
    });

    return {
      props: {
        datasets: result.results,
        totalCount: result.count,
        currentPage: page,
        query: searchQuery,
      },
    };
  } catch (error) {
    console.error('Error searching datasets:', error);
    return {
      props: {
        datasets: [],
        totalCount: 0,
        currentPage: 1,
        query: searchQuery,
      },
    };
  }
};
