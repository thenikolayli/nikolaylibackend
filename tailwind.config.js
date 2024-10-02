/** @type {import('tailwindcss').Config} */

import twGlow from "twglow";

module.exports = {
  content: [
    "./templates/**/*.html",
    "./static/**/*.{html,css,js}",
    "./static/js/**/*.js"
  ],
  theme: {
    extend: {},
    colors: {
      d1: "#0d1b2a",
      d2: "#1b263b",
      l1: "#415a77",
      l2: "#778da9",
      l3: "#e0e1dd"
    }
  },
  plugins: [twGlow],
}

