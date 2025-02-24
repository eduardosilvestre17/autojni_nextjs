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
        // Cores principais
        primary: "#023f86",
        myOrange: "#f9af22",
        "primary-dark": "#012f63",
        "myOrange-dark": "#d98f1c",

        // Cores de fundo e texto
        background: "#ffffff",
        foreground: "#111827",
        "dark-bg": "#1a1a1a",
        "dark-foreground": "#e5e7eb",

        // Exemplo de cores específicas para o input de pesquisa
        "search-bg": "#ffffff",
        "search-bg-dark": "#1f2937", // Equivalente ao gray-800
        "search-border-dark": "#374151", // Equivalente ao gray-700
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
