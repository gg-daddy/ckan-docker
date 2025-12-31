import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import DatasetCard from '@/components/DatasetCard';
import TopicFilters from '@/components/home/TopicFilters';
import {
  searchDatasets,
  getOrganizations,
  getTagsWithCounts,
  CkanDataset,
  CkanOrganization,
  TagWithCount,
} from '@/lib/ckan';

interface HomePageProps {
  recentDatasets: CkanDataset[];
  organizations: CkanOrganization[];
  totalDatasets: number;
  topics: TagWithCount[];
}

// Animated counter component
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const stepValue = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {displayValue.toLocaleString()}{suffix}
    </span>
  );
}

export default function HomePage({
  recentDatasets,
  organizations,
  totalDatasets,
  topics,
}: HomePageProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/search');
    }
  };

  return (
    <Layout hideHeaderSearch>
      {/* Hero Section - data.gov.sg style */}
      <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container-main py-16 sm:py-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Two-line hero title like data.gov.sg */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Real Data for
              <br />
              <span className="text-primary-600 dark:text-primary-400">Real Impact</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover, analyze, and download open datasets to power your research, applications, and decision-making.
            </p>

            {/* Search bar - Prominent, centered */}
            <form onSubmit={handleSearch} className="mt-10 max-w-2xl mx-auto">
              <div className="relative">
                <svg
                  className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for datasets, topics, or keywords..."
                  className="w-full pl-14 pr-32 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-lg"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-full transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Topic filters - Colored pills */}
            {topics.length > 0 && (
              <div className="mt-10">
                <TopicFilters topics={topics} maxDisplay={6} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section - data.gov.sg style with large numbers */}
      <section className="bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
        <div className="container-main py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-primary-600 dark:text-primary-400">
                <AnimatedCounter value={totalDatasets} suffix="+" />
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
                Datasets Available
              </div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-green-600 dark:text-green-400">
                <AnimatedCounter value={organizations.length} />
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
                Organizations
              </div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-orange-600 dark:text-orange-400">
                <AnimatedCounter value={topics.length} />
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
                Topics
              </div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-purple-600 dark:text-purple-400">
                API
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
                Available
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section - data.gov.sg style */}
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="container-main py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* View API Card */}
            <Link
              href="/api/3/action/status_show"
              target="_blank"
              className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                  <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    View APIs
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Access datasets programmatically through our CKAN API.
                  </p>
                </div>
              </div>
              <div className="absolute top-6 right-6 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Open Data License Card */}
            <Link
              href="/about"
              className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    Open Data License
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Learn about how you can use and share our open data.
                  </p>
                </div>
              </div>
              <div className="absolute top-6 right-6 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Feedback Card */}
            <Link
              href="/feedback"
              className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                  <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    Give Feedback
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Share your thoughts and help us improve our portal.
                  </p>
                </div>
              </div>
              <div className="absolute top-6 right-6 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Most Used Datasets Section */}
      <section className="bg-white dark:bg-gray-800">
        <div className="container-main py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Recently Updated
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Explore our latest datasets
              </p>
            </div>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              View all datasets
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl text-center py-16 px-6">
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
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                No datasets yet
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Get started by creating your first dataset in the admin portal.
              </p>
              <Link
                href="/user/login"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
              >
                Go to Admin
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Organizations Section */}
      {organizations.length > 0 && (
        <section className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="container-main py-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Organizations
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Explore datasets by organization
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {organizations.slice(0, 6).map((org) => (
                <Link
                  key={org.id}
                  href={`/search?org=${encodeURIComponent(org.name)}`}
                  className="group bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200 text-center"
                >
                  {org.image_url ? (
                    <img
                      src={org.image_url}
                      alt={org.title}
                      className="h-14 w-14 mx-auto object-contain"
                    />
                  ) : (
                    <div className="h-14 w-14 mx-auto bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-full flex items-center justify-center group-hover:from-primary-200 group-hover:to-primary-300 dark:group-hover:from-primary-900/50 dark:group-hover:to-primary-800/50 transition-colors">
                      <span className="text-primary-600 dark:text-primary-400 font-bold text-xl">
                        {org.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <p className="mt-4 text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 truncate transition-colors">
                    {org.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
  try {
    const [searchResult, organizations, topics] = await Promise.all([
      searchDatasets({ rows: 6, sort: 'metadata_modified desc' }),
      getOrganizations(),
      getTagsWithCounts(),
    ]);

    return {
      props: {
        recentDatasets: searchResult.results,
        organizations,
        totalDatasets: searchResult.count,
        topics,
      },
    };
  } catch (error) {
    console.error('Error fetching data for home page:', error);
    return {
      props: {
        recentDatasets: [],
        organizations: [],
        totalDatasets: 0,
        topics: [],
      },
    };
  }
};
