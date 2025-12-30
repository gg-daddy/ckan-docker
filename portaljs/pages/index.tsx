import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout';
import DatasetCard from '@/components/DatasetCard';
import SearchBar from '@/components/SearchBar';
import { searchDatasets, getOrganizations, CkanDataset, CkanOrganization } from '@/lib/ckan';

interface HomePageProps {
  recentDatasets: CkanDataset[];
  organizations: CkanOrganization[];
  totalDatasets: number;
}

export default function HomePage({
  recentDatasets,
  organizations,
  totalDatasets,
}: HomePageProps) {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-main py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Discover Open Data
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Explore datasets from our open data portal. Find, analyze, and download
              data to power your research and applications.
            </p>
            <SearchBar
              placeholder="Search for datasets..."
              className="max-w-xl"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="container-main py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">
                {totalDatasets}
              </div>
              <div className="text-sm text-gray-600 mt-1">Datasets</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">
                {organizations.length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Organizations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">Open</div>
              <div className="text-sm text-gray-600 mt-1">Data Access</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">API</div>
              <div className="text-sm text-gray-600 mt-1">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Datasets */}
      <section className="bg-gray-50">
        <div className="container-main py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Recent Datasets</h2>
            <Link href="/search" className="btn-secondary">
              View All
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {recentDatasets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentDatasets.map((dataset) => (
                <DatasetCard key={dataset.id} dataset={dataset} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No datasets yet
              </h3>
              <p className="mt-2 text-gray-500">
                Get started by creating your first dataset in the admin portal.
              </p>
              <Link href="/ckan-admin/" className="btn-primary mt-4">
                Go to Admin
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Organizations */}
      {organizations.length > 0 && (
        <section className="bg-white">
          <div className="container-main py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Organizations
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {organizations.slice(0, 6).map((org) => (
                <Link
                  key={org.id}
                  href={`/search?fq=organization:${org.name}`}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center"
                >
                  {org.image_url ? (
                    <img
                      src={org.image_url}
                      alt={org.title}
                      className="h-12 w-12 mx-auto object-contain"
                    />
                  ) : (
                    <div className="h-12 w-12 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold text-lg">
                        {org.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <p className="mt-2 text-sm font-medium text-gray-900 truncate">
                    {org.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-primary-50">
        <div className="container-main py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Need to manage data?
            </h2>
            <p className="mt-2 text-gray-600">
              Use the CKAN admin portal to create, edit, and manage datasets.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Link href="/ckan-admin/" className="btn-primary">
                Admin Portal
              </Link>
              <a
                href="/api/3/action/status_show"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                API Status
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
  try {
    const [searchResult, organizations] = await Promise.all([
      searchDatasets({ rows: 6, sort: 'metadata_modified desc' }),
      getOrganizations(),
    ]);

    return {
      props: {
        recentDatasets: searchResult.results,
        organizations,
        totalDatasets: searchResult.count,
      },
    };
  } catch (error) {
    console.error('Error fetching data for home page:', error);
    return {
      props: {
        recentDatasets: [],
        organizations: [],
        totalDatasets: 0,
      },
    };
  }
};
