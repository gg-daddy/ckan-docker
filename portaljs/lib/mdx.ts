import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'datasets');

export interface MDXFrontmatter {
  datasetId?: string;
  title?: string;
  description?: string;
  author?: string;
  lastUpdated?: string;
  sections?: string[];
  relatedDatasets?: string[];
  features?: {
    showChart?: boolean;
    showTable?: boolean;
    showDownloadButton?: boolean;
    showResources?: boolean;
  };
  [key: string]: unknown;
}

export interface MDXContent {
  content: string;
  frontmatter: MDXFrontmatter;
}

/**
 * Get MDX content for a specific dataset by ID
 * Convention: MDX filename should match CKAN dataset ID/name
 */
export function getMDXForDataset(datasetId: string): MDXContent | null {
  // Ensure content directory exists
  if (!fs.existsSync(CONTENT_DIR)) {
    console.warn(`Content directory does not exist: ${CONTENT_DIR}`);
    return null;
  }

  // Try to find MDX file matching the dataset ID
  const mdxPath = path.join(CONTENT_DIR, `${datasetId}.mdx`);
  const mdPath = path.join(CONTENT_DIR, `${datasetId}.md`);

  let filePath: string | null = null;

  if (fs.existsSync(mdxPath)) {
    filePath = mdxPath;
  } else if (fs.existsSync(mdPath)) {
    filePath = mdPath;
  }

  if (!filePath) {
    return null;
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { content, data } = matter(fileContent);

    return {
      content,
      frontmatter: data as MDXFrontmatter,
    };
  } catch (error) {
    console.error(`Error reading MDX file for dataset ${datasetId}:`, error);
    return null;
  }
}

/**
 * Get all dataset IDs that have MDX content
 */
export function getAllMDXDatasetIds(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  try {
    const files = fs.readdirSync(CONTENT_DIR);
    return files
      .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
      .filter((file) => !file.startsWith('_')) // Ignore files starting with underscore
      .map((file) => file.replace(/\.(mdx|md)$/, ''));
  } catch (error) {
    console.error('Error reading content directory:', error);
    return [];
  }
}

/**
 * Get all MDX files with their metadata
 */
export function getAllMDXContent(): Array<{ id: string; frontmatter: MDXFrontmatter }> {
  const ids = getAllMDXDatasetIds();

  return ids.map((id) => {
    const mdx = getMDXForDataset(id);
    return {
      id,
      frontmatter: mdx?.frontmatter || {},
    };
  });
}

/**
 * Check if a dataset has MDX content
 */
export function hasMDXContent(datasetId: string): boolean {
  if (!fs.existsSync(CONTENT_DIR)) {
    return false;
  }

  const mdxPath = path.join(CONTENT_DIR, `${datasetId}.mdx`);
  const mdPath = path.join(CONTENT_DIR, `${datasetId}.md`);

  return fs.existsSync(mdxPath) || fs.existsSync(mdPath);
}
