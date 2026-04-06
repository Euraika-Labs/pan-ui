import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/features/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        danger: 'hsl(var(--danger))',
        approval: 'hsl(var(--approval))',
        surface: 'hsl(var(--surface))',

        /* ── Euraika Brand Direct Access (§6) ── */
        euraika: {
          blue: '#073455',
          teal: '#094668',
          gold: '#E9C819',
          charcoal: '#1E2D39',
          mist: '#558B82',
          'gold-shade': '#B1961F',
          bronze: '#695118',
          'night-black': '#0A0C10',
          steel: '#51545A',
          cloud: '#91999A',
          offwhite: '#FEFFEF',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',         /* 12px */
        md: 'calc(var(--radius) - 4px)', /* 8px */
        sm: 'calc(var(--radius) - 8px)', /* 4px */
        xl: 'calc(var(--radius) + 4px)', /* 16px */
        shell: '1.6rem',
      },
      boxShadow: {
        shell: 'var(--shadow-shell)',
        card: 'var(--shadow-card)',
        elevated: 'var(--shadow-elevated)',
      },
    },
  },
  plugins: [],
};

export default config;
