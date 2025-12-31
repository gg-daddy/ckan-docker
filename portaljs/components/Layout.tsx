import Head from 'next/head';
import Link from 'next/link';
import { ReactNode, useState } from 'react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
          <div className="container-main">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-lg">
                    <svg
                      className="h-6 w-6 text-white"
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
                  </div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {siteTitle}
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-1">
                <Link
                  href="/"
                  className="px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-all duration-200"
                >
                  Home
                </Link>
                <Link
                  href="/search"
                  className="px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-all duration-200"
                >
                  Datasets
                </Link>
                <Link
                  href="/user/login"
                  className="px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-all duration-200"
                >
                  Admin
                </Link>
                <Link
                  href="/search"
                  className="ml-2 btn-primary"
                >
                  <svg
                    className="h-4 w-4 mr-2"
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
                  Search
                </Link>
              </nav>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
                <nav className="flex flex-col space-y-2">
                  <Link
                    href="/"
                    className="px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/search"
                    className="px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Datasets
                  </Link>
                  <Link
                    href="/user/login"
                    className="px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                </nav>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white">
          <div className="container-main py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand */}
              <div className="md:col-span-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-br from-primary-400 to-primary-600 p-2 rounded-lg">
                    <svg
                      className="h-6 w-6 text-white"
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
                  </div>
                  <span className="text-xl font-bold">{siteTitle}</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  An open data portal providing easy access to datasets and resources.
                  Powered by CKAN and PortalJS.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
                  Quick Links
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/search"
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      Browse Datasets
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/api/3/action/package_list"
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                      target="_blank"
                    >
                      API Documentation
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/user/login"
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      Admin Portal
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
                  Resources
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="https://docs.ckan.org/"
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      CKAN Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://portaljs.org/"
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      PortalJS Framework
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/datopian/portaljs"
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub Repository
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
                  Connect
                </h3>
                <div className="flex space-x-4">
                  <a
                    href="https://github.com"
                    className="text-gray-400 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a
                    href="https://twitter.com"
                    className="text-gray-400 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-800">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p className="text-sm text-gray-400">
                  &copy; {new Date().getFullYear()} {siteTitle}. All rights reserved.
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>Powered by</span>
                  <a href="https://ckan.org" className="text-primary-400 hover:text-primary-300" target="_blank" rel="noopener noreferrer">CKAN</a>
                  <span>&</span>
                  <a href="https://portaljs.org" className="text-primary-400 hover:text-primary-300" target="_blank" rel="noopener noreferrer">PortalJS</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
