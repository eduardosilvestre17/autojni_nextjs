// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Importante para ativar classes "dark"
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fundo padrão (modo claro)
        background: "#f3f4f6",
        // Texto padrão (modo claro)
        foreground: "#111827",

        // Marca principal
        primary: "#326ce5",
        "primary-dark": "#2b5ac0",
        secondary: "#f7b529",
        "secondary-dark": "#d69620",

        // Modo escuro
        "dark-bg": "#1a1a1a",
        "dark-foreground": "#e5e7eb",
      },
      fontFamily: {
        varela: ["var(--font-varela-round)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
