import { GetServerSideProps } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Layout from '@/components/Layout';
import ResourceList from '@/components/ResourceList';
import ResourceBadge from '@/components/ResourceBadge';
import ColabButton from '@/components/ColabButton';
import ColabBanner from '@/components/ColabBanner';
import { getDataset, CkanDataset } from '@/lib/ckan';
import { getMDXForDataset, MDXFrontmatter } from '@/lib/mdx';

// Dynamic imports for PortalJS components (client-side only)
const FlatUiTable = dynamic(
  () => import('@portaljs/components').then((mod) => mod.FlatUiTable),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" /> }
);
const PlotlyBarChart = dynamic(
  () => import('@portaljs/components').then((mod) => mod.PlotlyBarChart),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" /> }
);
const PlotlyLineChart = dynamic(
  () => import('@portaljs/components').then((mod) => mod.PlotlyLineChart),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" /> }
);
const LineChart = dynamic(
  () => import('@portaljs/components').then((mod) => mod.LineChart),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" /> }
);
const Map = dynamic(
  () => import('@portaljs/components').then((mod) => mod.Map),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" /> }
);
const Excel = dynamic(
  () => import('@portaljs/components').then((mod) => mod.Excel),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" /> }
);
const PdfViewer = dynamic(
  () => import('@portaljs/components').then((mod) => mod.PdfViewer),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" /> }
);
const VegaLite = dynamic(
  () => import('@portaljs/components').then((mod) => mod.VegaLite),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" /> }
);
const Plotly = dynamic(
  () => import('@portaljs/components').then((mod) => mod.Plotly),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" /> }
);

interface DatasetPageProps {
  dataset: CkanDataset;
  mdxSource: MDXRemoteSerializeResult | null;
  frontmatter: MDXFrontmatter | null;
}

// Custom MDX components
const mdxComponents = {
  // PortalJS data visualization components
  FlatUiTable,
  PlotlyBarChart,
  PlotlyLineChart,
  LineChart,
  Map,
  Excel,
  PdfViewer,
  VegaLite,
  Plotly,
  // Styling components
  h1: (props: any) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-medium mt-5 mb-2" {...props} />,
  p: (props: any) => <p className="mb-4 text-gray-700 leading-7" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
  li: (props: any) => <li className="text-gray-700" {...props} />,
  a: (props: any) => <a className="text-primary-600 hover:underline" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-600 my-4" {...props} />
  ),
  code: (props: any) => {
    const isInline = !props.className;
    if (isInline) {
      return <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm" {...props} />;
    }
    // For code blocks, just return the code element - pre will handle highlighting
    return <code {...props} />;
  },
  pre: (props: any) => {
    // Extract the code element from children
    const codeElement = props.children;
    if (codeElement?.type === 'code' || codeElement?.props?.className) {
      const className = codeElement.props?.className || '';
      const match = /language-(\w+)/.exec(className);
      const language = match ? match[1] : 'text';
      const code = String(codeElement.props?.children || '').replace(/\n$/, '');

      return (
        <SyntaxHighlighter
          style={oneDark}
          language={language}
          PreTag="div"
          className="rounded-lg mb-4"
          showLineNumbers={false}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.875rem',
          }}
        >
          {code}
        </SyntaxHighlighter>
      );
    }
    // Fallback for non-code pre elements
    return <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-4" {...props} />;
  },
  table: (props: any) => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full divide-y divide-gray-300" {...props} />
    </div>
  ),
  th: (props: any) => (
    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 bg-gray-50" {...props} />
  ),
  td: (props: any) => (
    <td className="px-4 py-2 text-sm text-gray-700 border-t border-gray-200" {...props} />
  ),
};

