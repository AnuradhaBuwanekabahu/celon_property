/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: '#FFFFFF',
        lightGray: '#E5E5E5',
        gold: '#FCA311',
        darkBlue: '#14213D',
        black: '#000000',
      },
    },
  },
  plugins: [],
}