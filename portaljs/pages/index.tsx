import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DatasetCard from '@/components/DatasetCard';
import TopicFilters from '@/components/home/TopicFilters';
import {
  ThaiGovLayout,
  useThaiLanguage,
  formatThaiNumber,
  AgencyAvatar,
} from '@/components/thailand';
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

// Bilingual text helper type
type BilingualText = { th: string; en: string };

// Animated counter component with Thai numeral support
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const { lang } = useThaiLanguage();
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
      {formatThaiNumber(displayValue, lang)}{suffix}
    </span>
  );
}

// Homepage content component (uses language context)
function HomePageContent({
  recentDatasets,
  organizations,
  totalDatasets,
  topics,
}: HomePageProps) {
  const { lang, t } = useThaiLanguage();
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

  // Bilingual content
  const content = {
    heroTitle1: { th: 'ศูนย์ข้อมูลเปิด', en: 'Open Government' },
    heroTitle2: { th: 'ภาครัฐ', en: 'Data' },
    heroSubtitle: {
      th: 'ค้นหาและเข้าถึงข้อมูลจากหน่วยงานภาครัฐของประเทศไทย เพื่อสนับสนุนการวิจัย การพัฒนา และความโปร่งใสของภาครัฐ',
      en: 'Discover, analyze, and download open datasets to power your research, applications, and decision-making.',
    },
    searchPlaceholder: {
      th: 'ค้นหาชุดข้อมูล หัวข้อ หรือหน่วยงาน...',
      en: 'Search for datasets, topics, or keywords...',
    },
    searchButton: { th: 'ค้นหา', en: 'Search' },
    statsDatasets: { th: 'ชุดข้อมูล', en: 'Datasets Available' },
    statsOrganizations: { th: 'หน่วยงาน', en: 'Agencies' },
    statsTopics: { th: 'หัวข้อ', en: 'Topics' },
    statsApi: { th: 'API พร้อมใช้งาน', en: 'API Available' },
    viewApis: { th: 'ดู APIs', en: 'View APIs' },
    viewApisDesc: {
      th: 'เข้าถึงชุดข้อมูลผ่าน CKAN API ของเรา',
      en: 'Access datasets programmatically through our CKAN API.',
    },
    openDataLicense: { th: 'สัญญาอนุญาตข้อมูลเปิด', en: 'Open Data License' },
    openDataLicenseDesc: {
      th: 'เรียนรู้วิธีการใช้งานและแบ่งปันข้อมูลเปิดของเรา',
      en: 'Learn about how you can use and share our open data.',
    },
    giveFeedback: { th: 'ให้ข้อเสนอแนะ', en: 'Give Feedback' },
    giveFeedbackDesc: {
      th: 'แบ่งปันความคิดเห็นและช่วยเราปรับปรุงพอร์ทัล',
      en: 'Share your thoughts and help us improve our portal.',
    },
    recentlyUpdated: { th: 'อัปเดตล่าสุด', en: 'Recently Updated' },
    recentlyUpdatedDesc: { th: 'สำรวจชุดข้อมูลล่าสุดของเรา', en: 'Explore our latest datasets' },
    viewAllDatasets: { th: 'ดูชุดข้อมูลทั้งหมด', en: 'View all datasets' },
    noDatasets: { th: 'ยังไม่มีชุดข้อมูล', en: 'No datasets yet' },
    noDatasetsDesc: {
      th: 'เริ่มต้นโดยการสร้างชุดข้อมูลแรกของคุณในพอร์ทัลผู้ดูแลระบบ',
      en: 'Get started by creating your first dataset in the admin portal.',
    },
    goToAdmin: { th: 'ไปที่หน้าผู้ดูแลระบบ', en: 'Go to Admin' },
    agenciesTitle: { th: 'หน่วยงาน', en: 'Government Agencies' },
    agenciesDesc: { th: 'สำรวจชุดข้อมูลตามหน่วยงาน', en: 'Explore datasets by government agency' },
  };

  return (
    <>
      {/* Hero Section - Thai Government Style */}
      <section className="th-hero">
        <div className="th-hero-container">
          <h1 className="th-hero-title">
            {t(content.heroTitle1)}
            <span className="th-hero-highlight">{t(content.heroTitle2)}</span>
          </h1>
          <p className="th-hero-subtitle">
            {t(content.heroSubtitle)}
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="th-search-box">
            <div className="th-search-input-wrapper">
              <svg
                className="th-search-icon"
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
                placeholder={t(content.searchPlaceholder)}
                className="th-search-input"
              />
              <button type="submit" className="th-btn th-btn-primary">
                {t(content.searchButton)}
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
      </section>

      {/* Stats Section */}
      <section className="th-stats-section">
        <div className="th-stats-container">
          <div className="th-stat-card">
            <div className="th-stat-value">
              <AnimatedCounter value={totalDatasets} suffix="+" />
            </div>
            <div className="th-stat-label">{t(content.statsDatasets)}</div>
          </div>
          <div className="th-stat-card">
            <div className="th-stat-value">
              <AnimatedCounter value={organizations.length} />
            </div>
            <div className="th-stat-label">{t(content.statsOrganizations)}</div>
          </div>
          <div className="th-stat-card">
            <div className="th-stat-value">
              <AnimatedCounter value={topics.length} />
            </div>
            <div className="th-stat-label">{t(content.statsTopics)}</div>
          </div>
          <div className="th-stat-card">
            <div className="th-stat-value">API</div>
            <div className="th-stat-label">{t(content.statsApi)}</div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* View API Card */}
            <Link
              href="/api/3/action/status_show"
              target="_blank"
              className="group relative bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-th-orange-300 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-th-navy-100 rounded-lg group-hover:bg-th-navy-200 transition-colors">
                  <svg className="h-6 w-6 text-th-navy-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-th-navy-600 group-hover:text-th-orange-500 transition-colors">
                    {t(content.viewApis)}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {t(content.viewApisDesc)}
                  </p>
                </div>
              </div>
              <div className="absolute top-6 right-6 text-gray-400 group-hover:text-th-orange-500 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Open Data License Card */}
            <Link
              href="/about"
              className="group relative bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-th-orange-300 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-th-navy-600 group-hover:text-th-orange-500 transition-colors">
                    {t(content.openDataLicense)}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {t(content.openDataLicenseDesc)}
                  </p>
                </div>
              </div>
              <div className="absolute top-6 right-6 text-gray-400 group-hover:text-th-orange-500 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Feedback Card */}
            <Link
              href="/feedback"
              className="group relative bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-th-orange-300 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-th-orange-100 rounded-lg group-hover:bg-th-orange-200 transition-colors">
                  <svg className="h-6 w-6 text-th-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-th-navy-600 group-hover:text-th-orange-500 transition-colors">
                    {t(content.giveFeedback)}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {t(content.giveFeedbackDesc)}
                  </p>
                </div>
              </div>
              <div className="absolute top-6 right-6 text-gray-400 group-hover:text-th-orange-500 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Recently Updated Datasets Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-heading font-bold text-th-navy-600">
                {t(content.recentlyUpdated)}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {t(content.recentlyUpdatedDesc)}
              </p>
            </div>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 text-sm font-medium text-th-orange-500 hover:text-th-orange-600 transition-colors"
            >
              {t(content.viewAllDatasets)}
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
            <div className="bg-gray-50 rounded-xl text-center py-16 px-6">
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
              <h3 className="mt-4 text-lg font-semibold text-th-navy-600">
                {t(content.noDatasets)}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {t(content.noDatasetsDesc)}
              </p>
              <Link
                href="/user/login"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-th-navy-600 hover:bg-th-navy-700 text-white font-medium rounded-lg transition-colors"
              >
                {t(content.goToAdmin)}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Organizations Section */}
      {organizations.length > 0 && (
        <section className="py-12 bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-heading font-bold text-th-navy-600">
                  {t(content.agenciesTitle)}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {t(content.agenciesDesc)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {organizations.slice(0, 6).map((org) => (
                <Link
                  key={org.id}
                  href={`/search?org=${encodeURIComponent(org.name)}`}
                  className="group bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md hover:border-th-orange-300 transition-all duration-200 text-center"
                >
                  <div className="flex justify-center">
                    <AgencyAvatar
                      imageUrl={org.image_url}
                      name={org.title}
                      size="md"
                    />
                  </div>
                  <p className="mt-4 text-sm font-medium text-th-navy-600 group-hover:text-th-orange-500 truncate transition-colors">
                    {org.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default function HomePage(props: HomePageProps) {
  return (
    <ThaiGovLayout>
      <HomePageContent {...props} />
    </ThaiGovLayout>
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
