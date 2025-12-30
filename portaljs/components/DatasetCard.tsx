import Link from 'next/link';
import { CkanDataset } from '@/lib/ckan';
import ResourceBadge from './ResourceBadge';

interface DatasetCardProps {
  dataset: CkanDataset;
}

export default function DatasetCard({ dataset }: DatasetCardProps) {
  // Get unique resource formats
  const formats = [...new Set(dataset.resources?.map((r) => r.format?.toUpperCase()).filter(Boolean))];

  return (
    <article className="dataset-card">
      <Link href={`/dataset/${dataset.name}`}>
        <h3 className="dataset-card-title">{dataset.title}</h3>
      </Link>

      {dataset.notes && (
        <p className="dataset-card-description">
          {dataset.notes.length > 200
            ? `${dataset.notes.substring(0, 200)}...`
            : dataset.notes}
        </p>
      )}

      {/* Meta Info */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
        {dataset.organization && (
          <div className="flex items-center">
            <svg
              className="h-4 w-4 mr-1"
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
            <span>{dataset.organization.title}</span>
          </div>
        )}

        {dataset.metadata_modified && (
          <div className="flex items-center">
            <svg
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              {new Date(dataset.metadata_modified).toLocaleDateString()}
            </span>
          </div>
        )}

        {dataset.resources && dataset.resources.length > 0 && (
          <div className="flex items-center">
            <svg
              className="h-4 w-4 mr-1"
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
            <span>{dataset.resources.length} resources</span>
          </div>
        )}
      </div>

      {/* Resource Formats */}
      {formats.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {formats.slice(0, 5).map((format) => (
            <ResourceBadge key={format} format={format} />
          ))}
          {formats.length > 5 && (
            <span className="text-xs text-gray-500">+{formats.length - 5} more</span>
          )}
        </div>
      )}

      {/* Tags */}
      {dataset.tags && dataset.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {dataset.tags.slice(0, 5).map((tag) => (
            <span key={tag.id} className="badge-gray">
              {tag.display_name}
            </span>
          ))}
          {dataset.tags.length > 5 && (
            <span className="text-xs text-gray-500">+{dataset.tags.length - 5} more</span>
          )}
        </div>
      )}
    </article>
  );
}
