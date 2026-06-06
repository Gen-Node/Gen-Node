/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#06070a',
        cyanx: '#22d3ee',
        bluex: '#38bdf8',
        indigox: '#818cf8',
      },
      fontFamily: {
        chalk: ['Caveat', 'cursive'],
      },
    },
  },
  plugins: [],
}
