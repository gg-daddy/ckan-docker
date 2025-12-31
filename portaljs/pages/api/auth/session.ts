import type { NextApiRequest, NextApiResponse } from 'next';
import {
  SessionResponse,
  AUTH_COOKIE_NAME,
  deserializeSession,
  isSessionExpired,
} from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SessionResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ authenticated: false });
  }

  try {
    // Get session cookie
    const cookieValue = req.cookies[AUTH_COOKIE_NAME];

    if (!cookieValue) {
      return res.status(200).json({ authenticated: false });
    }

    // Deserialize session
    const session = deserializeSession(cookieValue);

    if (!session) {
      // Invalid session format, clear cookie
      res.setHeader(
        'Set-Cookie',
        `${AUTH_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
      );
      return res.status(200).json({ authenticated: false });
    }

    // Check if session is expired
    if (isSessionExpired(session)) {
      // Session expired, clear cookie
      res.setHeader(
        'Set-Cookie',
        `${AUTH_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
      );
      return res.status(200).json({ authenticated: false });
    }

    // Session is valid
    return res.status(200).json({
      authenticated: true,
      user: session.user,
    });
  } catch (error) {
    console.error('Session check error:', error);
    return res.status(200).json({ authenticated: false });
  }
}
