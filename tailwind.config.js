const { tailwindColors } = require("./src/constants/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  presets: [require("nativewind/preset")],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ...tailwindColors },
    },
  },
  plugins: [],
};
