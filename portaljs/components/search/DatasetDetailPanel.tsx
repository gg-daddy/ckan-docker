import Link from 'next/link';
import { useState } from 'react';
import { CkanDataset } from '@/lib/ckan';
import ResourceBadge from '@/components/ResourceBadge';
import { useThaiLanguage } from '@/components/thailand';

interface DatasetDetailPanelProps {
  dataset: CkanDataset | null;
  isLoading: boolean;
  onClose: () => void;
}

// Bilingual content
const content = {
  overview: { th: 'ภาพรวม', en: 'Overview' },
  resources: { th: 'ทรัพยากร', en: 'Resources' },
  aboutDataset: { th: 'เกี่ยวกับชุดข้อมูล', en: 'About this dataset' },
  download: { th: 'ดาวน์โหลด', en: 'Download' },
  api: { th: 'API', en: 'API' },
  copyLink: { th: 'คัดลอกลิงก์', en: 'Copy link' },
  linkCopied: { th: 'คัดลอกแล้ว!', en: 'Copied!' },
  viewFullPage: { th: 'ดูหน้าเต็ม', en: 'View full page' },
  noDescription: { th: 'ไม่มีคำอธิบายสำหรับชุดข้อมูลนี้', en: 'No description available for this dataset.' },
  author: { th: 'ผู้เขียน', en: 'Author' },
  maintainer: { th: 'ผู้ดูแล', en: 'Maintainer' },
  license: { th: 'สัญญาอนุญาต', en: 'License' },
  organization: { th: 'หน่วยงาน', en: 'Organization' },
  created: { th: 'สร้างเมื่อ', en: 'Created' },
  updated: { th: 'อัปเดตล่าสุด', en: 'Last Updated' },
  formats: { th: 'รูปแบบ', en: 'Formats' },
  files: { th: 'ไฟล์', en: 'files' },
};

function DetailPanelSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="flex gap-4 mb-4">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
      <div className="flex gap-2 mb-6">
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        <div className="h-6 bg-gray-200 rounded-full w-14"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded w-40 mb-8"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
      </div>
    </div>
  );
}

export default function DatasetDetailPanel({
  dataset,
  isLoading,
  onClose,
}: DatasetDetailPanelProps) {
  const { t, lang } = useThaiLanguage();
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/dataset/${dataset?.name}`;
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return null;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg">
        <div className="p-6">
          <DetailPanelSkeleton />
        </div>
      </div>
    );
  }

  if (!dataset) {
    return null;
  }

  const primaryResource = dataset.resources?.[0];
  const format = primaryResource?.format?.toUpperCase() || 'FILE';
  const size = formatFileSize(primaryResource?.size);
  const uniqueFormats = [...new Set(dataset.resources?.map((r) => r.format?.toUpperCase()).filter(Boolean))];

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
      {/* Header with close button */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
        <span className="text-sm font-medium text-gray-500">
          {dataset.resources?.length || 0} {t(content.files)}
        </span>
        <div className="flex items-center gap-2">
          <Link
            href={`/dataset/${dataset.name}`}
            className="text-sm text-th-orange-600 hover:text-th-orange-700 font-medium"
          >
            {t(content.viewFullPage)} →
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close panel"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
          {dataset.title}
        </h2>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
          {dataset.organization && (
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>{dataset.organization.title}</span>
            </div>
          )}
          {dataset.metadata_modified && (
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatDate(dataset.metadata_modified)}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {dataset.tags && dataset.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {dataset.tags.slice(0, 5).map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
              >
                {tag.display_name}
              </span>
            ))}
            {dataset.tags.length > 5 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                +{dataset.tags.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {primaryResource && (
            <a
              href={primaryResource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-th-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-th-orange-600 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {t(content.download)} {format}{size ? ` (${size})` : ''}
            </a>
          )}
          <a
            href={`/api/3/action/package_show?id=${dataset.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            {t(content.api)}
          </a>
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 transition-colors"
            title={t(content.copyLink)}
          >
            {linkCopied ? (
              <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            )}
          </button>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">{t(content.overview)}</h3>
          {dataset.notes ? (
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
              {dataset.notes.replace(/<[^>]*>/g, '')}
            </p>
          ) : (
            <p className="text-sm text-gray-400 italic">{t(content.noDescription)}</p>
          )}
        </div>

        {/* Resources preview */}
        {dataset.resources && dataset.resources.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              {t(content.resources)} ({dataset.resources.length})
            </h3>
            <div className="space-y-2">
              {dataset.resources.slice(0, 3).map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <ResourceBadge format={resource.format || 'FILE'} />
                    <span className="text-sm text-gray-700 truncate">
                      {resource.name || resource.description || 'Unnamed resource'}
                    </span>
                  </div>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 p-1.5 text-gray-400 hover:text-th-orange-600 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                </div>
              ))}
              {dataset.resources.length > 3 && (
                <Link
                  href={`/dataset/${dataset.name}`}
                  className="block text-center text-sm text-th-orange-600 hover:text-th-orange-700 py-2"
                >
                  +{dataset.resources.length - 3} more resources →
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Metadata grid */}
        <div className="border-t border-gray-100 pt-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">{t(content.aboutDataset)}</h3>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {dataset.organization && (
              <div>
                <dt className="text-gray-500">{t(content.organization)}</dt>
                <dd className="text-gray-900 font-medium">{dataset.organization.title}</dd>
              </div>
            )}
            {dataset.license_title && (
              <div>
                <dt className="text-gray-500">{t(content.license)}</dt>
                <dd className="text-gray-900">{dataset.license_title}</dd>
              </div>
            )}
            {dataset.metadata_created && (
              <div>
                <dt className="text-gray-500">{t(content.created)}</dt>
                <dd className="text-gray-900">{formatDate(dataset.metadata_created)}</dd>
              </div>
            )}
            {dataset.metadata_modified && (
              <div>
                <dt className="text-gray-500">{t(content.updated)}</dt>
                <dd className="text-gray-900">{formatDate(dataset.metadata_modified)}</dd>
              </div>
            )}
            {uniqueFormats.length > 0 && (
              <div className="col-span-2">
                <dt className="text-gray-500 mb-1">{t(content.formats)}</dt>
                <dd className="flex flex-wrap gap-1">
                  {uniqueFormats.map((fmt) => (
                    <ResourceBadge key={fmt} format={fmt as string} />
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
