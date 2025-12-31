/**
 * CKAN API utilities for server-side API calls
 * Uses the authenticated user's token when available
 */

import type { NextApiRequest } from 'next';
import { getApiTokenFromRequest } from './auth';

// CKAN API URL (internal Docker network)
const CKAN_API_URL = process.env.CKAN_API_URL || 'http://ckan-dev:5000';

export interface CkanApiResponse<T = unknown> {
  success: boolean;
  result?: T;
  error?: {
    message: string;
    __type: string;
  };
}

export interface CkanFetchOptions {
  /** Use user's token from session (default: true) */
  useUserToken?: boolean;
  /** Additional headers */
  headers?: Record<string, string>;
  /** Request method (default: GET) */
  method?: 'GET' | 'POST';
  /** Request body for POST requests */
  body?: Record<string, unknown>;
}

/**
 * Make an authenticated request to CKAN API
 * Automatically uses the logged-in user's API token if available
 */
export async function ckanFetch<T = unknown>(
  endpoint: string,
  req: NextApiRequest,
  options: CkanFetchOptions = {}
): Promise<CkanApiResponse<T>> {
  const {
    useUserToken = true,
    headers = {},
    method = 'GET',
    body,
  } = options;

  // Get authentication token
  let authToken: string | null = null;

  if (useUserToken) {
    // Try to get user's token from session
    authToken = getApiTokenFromRequest(req.cookies);
  }

  // Fallback to sysadmin key if no user token
  if (!authToken) {
    authToken = process.env.CKAN_SYSADMIN_API_KEY || null;
  }

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${CKAN_API_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { Authorization: authToken }),
        ...headers,
      },
      ...(body && { body: JSON.stringify(body) }),
    });

    // Handle non-JSON response
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error(`CKAN API returned non-JSON response for ${endpoint}`);
      return {
        success: false,
        error: {
          message: 'CKAN service unavailable',
          __type: 'Service Error',
        },
      };
    }

    const data: CkanApiResponse<T> = await response.json();
    return data;
  } catch (error) {
    console.error(`CKAN API error for ${endpoint}:`, error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        __type: 'Network Error',
      },
    };
  }
}

/**
 * Get user activity list
 */
export async function getUserActivity(
  userId: string,
  req: NextApiRequest,
  limit: number = 5
) {
  return ckanFetch(
    `/api/3/action/user_activity_list?id=${encodeURIComponent(userId)}&limit=${limit}`,
    req
  );
}

/**
 * Get user information
 */
export async function getUser(userId: string, req: NextApiRequest) {
  return ckanFetch(`/api/3/action/user_show?id=${encodeURIComponent(userId)}`, req);
}

/**
 * Get package/dataset list for a user
 */
export async function getUserPackages(
  userId: string,
  req: NextApiRequest,
  limit: number = 10
) {
  return ckanFetch(
    `/api/3/action/package_search?fq=creator_user_id:${encodeURIComponent(userId)}&rows=${limit}`,
    req
  );
}

/**
 * Get organization list for a user
 */
export async function getUserOrganizations(userId: string, req: NextApiRequest) {
  return ckanFetch(
    `/api/3/action/organization_list_for_user?id=${encodeURIComponent(userId)}`,
    req
  );
}
