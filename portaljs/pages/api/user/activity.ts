import type { NextApiRequest, NextApiResponse } from 'next';

// Use same CKAN URL as other API routes
const CKAN_URL = process.env.CKAN_API_URL || 'http://ckan-dev:5000';

interface ActivityResponse {
  success: boolean;
  result?: Array<{
    timestamp: string;
    activity_type: string;
    data: Record<string, unknown>;
  }>;
  error?: string;
}

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

  try {
    // Use sysadmin API key if available for authentication
    const sysadminApiKey = process.env.CKAN_SYSADMIN_API_KEY;

    const response = await fetch(
      `${CKAN_URL}/api/3/action/user_activity_list?id=${encodeURIComponent(userId)}&limit=${limit}`,
      {
        headers: {
          ...(sysadminApiKey && { Authorization: sysadminApiKey }),
        },
      }
    );

    // Handle non-JSON response (e.g., CKAN not available)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Activity API: CKAN returned non-JSON response');
      return res.status(200).json({
        success: true,
        result: [], // Return empty array instead of error
      });
    }

    const data = await response.json();

    if (data.success) {
      return res.status(200).json({
        success: true,
        result: data.result,
      });
    } else {
      // Return empty array on CKAN error (non-critical feature)
      console.error('Activity API error:', data.error);
      return res.status(200).json({
        success: true,
        result: [],
      });
    }
  } catch (error) {
    console.error('Activity fetch error:', error);
    // Return empty array instead of 500 error (activity is non-critical)
    return res.status(200).json({
      success: true,
      result: [],
    });
  }
}
