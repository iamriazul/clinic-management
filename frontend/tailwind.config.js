/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          DEFAULT: '#fc03ad',
          50: '#fef0f9',
          100: '#fee0f4',
          200: '#ffc2ea',
          300: '#ff93d7',
          400: '#ff54bb',
          500: '#fc03ad',
          600: '#e0008f',
          700: '#b80074',
          800: '#960060',
          900: '#7c0052',
        },
        aqua: {
          DEFAULT: '#03fce3',
          50: '#edfffe',
          100: '#d1fffe',
          200: '#a9fefb',
          300: '#6cfcf4',
          400: '#03fce3',
          500: '#00e0cc',
          600: '#00b5aa',
          700: '#008f89',
          800: '#00716e',
          900: '#065d5b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
