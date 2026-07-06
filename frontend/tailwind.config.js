/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          container: 'var(--primary-container)',
          fixed: 'var(--primary-fixed-dim)',
        },
        background: 'var(--background)',
        surface: 'var(--surface)',
        'surface-container': 'var(--surface-container)',
        'on-surface': 'var(--on-surface)',
        'on-surface-variant': 'var(--on-surface-variant)',
        outline: 'var(--outline)',
        'outline-variant': 'var(--outline-variant)',
        error: 'var(--error)',
        
        // Elite Sync Status Colors
        'sync-active': '#FFD133',
        'sync-idle': '#7f7661',
        
        // Animation System Tokens
        cream: '#FFFBF0',
        gold: {
          DEFAULT: '#F5C400',
          hover: '#E0B000',
          light: '#FFF8D6',
        },
      },
      boxShadow: {
        'elite': '0 20px 60px -12px rgba(115, 92, 0, 0.15), 0 8px 24px -8px rgba(255, 209, 51, 0.2)',
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        button: 'var(--shadow-button)',
        'button-hover': 'var(--shadow-button-hover)',
      },
      fontFamily: {
        sans: ['var(--font-vietnam)', 'ui-sans-serif', 'system-ui'],
        jakarta: ['var(--font-jakarta)', 'sans-serif'],
        vietnam: ['var(--font-vietnam)', 'sans-serif'],
        caveat: ['var(--font-caveat)', 'cursive'],
        marker: ['var(--font-permanent-marker)', 'cursive'],
      },
      borderRadius: {
        'elite': '2.5rem',
        card: '20px',
        input: '14px',
        pill: '9999px',
        chip: '10px',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
        'ease-out-expo': 'cubic-bezier(0, 0, 0.2, 1)',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
};
