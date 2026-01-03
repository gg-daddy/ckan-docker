/**
 * Thailand Government Header Component
 *
 * A government-branded header following Thai government visual identity standards.
 * Includes:
 * - Government trust banner (เว็บไซต์หน่วยงานราชการไทย)
 * - Garuda emblem and site logo
 * - Bilingual navigation (Thai/English)
 * - Accessibility controls
 * - Language switcher
 */

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useRef, useEffect, FormEvent } from 'react';
import getConfig from 'next/config';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

const { publicRuntimeConfig } = getConfig() || {};

interface ThaiGovHeaderProps {
  siteTitle?: {
    th: string;
    en: string;
  };
  hideSearch?: boolean;
  currentLang?: 'th' | 'en';
  onLangChange?: (lang: 'th' | 'en') => void;
}

// Garuda Emblem SVG Component
const GarudaEmblem = ({ className = '' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 48 56"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Simplified Garuda emblem - replace with official SVG */}
    <path
      d="M24 4C20 4 16 8 16 12C16 16 18 20 24 24C30 20 32 16 32 12C32 8 28 4 24 4Z"
      fill="currentColor"
    />
    <path
      d="M12 20C8 22 4 28 4 34C4 40 8 46 16 50C20 48 22 44 24 40C26 44 28 48 32 50C40 46 44 40 44 34C44 28 40 22 36 20C32 22 28 26 24 30C20 26 16 22 12 20Z"
      fill="currentColor"
    />
    <path
      d="M24 52C22 52 20 54 20 54L24 56L28 54C28 54 26 52 24 52Z"
      fill="currentColor"
    />
  </svg>
);

// Navigation items with bilingual support
const navItems = [
  { href: '/', label: { th: 'หน้าแรก', en: 'Home' } },
  { href: '/search', label: { th: 'ชุดข้อมูล', en: 'Datasets' } },
  { href: '/agencies', label: { th: 'หน่วยงาน', en: 'Agencies' } },
  { href: '/api-docs', label: { th: 'API', en: 'API' } },
  { href: '/about', label: { th: 'เกี่ยวกับเรา', en: 'About' } },
];

export default function ThaiGovHeader({
  siteTitle = {
    th: 'ศูนย์ข้อมูลเปิดภาครัฐ',
    en: 'Open Government Data',
  },
  hideSearch = false,
  currentLang = 'th',
  onLangChange,
}: ThaiGovHeaderProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showVerifyPopup, setShowVerifyPopup] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/search');
    }
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    router.push('/');
  };

  const t = (text: { th: string; en: string }) => text[currentLang];

  return (
    <>
      {/* Government Trust Banner */}
      <div className="th-gov-banner">
        <div className="th-gov-banner-content">
          <span className="th-gov-indicator">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <span className="th-gov-banner-text th-gov-banner-text-th">
            {currentLang === 'th' ? 'เว็บไซต์หน่วยงานราชการไทย' : 'Official Thai Government Website'}
          </span>
          <button
            className="th-gov-verify-link"
            onClick={() => setShowVerifyPopup(!showVerifyPopup)}
          >
            {currentLang === 'th' ? 'วิธีการตรวจสอบ' : 'How to verify'}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Verify Popup */}
        {showVerifyPopup && (
          <div className="absolute top-full right-4 mt-2 p-4 bg-white rounded-lg shadow-lg z-50 max-w-sm">
            <h4 className="font-semibold text-gray-900 mb-2">
              {currentLang === 'th' ? 'วิธีตรวจสอบเว็บไซต์ราชการ' : 'How to verify government websites'}
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• {currentLang === 'th' ? 'URL ลงท้ายด้วย .go.th หรือ .or.th' : 'URL ends with .go.th or .or.th'}</li>
              <li>• {currentLang === 'th' ? 'มีตราครุฑอย่างเป็นทางการ' : 'Has official Garuda emblem'}</li>
              <li>• {currentLang === 'th' ? 'มี HTTPS ที่ปลอดภัย' : 'Has secure HTTPS connection'}</li>
            </ul>
          </div>
        )}
      </div>

      {/* Main Header */}
      <header className="th-header">
        <div className="th-header-main">
          {/* Logo Section */}
          <Link href="/" className="th-logo-section">
            <div className="th-garuda-logo">
              <GarudaEmblem className="w-full h-full text-[#1E3A5F]" />
            </div>
            <div className="th-site-title">
              <span className="th-title-thai">{siteTitle.th}</span>
              <span className="th-title-english">{siteTitle.en}</span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          {!hideSearch && (
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={currentLang === 'th' ? 'ค้นหาชุดข้อมูล...' : 'Search datasets...'}
                  className="w-full pl-4 pr-12 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-[#F26522] hover:bg-[#D94E0F] text-white rounded-md transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          )}

          {/* Utility Section */}
          <div className="th-utility-section">
            {/* Accessibility Button */}
            <button className="th-utility-btn hidden md:flex" title={currentLang === 'th' ? 'การเข้าถึง' : 'Accessibility'}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8a2 2 0 100-4 2 2 0 000 4zM12 8v8M8 12h8" />
              </svg>
            </button>

            {/* Font Size Button */}
            <button className="th-utility-btn hidden md:flex" title={currentLang === 'th' ? 'ขนาดตัวอักษร' : 'Font size'}>
              <span className="text-xs font-bold">ก+</span>
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher
              currentLang={currentLang}
              onLangChange={onLangChange}
            />

            {/* User Menu */}
            {isLoading ? (
              <div className="hidden md:flex px-3 py-2">
                <div className="animate-pulse h-8 w-8 bg-gray-200 rounded-full"></div>
              </div>
            ) : isAuthenticated && user ? (
              <div className="relative hidden md:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#1E3A5F] flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {user.displayName?.charAt(0).toUpperCase() || user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <svg
                    className={`h-4 w-4 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.displayName || user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      href="/user/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {currentLang === 'th' ? 'โปรไฟล์' : 'Profile'}
                    </Link>
                    {user.sysadmin && (
                      <a
                        href={`${publicRuntimeConfig?.ckanUrl || 'https://localhost:8443'}/ckan-admin`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {currentLang === 'th' ? 'จัดการ CKAN' : 'CKAN Admin'}
                      </a>
                    )}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {currentLang === 'th' ? 'ออกจากระบบ' : 'Sign out'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/user/login"
                className="hidden md:flex th-btn th-btn-secondary th-btn-sm"
              >
                {currentLang === 'th' ? 'เข้าสู่ระบบ' : 'Log in'}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="th-utility-btn md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="th-nav hidden md:block">
          <div className="th-nav-container">
            <ul className="th-nav-list">
              {navItems.map((item) => (
                <li key={item.href} className="th-nav-item">
                  <Link
                    href={item.href}
                    className={`th-nav-link ${router.pathname === item.href ? 'active' : ''}`}
                  >
                    {t(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="th-mobile-menu open">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="th-mobile-menu-panel">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{t(siteTitle)}</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Mobile Search */}
              {!hideSearch && (
                <form onSubmit={handleSearch} className="p-4 border-b border-gray-200">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={currentLang === 'th' ? 'ค้นหาชุดข้อมูล...' : 'Search datasets...'}
                      className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </form>
              )}

              {/* Mobile Nav */}
              <ul className="th-mobile-nav-list">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="th-mobile-nav-link"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t(item.label)}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Mobile Auth */}
              <div className="p-4 border-t border-gray-200 mt-auto">
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#1E3A5F] flex items-center justify-center">
                        <span className="text-sm font-semibold text-white">
                          {user.displayName?.charAt(0).toUpperCase() || user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.displayName || user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Link
                        href="/user/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {currentLang === 'th' ? 'โปรไฟล์' : 'Profile'}
                      </Link>
                      {user.sysadmin && (
                        <a
                          href={`${publicRuntimeConfig?.ckanUrl || 'https://localhost:8443'}/ckan-admin`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {currentLang === 'th' ? 'จัดการ CKAN' : 'CKAN Admin'}
                        </a>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full th-btn th-btn-outline"
                      >
                        {currentLang === 'th' ? 'ออกจากระบบ' : 'Sign out'}
                      </button>
                    </div>
                  </>
                ) : (
                  <Link
                    href="/user/login"
                    className="w-full th-btn th-btn-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {currentLang === 'th' ? 'เข้าสู่ระบบ' : 'Log in'}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
