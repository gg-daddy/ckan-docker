/**
 * Thai Government Layout Component
 *
 * A complete layout wrapper for Thailand government data portal.
 * Includes header with trust banner, language switching, and footer.
 * Manages language state and provides context to child components.
 */

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import Link from 'next/link';
import ThaiGovHeader from './ThaiGovHeader';
import ThaiGovFooter from './ThaiGovFooter';

// Language context for global language state
interface LanguageContextType {
  lang: 'th' | 'en';
  setLang: (lang: 'th' | 'en') => void;
  t: (text: { th: string; en: string }) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'th',
  setLang: () => {},
  t: (text) => text.th,
});

export const useThaiLanguage = () => useContext(LanguageContext);

interface ThaiGovLayoutProps {
  children: ReactNode;
  initialLang?: 'th' | 'en';
  siteTitle?: { th: string; en: string };
  siteDescription?: { th: string; en: string };
  showTrustBanner?: boolean;
  // Page-specific title and description (for SEO/meta)
  title?: string;
  description?: string;
}

export default function ThaiGovLayout({
  children,
  initialLang,
  siteTitle = { th: 'ศูนย์ข้อมูลเปิดภาครัฐ', en: 'Open Government Data' },
  siteDescription = {
    th: 'ศูนย์กลางข้อมูลเปิดภาครัฐ ให้บริการข้อมูลจากหน่วยงานภาครัฐของประเทศไทย',
    en: 'The central open government data platform providing data from Thai government agencies.',
  },
  showTrustBanner = true,
  title,
  description,
}: ThaiGovLayoutProps) {
  const [lang, setLangState] = useState<'th' | 'en'>('th');
  const [mounted, setMounted] = useState(false);

  // Initialize language from localStorage or browser settings
  useEffect(() => {
    setMounted(true);
    if (initialLang) {
      setLangState(initialLang);
      return;
    }

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('preferredLang');
      if (stored === 'th' || stored === 'en') {
        setLangState(stored);
        return;
      }

      // Check browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('th')) {
        setLangState('th');
      } else {
        setLangState('en');
      }
    }
  }, [initialLang]);

  const setLang = (newLang: 'th' | 'en') => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLang', newLang);
      // Update HTML lang attribute
      document.documentElement.lang = newLang;
    }
  };

  // Translation helper
  const t = (text: { th: string; en: string }) => text[lang];

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="th-layout th-loading">
        <div className="th-loading-spinner" />
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <div className={`th-layout lang-${lang}`} data-lang={lang}>
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-th-navy-600 focus:text-white focus:px-4 focus:py-2"
        >
          {lang === 'th' ? 'ข้ามไปยังเนื้อหาหลัก' : 'Skip to main content'}
        </a>

        {/* Header with trust banner */}
        <ThaiGovHeader
          currentLang={lang}
          onLangChange={setLang}
          siteTitle={siteTitle}
        />

        {/* Main content */}
        <main id="main-content" className="th-main">
          {children}
        </main>

        {/* Footer */}
        <ThaiGovFooter
          currentLang={lang}
          siteTitle={siteTitle}
          description={siteDescription}
        />
      </div>
    </LanguageContext.Provider>
  );
}

// Additional layout components for specific page types

interface PageHeaderProps {
  title: { th: string; en: string };
  subtitle?: { th: string; en: string };
  breadcrumbs?: Array<{
    href: string;
    label: { th: string; en: string };
  }>;
}

export function ThaiPageHeader({ title, subtitle, breadcrumbs }: PageHeaderProps) {
  const { t, lang } = useThaiLanguage();

  return (
    <div className="th-page-header">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="th-breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">{lang === 'th' ? 'หน้าแรก' : 'Home'}</Link>
            </li>
            {breadcrumbs.map((crumb, index) => (
              <li key={index}>
                <span className="th-breadcrumb-separator">/</span>
                {index === breadcrumbs.length - 1 ? (
                  <span aria-current="page">{t(crumb.label)}</span>
                ) : (
                  <Link href={crumb.href}>{t(crumb.label)}</Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Title */}
      <h1 className="th-page-title">{t(title)}</h1>

      {/* Subtitle */}
      {subtitle && <p className="th-page-subtitle">{t(subtitle)}</p>}
    </div>
  );
}

// Helper component for bilingual text display
interface BilingualTextProps {
  th: string;
  en: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function BilingualText({
  th,
  en,
  className = '',
  as: Component = 'span',
}: BilingualTextProps) {
  const { lang } = useThaiLanguage();
  return <Component className={className}>{lang === 'th' ? th : en}</Component>;
}

// Date formatter for Thai Buddhist calendar
export function formatThaiDate(date: Date, lang: 'th' | 'en'): string {
  if (lang === 'th') {
    // Thai Buddhist calendar (BE = CE + 543)
    const thaiYear = date.getFullYear() + 543;
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
      'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
      'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
    ];
    return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${thaiYear}`;
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Number formatter for Thai numerals
export function formatThaiNumber(num: number, lang: 'th' | 'en'): string {
  if (lang === 'th') {
    const thaiNumerals = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
    return num
      .toLocaleString('th-TH')
      .split('')
      .map((char) => {
        const digit = parseInt(char, 10);
        return !isNaN(digit) ? thaiNumerals[digit] : char;
      })
      .join('');
  }
  return num.toLocaleString('en-US');
}
