"use client";

import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "next-themes";

export function ThemeSwitch() {
  const { theme, systemTheme, setTheme } = useTheme();

  // Estado para saber se já "montamos" (hidratamos) o componente
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Se 'theme' for "system", usamos o tema real do sistema
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  // Ao clicar no input, alterna entre dark e light
  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  // Se ainda não montou, não renderiza nada (ou renderiza um placeholder)
  if (!mounted) {
    return null;
  }

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      {/* 
        Usamos <input type="checkbox"> apenas para fins de acessibilidade,
        e estilizamos manualmente (sr-only, etc). 
      */}
      <input
        type="checkbox"
        className="sr-only peer"
        checked={isDark}
        onChange={toggleTheme}
      />
      <div
        className={`
          w-11 h-6 rounded-full bg-gray-200 
          peer-focus:outline-none transition-colors
          dark:bg-gray-600 peer-checked:bg-primary
          relative
        `}
      >
        <div
          className={`
            absolute top-[2px] left-[2px]
            w-5 h-5 rounded-full border border-gray-300 bg-white
            transition-all duration-300
            flex items-center justify-center
            ${isDark ? "translate-x-5" : ""}
          `}
        >
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
