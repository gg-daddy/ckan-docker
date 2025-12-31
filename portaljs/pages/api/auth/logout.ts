import type { NextApiRequest, NextApiResponse } from 'next';
import { LogoutResponse, AUTH_COOKIE_NAME } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LogoutResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false });
  }

  // Clear the session cookie by setting it to expire immediately
  res.setHeader(
    'Set-Cookie',
    `${AUTH_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  );

  return res.status(200).json({ success: true });
}
