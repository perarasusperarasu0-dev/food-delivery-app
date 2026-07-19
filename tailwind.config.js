/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171410",
        surface: "#221D16",
        surface2: "#2B241A",
        chili: "#FF5A1F",
        herb: "#8BAA3C",
        cream: "#F5EFE4",
        muted: "#9A9285",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
