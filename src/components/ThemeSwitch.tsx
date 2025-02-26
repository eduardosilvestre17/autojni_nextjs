"use client";

import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

// Função auxiliar para obter preferência atual (localStorage ou sistema)
function getInitialTheme(): boolean {
  // Evita erro no SSR: só lemos localStorage se window estiver definido
  if (typeof window !== "undefined") {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      return true;
    }
    if (storedTheme === "light") {
      return false;
    }
    // Caso não haja nada em localStorage, segue preferência do sistema:
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  // Se estiver renderizando no servidor, apenas retorna 'false' por segurança
  return false;
}

export function ThemeSwitch() {
  // Iniciamos já com o valor correto de "dark" ou "light", sem retornar null
  const [isDark, setIsDark] = useState<boolean>(getInitialTheme);

  // Sempre que mudar 'isDark', atualiza o <html> e o localStorage
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Basta alternar o boolean
  function toggleTheme() {
    setIsDark(!isDark);
  }

  return (
    <label className="relative inline-flex items-center cursor-pointer">
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
