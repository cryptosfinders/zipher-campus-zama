const animate = require('tailwindcss-animate')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' }
    },
    extend: {
      colors: {
        // Base semantic colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        // ---- ZAMA BRAND PALETTE ---- //
        zama: {
          blue: '#1E5AFF',        // primary
          purple: '#6A21FF',      // secondary
          cyan: '#14D8FF',        // accent
          black: '#0A0A0A',       // dark bg
          white: '#F8FAFC',       // fg
          grey: {
            1: '#1C1C1C',
            2: '#2A2A2A',
            3: '#3A3A3A'
          }
        },

        // Replace your “brand-blue” with Zama’s official palette
        'brand-blue': {
          DEFAULT: '#1E5AFF',
          light: '#4C7CFF',
          lighter: '#78A0FF',
          dark: '#153EAF',
          darker: '#0C266B'
        },

        primary: {
          DEFAULT: '#1E5AFF',
          foreground: '#F8FAFC'
        },
        secondary: {
          DEFAULT: '#6A21FF',
          foreground: '#F8FAFC'
        },
        accent: {
          DEFAULT: '#14D8FF',
          foreground: '#0A0A0A'
        },

        destructive: {
          DEFAULT: '#FF4757',
          foreground: '#ffffff'
        },

        muted: {
          DEFAULT: '#1C1C1C',
          foreground: '#A1A1A1'
        },

        card: {
          DEFAULT: '#0A0A0A',
          foreground: '#F8FAFC'
        }
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },

      // Animations
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },

        // Glowing pulse for Zama highlight
        'zama-glow': {
          '0%, 100%': { boxShadow: '0 0 10px #1E5AFF55' },
          '50%': { boxShadow: '0 0 20px #14D8FFAA' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'zama-glow': 'zama-glow 2s ease-in-out infinite'
      },

      // Cool gradient helpers
      backgroundImage: {
        'zama-gradient': 'linear-gradient(135deg, #1E5AFF, #6A21FF)',
        'zama-cyan': 'linear-gradient(135deg, #14D8FF, #1E5AFF)',
        'zama-deep': 'linear-gradient(180deg, #0A0A0A, #1C1C1C)'
      }
