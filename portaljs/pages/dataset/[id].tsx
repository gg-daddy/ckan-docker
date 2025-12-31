import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import Layout from '@/components/Layout';
import ResourceList from '@/components/ResourceList';
import ResourceBadge from '@/components/ResourceBadge';
import ColabButton from '@/components/ColabButton';
import ColabBanner from '@/components/ColabBanner';
import { getDataset, CkanDataset } from '@/lib/ckan';
import { getMDXForDataset, MDXFrontmatter } from '@/lib/mdx';

interface DatasetPageProps {
  dataset: CkanDataset;
  mdxSource: MDXRemoteSerializeResult | null;
  frontmatter: MDXFrontmatter | null;
}

// Custom MDX components
const mdxComponents = {
  // Add custom components here that can be used in MDX files
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
    return <code {...props} />;
  },
  pre: (props: any) => (
    <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-4" {...props} />
  ),
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
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container-main py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
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
                  className="ml-2 text-gray-500 hover:text-gray-700"
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
                <span className="ml-2 text-gray-900 font-medium truncate max-w-xs">
                  {dataset.title}
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container-main py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {dataset.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
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
                      className="badge-gray hover:bg-gray-200"
                    >
                      {tag.display_name}
                    </Link>
                  ))}
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
                    <p className="text-gray-700 whitespace-pre-wrap">{dataset.notes}</p>
                  ) : (
                    <p className="text-gray-500 italic">
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
              <ResourceList resources={dataset.resources} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Actions Card */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Actions
                </h3>
                <div className="space-y-3">
                  <a
                    href={`/dataset/edit/${dataset.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary w-full"
                  >
                    <svg
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit in CKAN
                  </a>
                  <a
                    href={`/api/3/action/package_show?id=${dataset.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary w-full"
                  >
                    <svg
                      className="h-4 w-4 mr-2"
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
                    View API
                  </a>
                  {frontmatter?.colabNotebook && (
                    <ColabButton
                      notebookPath={frontmatter.colabNotebook}
                      className="btn-secondary w-full"
                    />
                  )}
                </div>
              </div>

              {/* Formats Card */}
              {dataset.resources && dataset.resources.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Available Formats
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      ...new Set(
                        dataset.resources
                          .map((r) => r.format?.toUpperCase())
                          .filter(Boolean)
                      ),
                    ].map((format) => (
                      <ResourceBadge key={format} format={format as string} />
                    ))}
                  </div>
                </div>
              )}

              {/* Info Card */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Dataset Info
                </h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-gray-500">ID</dt>
                    <dd className="text-gray-900 font-mono text-xs break-all">
                      {dataset.id}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Name</dt>
                    <dd className="text-gray-900">{dataset.name}</dd>
                  </div>
                  {dataset.metadata_created && (
                    <div>
                      <dt className="text-gray-500">Created</dt>
                      <dd className="text-gray-900">
                        {new Date(dataset.metadata_created).toLocaleDateString()}
                      </dd>
                    </div>
                  )}
                  {dataset.author && (
                    <div>
                      <dt className="text-gray-500">Author</dt>
                      <dd className="text-gray-900">{dataset.author}</dd>
                    </div>
                  )}
                  {dataset.maintainer && (
                    <div>
                      <dt className="text-gray-500">Maintainer</dt>
                      <dd className="text-gray-900">{dataset.maintainer}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </aside>
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
