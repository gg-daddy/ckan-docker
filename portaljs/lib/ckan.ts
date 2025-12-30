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

export interface CkanSearchResult {
  results: CkanDataset[];
  count: number;
  facets?: Record<string, Record<string, number>>;
}

export interface CkanApiResponse<T> {
  success: boolean;
  result: T;
  error?: {
    message: string;
    __type: string;
  };
}

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
