/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        neongold: 'linear-gradient(145deg, #d1ff00 0%, #ffd933 100%)',
        blushsky: 'linear-gradient(145deg, rgba(238, 174, 202, 1) 0%, rgba(148, 187, 233, 1) 100%)'
      },
      colors: {
        gray: {
          99: '#757b8a',
          90: '#5e636e',
          80: '#525661',
          70: '#464a53',
          60: '#3b3d45',
          50: '#2f3137',
          40: '#2a2c32',
          30: '#232529',
          20: '#17191c',
          10: '#0c0d0e',
        },
      },
    },
  },
  plugins: [],
};
