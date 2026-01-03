/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Thailand Government Visual Identity
        // Based on Thai government official portals (DGA, thaigov.go.th)
        'th-navy': {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#b3c5d7',
          300: '#8da7c2',
          400: '#6789ad',
          500: '#2d5282',
          600: '#1E3A5F',  // Primary - Official Thai Government Navy
          700: '#192f4d',
          800: '#14253b',
          900: '#0f1b29',
          950: '#0a1118',
        },
        'th-orange': {
          50: '#fef6f0',
          100: '#fde8d9',
          200: '#fcd1b3',
          300: '#fab98d',
          400: '#f89157',
          500: '#F26522',  // Accent - Thai Government Orange
          600: '#d9561c',
          700: '#b54716',
          800: '#913810',
          900: '#6d290a',
          950: '#491a04',
        },
        'th-gold': {
          50: '#fdfaef',
          100: '#faf3d9',
          200: '#f5e7b3',
          300: '#f0db8d',
          400: '#dcbf4f',
          500: '#C9A227',  // Royal Gold
          600: '#a88820',
          700: '#876e1a',
          800: '#665414',
          900: '#453a0e',
          950: '#242008',
        },
        // Keep existing primary as fallback (data.gov.sg inspired)
        primary: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#baddff',
          300: '#7cc2ff',
          400: '#36a3ff',
          500: '#0b85f3',
          600: '#0066cc',
          700: '#0052a3',
          800: '#004485',
          900: '#00386e',
          950: '#002347',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // Clean gray palette for light theme
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        // Thai-localized topic colors
        topic: {
          environment: '#22c55e',    // สิ่งแวดล้อม
          health: '#ef4444',         // สาธารณสุข
          education: '#8b5cf6',      // การศึกษา
          economy: '#f59e0b',        // เศรษฐกิจ
          transport: '#06b6d4',      // คมนาคม
          society: '#ec4899',        // สังคม
          technology: '#3b82f6',     // เทคโนโลยี
          infrastructure: '#6366f1', // โครงสร้างพื้นฐาน
          agriculture: '#84cc16',    // เกษตรกรรม
          tourism: '#f97316',        // การท่องเที่ยว
          government: '#1E3A5F',     // ราชการ
        },
      },
      fontFamily: {
        // Thai-optimized font stack
        sans: ['Sarabun', 'Noto Sans Thai', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Prompt', 'Noto Sans Thai', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
        // Keep English-only option
        'sans-en': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      // Thai-optimized line heights
      lineHeight: {
        'thai': '1.7',
        'thai-tight': '1.5',
        'thai-loose': '1.9',
      },
      // Thai-optimized font sizes (slightly larger for readability)
      fontSize: {
        'th-xs': ['0.8125rem', { lineHeight: '1.5' }],    // 13px
        'th-sm': ['0.9375rem', { lineHeight: '1.6' }],    // 15px
        'th-base': ['1.0625rem', { lineHeight: '1.7' }],  // 17px
        'th-lg': ['1.1875rem', { lineHeight: '1.7' }],    // 19px
        'th-xl': ['1.375rem', { lineHeight: '1.6' }],     // 22px
        'th-2xl': ['1.625rem', { lineHeight: '1.5' }],    // 26px
        'th-3xl': ['2rem', { lineHeight: '1.4' }],        // 32px
        'th-4xl': ['2.5rem', { lineHeight: '1.3' }],      // 40px
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.1)',
        'dropdown': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'count-up': 'countUp 1s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#404040',
            a: {
              color: '#0066cc',
              '&:hover': {
                color: '#0052a3',
              },
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
