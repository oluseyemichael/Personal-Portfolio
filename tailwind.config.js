/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep navy backgrounds
        navy: {
          950: '#050818',
          900: '#0A0E24',
          800: '#101635',
          700: '#1A2247',
        },
        // Amber/gold accents
        amber: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
        gold: {
          400: '#FFD86B',
          500: '#FFC145',
          600: '#E5A428',
        },
        // Warm off-white for text
        cream: '#FFF8E7',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
