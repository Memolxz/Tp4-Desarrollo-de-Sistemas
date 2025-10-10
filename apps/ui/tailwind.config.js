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
      accent: "#3E0212",
      complement: "#386641",
      lightcomplement: "#CDD7C1",
    },
  },
  },
  plugins: [],
};
