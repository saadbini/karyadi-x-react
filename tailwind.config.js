/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'karyadi': {
          orange: '#FF5733',
          teal: '#40E0D0'
        }
      }
    },
  },
  plugins: [],
}