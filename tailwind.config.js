/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brandRed: "#e50914",
        brandRedLight: "#ff2a35",
        brandCream: "#f4f4f5",
        brandBlack: "#080808",
        brandGray: "#6b7280",
        brandPurple: "#27272a",
        igRed: "#e50914",
        igRedDark: "#9f0712",
        igCarbon: "#111111",
        igAsh: "#f4f4f5",
        igGold: "#f5b642",
      },
    },
  },
  plugins: [],
};