export default function DatasetPage({
  dataset,
  mdxSource,
  frontmatter,
}: DatasetPageProps) {
  return (
    <Layout
      title={dataset.title}
      description={dataset.notes?.substring(0, 160)}
    >
      {/* Breadcrumb */}
      <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container-main py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                  Home
                </Link>
              </li>
              <li className="flex items-center">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <Link
                  href="/search"
                  className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  Datasets
                </Link>
              </li>
              <li className="flex items-center">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span className="ml-2 text-gray-900 dark:text-white font-medium truncate max-w-xs">
                  {dataset.title}
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container-main py-8">
        <div className="max-w-4xl">
          {/* Main Content - Single Column Layout */}
          <div>
            {/* Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {dataset.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
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
                    {dataset.organization.title}
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
                    Updated: {new Date(dataset.metadata_modified).toLocaleDateString()}
                  </div>
                )}
                {dataset.license_title && (
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
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    {dataset.license_title}
                  </div>
                )}
              </div>

              {/* Tags */}
              {dataset.tags && dataset.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {dataset.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/search?q=${encodeURIComponent(tag.name)}`}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {tag.display_name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Prominent Download Button */}
              {dataset.resources && dataset.resources.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 mt-6">
                  {(() => {
                    const primaryResource = dataset.resources[0];
                    const format = primaryResource.format?.toUpperCase() || 'FILE';
                    const size = primaryResource.size
                      ? primaryResource.size < 1024
                        ? `${primaryResource.size} B`
                        : primaryResource.size < 1024 * 1024
                        ? `${(primaryResource.size / 1024).toFixed(1)} KB`
                        : `${(primaryResource.size / (1024 * 1024)).toFixed(1)} MB`
                      : null;
                    return (
                      <a
                        href={primaryResource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 transition-colors"
                      >
                        <svg
                          className="h-4 w-4"
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
                        Download {format}{size ? ` (${size})` : ''}
                      </a>
                    );
                  })()}
                  <a
                    href={`/api/3/action/package_show?id=${dataset.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                    API
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                    }}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    title="Copy link"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </header>

            {/* MDX Content or Default Description */}
            <div className="prose prose-lg max-w-none">
              {mdxSource ? (
                <div className="mdx-content">
                  <MDXRemote {...mdxSource} components={mdxComponents} />
                </div>
              ) : (
                <div>
                  {dataset.notes ? (
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{dataset.notes}</p>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">
                      No description available for this dataset.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Colab Banner - after content, before resources */}
            {frontmatter?.colabNotebook && (
              <ColabBanner
                notebookPath={frontmatter.colabNotebook}
                datasetName={dataset.name}
              />
            )}

            {/* Resources Section */}
            <div className="mt-12">
              <ResourceList resources={dataset.resources} dataset={dataset} />
            </div>

            {/* About this dataset - Similar to data.gov.sg */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                About this dataset
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                {dataset.author && (
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400 mb-1">Author</dt>
                    <dd className="text-gray-900 dark:text-white">{dataset.author}</dd>
                  </div>
                )}
                {dataset.maintainer && (
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400 mb-1">Maintainer</dt>
                    <dd className="text-gray-900 dark:text-white">{dataset.maintainer}</dd>
                  </div>
                )}
                {dataset.license_title && (
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400 mb-1">Licence</dt>
                    <dd className="text-gray-900 dark:text-white">{dataset.license_title}</dd>
                  </div>
                )}
                {dataset.organization && (
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400 mb-1">Organization</dt>
                    <dd className="text-gray-900 dark:text-white">{dataset.organization.title}</dd>
                  </div>
                )}
                {dataset.metadata_created && (
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400 mb-1">Created</dt>
                    <dd className="text-gray-900 dark:text-white">
                      {new Date(dataset.metadata_created).toLocaleDateString()}
                    </dd>
                  </div>
                )}
                {dataset.metadata_modified && (
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400 mb-1">Last Updated</dt>
                    <dd className="text-gray-900 dark:text-white">
                      {new Date(dataset.metadata_modified).toLocaleDateString()}
                    </dd>
                  </div>
                )}
                {dataset.resources && dataset.resources.length > 0 && (
                  <div>
                    <dt className="text-gray-500 dark:text-gray-400 mb-1">Formats</dt>
                    <dd className="flex flex-wrap gap-1">
                      {[
                        ...new Set(
                          dataset.resources
                            .map((r) => r.format?.toUpperCase())
                            .filter(Boolean)
                        ),
                      ].map((format) => (
                        <ResourceBadge key={format} format={format as string} size="sm" />
                      ))}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-gray-500 dark:text-gray-400 mb-1">Dataset ID</dt>
                  <dd className="text-gray-900 dark:text-white font-mono text-xs break-all">
                    {dataset.id}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<DatasetPageProps> = async ({
  params,
}) => {
  const id = params?.id as string;

  // Fetch dataset from CKAN
  const dataset = await getDataset(id);

  if (!dataset) {
    return { notFound: true };
  }

  // Try to load MDX content for this dataset
  let mdxSource: MDXRemoteSerializeResult | null = null;
  let frontmatter: MDXFrontmatter | null = null;

  const mdxContent = getMDXForDataset(dataset.name);

  if (mdxContent) {
    try {
      mdxSource = await serialize(mdxContent.content, {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [],
        },
      });
      frontmatter = mdxContent.frontmatter;
    } catch (error) {
      console.error('Error serializing MDX:', error);
    }
  }

  return {
    props: {
      dataset,
      mdxSource,
      frontmatter,
    },
  };
};
