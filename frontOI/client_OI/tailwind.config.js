// tailwind.config.js
const {nextui} = require("@nextui-org/react");
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        teko: ['Teko', 'sans-serif'],
        mulish: ['Mulish', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'custom-blue': '#00B0FF',
        'blue-admin': '#0B63F8FF',
        'black-menu':'#717171FF',
        'oi-bg':'#F7F7F7',
        'opacity-text': '#ADA7A7',
        'gray-but':'#ADA7A7'
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}

