/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'sans-serif']
      },
      colors: {
        primary: {
          50: '#eef4ff',
          100: '#dce8ff',
          200: '#b9d1ff',
          300: '#8ab0ff',
          400: '#5b8bff',
          500: '#2f66f5',
          600: '#204ed6',
          700: '#1c3fac',
          800: '#1b3689',
          900: '#1a306e'
        }
      },
      boxShadow: {
        soft: '0 8px 24px -8px rgba(32, 78, 214, 0.15)'
      }
    }
  },
  plugins: []
}
