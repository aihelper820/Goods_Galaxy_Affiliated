import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#e60023',
        'on-primary': '#211922',
        'primary-container': '#ffd2da',
        'on-primary-container': '#211922',
        'primary-fixed': '#ff9ab0',
        'primary-fixed-dim': '#e60023',
        'on-primary-fixed': '#211922',
        'on-primary-fixed-variant': '#62625b',

        secondary: '#e5e5e0',
        'on-secondary': '#211922',
        'secondary-container': '#f3f2ec',
        'on-secondary-container': '#211922',
        'secondary-fixed': '#e0e0d9',
        'secondary-fixed-dim': '#c8c8c1',
        'on-secondary-fixed': '#211922',
        'on-secondary-fixed-variant': '#62625b',

        tertiary: '#435ee5',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#dbe3ff',
        'on-tertiary-container': '#211922',
        'tertiary-fixed': '#7b91ff',
        'tertiary-fixed-dim': '#435ee5',
        'on-tertiary-fixed': '#ffffff',
        'on-tertiary-fixed-variant': '#211922',

        surface: '#fffdf9',
        'on-surface': '#211922',
        'on-surface-variant': '#62625b',
        'surface-dim': '#e0e0d9',
        'surface-bright': '#ffffff',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#faf9f5',
        'surface-container': '#f3f2ec',
        'surface-container-high': '#e9e7e0',
        'surface-container-highest': '#e0e0d9',
        'surface-variant': '#f3f2ec',

        background: '#fffdf9',
        'on-background': '#211922',

        outline: '#91918c',
        'outline-variant': '#c8c8c1',

        error: '#9e0a0a',
        'on-error': '#ffffff',
        'error-container': '#ffe1de',
        'on-error-container': '#9e0a0a',

        // Inverse colors
        'inverse-surface': '#211922',
        'inverse-on-surface': '#fffdf9',
        'inverse-primary': '#e60023',

        // Surface tint
        'surface-tint': '#e60023',
      },
      borderRadius: {
        DEFAULT: '1rem',
        sm: '0.75rem',
        lg: '1.25rem',
        xl: '1.75rem',
        '2xl': '2rem',
        full: '9999px',
      },
      fontFamily: {
        headline: ['var(--font-gga)'],
        body: ['var(--font-gga)'],
        label: ['var(--font-gga)'],
      },
      fontSize: {
        // Display sizes
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['2.8rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['2.2rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }],

        // Headline sizes
        'headline-lg': ['1.75rem', { lineHeight: '1.4', letterSpacing: '0' }],
        'headline-md': ['1.5rem', { lineHeight: '1.4', letterSpacing: '0' }],
        'headline-sm': ['1.25rem', { lineHeight: '1.4', letterSpacing: '0' }],

        // Body sizes
        'body-lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'body-md': ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0' }],

        // Label sizes
        'label-lg': ['0.875rem', { lineHeight: '1.4', letterSpacing: '+0.05em' }],
        'label-md': ['0.75rem', { lineHeight: '1.3', letterSpacing: '+0.05em' }],
        'label-sm': ['0.6875rem', { lineHeight: '1.3', letterSpacing: '+0.05em' }],
      },
      spacing: {
        '32': '2rem',
        '48': '3rem',
      },
    },
  },
  plugins: [],
}

export default config
