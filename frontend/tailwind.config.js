/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-dark": "#2A324B",
        "primary-light": "#F7C59F",
      },
      fontFamily: {
        cursive: ["Grey Qo"],
      },
    },
  },
  plugins: [],
};
