import Link from 'next/link';
import getConfig from 'next/config';
import { ThaiGovLayout, useThaiLanguage } from '@/components/thailand';

const { publicRuntimeConfig } = getConfig() || {};
const ckanUrl = publicRuntimeConfig?.ckanUrl || 'http://localhost:5001';

// Bilingual content
const content = {
  title: { th: 'เอกสาร API', en: 'API Documentation' },
  subtitle: {
    th: 'เข้าถึงข้อมูลเปิดผ่าน CKAN API',
    en: 'Access open data programmatically through our CKAN API',
  },
  baseUrl: { th: 'URL พื้นฐาน', en: 'Base URL' },
  commonEndpoints: { th: 'Endpoint ที่ใช้บ่อย', en: 'Common Endpoints' },
  example: { th: 'ตัวอย่าง', en: 'Example' },
  response: { th: 'การตอบกลับ', en: 'Response' },
  tryIt: { th: 'ลองใช้งาน', en: 'Try it' },
  fullDocs: { th: 'เอกสารฉบับเต็ม', en: 'Full Documentation' },
  fullDocsDesc: {
    th: 'ดูเอกสาร CKAN API ฉบับเต็มสำหรับข้อมูลเพิ่มเติม',
    en: 'View the complete CKAN API documentation for more details.',
  },
  viewDocs: { th: 'ดูเอกสาร CKAN API', en: 'View CKAN API Docs' },
};

const endpoints = [
  {
    name: 'package_list',
    description: {
      th: 'ดึงรายชื่อชุดข้อมูลทั้งหมด',
      en: 'Get a list of all dataset names',
    },
    method: 'GET',
    path: '/api/3/action/package_list',
  },
  {
    name: 'package_search',
    description: {
      th: 'ค้นหาชุดข้อมูล',
      en: 'Search for datasets',
    },
    method: 'GET',
    path: '/api/3/action/package_search?q={query}',
    params: [
      { name: 'q', desc: { th: 'คำค้นหา', en: 'Search query' } },
      { name: 'rows', desc: { th: 'จำนวนผลลัพธ์ (ค่าเริ่มต้น: 10)', en: 'Number of results (default: 10)' } },
      { name: 'start', desc: { th: 'ตำแหน่งเริ่มต้น', en: 'Offset for pagination' } },
    ],
  },
  {
    name: 'package_show',
    description: {
      th: 'ดึงข้อมูลชุดข้อมูลตาม ID หรือชื่อ',
      en: 'Get details of a specific dataset by ID or name',
    },
    method: 'GET',
    path: '/api/3/action/package_show?id={dataset_id}',
  },
  {
    name: 'organization_list',
    description: {
      th: 'ดึงรายชื่อหน่วยงานทั้งหมด',
      en: 'Get a list of all organizations (agencies)',
    },
    method: 'GET',
    path: '/api/3/action/organization_list',
  },
  {
    name: 'tag_list',
    description: {
      th: 'ดึงรายชื่อแท็กทั้งหมด',
      en: 'Get a list of all tags',
    },
    method: 'GET',
    path: '/api/3/action/tag_list',
  },
];

function ApiDocsContent() {
  const { t, lang } = useThaiLanguage();

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

      <div className="container-main py-8">
        <div className="max-w-4xl">
          {/* Base URL */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-th-navy-600 mb-3">
              {t(content.baseUrl)}
            </h2>
            <code className="block bg-gray-100 px-4 py-3 rounded-lg text-sm font-mono text-gray-800 break-all">
              {ckanUrl}/api/3/action/
            </code>
          </div>

          {/* Endpoints */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-th-navy-600">
                {t(content.commonEndpoints)}
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {endpoints.map((endpoint) => (
                <div key={endpoint.name} className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded bg-green-100 text-green-800">
                          {endpoint.method}
                        </span>
                        <code className="text-sm font-mono text-th-navy-600 font-semibold">
                          {endpoint.name}
                        </code>
                      </div>
                      <p className="text-sm text-gray-600">
                        {t(endpoint.description)}
                      </p>
                    </div>
                    <a
                      href={`${ckanUrl}${endpoint.path.replace('{query}', 'test').replace('{dataset_id}', 'test')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-th-orange-600 bg-th-orange-50 hover:bg-th-orange-100 rounded-lg transition-colors"
                    >
                      {t(content.tryIt)}
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <code className="text-xs font-mono text-gray-700 break-all">
                      {ckanUrl}{endpoint.path}
                    </code>
                  </div>

                  {endpoint.params && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                        Parameters
                      </p>
                      <div className="space-y-1">
                        {endpoint.params.map((param) => (
                          <div key={param.name} className="flex items-center gap-2 text-sm">
                            <code className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono text-gray-800">
                              {param.name}
                            </code>
                            <span className="text-gray-600 text-xs">{t(param.desc)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Example Request */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-th-navy-600 mb-3">
              {t(content.example)}
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              {lang === 'th' ? 'ค้นหาชุดข้อมูลที่เกี่ยวข้องกับ "climate":' : 'Search for datasets related to "climate":'}
            </p>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <code className="text-sm font-mono text-green-400">
                curl &quot;{ckanUrl}/api/3/action/package_search?q=climate&amp;rows=5&quot;
              </code>
            </div>

            <h3 className="text-sm font-semibold text-gray-700 mt-4 mb-2">
              {t(content.response)}
            </h3>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs font-mono text-gray-300">
{`{
  "success": true,
  "result": {
    "count": 10,
    "results": [
      {
        "id": "...",
        "name": "climate-data",
        "title": "Climate Data 2024",
        "resources": [...]
      }
    ]
  }
}`}
              </pre>
            </div>
          </div>

          {/* Full Documentation Link */}
          <div className="bg-gradient-to-r from-th-navy-600 to-th-navy-700 rounded-xl p-6 text-white">
            <h2 className="text-lg font-semibold mb-2">
              {t(content.fullDocs)}
            </h2>
            <p className="text-th-navy-100 text-sm mb-4">
              {t(content.fullDocsDesc)}
            </p>
            <a
              href="https://docs.ckan.org/en/latest/api/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-th-navy-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              {t(content.viewDocs)}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ApiDocsPage() {
  return (
    <ThaiGovLayout title="API Documentation" description="CKAN API documentation for developers">
      <ApiDocsContent />
    </ThaiGovLayout>
  );
}
