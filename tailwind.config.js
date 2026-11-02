/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fbf8f3',
          100: '#f5eee3',
          200: '#ebdcbf',
          300: '#dfc596',
          400: '#d1aa6a',
          500: '#c59247',
          600: '#b17b38',
          700: '#8e5d2d',
          800: '#754a2a',
          900: '#613e25',
          950: '#382012',
        },
        navy: {
          800: '#0f172a',
          850: '#0c1322',
          900: '#080d19',
          950: '#04070d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
