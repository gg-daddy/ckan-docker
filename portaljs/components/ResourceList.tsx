import { useState } from 'react';
import { CkanResource, CkanDataset } from '@/lib/ckan';
import ResourceBadge from './ResourceBadge';
import AccessBadge from './AccessBadge';
import RequestAccessModal from './RequestAccessModal';
import { useResourceAccess } from '@/hooks/useResourceAccess';
import Link from 'next/link';

interface ResourceListProps {
  resources: CkanResource[];
  dataset?: CkanDataset;
}

interface ResourceItemProps {
  resource: CkanResource;
  dataset?: CkanDataset;
  onRequestAccess: (resource: CkanResource) => void;
}

function ResourceItem({ resource, dataset, onRequestAccess }: ResourceItemProps) {
  const { canAccess, accessLevel, reason, requiresLogin, requiresRequest } = useResourceAccess(
    resource,
    dataset
  );

  return (
    <div className="py-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-base font-medium text-gray-900 dark:text-white truncate">
              {resource.name || 'Unnamed Resource'}
            </h3>
            <ResourceBadge format={resource.format} />
            {accessLevel && accessLevel !== 'public' && (
              <AccessBadge accessLevel={accessLevel} />
            )}
          </div>
          {resource.description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {resource.description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            {resource.size && <span>{formatFileSize(resource.size)}</span>}
            {resource.last_modified && (
              <span>Updated: {new Date(resource.last_modified).toLocaleDateString()}</span>
            )}
          </div>
        </div>
        <div className="ml-4 flex-shrink-0 flex gap-2">
          {canAccess ? (
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
          ) : requiresLogin ? (
            <Link
              href="/user/login"
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-500 transition-colors"
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
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Login to Download
            </Link>
          ) : requiresRequest ? (
            <button
              onClick={() => onRequestAccess(resource)}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-500 transition-colors"
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              Request Access
            </button>
          ) : (
            <span className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Restricted
            </span>
          )}
        </div>
      </div>
      {!canAccess && reason && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">{reason}</p>
      )}
    </div>
  );
}

export default function ResourceList({ resources, dataset }: ResourceListProps) {
  const [selectedResource, setSelectedResource] = useState<CkanResource | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRequestAccess = (resource: CkanResource) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedResource(null);
  };

  if (!resources || resources.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No resources available for this dataset.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Resources ({resources.length})
        </h2>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {resources.map((resource) => (
            <ResourceItem
              key={resource.id}
              resource={resource}
              dataset={dataset}
              onRequestAccess={handleRequestAccess}
            />
          ))}
        </div>
      </div>

      {selectedResource && dataset && (
        <RequestAccessModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          resource={selectedResource}
          dataset={dataset}
        />
      )}
    </>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
