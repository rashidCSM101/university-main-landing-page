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
          DEFAULT: '#0B1E3D',
          light: '#1A3461',
          dark: '#060F1F',
        },
        teal: {
          DEFAULT: '#00C8C8',
          light: '#33D4D4',
          dark: '#009A9A',
        },
        accent: {
          gold: '#E8C547',
          cream: '#F0F7FF',
          sky: '#B8D8F0',
        },
      },
    },
  },
  plugins: [],
}
