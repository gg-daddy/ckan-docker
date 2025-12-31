/**
 * Authentication utilities and types for PortalJS
 */

// User type returned from CKAN API
export interface CkanUser {
  id: string;
  name: string;
  fullname: string | null;
  email: string;
  created: string;
  about: string | null;
  sysadmin: boolean;
  state: string;
  image_url: string | null;
  display_name: string;
  email_hash: string;
  number_created_packages: number;
}

// Session data stored in cookie
export interface SessionData {
  user: {
    id: string;
    name: string;
    displayName: string;
    email: string;
    sysadmin: boolean;
  };
  apiToken: string;
  expiresAt: number;
}

// Auth state for React context
export interface AuthState {
  user: SessionData['user'] | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Login credentials
export interface LoginCredentials {
  username: string;
  password: string;
}

// API response types
export interface LoginResponse {
  success: boolean;
  user?: SessionData['user'];
  error?: string;
}

export interface LogoutResponse {
  success: boolean;
}

export interface SessionResponse {
  authenticated: boolean;
  user?: SessionData['user'];
}

// Cookie configuration
export const AUTH_COOKIE_NAME = 'portaljs_session';
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

/**
 * Serialize session data for cookie storage
 */
export function serializeSession(session: SessionData): string {
  return Buffer.from(JSON.stringify(session)).toString('base64');
}

/**
 * Deserialize session data from cookie
 */
export function deserializeSession(cookieValue: string): SessionData | null {
  try {
    const json = Buffer.from(cookieValue, 'base64').toString('utf-8');
    return JSON.parse(json) as SessionData;
  } catch {
    return null;
  }
}

/**
 * Check if session is expired
 */
export function isSessionExpired(session: SessionData): boolean {
  return Date.now() > session.expiresAt;
}
