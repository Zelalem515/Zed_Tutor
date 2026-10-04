/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Primary Navy (deep academic identity) ─────────────────────────
        navy: {
          950: '#08142E',   // deepest — hero, footer backgrounds
          900: '#0C1A38',   // dark sections
          850: '#0F2044',   // subtle variation
          800: '#152B56',   // card backgrounds on dark
          700: '#1E3A70',   // borders on dark
          600: '#2A4A8A',   // lighter navy accents
        },
        // ── Primary Blue (interactive / academic accent) ───────────────────
        academic: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#2563EB',   // primary interactive
          600: '#1D4ED8',   // hover
          700: '#1E40AF',   // pressed / darker
          800: '#1E3A8A',
          900: '#1E3270',
        },
        // ── Gold (achievement / credibility accent — use sparingly) ────────
        gold: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F5B51B',   // main gold — Gold Medalist, 1st Rank
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
        },
        // ── Cyan (technology highlight — use sparingly) ────────────────────
        cyan: {
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
        },
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        sans:    ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        // Refined type scale
        'display': ['4.5rem',  { lineHeight: '1.05', letterSpacing: '-0.025em', fontWeight: '800' }],
        'h1':      ['3.5rem',  { lineHeight: '1.1',  letterSpacing: '-0.02em',  fontWeight: '800' }],
        'h2':      ['2.5rem',  { lineHeight: '1.2',  letterSpacing: '-0.015em', fontWeight: '700' }],
        'h3':      ['1.75rem', { lineHeight: '1.3',  letterSpacing: '-0.01em',  fontWeight: '700' }],
        'h4':      ['1.25rem', { lineHeight: '1.4',  fontWeight: '600' }],
        'body-lg': ['1.125rem',{ lineHeight: '1.75', fontWeight: '400' }],
        'body':    ['1rem',    { lineHeight: '1.75', fontWeight: '400' }],
        'sm':      ['0.875rem',{ lineHeight: '1.6',  fontWeight: '400' }],
        'xs':      ['0.75rem', { lineHeight: '1.5',  fontWeight: '500' }],
      },
      spacing: {
        'section': '5rem',    // py-section = 80px desktop section padding
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'card': '1rem',       // 16px — consistent card radius
        '2xl': '1rem',        // override to 16px
        '3xl': '1.5rem',      // 24px — hero card, large containers
      },
      boxShadow: {
        'card':    '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-md': '0 4px 12px 0 rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.04)',
        'card-lg': '0 10px 30px 0 rgba(0,0,0,0.10), 0 4px 8px -4px rgba(0,0,0,0.06)',
        'navy':    '0 8px 32px rgba(8,20,46,0.35)',
        'gold':    '0 4px 20px rgba(245,181,27,0.25)',
      },
      keyframes: {
        // Existing — keep
        softPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.92', transform: 'scale(1.02)' },
        },
        // New animations
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        countUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      animation: {
        'soft-pulse':   'softPulse 4s ease-in-out infinite',
        'fade-in-up':   'fadeInUp 0.6s ease-out both',
        'fade-in':      'fadeIn 0.5s ease-out both',
        'slide-in-right': 'slideInRight 0.6s ease-out both',
        'count-up':     'countUp 0.4s ease-out both',
        // Stagger helpers — applied via style={{ animationDelay }}
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-subtle': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
