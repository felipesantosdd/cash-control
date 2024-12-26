/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/public/index.html"],
  theme: {
    extend: {
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
      transitionTimingFunction: {
        expand: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        300: "300ms",
      },
      keyframes: {
        expandContent: {
          "0%": { maxHeight: "0", opacity: "0", transform: "scaleY(0)" },
          "100%": { maxHeight: "2000px", opacity: "1", transform: "scaleY(1)" },
        },
        collapseContent: {
          "0%": { maxHeight: "2000px", opacity: "1", transform: "scaleY(1)" },
          "100%": { maxHeight: "0", opacity: "0", transform: "scaleY(0)" },
        },
        keyframes: {
          wiggle: {
            "0%, 100%": { transform: "rotate(-3deg)" },
            "50%": { transform: "rotate(3deg)" },
          },
        },
        transitionDuration: {
          2000: "2000ms",
        },
      },
      animation: {
        expand: "expandContent 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        collapse: "collapseContent 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "spin-slow": "spin 3s linear infinite",
      },
      transitionProperty: {
        "max-height": "max-height",
      },
    },
  },
  plugins: [],
};
