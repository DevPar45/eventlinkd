import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#ef4444",
        primary: "#000000",
        secondary: "#111111",
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;



