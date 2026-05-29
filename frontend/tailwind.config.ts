import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#006241',
          accent: '#00754A',
          house: '#1E3932',
          uplift: '#2b5148',
          'green-light': '#d4e9e2',
          gold: '#cba258',
          'gold-light': '#dfc49d',
          'gold-lightest': '#faf6ee',
        },
        canvas: '#f2f0eb',
        ceramic: '#edebe9',
        'neutral-cool': '#f9f9f9',
        card: '#ffffff',
        foreground: 'rgba(0,0,0,0.87)',
        'foreground-muted': 'rgba(0,0,0,0.58)',
        'foreground-white': 'rgba(255,255,255,1)',
        'foreground-white-soft': 'rgba(255,255,255,0.70)',
        reward: '#33433d',
        destructive: '#c82014',
        warning: '#fbbc05',
      },
      borderRadius: {
        card: '12px',
        pill: '50px',
      },
      boxShadow: {
        card: '0px 0px 0.5px 0px rgba(0,0,0,0.14), 0px 1px 1px 0px rgba(0,0,0,0.24)',
        'card-hover': '0px 4px 12px rgba(0,0,0,0.08), 0px 2px 4px rgba(0,0,0,0.04)',
        nav: '0 1px 3px rgba(0,0,0,0.1), 0 2px 2px rgba(0,0,0,0.06), 0 0 2px rgba(0,0,0,0.07)',
        frap: '0 0 6px rgba(0,0,0,0.24), 0 8px 12px rgba(0,0,0,0.14)',
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      letterSpacing: {
        tight: '-0.01em',
        loose: '0.1em',
        looser: '0.15em',
      },
      fontSize: {
        'display': ['5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'jumbo': ['3.6rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'hero': ['2.8rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      spacing: {
        '1': '0.4rem',
        '2': '0.8rem',
        '3': '1.6rem',
        '4': '2.4rem',
        '5': '3.2rem',
        '6': '4rem',
        '7': '4.8rem',
        '8': '5.6rem',
        '9': '6.4rem',
      },
      maxWidth: {
        'col-sm': '343px',
        'col-md': '500px',
        'col-lg': '720px',
        'col-xl': '1440px',
      },
    },
  },
  plugins: [],
}

export default config
