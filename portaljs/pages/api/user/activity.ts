import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserActivity } from '@/lib/ckan-api';

interface ActivityResponse {
  success: boolean;
  result?: Array<{
    timestamp: string;
    activity_type: string;
    data: Record<string, unknown>;
  }>;
  error?: string;
}

/**
 * GET /api/user/activity
 * Fetches user activity from CKAN using the logged-in user's credentials
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ActivityResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { userId, limit = '5' } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ success: false, error: 'userId is required' });
  }

  // Fetch activity using authenticated CKAN API call
  const data = await getUserActivity(userId, req, parseInt(limit as string, 10));

  if (data.success && data.result) {
    return res.status(200).json({
      success: true,
      result: data.result as ActivityResponse['result'],
    });
  }

  // Return empty array on error (activity is non-critical feature)
  console.error('Activity API error:', data.error);
  return res.status(200).json({
    success: true,
    result: [],
  });
}
