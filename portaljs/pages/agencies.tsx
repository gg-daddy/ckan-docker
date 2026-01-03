import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { ThaiGovLayout, useThaiLanguage, AgencyAvatar } from '@/components/thailand';
import { getOrganizationsWithCounts, OrganizationWithCount } from '@/lib/ckan';

interface AgenciesPageProps {
  agencies: OrganizationWithCount[];
}

// Bilingual content
const content = {
  title: { th: 'หน่วยงาน', en: 'Government Agencies' },
  subtitle: {
    th: 'สำรวจชุดข้อมูลตามหน่วยงานภาครัฐ',
    en: 'Explore datasets by government agency',
  },
  datasetsLabel: { th: 'ชุดข้อมูล', en: 'datasets' },
  noAgencies: { th: 'ยังไม่มีหน่วยงาน', en: 'No agencies yet' },
  noAgenciesDesc: {
    th: 'หน่วยงานจะปรากฏที่นี่เมื่อมีการเพิ่มชุดข้อมูล',
    en: 'Agencies will appear here when datasets are added.',
  },
  viewDatasets: { th: 'ดูชุดข้อมูล', en: 'View datasets' },
};

function AgenciesContent({ agencies }: AgenciesPageProps) {
  const { t } = useThaiLanguage();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-main py-8">
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-th-navy-600">
                  {t({ th: 'หน้าแรก', en: 'Home' })}
                </Link>
              </li>
              <li className="flex items-center">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="ml-2 text-th-navy-600 font-medium">{t(content.title)}</span>
              </li>
            </ol>
          </nav>

          <h1 className="text-3xl font-bold text-th-navy-600 mb-2">
            {t(content.title)}
          </h1>
          <p className="text-gray-600">
            {t(content.subtitle)}
          </p>
        </div>
      </div>

      {/* Agencies Grid */}
      <div className="container-main py-8">
        {agencies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {agencies.map((agency) => (
              <Link
                key={agency.id}
                href={`/search?org=${encodeURIComponent(agency.name)}`}
                className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-th-orange-300 transition-all duration-200"
              >
                {/* Agency Logo */}
                <div className="flex justify-center mb-4">
                  <AgencyAvatar
                    imageUrl={agency.image_url}
                    name={agency.title}
                    size="lg"
                  />
                </div>

                {/* Agency Info */}
                <div className="text-center">
                  <h3 className="font-semibold text-th-navy-600 group-hover:text-th-orange-500 transition-colors mb-2">
                    {agency.title}
                  </h3>
                  {agency.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {agency.description}
                    </p>
                  )}
                  <div className="inline-flex items-center gap-1 text-sm text-gray-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span>{agency.package_count || 0} {t(content.datasetsLabel)}</span>
                  </div>
                </div>

                {/* View button */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="flex items-center justify-center gap-2 text-sm font-medium text-th-orange-500 group-hover:text-th-orange-600">
                    {t(content.viewDatasets)}
                    <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 text-center py-16 px-6">
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-th-navy-600">
              {t(content.noAgencies)}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {t(content.noAgenciesDesc)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AgenciesPage(props: AgenciesPageProps) {
  return (
    <ThaiGovLayout title="Agencies" description="Government agencies with open data">
      <AgenciesContent {...props} />
    </ThaiGovLayout>
  );
}

export const getServerSideProps: GetServerSideProps<AgenciesPageProps> = async () => {
  try {
    const agencies = await getOrganizationsWithCounts();
    return {
      props: {
        agencies,
      },
    };
  } catch (error) {
    console.error('Error fetching agencies:', error);
    return {
      props: {
        agencies: [],
      },
    };
  }
};
