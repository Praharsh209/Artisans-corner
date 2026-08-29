/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        moss: {
          50: '#F1F6F0',
          100: '#E0EDE0',
          200: '#C2DBC2',
          300: '#9AC39A',
          400: '#6FA36F',
          500: '#4A854A',
          600: '#356A35',
          700: '#2D5A27', // Main Moss Green
          800: '#21441D',
          900: '#162F13',
        },
        terracotta: {
          50: '#FCF5F2',
          100: '#F8E9E4',
          200: '#F0D1C8',
          300: '#E4B3A5',
          400: '#D78B78',
          500: '#C86446', // Main Terracotta Clay
          600: '#B25034',
          700: '#8E3F29',
          800: '#6C301F',
          900: '#4C2216',
        },
        parchment: {
          50: '#FAF8F5',
          100: '#F5EFE6', // Light parchment
          200: '#EDE4D4',
          300: '#E2D4BF',
          400: '#D1BDA0',
          500: '#BEA482',
          600: '#A48967',
          700: '#7F674B',
          800: '#5C4A35',
          900: '#3D3021',
        },
        earth: {
          dark: '#232924',
          charcoal: '#333D35',
          muted: '#626F65',
          light: '#F8F6F0',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'warm': '0 4px 20px -2px rgba(60, 45, 30, 0.08), 0 2px 6px -1px rgba(60, 45, 30, 0.04)',
        'warm-lg': '0 10px 25px -3px rgba(60, 45, 30, 0.1), 0 4px 10px -2px rgba(60, 45, 30, 0.05)',
      }
    },
  },
  plugins: [],
}
