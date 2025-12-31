interface ColabButtonProps {
  notebookPath: string;
  className?: string;
}

export default function ColabButton({ notebookPath, className = '' }: ColabButtonProps) {
  const GITHUB_OWNER = 'gg-daddy';
  const GITHUB_REPO = 'ckan-docker';
  const GITHUB_BRANCH = 'portjs-inte';

  const colabUrl = `https://colab.research.google.com/github/${GITHUB_OWNER}/${GITHUB_REPO}/blob/${GITHUB_BRANCH}/portaljs/content/notebooks/${notebookPath}`;

  return (
    <a
      href={colabUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <svg
        className="h-4 w-4 mr-2"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Google Colab icon */}
        <path d="M16.941 4.976a7.033 7.033 0 0 0-4.93 2.064 7.033 7.033 0 0 0-.124 9.807l2.395-2.395a3.646 3.646 0 0 1 5.15-5.148l2.397-2.399a7.033 7.033 0 0 0-4.888-1.93z" />
        <path d="M7.074 19.024a7.033 7.033 0 0 0 4.93-2.064 7.033 7.033 0 0 0 .124-9.807l-2.395 2.395a3.646 3.646 0 0 1-5.15 5.148l-2.397 2.399a7.033 7.033 0 0 0 4.888 1.93z" />
      </svg>
      Open in Colab
    </a>
  );
}
