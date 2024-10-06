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
      d1: "rgb(var(--d1))",
      d2: "rgb(var(--d2))",
      l1: "rgb(var(--l1))",
      l2: "rgb(var(--l2))",
      l3: "rgb(var(--l3))",
      transparent: "transparent"
    }
  },
  plugins: [twGlow],
}

