/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#ED1C24', // Jackson Red
          600: '#c4161b', // Darker shade for hover
        },
        secondary: {
          500: '#FFCC00', // Jackson Yellow
          600: '#e6b800', // Darker yellow for hover
        },
      },
      boxShadow: {
        theme: '0 4px 20px -4px rgba(237, 28, 36, 0.3)', // red-tinted custom shadow
      },
    },
  },
  plugins: [],
};
