import type { NextApiRequest, NextApiResponse } from 'next';
import {
  LoginResponse,
  SessionData,
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_MAX_AGE,
  serializeSession,
  CkanUser,
  UserOrganization,
} from '@/lib/auth';

// CKAN API URL (internal Docker network)
const CKAN_API_URL = process.env.CKAN_API_URL || 'http://ckan-dev:5000';

interface CkanApiResponse<T> {
  success: boolean;
  result?: T;
  error?: {
    message: string;
    __type: string;
  };
}

/**
 * Authenticate user with CKAN
 * CKAN doesn't have a direct login API, so we:
 * 1. Try to get user info with provided credentials
 * 2. If successful, create an API token for the session
 */
async function authenticateWithCkan(
  username: string,
  password: string
): Promise<{ user: CkanUser; apiToken: string } | null> {
  try {
    // First, try to authenticate by calling user_show with the user's own credentials
    // We need to use the site-wide API key or try a different approach

    // CKAN 2.10+ supports user authentication via the API
    // We'll try to create an API token which requires valid credentials

    // Step 1: Try to get user info using basic auth or session
    // For CKAN, we need to use the internal authentication mechanism

    // Approach: Use CKAN's user_login action if available, or
    // authenticate via session cookie and then get user info

    // For now, let's use the CKAN sysadmin credentials to validate the user
    // In production, you'd want to use CKAN's proper auth mechanism

    const sysadminApiKey = process.env.CKAN_SYSADMIN_API_KEY;

    // Try to authenticate using CKAN's user_show to verify user exists
    const userResponse = await fetch(`${CKAN_API_URL}/api/3/action/user_show`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(sysadminApiKey && { Authorization: sysadminApiKey }),
      },
      body: JSON.stringify({ id: username }),
    });

    const userData: CkanApiResponse<CkanUser> = await userResponse.json();

    if (!userData.success || !userData.result) {
      console.error('User not found:', username);
      return null;
    }

    // For CKAN authentication, we need to validate the password
    // CKAN doesn't expose a direct password validation API
    // We'll use CKAN's web login to validate credentials

    const loginResponse = await fetch(`${CKAN_API_URL}/login_generic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        login: username,
        password: password,
      }),
      redirect: 'manual', // Don't follow redirects
    });

    // CKAN returns a redirect on successful login
    // Check for session cookie or redirect to dashboard
    const setCookieHeader = loginResponse.headers.get('set-cookie');
    const locationHeader = loginResponse.headers.get('location');

    // If we got redirected to dashboard or got a session cookie, login was successful
    const isLoginSuccessful =
      (loginResponse.status === 302 && locationHeader && !locationHeader.includes('login')) ||
      (setCookieHeader && setCookieHeader.includes('ckan'));

    if (!isLoginSuccessful) {
      console.error('Invalid password for user:', username);
      return null;
    }

    // Create an API token for this session
    // We need to use the session from the login to create a token
    // For simplicity, we'll generate a session token on our side

    // Extract the CKAN session cookie if available
    let ckanSession = '';
    if (setCookieHeader) {
      const match = setCookieHeader.match(/ckan=([^;]+)/);
      if (match) {
        ckanSession = match[1];
      }
    }

    // Try to create an API token using the session
    const tokenResponse = await fetch(`${CKAN_API_URL}/api/3/action/api_token_create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(ckanSession && { Cookie: `ckan=${ckanSession}` }),
      },
      body: JSON.stringify({
        user: username,
        name: `portaljs-session-${Date.now()}`,
      }),
    });

    const tokenData: CkanApiResponse<{ token: string }> = await tokenResponse.json();

    // Use the token if created, otherwise use session identifier
    const apiToken = tokenData.success && tokenData.result?.token
      ? tokenData.result.token
      : `session-${ckanSession || Date.now()}`;

    return {
      user: userData.result,
      apiToken,
    };
  } catch (error) {
    console.error('CKAN authentication error:', error);
    return null;
  }
}

/**
 * Fetch user's organization memberships from CKAN
 */
async function fetchUserOrganizations(
  username: string,
  apiToken: string
): Promise<UserOrganization[]> {
  try {
    const response = await fetch(
      `${CKAN_API_URL}/api/3/action/organization_list_for_user?id=${encodeURIComponent(username)}`,
      {
        headers: {
          Authorization: apiToken,
        },
      }
    );

    const data: CkanApiResponse<Array<{
      id: string;
      name: string;
      title: string;
      capacity: string;
    }>> = await response.json();

    if (data.success && data.result) {
      return data.result.map((org) => ({
        id: org.id,
        name: org.name,
        title: org.title,
        capacity: org.capacity,
      }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching user organizations:', error);
    return [];
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: 'Username and password are required',
    });
  }

  try {
    // Authenticate with CKAN
    const authResult = await authenticateWithCkan(username, password);

    if (!authResult) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password',
      });
    }

    const { user, apiToken } = authResult;

    // Fetch user's organization memberships
    const organizations = await fetchUserOrganizations(user.name, apiToken);

    // Create session data
    const sessionData: SessionData = {
      user: {
        id: user.id,
        name: user.name,
        displayName: user.display_name || user.fullname || user.name,
        email: user.email,
        sysadmin: user.sysadmin,
        organizations,
      },
      apiToken,
      expiresAt: Date.now() + AUTH_COOKIE_MAX_AGE * 1000,
    };

    // Serialize and set cookie
    const cookieValue = serializeSession(sessionData);

    res.setHeader(
      'Set-Cookie',
      `${AUTH_COOKIE_NAME}=${cookieValue}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${AUTH_COOKIE_MAX_AGE}`
    );

    return res.status(200).json({
      success: true,
      user: sessionData.user,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred during login',
    });
  }
}
