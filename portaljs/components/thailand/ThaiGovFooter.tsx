/**
 * Thailand Government Footer Component
 *
 * A government-branded footer following Thai government visual identity standards.
 * Includes:
 * - Government branding with Garuda emblem
 * - Quick links organized by category
 * - Contact information
 * - Legal links (Privacy, Terms, Open Data License)
 * - Copyright information
 */

import Link from 'next/link';

interface FooterLink {
  href: string;
  label: { th: string; en: string };
  external?: boolean;
}

interface FooterSection {
  title: { th: string; en: string };
  links: FooterLink[];
}

interface ThaiGovFooterProps {
  currentLang?: 'th' | 'en';
  siteTitle?: { th: string; en: string };
  description?: { th: string; en: string };
}

// Garuda Emblem for Footer (inverted for dark background)
const GarudaEmblemWhite = ({ className = '' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 48 56"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
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

// Default footer sections
const defaultSections: FooterSection[] = [
  {
    title: { th: 'เกี่ยวกับ', en: 'About' },
    links: [
      { href: '/about', label: { th: 'เกี่ยวกับเรา', en: 'About Us' } },
      { href: '/agencies', label: { th: 'หน่วยงานที่เข้าร่วม', en: 'Participating Agencies' } },
      { href: '/news', label: { th: 'ข่าวสาร', en: 'News' } },
      { href: '/faq', label: { th: 'คำถามที่พบบ่อย', en: 'FAQ' } },
    ],
  },
  {
    title: { th: 'บริการ', en: 'Services' },
    links: [
      { href: '/search', label: { th: 'ค้นหาชุดข้อมูล', en: 'Search Datasets' } },
      { href: '/api-docs', label: { th: 'เอกสาร API', en: 'API Documentation' } },
      { href: '/developers', label: { th: 'สำหรับนักพัฒนา', en: 'For Developers' } },
      { href: '/submit-data', label: { th: 'ส่งข้อมูล', en: 'Submit Data' } },
    ],
  },
  {
    title: { th: 'ติดต่อ', en: 'Contact' },
    links: [
      { href: '/contact', label: { th: 'ติดต่อเรา', en: 'Contact Us' } },
      { href: '/feedback', label: { th: 'ข้อเสนอแนะ', en: 'Feedback' } },
      { href: '/support', label: { th: 'ศูนย์ช่วยเหลือ', en: 'Help Center' } },
    ],
  },
];

const legalLinks: FooterLink[] = [
  { href: '/privacy', label: { th: 'นโยบายความเป็นส่วนตัว', en: 'Privacy Policy' } },
  { href: '/terms', label: { th: 'ข้อกำหนดการใช้งาน', en: 'Terms of Use' } },
  { href: '/open-data-license', label: { th: 'สัญญาอนุญาตข้อมูลเปิด', en: 'Open Data License' } },
];

export default function ThaiGovFooter({
  currentLang = 'th',
  siteTitle = { th: 'ศูนย์ข้อมูลเปิดภาครัฐ', en: 'Open Government Data' },
  description = {
    th: 'ศูนย์กลางข้อมูลเปิดภาครัฐ ให้บริการข้อมูลจากหน่วยงานภาครัฐของประเทศไทย เพื่อสนับสนุนการพัฒนาประเทศและความโปร่งใสของภาครัฐ',
    en: 'The central open government data platform providing data from Thai government agencies to support national development and government transparency.',
  },
}: ThaiGovFooterProps) {
  const t = (text: { th: string; en: string }) => text[currentLang];

  return (
    <footer className="th-footer">
      <div className="th-footer-container">
        {/* Main Footer Content */}
        <div className="th-footer-grid">
          {/* Brand Section */}
          <div className="th-footer-brand">
            <div className="th-footer-logo">
              <GarudaEmblemWhite className="th-footer-logo-img text-white" />
              <span className="th-footer-logo-text">{t(siteTitle)}</span>
            </div>
            <p className="th-footer-description">{t(description)}</p>

            {/* Social Links */}
            <div className="flex gap-3 mt-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Footer Link Sections */}
          {defaultSections.map((section, index) => (
            <div key={index} className="th-footer-section">
              <h4>{t(section.title)}</h4>
              <ul className="th-footer-links">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.external ? (
                      <a
                        href={link.href}
                        className="th-footer-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t(link.label)}
                      </a>
                    ) : (
                      <Link href={link.href} className="th-footer-link">
                        {t(link.label)}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="th-footer-bottom">
          <p className="th-footer-copyright">
            © {new Date().getFullYear()} {t(siteTitle)}.{' '}
            {currentLang === 'th' ? 'สงวนลิขสิทธิ์' : 'All rights reserved.'}
          </p>

          <div className="th-footer-legal-links">
            {legalLinks.map((link, index) => (
              <Link key={index} href={link.href} className="th-footer-legal-link">
                {t(link.label)}
              </Link>
            ))}
          </div>
        </div>

        {/* Government Attribution */}
        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-white/50">
            {currentLang === 'th' ? (
              <>
                พัฒนาโดย{' '}
                <a href="https://www.dga.or.th" className="text-white/70 hover:text-white" target="_blank" rel="noopener noreferrer">
                  สำนักงานพัฒนารัฐบาลดิจิทัล (องค์การมหาชน)
                </a>
              </>
            ) : (
              <>
                Developed by{' '}
                <a href="https://www.dga.or.th" className="text-white/70 hover:text-white" target="_blank" rel="noopener noreferrer">
                  Digital Government Development Agency
                </a>
              </>
            )}
          </p>
          <p className="text-xs text-white/40 mt-2">
            {currentLang === 'th'
              ? 'ขับเคลื่อนด้วย CKAN และ PortalJS'
              : 'Powered by CKAN & PortalJS'}
          </p>
        </div>
      </div>
    </footer>
  );
}
