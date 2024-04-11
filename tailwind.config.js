const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}", "./assets/js/*.js"],
  theme: {
    extend: {
      colors: {
        'notenapp-blue': '#008ee6',
        'notenapp-blue-hover': '#006eb2',
      },
    },
    screens: {
      'xs': '400px',
      ...defaultTheme.screens,
    },
    fontFamily: {
      "Syne": ['Syne', 'sans-serif']
    },
  },
  plugins: [],
}

