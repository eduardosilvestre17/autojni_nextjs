// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Para usar as variantes "dark:"
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cor primária (azul JNI)
        primary: "#023f86",
        // Cor secundária (laranja JNI)
        myOrange: "#f9af22",

        // Variações, se precisar
        "primary-dark": "#012f63",
        "myOrange-dark": "#d98f1c",

        // Outros
        background: "#ffffff",
        foreground: "#111827",
        "dark-bg": "#1a1a1a",
        "dark-foreground": "#e5e7eb",
      },
      fontFamily: {
        // Exemplo de fonte adicional, se precisar
        varela: ["var(--font-varela-round)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
