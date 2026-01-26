/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ff5a0a',
          light: '#ff7a3a',
          dark: '#e04a00',
        },
        background: {
          DEFAULT: '#fdf8f4',
          light: '#fffaf7',
          dark: '#f5f0eb',
        }
      },
    },
  },
  plugins: [],
}