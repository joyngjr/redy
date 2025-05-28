/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // important for Angular
  ],
  theme: {
    extend: {
      colors: {
        background: "#1C2233",    // dark navy background
        foreground: "#F4EDE5",    // warm off-white text
        accent: "#6399B0",        // soft blue accent
        primary: "#4C2A1E",       // deep brown
        secondary: "#A4867C",     // muted light brown
        danger: "#D13F37",         // alert red
        success: "#5A7D4C",       // soft green for success messages
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        oldnews: ["OldNewspaperTypes", "serif"],
      }
    },
  },
  plugins: [],
};