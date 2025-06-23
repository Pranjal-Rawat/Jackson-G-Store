/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}', // Include if you're using /pages
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#ED1C24',   // Jackson Red
          600: '#c4161b',   // Darker red (hover)
        },
        secondary: {
          500: '#FFCC00',   // Jackson Yellow
          600: '#e6b800',   // Darker yellow (hover)
        },
      },
      fontFamily: {
        display: ['Geist', 'sans-serif'],
        body: ['Geist', 'sans-serif'],
      },
      boxShadow: {
        theme: '0 4px 20px -4px rgba(237, 28, 36, 0.3)', // Custom brand shadow
      },
    },
  },
  plugins: [],
  // Optional: uncomment if using dynamic class generation or Tailwind CLI builds
  // safelist: ['bg-primary-500', 'bg-secondary-500'],
};
