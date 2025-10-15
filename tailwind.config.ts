import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        youtube: {
          red: '#E50914',
          dark: '#0a0a0a',
          card: '#1E1E1E',
          border: '#2D2D2D',
        }
      }
    },
  },
  plugins: [],
} satisfies Config;
