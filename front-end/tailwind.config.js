/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // important for Angular
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0F19",    // very dark blue-black
        foreground: "#FFFFFF",    // white text
        accent: "#6399B0",        // soft dark gray-blue
        primary: "#45A29E",       // teal/cyan for buttons or links
        secondary: "#1C2233",     // bright aqua highlight
        danger: "#D23F38"         // red for errors or warnings
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      }
    },
  },
  plugins: [],
};