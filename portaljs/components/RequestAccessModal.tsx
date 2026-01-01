import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CkanResource, CkanDataset } from '@/lib/ckan';
import Link from 'next/link';

interface RequestAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: CkanResource;
  dataset: CkanDataset;
}

export default function RequestAccessModal({
  isOpen,
  onClose,
  resource,
  dataset,
}: RequestAccessModalProps) {
  const { user, isAuthenticated } = useAuth();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Require authentication
    if (!isAuthenticated || !user) {
      setSubmitStatus('error');
      setErrorMessage('You must be logged in to request access');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/resource/request-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resourceId: resource.id,
          resourceName: resource.name,
          datasetId: dataset.id,
          datasetName: dataset.name,
          datasetTitle: dataset.title,
          maintainerEmail: dataset.maintainer_email || dataset.author_email,
          requesterName: user.displayName || user.name,
          requesterEmail: user.email,
          reason: reason,
          username: user.name,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Failed to submit request');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitStatus('idle');
    setReason('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all max-h-[90vh] flex flex-col">
          {/* Header - Fixed */}
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Request Access
              </h3>
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Request access to: <strong>{resource.name}</strong>
            </p>
          </div>

          {/* Content - Scrollable */}
          <div className="px-6 py-4 overflow-y-auto flex-1">
            {!isAuthenticated ? (
              // Not logged in - show login prompt
              <div className="text-center py-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                  <svg
                    className="h-6 w-6 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h4 className="mt-3 text-lg font-medium text-gray-900 dark:text-white">
                  Login Required
                </h4>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  You must be logged in to request access to this resource.
                  This ensures we can verify your identity and notify you when access is granted.
                </p>
                <div className="mt-4 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <Link
                    href="/user/login"
                    className="inline-flex justify-center rounded-md bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500"
                  >
                    Log in
                  </Link>
                </div>
              </div>
            ) : submitStatus === 'success' ? (
              // Success state
              <div className="text-center py-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h4 className="mt-3 text-lg font-medium text-gray-900 dark:text-white">
                  Request Submitted
                </h4>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Your access request has been sent to the dataset maintainer.
                  You will be notified at <strong>{user?.email}</strong> when your request is approved.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-4 inline-flex justify-center rounded-md bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500"
                >
                  Close
                </button>
              </div>
            ) : (
              // Authenticated - show form with user info (read-only) + reason
              <form id="request-access-form" onSubmit={handleSubmit} className="space-y-4">
                {submitStatus === 'error' && (
                  <div className="rounded-md bg-red-50 p-3">
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>
                )}

                {/* User info - read only */}
                <div className="rounded-md bg-gray-50 dark:bg-gray-700/50 p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Requesting as
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.displayName || user?.name}
                  </p>
                  {user?.email && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="reason"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Reason for Access <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="reason"
                    required
                    rows={2}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                    placeholder="Please explain why you need access to this resource..."
                  />
                </div>
              </form>
            )}
          </div>

          {/* Footer - Fixed (only for authenticated form view) */}
          {isAuthenticated && submitStatus !== 'success' && (
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="request-access-form"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#7c3aed' }}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
