/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
      dominant: "#F7F7F7",
      secondary: "#FFFFFF",
      accent: "#5B8D56",
      hovercolor: "[#4B7447]",
      complement: "#98C581",
      lightcomplement: "#CDD7C1",
    },
      fontFamily: {
        geist: ['"Geist"', 'sans-serif'],
      },
  },
  },
  plugins: [],
};
