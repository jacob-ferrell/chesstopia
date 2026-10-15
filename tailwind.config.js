/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"],
        chess: [
          "DejaVu Sans",
          "Segoe UI Symbol",
          "Noto Sans Symbols 2",
          "Apple Symbols",
          "Arial Unicode MS",
          "sans-serif",
        ],
      },
      colors: {
        board: {
          light: "#ca8a04", // yellow-600
          dark: "#713f12", // yellow-900
          frame: "#422006", // yellow-950
        },
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(0, 0, 0, 0.55)",
        glow: "0 0 0 3px rgba(202, 138, 4, 0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulsate: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.9" },
          "50%": { transform: "scale(1.12)", opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.35s ease-out both",
        pulsate: "pulsate 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
