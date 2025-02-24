"use client";

import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export function ThemeSwitch() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  // Lê o tema do localStorage ao montar
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, []);

  // Aplica/remove a classe "dark" no <html> e salva no localStorage
  useEffect(() => {
    if (isDark === null) return; // Aguarda até sabermos o tema
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Enquanto não sabemos o tema, não renderiza o switch
  if (isDark === null) {
    return null;
  }

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      {/* Checkbox invisível, que controla o estado */}
      <input
        type="checkbox"
        className="sr-only peer"
        checked={isDark}
        onChange={() => setIsDark(!isDark)}
      />

      {/* 
        Switch "fundo": 
        - w-11 h-6 => tamanho do switch
        - peer-checked:bg-primary => cor do switch ao "ligar"
      */}
      <div
        className={`
          w-11 h-6 rounded-full bg-gray-200 
          peer-focus:outline-none transition-colors
          dark:bg-gray-600 peer-checked:bg-primary
          relative
        `}
      >
        {/* 
          Bolinha interna (slider):
          - Absoluta, do mesmo tamanho do switch interior (w-5 h-5)
          - Desloca-se para a direita em modo "checked" (translate-x-5)
          - flex items-center justify-center => para centralizar o ícone
        */}
        <div
          className={`
            absolute top-[2px] left-[2px] 
            w-5 h-5 rounded-full border border-gray-300 bg-white 
            transition-all duration-300
            flex items-center justify-center
            ${isDark ? "translate-x-5" : ""}
          `}
        >
          {/* 
            Ícone menor (p. ex. text-[10px]) 
            Ajuste conforme necessário. 
          */}
          {isDark ? (
            <FaMoon className="text-[10px] text-gray-600" />
          ) : (
            <FaSun className="text-[10px] text-yellow-500" />
          )}
        </div>
      </div>
    </label>
  );
}
