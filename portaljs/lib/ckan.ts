import getConfig from 'next/config';

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig() || {};

/**
 * Get the CKAN API URL based on environment
 * Server-side: use internal Docker network URL
 * Client-side: use public URL
 */
const getCkanApiUrl = (): string => {
  if (typeof window === 'undefined') {
    // Server-side: use internal URL
    return serverRuntimeConfig?.ckanApiUrl || process.env.CKAN_API_URL || 'http://ckan:5000';
  }
  // Client-side: use public URL
  return publicRuntimeConfig?.ckanUrl || process.env.NEXT_PUBLIC_CKAN_URL || 'https://localhost:8443';
};

// Access Level types for resource access control
export type AccessLevel = 'public' | 'registered' | 'same_organization' | 'only_allowed_users';

// CKAN API Types
export interface CkanResource {
  id: string;
  name: string;
  format: string;
  url: string;
  description: string;
  size?: number;
  created?: string;
  last_modified?: string;
  mimetype?: string;
  // Access control fields (from ckanext-scheming)
  access_level?: AccessLevel;
  allowed_users?: string;
}

export interface CkanOrganization {
  id: string;
  name: string;
  title: string;
  description?: string;
  image_url?: string;
  created?: string;
  state?: string;
}

export interface CkanGroup {
  id: string;
  name: string;
  title: string;
  description?: string;
  image_url?: string;
}

export interface CkanTag {
  id: string;
  name: string;
  display_name: string;
}

export interface CkanDataset {
  id: string;
  name: string;
  title: string;
  notes: string;
  resources: CkanResource[];
  organization?: CkanOrganization;
  groups?: CkanGroup[];
  tags?: CkanTag[];
  metadata_created: string;
  metadata_modified: string;
  author?: string;
  author_email?: string;
  maintainer?: string;
  maintainer_email?: string;
  license_id?: string;
  license_title?: string;
  url?: string;
  state?: string;
  type?: string;
  num_resources?: number;
  num_tags?: number;
}

// Facet types for search
export interface FacetItem {
  name: string;
  display_name: string;
  count: number;
}

export interface SearchFacets {
  tags?: { title: string; items: FacetItem[] };
  organization?: { title: string; items: FacetItem[] };
  res_format?: { title: string; items: FacetItem[] };
  groups?: { title: string; items: FacetItem[] };
}

export interface CkanSearchResult {
  results: CkanDataset[];
  count: number;
  facets?: Record<string, Record<string, number>>;
  search_facets?: SearchFacets;
}

export interface CkanApiResponse<T> {
  success: boolean;
  result: T;
  error?: {
    message: string;
    __type: string;
  };
}

// Sort options for search
export type SortOption = 'relevance' | 'modified' | 'name' | 'created';

export const SORT_OPTIONS: { value: SortOption; label: string; param: string }[] = [
  { value: 'relevance', label: 'Relevance', param: 'score desc' },
  { value: 'modified', label: 'Last Modified', param: 'metadata_modified desc' },
  { value: 'created', label: 'Newest', param: 'metadata_created desc' },
  { value: 'name', label: 'Name (A-Z)', param: 'title_string asc' },
];

/**
 * Fetch a single dataset by ID or name
 */
export async function getDataset(nameOrId: string): Promise<CkanDataset | null> {
  try {
    const baseUrl = getCkanApiUrl();
    const res = await fetch(`${baseUrl}/api/3/action/package_show?id=${encodeURIComponent(nameOrId)}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch dataset: ${res.statusText}`);
    }

    const data: CkanApiResponse<CkanDataset> = await res.json();

    if (data.success) {
      return data.result;
    }

    return null;
  } catch (error) {
    console.error('Error fetching dataset:', error);
    return null;
  }
}

/**
 * Search datasets with optional parameters
 */
export async function searchDatasets(params: {
  q?: string;
  rows?: number;
  start?: number;
  fq?: string;
  sort?: string;
  facet?: string;
} = {}): Promise<CkanSearchResult> {
  try {
    const baseUrl = getCkanApiUrl();
    const searchParams = new URLSearchParams();

    if (params.q) searchParams.set('q', params.q);
    if (params.rows) searchParams.set('rows', params.rows.toString());
    if (params.start) searchParams.set('start', params.start.toString());
    if (params.fq) searchParams.set('fq', params.fq);
    if (params.sort) searchParams.set('sort', params.sort);
    if (params.facet) searchParams.set('facet', params.facet);

    const res = await fetch(`${baseUrl}/api/3/action/package_search?${searchParams}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Failed to search datasets: ${res.statusText}`);
    }

    const data: CkanApiResponse<CkanSearchResult> = await res.json();

    if (data.success) {
      return data.result;
    }

    return { results: [], count: 0 };
  } catch (error) {
    console.error('Error searching datasets:', error);
    return { results: [], count: 0 };
  }
}

/**
 * Search datasets with faceted filtering
 * Supports filtering by tags (topics), organizations, and resource formats
 */
