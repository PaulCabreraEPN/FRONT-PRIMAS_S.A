/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode:'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#205598', // Nombre del color: código hexadecimal
        customWhite: '#efefef', // Otro color personalizado
      },
    },
  },
  plugins: [],
}
