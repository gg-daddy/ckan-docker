import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CkanResource, CkanDataset, AccessLevel } from '@/lib/ckan';

export interface ResourceAccessResult {
  canAccess: boolean;
  accessLevel: AccessLevel;
  reason: string;
  requiresLogin: boolean;
  requiresRequest: boolean;
}

/**
 * Hook to determine if the current user can access a resource
 * based on its access_level and allowed_users fields
 */
export function useResourceAccess(
  resource: CkanResource,
  dataset?: CkanDataset
): ResourceAccessResult {
  const { user, isAuthenticated } = useAuth();

  return useMemo(() => {
    const accessLevel = resource.access_level || 'public';

    // Public resources - everyone can access
    if (accessLevel === 'public') {
      return {
        canAccess: true,
        accessLevel,
        reason: 'This resource is publicly available',
        requiresLogin: false,
        requiresRequest: false,
      };
    }

    // Registered users - must be logged in
    if (accessLevel === 'registered') {
      if (isAuthenticated) {
        return {
          canAccess: true,
          accessLevel,
          reason: 'Available to registered users',
          requiresLogin: false,
          requiresRequest: false,
        };
      }
      return {
        canAccess: false,
        accessLevel,
        reason: 'Please log in to download this resource',
        requiresLogin: true,
        requiresRequest: false,
      };
    }

    // Same organization - must be a member of the dataset's organization
    if (accessLevel === 'same_organization') {
      if (!isAuthenticated) {
        return {
          canAccess: false,
          accessLevel,
          reason: 'Please log in to download this resource',
          requiresLogin: true,
          requiresRequest: false,
        };
      }

      // Check if user is in the same organization
      const datasetOrgName = dataset?.organization?.name;
      const userOrgs = user?.organizations || [];
      const isInSameOrg = userOrgs.some((org: any) => org.name === datasetOrgName);

      if (isInSameOrg) {
        return {
          canAccess: true,
          accessLevel,
          reason: 'Available to organization members',
          requiresLogin: false,
          requiresRequest: false,
        };
      }

      return {
        canAccess: false,
        accessLevel,
        reason: 'This resource is only available to members of the dataset\'s organization',
        requiresLogin: false,
        requiresRequest: true,
      };
    }

    // Only allowed users - must be in the allowed_users list
    if (accessLevel === 'only_allowed_users') {
      if (!isAuthenticated) {
        return {
          canAccess: false,
          accessLevel,
          reason: 'Please log in to download this resource',
          requiresLogin: true,
          requiresRequest: false,
        };
      }

      // Parse allowed_users (comma-separated string)
      const allowedUsers = resource.allowed_users
        ?.split(',')
        .map((u) => u.trim().toLowerCase())
        .filter(Boolean) || [];

      const currentUsername = user?.name?.toLowerCase();

      if (currentUsername && allowedUsers.includes(currentUsername)) {
        return {
          canAccess: true,
          accessLevel,
          reason: 'You have been granted access to this resource',
          requiresLogin: false,
          requiresRequest: false,
        };
      }

      return {
        canAccess: false,
        accessLevel,
        reason: 'Access to this resource is restricted. Please request access.',
        requiresLogin: false,
        requiresRequest: true,
      };
    }

    // Default - allow access for unknown access levels
    return {
      canAccess: true,
      accessLevel,
      reason: 'Resource access level unknown',
      requiresLogin: false,
      requiresRequest: false,
    };
  }, [resource, dataset, user, isAuthenticated]);
}

/**
 * Get a human-readable label for an access level
 */
export function getAccessLevelLabel(accessLevel: AccessLevel): string {
  const labels: Record<AccessLevel, string> = {
    public: 'Public',
    registered: 'Registered Users',
    same_organization: 'Organization Only',
    only_allowed_users: 'Restricted',
  };
  return labels[accessLevel] || 'Unknown';
}

/**
 * Get the CSS color class for an access level badge
 */
export function getAccessLevelColor(accessLevel: AccessLevel): string {
  const colors: Record<AccessLevel, string> = {
    public: 'bg-green-100 text-green-800',
    registered: 'bg-blue-100 text-blue-800',
    same_organization: 'bg-yellow-100 text-yellow-800',
    only_allowed_users: 'bg-red-100 text-red-800',
  };
  return colors[accessLevel] || 'bg-gray-100 text-gray-800';
}
