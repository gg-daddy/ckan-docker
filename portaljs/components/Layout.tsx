import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useState, FormEvent } from 'react';
import getConfig from 'next/config';
import DarkModeToggle from './ui/DarkModeToggle';

const { publicRuntimeConfig } = getConfig() || {};

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  hideHeaderSearch?: boolean;
}

export default function Layout({
  children,
  title,
  description = 'Open Data Portal powered by CKAN and PortalJS',
  hideHeaderSearch = false,
}: LayoutProps) {
  const router = useRouter();
  const siteTitle = publicRuntimeConfig?.siteTitle || 'Data Portal';
  const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/search');
    }
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
        {/* Header - data.gov.sg style */}
        <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="container-main">
            <div className="flex items-center justify-between h-16 gap-4">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 bg-primary-600 dark:bg-primary-500 rounded-lg">
                  <svg
                    className="h-5 w-5 text-white"
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
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {siteTitle}
                </span>
              </Link>

              {/* Header Search Bar - data.gov.sg style */}
              {!hideHeaderSearch && (
                <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for datasets"
                      className="w-full pl-4 pr-12 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="submit"
                      className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </form>
              )}

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1 flex-shrink-0">
                <Link
                  href="/search"
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Datasets
                </Link>
                <Link
                  href="/about"
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Help
                </Link>
                <Link
                  href="/feedback"
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Feedback
                </Link>
                <Link
                  href="/user/login"
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <div className="ml-2 pl-2 border-l border-gray-200 dark:border-gray-700">
                  <DarkModeToggle />
                </div>
              </nav>

              {/* Mobile Menu Button */}
              <div className="flex items-center gap-2 md:hidden">
                <DarkModeToggle />
                <button
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle menu"
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
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-gray-100 dark:border-gray-800 animate-fade-in">
                {/* Mobile Search */}
                {!hideHeaderSearch && (
                  <form onSubmit={handleSearch} className="mb-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for datasets"
                        className="w-full pl-4 pr-12 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>
                    </div>
                  </form>
                )}
                <nav className="flex flex-col gap-1">
                  <Link
                    href="/search"
                    className="px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Datasets
                  </Link>
                  <Link
                    href="/about"
                    className="px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Help
                  </Link>
                  <Link
                    href="/feedback"
                    className="px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Feedback
                  </Link>
                  <Link
                    href="/user/login"
                    className="px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                </nav>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Footer - Clean, minimal */}
        <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="container-main py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Left side - Links */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                <Link
                  href="/about"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  About
                </Link>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <Link
                  href="/privacy"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Privacy
                </Link>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <Link
                  href="/terms"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Terms of Use
                </Link>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <a
                  href="https://github.com/datopian/portaljs"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </div>

              {/* Right side - Attribution */}
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Powered by</span>
                <a
                  href="https://ckan.org"
                  className="font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CKAN
                </a>
                <span>&</span>
                <a
                  href="https://portaljs.org"
                  className="font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  PortalJS
                </a>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} {siteTitle}. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
