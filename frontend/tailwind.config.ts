import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/shadcn/tailwind.css",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "rgb(var(--primary-rgb) / <alpha-value>)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary-rgb) / <alpha-value>)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "rgb(var(--muted-rgb) / <alpha-value>)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent-rgb) / <alpha-value>)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive-rgb) / <alpha-value>)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: {
            DEFAULT: "var(--sidebar-primary)",
            foreground: "var(--sidebar-primary-foreground)",
          },
          accent: {
            DEFAULT: "var(--sidebar-accent)",
            foreground: "var(--sidebar-accent-foreground)",
          },
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        brand: {
          green: 'rgb(var(--brand-green-rgb) / <alpha-value>)',
          accent: 'rgb(var(--brand-accent-rgb) / <alpha-value>)',
          house: 'var(--brand-house)',
          uplift: 'var(--brand-uplift)',
          'green-light': 'rgb(var(--brand-green-light-rgb) / <alpha-value>)',
          gold: '#cba258',
          'gold-light': '#dfc49d',
          'gold-lightest': '#faf6ee',
        },
        canvas: "#f2f0eb",
        ceramic: "#edebe9",
        "neutral-cool": "#f9f9f9",
        "foreground-muted": "rgba(0,0,0,0.58)",
        "foreground-white": "rgba(255,255,255,1)",
        "foreground-white-soft": "rgba(255,255,255,0.70)",
        reward: "#4A372E",
        warning: "#fbbc05",
      },
      borderRadius: {
        card: "12px",
        pill: "50px",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0px 0px 0.5px 0px rgba(0,0,0,0.14), 0px 1px 1px 0px rgba(0,0,0,0.24)",
        "card-hover":
          "0px 4px 12px rgba(0,0,0,0.08), 0px 2px 4px rgba(0,0,0,0.04)",
        nav: "0 1px 3px rgba(0,0,0,0.1), 0 2px 2px rgba(0,0,0,0.06), 0 0 2px rgba(0,0,0,0.07)",
        frap: "0 0 6px rgba(0,0,0,0.24), 0 8px 12px rgba(0,0,0,0.14)",
        soft: "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px",
        glass: "rgba(0, 0, 0, 0.1) 0px 10px 50px",
      },
      fontFamily: {
        sans: ["Inter", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        serif: ["Georgia", "Times New Roman", "serif"],
      },
      letterSpacing: {
        tight: "-0.01em",
        loose: "0.1em",
        looser: "0.15em",
        wide: "0.3em",
      },
      fontSize: {
        display: ["5rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        jumbo: ["3.6rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        hero: ["2.8rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
      },
      spacing: {
        "1": "0.4rem",
        "2": "0.8rem",
        "3": "1.6rem",
        "4": "2.4rem",
        "5": "3.2rem",
        "6": "4rem",
        "7": "4.8rem",
        "8": "5.6rem",
        "9": "6.4rem",
      },
      maxWidth: {
        "col-sm": "343px",
        "col-md": "500px",
        "col-lg": "720px",
        "col-xl": "1440px",
      },
      keyframes: {
        "blur-in": {
          "0%": {
            opacity: "0",
            filter: "blur(12px)",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            filter: "blur(0)",
            transform: "translateY(0)",
          },
        },
        "scale-fade-in": {
          "0%": {
            opacity: "0",
            transform: "scale(0.9)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        "scroll-down": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },
        "scroll-up": {
          "0%": { transform: "translateY(-50%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        "blur-in": "blur-in 0.8s ease-out forwards",
        "scale-fade-in": "scale-fade-in 0.6s ease-out forwards",
        "scroll-down": "scroll-down 30s linear infinite",
        "scroll-up": "scroll-up 30s linear infinite",
        "scroll-down-slow": "scroll-down 60s linear infinite",
        "scroll-up-slow": "scroll-up 60s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
