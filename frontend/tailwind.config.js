/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    './node_modules/primereact/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        gunmetal: {
          DEFAULT: "#253737",
          medium: "#869696",
          ligth: "#C7CFD1",
        },
        flame: {
          DEFAULT:"#E64D24",
          medium: "#F4A27C",
          light: "#FBD8C4"},
        "tiffany-blue": {
          DEFAULT: "#00B9AE",
          medium: "#9CD7D1",
          light: "#D6EFEC"
        },
        "vivid-cerulean": "#0DACEC",
        "oreoles-orange": "#F9421E",
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    },
  },
  plugins: [],
};
