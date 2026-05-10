/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        glacier: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        pine: {
          700: '#1d4b35',
          800: '#153828',
          900: '#0f281e',
        },
      },
      backgroundImage: {
        'kashmir-gradient':
          'linear-gradient(135deg, rgba(14,165,233,0.15) 0%, rgba(15,40,30,0.85) 50%, rgba(12,74,110,0.9) 100%)',
        'glass-light':
          'linear-gradient(145deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 100%)',
        'glass-dark':
          'linear-gradient(145deg, rgba(30,41,59,0.55) 0%, rgba(15,23,42,0.35) 100%)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2)',
        'glass-lg': '0 25px 50px -12px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
};
