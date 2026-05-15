/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#7c6af7',
          hover: '#5b4de0',
          light: '#ede9fe',
        },
        surface: {
          DEFAULT: '#ffffff',
          2: '#f9f9fb',
          dark: '#161b25',
          dark2: '#1c2232',
        },
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)',
        'card-lg': '0 8px 28px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.05)',
        'accent': '0 4px 14px rgba(124,106,247,0.4)',
      },
      animation: {
        'rise': 'rise 0.22s ease both',
        'fade-in': 'fadeIn 0.2s ease',
      },
      keyframes: {
        rise: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'none' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
