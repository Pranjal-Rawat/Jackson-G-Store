/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}', // Only if using /pages
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          400: '#F2635A',   // lighter Jackson Red
          500: '#ED1C24',   // Jackson Red
          600: '#C4161B',   // Darker red (hover)
        },
        secondary: {
          400: '#FFDF4D',   // lighter Jackson Yellow
          500: '#FFCC00',   // Jackson Yellow
          600: '#E6B800',   // Darker yellow (hover)
        },
      },
      fontFamily: {
        display: ['Geist', 'sans-serif'],
        body:    ['Geist', 'sans-serif'],
      },
      boxShadow: {
        theme: '0 4px 20px -4px rgba(237, 28, 36, 0.3)', // Brand shadow
      },
      maxWidth: {
        '8xl': '90rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
