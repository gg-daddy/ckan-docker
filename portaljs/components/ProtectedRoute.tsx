import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import Layout from './Layout';

interface ProtectedRouteProps {
  children: ReactNode;
  /** Custom redirect path when not authenticated (default: /user/login) */
  redirectTo?: string;
  /** Whether to include returnUrl in redirect (default: true) */
  includeReturnUrl?: boolean;
  /** Custom loading component */
  loadingComponent?: ReactNode;
  /** Page title for loading state */
  loadingTitle?: string;
  /** Require sysadmin role */
  requireSysadmin?: boolean;
}

/**
 * HOC component that protects routes requiring authentication.
 * Automatically redirects to login page if user is not authenticated.
 *
 * @example
 * // Basic usage
 * <ProtectedRoute>
 *   <MyProtectedContent />
 * </ProtectedRoute>
 *
 * @example
 * // With sysadmin requirement
 * <ProtectedRoute requireSysadmin>
 *   <AdminOnlyContent />
 * </ProtectedRoute>
 */
export default function ProtectedRoute({
  children,
  redirectTo = '/user/login',
  includeReturnUrl = true,
  loadingComponent,
  loadingTitle = 'Loading',
  requireSysadmin = false,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      // Not authenticated - redirect to login
      if (!isAuthenticated) {
        const returnUrl = includeReturnUrl ? router.asPath : undefined;
        const redirectPath = returnUrl
          ? `${redirectTo}?returnUrl=${encodeURIComponent(returnUrl)}`
          : redirectTo;
        router.replace(redirectPath);
      }
      // Authenticated but not sysadmin when required
      else if (requireSysadmin && !user?.sysadmin) {
        // Redirect to home or show unauthorized
        router.replace('/');
      }
    }
  }, [
    isLoading,
    isAuthenticated,
    user?.sysadmin,
    requireSysadmin,
    router,
    redirectTo,
    includeReturnUrl,
  ]);

  // Show loading state
  if (isLoading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }

    return (
      <Layout title={loadingTitle} hideHeaderSearch>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  // Not authenticated or not authorized - don't render children (will redirect)
  if (!isAuthenticated || (requireSysadmin && !user?.sysadmin)) {
    return null;
  }

  // Authenticated (and authorized if required) - render children
  return <>{children}</>;
}

/**
 * Higher-order component version for wrapping page components
 *
 * @example
 * function MyPage() {
 *   return <div>Protected content</div>;
 * }
 *
 * export default withProtectedRoute(MyPage);
 *
 * @example
 * // With options
 * export default withProtectedRoute(MyPage, { requireSysadmin: true });
 */
export function withProtectedRoute<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) {
  const WithProtectedRouteComponent = (props: P) => {
    return (
      <ProtectedRoute {...options}>
        <WrappedComponent {...props} />
      </ProtectedRoute>
    );
  };

  // Set display name for debugging
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithProtectedRouteComponent.displayName = `withProtectedRoute(${displayName})`;

  return WithProtectedRouteComponent;
}
