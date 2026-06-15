/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan every component/route for className usage
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Bingebox brand palette
        brand: {
          DEFAULT: '#208AEF',
          dark: '#1565C0',
          light: '#E6F4FE',
        },
      },
    },
  },
  plugins: [],
};
