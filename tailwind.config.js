/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'notenapp-blue' : '#008ee6',
        'notenapp-blue-hover' : '#006eb2',
      },
    },
  },
  plugins: [],
}

