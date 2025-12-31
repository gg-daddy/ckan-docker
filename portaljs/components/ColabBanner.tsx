interface ColabBannerProps {
  notebookPath: string;
  datasetName?: string;
}

export default function ColabBanner({ notebookPath, datasetName }: ColabBannerProps) {
  const GITHUB_OWNER = 'gg-daddy';
  const GITHUB_REPO = 'ckan-docker';
  const GITHUB_BRANCH = 'portjs-inte';

  const colabUrl = `https://colab.research.google.com/github/${GITHUB_OWNER}/${GITHUB_REPO}/blob/${GITHUB_BRANCH}/portaljs/content/notebooks/${notebookPath}`;

  return (
    <div className="my-6 rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-start gap-5">
        {/* Colab Logo - Official style matching data.gov.sg */}
        <div className="flex-shrink-0">
          <svg
            className="h-16 w-20"
            viewBox="0 0 80 56"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Left ring (Orange) */}
            <circle cx="24" cy="28" r="20" fill="none" stroke="#E37400" strokeWidth="8" />
            <path
              d="M24 8 A20 20 0 0 1 44 28"
              fill="none"
              stroke="#D56A00"
              strokeWidth="8"
            />
            {/* Right ring (Yellow/Amber) */}
            <circle cx="56" cy="28" r="20" fill="none" stroke="#F9AB00" strokeWidth="8" />
            <path
              d="M56 8 A20 20 0 0 1 76 28"
              fill="none"
              stroke="#E09000"
              strokeWidth="8"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Analyse this dataset with Colab Notebook
          </h3>
          <ol className="text-sm text-gray-600 space-y-1 mb-4">
            {datasetName && (
              <li>
                1. Dataset ID:{' '}
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-600 font-mono text-xs">
                  {datasetName}
                </code>
              </li>
            )}
            <li>{datasetName ? '2.' : '1.'} Click on the button below to open the notebook</li>
          </ol>

          <a
            href={colabUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-amber-400 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-amber-500 transition-colors"
          >
            Open in Colab
          </a>
        </div>
      </div>
    </div>
  );
}
