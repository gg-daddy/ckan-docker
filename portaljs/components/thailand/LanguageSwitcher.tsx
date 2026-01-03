/**
 * Language Switcher Component
 *
 * Provides Thai/English language toggle for the Thailand government portal.
 * Follows Thai government design standards with clear visual feedback.
 */

interface LanguageSwitcherProps {
  currentLang: 'th' | 'en';
  onLangChange?: (lang: 'th' | 'en') => void;
  variant?: 'default' | 'minimal' | 'dropdown';
}

export default function LanguageSwitcher({
  currentLang = 'th',
  onLangChange,
  variant = 'default',
}: LanguageSwitcherProps) {
  const handleLangChange = (lang: 'th' | 'en') => {
    if (onLangChange) {
      onLangChange(lang);
    }
    // Could also store in localStorage or cookie
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLang', lang);
    }
  };

  if (variant === 'minimal') {
    return (
      <button
        onClick={() => handleLangChange(currentLang === 'th' ? 'en' : 'th')}
        className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
      >
        <span className={currentLang === 'th' ? 'text-[#1E3A5F] font-semibold' : ''}>
          TH
        </span>
        <span className="text-gray-300">/</span>
        <span className={currentLang === 'en' ? 'text-[#1E3A5F] font-semibold' : ''}>
          EN
        </span>
      </button>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className="relative">
        <select
          value={currentLang}
          onChange={(e) => handleLangChange(e.target.value as 'th' | 'en')}
          className="appearance-none bg-transparent pl-8 pr-8 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] cursor-pointer"
        >
          <option value="th">🇹🇭 ไทย</option>
          <option value="en">🇬🇧 English</option>
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  }

  // Default variant - segmented button style
  return (
    <div className="th-lang-switcher">
      <button
        onClick={() => handleLangChange('th')}
        className={`th-lang-btn th-lang-btn-th ${currentLang === 'th' ? 'active' : ''}`}
        aria-label="Switch to Thai"
      >
        <span className="flex items-center gap-1">
          <span className="hidden sm:inline">🇹🇭</span>
          <span>TH</span>
        </span>
      </button>
      <button
        onClick={() => handleLangChange('en')}
        className={`th-lang-btn ${currentLang === 'en' ? 'active' : ''}`}
        aria-label="Switch to English"
      >
        <span className="flex items-center gap-1">
          <span className="hidden sm:inline">🇬🇧</span>
          <span>EN</span>
        </span>
      </button>
    </div>
  );
}

// Helper hook for managing language state
export function useLanguage() {
  const getInitialLang = (): 'th' | 'en' => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('preferredLang');
      if (stored === 'th' || stored === 'en') {
        return stored;
      }
      // Check browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('th')) {
        return 'th';
      }
    }
    return 'th'; // Default to Thai
  };

  return {
    getInitialLang,
    setLang: (lang: 'th' | 'en') => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('preferredLang', lang);
      }
    },
  };
}
