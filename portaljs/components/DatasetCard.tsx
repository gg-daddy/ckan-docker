import Link from 'next/link';
import { CkanDataset, formatResourceFormat, getFormatBadgeClass } from '@/lib/ckan';

interface DatasetCardProps {
  dataset: CkanDataset;
}

export default function DatasetCard({ dataset }: DatasetCardProps) {
  // Get unique resource formats
  const formats = [...new Set(dataset.resources?.map((r) => r.format?.toUpperCase()).filter(Boolean) || [])];

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <article className="card-hover p-5">
      <Link href={`/dataset/${dataset.name}`}>
        <h3 className="text-base font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2">
          {dataset.title}
        </h3>
      </Link>

      {dataset.notes && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {dataset.notes.replace(/<[^>]*>/g, '')}
        </p>
      )}

      {/* Meta Info */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
        {dataset.organization && (
          <div className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="truncate max-w-[120px]">{dataset.organization.title}</span>
          </div>
        )}

        {dataset.metadata_modified && (
          <div className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatDate(dataset.metadata_modified)}</span>
          </div>
        )}

        {dataset.resources && dataset.resources.length > 0 && (
          <div className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{dataset.resources.length} files</span>
          </div>
        )}
      </div>

      {/* Resource Formats */}
      {formats.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {formats.slice(0, 4).map((format) => (
            <span key={format} className={getFormatBadgeClass(format)}>
              {formatResourceFormat(format)}
            </span>
          ))}
          {formats.length > 4 && (
            <span className="format-default">+{formats.length - 4}</span>
          )}
        </div>
      )}

      {/* Tags */}
      {dataset.tags && dataset.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {dataset.tags.slice(0, 3).map((tag) => (
            <Link
              key={tag.id}
              href={`/search?tags=${encodeURIComponent(tag.name)}`}
              className="badge-gray text-xs hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {tag.display_name}
            </Link>
          ))}
          {dataset.tags.length > 3 && (
            <span className="badge-gray text-xs">+{dataset.tags.length - 3}</span>
          )}
        </div>
      )}
    </article>
  );
}
