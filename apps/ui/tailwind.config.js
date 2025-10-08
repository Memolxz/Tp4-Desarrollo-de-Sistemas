/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
      dominant: "#F5F5F5",
      secondary: "#FFFFFF",
      accent: "#7F00FF",
    },
  },
  },
  plugins: [],
};
