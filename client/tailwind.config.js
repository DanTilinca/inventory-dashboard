/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // Use "class" strategy so native selects keep daisyUI `.select` layout.
    // Default forms plugin styles fight daisyUI and clip option text vertically.
    require("@tailwindcss/forms")({ strategy: "class" }),
    require("daisyui"),
  ],
  daisyui: {
    themes: ["light",],
  },
};
