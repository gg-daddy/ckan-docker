import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig() || {};

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({
  children,
  title,
  description = 'Open Data Portal powered by CKAN and PortalJS',
}: LayoutProps) {
  const siteTitle = publicRuntimeConfig?.siteTitle || 'Data Portal';
  const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="container-main">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <svg
                  className="h-8 w-8 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                  />
                </svg>
                <span className="text-xl font-bold text-gray-900">{siteTitle}</span>
              </Link>

              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/search"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Datasets
                </Link>
                <Link
                  href="/ckan-admin/"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  target="_blank"
                >
                  Admin
                </Link>
              </nav>

              {/* Search Icon (Mobile) */}
              <div className="md:hidden">
                <Link href="/search" className="text-gray-600 hover:text-gray-900">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200">
          <div className="container-main py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* About */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  About
                </h3>
                <p className="mt-4 text-sm text-gray-600">
                  An open data portal providing access to datasets and resources.
                  Powered by CKAN and PortalJS.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Quick Links
                </h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link
                      href="/search"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Browse Datasets
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/api/3/action/package_list"
                      className="text-sm text-gray-600 hover:text-gray-900"
                      target="_blank"
                    >
                      API Documentation
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/ckan-admin/"
                      className="text-sm text-gray-600 hover:text-gray-900"
                      target="_blank"
                    >
                      Admin Portal
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Resources
                </h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a
                      href="https://docs.ckan.org/"
                      className="text-sm text-gray-600 hover:text-gray-900"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      CKAN Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://portaljs.org/"
                      className="text-sm text-gray-600 hover:text-gray-900"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      PortalJS
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                &copy; {new Date().getFullYear()} {siteTitle}. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
