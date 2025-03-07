"use client";

import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "next-themes";

export function ThemeSwitch() {
  // Hook do next-themes
  const { theme, systemTheme, setTheme } = useTheme();

  // Se 'theme' estiver "system", pegamos o valor real do sistema
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  // Ao clicar, se estiver em 'dark', muda pra 'light'; senão, muda pra 'dark'
  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      {/* 
        Podíamos usar um <button> normal. Mas, como no seu exemplo,
        deixo um <input type="checkbox"> estilizado. 
      */}
      <input
        type="checkbox"
        className="sr-only peer"
        checked={isDark}
        onChange={toggleTheme}
        // Se preferir, pode desabilitar o input enquanto 'systemTheme' não estiver carregado
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