export interface FacetedSearchParams {
  q?: string;
  tags?: string[];
  organization?: string[];
  format?: string[];
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface FacetedSearchResult extends CkanSearchResult {
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function searchDatasetsWithFacets(params: FacetedSearchParams = {}): Promise<FacetedSearchResult> {
  try {
    const baseUrl = getCkanApiUrl();
    const searchParams = new URLSearchParams();

    // Query
    if (params.q && params.q.trim()) {
      searchParams.set('q', params.q.trim());
    }

    // Pagination
    const page = params.page || 1;
    const pageSize = params.pageSize || 12;
    searchParams.set('rows', pageSize.toString());
    searchParams.set('start', ((page - 1) * pageSize).toString());

    // Sort
    if (params.sort) {
      const sortOption = SORT_OPTIONS.find(s => s.value === params.sort);
      if (sortOption) {
        searchParams.set('sort', sortOption.param);
      }
    }

    // Enable facets
    searchParams.set('facet', 'true');
    searchParams.set('facet.field', '["tags", "organization", "res_format"]');
    searchParams.set('facet.limit', '50');

    // Build filter query (fq)
    const filterQueries: string[] = [];

    if (params.tags && params.tags.length > 0) {
      const tagFilters = params.tags.map(tag => `tags:"${tag}"`).join(' OR ');
      filterQueries.push(`(${tagFilters})`);
    }

    if (params.organization && params.organization.length > 0) {
      const orgFilters = params.organization.map(org => `organization:"${org}"`).join(' OR ');
      filterQueries.push(`(${orgFilters})`);
    }

    if (params.format && params.format.length > 0) {
      const formatFilters = params.format.map(fmt => `res_format:"${fmt}"`).join(' OR ');
      filterQueries.push(`(${formatFilters})`);
    }

    if (filterQueries.length > 0) {
      searchParams.set('fq', filterQueries.join(' AND '));
    }

    const res = await fetch(`${baseUrl}/api/3/action/package_search?${searchParams}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 30 }, // Shorter cache for search results
    });

    if (!res.ok) {
      throw new Error(`Failed to search datasets: ${res.statusText}`);
    }

    const data: CkanApiResponse<CkanSearchResult> = await res.json();

    if (data.success) {
      const result = data.result;
      return {
        ...result,
        page,
        pageSize,
        totalPages: Math.ceil(result.count / pageSize),
      };
    }

    return {
      results: [],
      count: 0,
      page,
      pageSize,
      totalPages: 0,
    };
  } catch (error) {
    console.error('Error searching datasets with facets:', error);
    return {
      results: [],
      count: 0,
      page: params.page || 1,
      pageSize: params.pageSize || 12,
      totalPages: 0,
    };
  }
}

/**
 * Get all tags with their usage counts
 * Uses package_search with facets to get accurate counts
 */
export interface TagWithCount {
  name: string;
  display_name: string;
  count: number;
}

export async function getTagsWithCounts(): Promise<TagWithCount[]> {
  try {
    const baseUrl = getCkanApiUrl();
    const searchParams = new URLSearchParams();
    searchParams.set('rows', '0');
    searchParams.set('facet', 'true');
    searchParams.set('facet.field', '["tags"]');
    searchParams.set('facet.limit', '100');

    const res = await fetch(`${baseUrl}/api/3/action/package_search?${searchParams}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch tags with counts: ${res.statusText}`);
    }

    const data: CkanApiResponse<CkanSearchResult> = await res.json();

    if (data.success && data.result.search_facets?.tags) {
      return data.result.search_facets.tags.items.map(item => ({
        name: item.name,
        display_name: item.display_name || item.name,
        count: item.count,
      }));
    }

    // Fallback: use facets object
    if (data.success && data.result.facets?.tags) {
      return Object.entries(data.result.facets.tags).map(([name, count]) => ({
        name,
        display_name: name,
        count,
      }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching tags with counts:', error);
    return [];
  }
}

/**
 * Get organization with counts
 */
export interface OrganizationWithCount extends CkanOrganization {
  package_count?: number;
}

export async function getOrganizationsWithCounts(): Promise<OrganizationWithCount[]> {
  try {
    const baseUrl = getCkanApiUrl();
    const res = await fetch(`${baseUrl}/api/3/action/organization_list?all_fields=true&include_dataset_count=true`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch organizations: ${res.statusText}`);
    }

    const data: CkanApiResponse<OrganizationWithCount[]> = await res.json();
    return data.success ? data.result : [];
  } catch (error) {
    console.error('Error fetching organizations with counts:', error);
    return [];
  }
}

/**
 * Get available resource formats with counts
 */
export interface FormatWithCount {
  name: string;
  count: number;
}

export async function getFormatsWithCounts(): Promise<FormatWithCount[]> {
  try {
    const baseUrl = getCkanApiUrl();
    const searchParams = new URLSearchParams();
    searchParams.set('rows', '0');
    searchParams.set('facet', 'true');
    searchParams.set('facet.field', '["res_format"]');
    searchParams.set('facet.limit', '50');

    const res = await fetch(`${baseUrl}/api/3/action/package_search?${searchParams}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch formats: ${res.statusText}`);
    }

    const data: CkanApiResponse<CkanSearchResult> = await res.json();

    if (data.success && data.result.search_facets?.res_format) {
      return data.result.search_facets.res_format.items.map(item => ({
        name: item.name,
        count: item.count,
      }));
    }

    // Fallback: use facets object
    if (data.success && data.result.facets?.res_format) {
      return Object.entries(data.result.facets.res_format).map(([name, count]) => ({
        name,
        count,
      }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching formats with counts:', error);
    return [];
  }
}

/**
 * Get all organizations
 */
export async function getOrganizations(): Promise<CkanOrganization[]> {
  try {
    const baseUrl = getCkanApiUrl();
    const res = await fetch(`${baseUrl}/api/3/action/organization_list?all_fields=true`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch organizations: ${res.statusText}`);
    }

    const data: CkanApiResponse<CkanOrganization[]> = await res.json();
    return data.success ? data.result : [];
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return [];
  }
}

/**
 * Get all groups
 */
export async function getGroups(): Promise<CkanGroup[]> {
  try {
    const baseUrl = getCkanApiUrl();
    const res = await fetch(`${baseUrl}/api/3/action/group_list?all_fields=true`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch groups: ${res.statusText}`);
    }

    const data: CkanApiResponse<CkanGroup[]> = await res.json();
    return data.success ? data.result : [];
  } catch (error) {
    console.error('Error fetching groups:', error);
    return [];
  }
}

/**
 * Get all tags
 */
export async function getTags(): Promise<CkanTag[]> {
  try {
    const baseUrl = getCkanApiUrl();
    const res = await fetch(`${baseUrl}/api/3/action/tag_list?all_fields=true`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch tags: ${res.statusText}`);
    }

    const data: CkanApiResponse<CkanTag[]> = await res.json();
    return data.success ? data.result : [];
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

/**
 * Get site statistics
 */
export async function getSiteStats(): Promise<{
  dataset_count: number;
  organization_count: number;
  group_count: number;
  tag_count: number;
} | null> {
  try {
    const baseUrl = getCkanApiUrl();
    const res = await fetch(`${baseUrl}/api/3/action/site_read`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      // Fallback: count manually
      const [datasets, orgs, groups] = await Promise.all([
        searchDatasets({ rows: 0 }),
        getOrganizations(),
        getGroups(),
      ]);

      return {
        dataset_count: datasets.count,
        organization_count: orgs.length,
        group_count: groups.length,
        tag_count: 0,
      };
    }

    const data = await res.json();
    return data.success ? data.result : null;
  } catch (error) {
    console.error('Error fetching site stats:', error);
    return null;
  }
}

/**
 * Get recent datasets
 */
export async function getRecentDatasets(limit: number = 6): Promise<CkanDataset[]> {
  try {
    const result = await searchDatasets({
      rows: limit,
      sort: 'metadata_modified desc',
    });
    return result.results;
  } catch (error) {
    console.error('Error fetching recent datasets:', error);
    return [];
  }
}

/**
 * Fetch a single dataset by ID or name (client-side)
 * This version is optimized for client-side use without Next.js cache headers
 */
export async function fetchDatasetClient(nameOrId: string): Promise<CkanDataset | null> {
  try {
    const baseUrl = getCkanApiUrl();
    const res = await fetch(`${baseUrl}/api/3/action/package_show?id=${encodeURIComponent(nameOrId)}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data on client
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch dataset: ${res.statusText}`);
    }

    const data: CkanApiResponse<CkanDataset> = await res.json();

    if (data.success) {
      return data.result;
    }

    return null;
  } catch (error) {
    console.error('Error fetching dataset (client):', error);
    return null;
  }
}

/**
 * Format a resource format string for display
 */
export function formatResourceFormat(format: string): string {
  const upper = format.toUpperCase();
  const formatMap: Record<string, string> = {
    'CSV': 'CSV',
    'JSON': 'JSON',
    'XML': 'XML',
    'PDF': 'PDF',
    'XLS': 'XLS',
    'XLSX': 'XLSX',
    'GEOJSON': 'GeoJSON',
    'SHP': 'Shapefile',
    'ZIP': 'ZIP',
    'HTML': 'HTML',
    'API': 'API',
    'WMS': 'WMS',
    'WFS': 'WFS',
  };
  return formatMap[upper] || upper;
}

/**
 * Get CSS class for resource format badge
 */
export function getFormatBadgeClass(format: string): string {
  const lower = format.toLowerCase();
  const classMap: Record<string, string> = {
    'csv': 'format-csv',
    'json': 'format-json',
    'geojson': 'format-json',
    'pdf': 'format-pdf',
    'xml': 'format-xml',
    'xls': 'format-xlsx',
    'xlsx': 'format-xlsx',
  };
  return classMap[lower] || 'format-default';
}
