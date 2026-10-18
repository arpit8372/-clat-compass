import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        compass: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#bae0fd",
          300: "#7cc8fb",
          400: "#36acf7",
          500: "#0c8ee9",
          600: "#0270c7",
          700: "#0359a1",
          800: "#074b83",
          900: "#0b3f6d",
          950: "#072849",
        },
        navy: {
          800: "#101d2d",
          850: "#0c1724",
          900: "#09121d",
          950: "#050b12",
        },
        gold: {
          50: "#fefdf2",
          100: "#fdfbe8",
          200: "#faf4c5",
          300: "#f6e893",
          400: "#efd453",
          500: "#e5bc24",
          600: "#ca9a19",
          700: "#a17215",
          800: "#835917",
          900: "#6f4918",
        },
        cbt: {
          visited: "#f3f4f6",
          notAnswered: "#ef4444",
          answered: "#10b981",
          marked: "#8b5cf6",
          markedAnswered: "#4f46e5",
        }
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      }
    },
  },
  plugins: [],
};
export default config;
