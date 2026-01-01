import type { NextApiRequest, NextApiResponse } from 'next';
import { getSessionFromRequest } from '@/lib/auth';

interface RequestAccessBody {
  resourceId: string;
  resourceName: string;
  datasetId: string;
  datasetName: string;
  datasetTitle: string;
  maintainerEmail?: string;
  requesterName: string;
  requesterEmail: string;
  reason: string;
  username?: string;
}

interface RequestAccessResponse {
  success: boolean;
  error?: string;
  message?: string;
}

// CKAN API URL (internal Docker network)
const CKAN_API_URL = process.env.CKAN_API_URL || 'http://ckan-dev:5000';

/**
 * Send access request notification
 * This can be extended to use SMTP or other notification methods
 */
async function sendAccessRequestNotification(
  request: RequestAccessBody,
  apiToken?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Log the request for now (can be replaced with actual email sending)
    console.log('=== Access Request Received ===');
    console.log(`Resource: ${request.resourceName} (${request.resourceId})`);
    console.log(`Dataset: ${request.datasetTitle} (${request.datasetId})`);
    console.log(`Requester: ${request.requesterName} <${request.requesterEmail}>`);
    console.log(`Username: ${request.username || 'Not logged in'}`);
    console.log(`Reason: ${request.reason}`);
    console.log(`Maintainer Email: ${request.maintainerEmail || 'Not set'}`);
    console.log('================================');

    // Option 1: Use CKAN's activity stream to log the request
    // This creates an audit trail in CKAN
    if (apiToken && request.username) {
      try {
        const activityResponse = await fetch(
          `${CKAN_API_URL}/api/3/action/activity_create`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: apiToken,
            },
            body: JSON.stringify({
              user_id: request.username,
              object_id: request.datasetId,
              activity_type: 'access_request',
              data: {
                resource_id: request.resourceId,
                resource_name: request.resourceName,
                reason: request.reason,
                requester_email: request.requesterEmail,
              },
            }),
          }
        );

        // Activity creation may fail if not supported, that's okay
        if (!activityResponse.ok) {
          console.log('Activity logging not available, continuing...');
        }
      } catch (activityError) {
        // Non-critical error, continue
        console.log('Activity logging failed, continuing...');
      }
    }

    // Option 2: TODO - Integrate with SMTP to send actual emails
    // Example with nodemailer:
    // const transporter = nodemailer.createTransport({
    //   host: process.env.SMTP_HOST,
    //   port: parseInt(process.env.SMTP_PORT || '587'),
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASSWORD,
    //   },
    // });
    //
    // await transporter.sendMail({
    //   from: process.env.SMTP_FROM,
    //   to: request.maintainerEmail,
    //   subject: `Access Request for ${request.resourceName}`,
    //   text: `...`,
    // });

    return { success: true };
  } catch (error) {
    console.error('Failed to send access request notification:', error);
    return {
      success: false,
      error: 'Failed to process access request',
    };
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RequestAccessResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Require authentication - users must be logged in to request access
  const session = getSessionFromRequest(req.cookies);
  if (!session || !session.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please log in to request access.',
    });
  }

  const apiToken = session.apiToken;
  const body: RequestAccessBody = req.body;

  // Validate required fields
  if (!body.resourceId || !body.reason) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: resourceId and reason are required',
    });
  }

  // Use authenticated user's info (ignore any client-provided name/email)
  body.requesterName = session.user.displayName || session.user.name || body.username || 'Unknown';
  body.requesterEmail = session.user.email || '';
  body.username = session.user.name;

  // Validate that we have a valid email from the session
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!body.requesterEmail || !emailRegex.test(body.requesterEmail)) {
    return res.status(400).json({
      success: false,
      error: 'Your account does not have a valid email address. Please update your profile.',
    });
  }

  // Check if maintainer email is set
  if (!body.maintainerEmail) {
    console.warn(
      `No maintainer email set for dataset ${body.datasetId}. Request logged but cannot be sent.`
    );
  }

  // Send notification
  const result = await sendAccessRequestNotification(body, apiToken);

  if (!result.success) {
    return res.status(500).json({
      success: false,
      error: result.error || 'Failed to submit access request',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Access request submitted successfully',
  });
}
