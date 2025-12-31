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
function AnimatedCounter({ value, label }: { value: number | string; label: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : 0;

  useEffect(() => {
    if (typeof value !== 'number') return;

    const duration = 1000;
    const steps = 30;
    const stepValue = numericValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= numericValue) {
        setDisplayValue(numericValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [numericValue, value]);

  return (
    <div className="stat-card">
      <div className="stat-value">
        {typeof value === 'number' ? displayValue.toLocaleString() : value}
      </div>
      <div className="stat-label">{label}</div>
    </div>
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
    <Layout>
      {/* Hero Section - Clean, light design */}
      <section className="hero-section">
        <div className="container-main">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="hero-title">
              Explore Open Data
            </h1>
            <p className="hero-subtitle">
              Discover, analyze, and download datasets from our open data portal.
              Find the data you need to power your research and applications.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto">
              <div className="search-container">
                <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for datasets..."
                  className="search-input-lg"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Topic filters */}
            {topics.length > 0 && (
              <div className="mt-8">
                <TopicFilters topics={topics} maxDisplay={6} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container-main py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <AnimatedCounter value={totalDatasets} label="Datasets" />
            <AnimatedCounter value={organizations.length} label="Organizations" />
            <AnimatedCounter value={topics.length} label="Topics" />
            <AnimatedCounter value="API" label="Available" />
          </div>
        </div>
      </section>

      {/* Recent Datasets */}
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="container-main py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recently Updated
            </h2>
            <Link
              href="/search"
              className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                No datasets yet
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Get started by creating your first dataset in the admin portal.
              </p>
              <Link href="/user/login" className="btn-primary mt-4">
                Go to Admin
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Organizations */}
      {organizations.length > 0 && (
        <section className="bg-white dark:bg-gray-800">
          <div className="container-main py-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Organizations
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {organizations.slice(0, 6).map((org) => (
                <Link
                  key={org.id}
                  href={`/search?org=${encodeURIComponent(org.name)}`}
                  className="card-interactive p-4 text-center"
                >
                  {org.image_url ? (
                    <img
                      src={org.image_url}
                      alt={org.title}
                      className="h-12 w-12 mx-auto object-contain"
                    />
                  ) : (
                    <div className="h-12 w-12 mx-auto bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">
                        {org.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <p className="mt-3 text-sm font-medium text-gray-900 dark:text-white truncate">
                    {org.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick Links / CTA */}
      <section className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="container-main py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* API Access */}
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">API Access</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Access datasets programmatically through our CKAN API.
              </p>
              <a
                href="/api/3/action/status_show"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
              >
                View API Documentation
              </a>
            </div>

            {/* Admin Portal */}
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Manage Data</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Create, edit, and manage datasets through the admin portal.
              </p>
              <Link
                href="/user/login"
                className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
              >
                Go to Admin Portal
              </Link>
            </div>

            {/* About */}
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">About</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Learn more about our open data initiative and how to contribute.
              </p>
              <Link
                href="/about"
                className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
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
