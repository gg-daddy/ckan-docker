import { CkanResource } from '@/lib/ckan';
import ResourceBadge from './ResourceBadge';

interface ResourceListProps {
  resources: CkanResource[];
}

export default function ResourceList({ resources }: ResourceListProps) {
  if (!resources || resources.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No resources available for this dataset.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">
        Resources ({resources.length})
      </h2>
      <div className="divide-y divide-gray-200">
        {resources.map((resource) => (
          <div key={resource.id} className="py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-medium text-gray-900 truncate">
                    {resource.name || 'Unnamed Resource'}
                  </h3>
                  <ResourceBadge format={resource.format} />
                </div>
                {resource.description && (
                  <p className="mt-1 text-sm text-gray-600">{resource.description}</p>
                )}
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                  {resource.size && (
                    <span>{formatFileSize(resource.size)}</span>
                  )}
                  {resource.last_modified && (
                    <span>
                      Updated: {new Date(resource.last_modified).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="ml-4 flex-shrink-0 flex gap-2">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-sm"
                >
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
