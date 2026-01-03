/**
 * Thailand Government Visual Identity Components
 *
 * This module exports all components needed for the Thailand
 * government data portal visual identity system.
 *
 * Usage:
 * import {
 *   ThaiGovLayout,
 *   ThaiGovHeader,
 *   ThaiGovFooter,
 *   LanguageSwitcher,
 *   useThaiLanguage,
 * } from '@/components/thailand';
 */

// Layout Components
export {
  default as ThaiGovLayout,
  useThaiLanguage,
  ThaiPageHeader,
  BilingualText,
  formatThaiDate,
  formatThaiNumber,
} from './ThaiGovLayout';

// Header and Navigation
export { default as ThaiGovHeader } from './ThaiGovHeader';

// Footer
export { default as ThaiGovFooter } from './ThaiGovFooter';

// Language Switcher
export { default as LanguageSwitcher, useLanguage } from './LanguageSwitcher';

// Agency Avatar
export { default as AgencyAvatar } from './AgencyAvatar';
