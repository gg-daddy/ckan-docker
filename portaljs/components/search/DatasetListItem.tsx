import Link from 'next/link';
import { CkanDataset, formatResourceFormat, getFormatBadgeClass } from '@/lib/ckan';

interface DatasetListItemProps {
  dataset: CkanDataset;
  isSelected?: boolean;
  onSelect?: (dataset: CkanDataset) => void;
  compact?: boolean;
}

export default function DatasetListItem({
  dataset,
  isSelected = false,
  onSelect,
  compact = false,
}: DatasetListItemProps) {
  // Get unique resource formats
  const formats = [...new Set(dataset.resources?.map(r => r.format?.toUpperCase()).filter(Boolean) || [])];

  // Format the date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onSelect) {
      e.preventDefault();
      onSelect(dataset);
    }
  };

  // Dynamic classes based on compact mode and selection state
  const articleClasses = [
    'dataset-list-item',
    'transition-all duration-150',
    compact ? 'p-3' : '',
    isSelected ? 'border-l-4 border-th-orange-500 bg-th-orange-50 dark:bg-th-orange-900/20' : '',
    onSelect ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : '',
  ].filter(Boolean).join(' ');

  const TitleWrapper = onSelect ? 'button' : Link;
  const titleProps = onSelect
    ? { type: 'button' as const, onClick: handleClick, className: 'text-left w-full' }
    : { href: `/dataset/${dataset.name}` };

  return (
    <article className={articleClasses} onClick={onSelect ? handleClick : undefined}>
      <div className={`flex flex-col sm:flex-row sm:items-start ${compact ? 'gap-2' : 'gap-3'}`}>
        <div className="flex-1 min-w-0">
          {/* Title */}
          {onSelect ? (
            <h3 className="dataset-title">{dataset.title}</h3>
          ) : (
            <Link href={`/dataset/${dataset.name}`}>
              <h3 className="dataset-title">{dataset.title}</h3>
            </Link>
          )}

          {/* Description - hide or truncate more in compact mode */}
          {dataset.notes && (
            <p className={`dataset-description mt-1 ${compact ? 'line-clamp-2' : ''}`}>
              {dataset.notes.replace(/<[^>]*>/g, '')}
            </p>
          )}

          {/* Meta information */}
          <div className={`dataset-meta ${compact ? 'mt-2' : 'mt-3'}`}>
            {/* Organization */}
            {dataset.organization && (
              <div className="dataset-meta-item">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>{dataset.organization.title}</span>
              </div>
            )}

            {/* Last modified */}
            <div className="dataset-meta-item">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Updated {formatDate(dataset.metadata_modified)}</span>
            </div>

            {/* Resource count - show in non-compact mode only */}
            {!compact && (
              <div className="dataset-meta-item">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{dataset.resources?.length || 0} resources</span>
              </div>
            )}
          </div>
        </div>

        {/* Format badges */}
        {formats.length > 0 && (
          <div className={`flex flex-wrap gap-1.5 sm:flex-col sm:items-end ${compact ? 'hidden sm:flex' : ''}`}>
            {formats.slice(0, compact ? 2 : 3).map((format) => (
              <span
                key={format}
                className={getFormatBadgeClass(format)}
              >
                {formatResourceFormat(format)}
              </span>
            ))}
            {formats.length > (compact ? 2 : 3) && (
              <span className="format-default">
                +{formats.length - (compact ? 2 : 3)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Tags - hide in compact mode */}
      {!compact && dataset.tags && dataset.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {dataset.tags.slice(0, 5).map((tag) => (
            <Link
              key={tag.id}
              href={`/search?tags=${encodeURIComponent(tag.name)}`}
              className="badge-gray hover:bg-gray-200 dark:hover:bg-gray-600"
              onClick={(e) => e.stopPropagation()}
            >
              {tag.display_name}
            </Link>
          ))}
          {dataset.tags.length > 5 && (
            <span className="badge-gray">
              +{dataset.tags.length - 5} more
            </span>
          )}
        </div>
      )}
    </article>
  );
}

// Skeleton loading component
export function DatasetListItemSkeleton() {
  return (
    <div className="dataset-list-item animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        <div className="flex-1">
          <div className="skeleton-title" />
          <div className="skeleton-text mt-2 w-full" />
          <div className="skeleton-text mt-1 w-3/4" />
          <div className="flex gap-4 mt-3">
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-4 w-32" />
            <div className="skeleton h-4 w-20" />
          </div>
        </div>
        <div className="flex gap-1.5 sm:flex-col">
          <div className="skeleton h-5 w-12 rounded" />
          <div className="skeleton h-5 w-12 rounded" />
        </div>
      </div>
    </div>
  );
}
