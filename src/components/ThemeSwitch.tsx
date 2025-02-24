"use client";

import { useState, useEffect } from "react";

export function ThemeSwitch() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  // Ao montar no cliente, lê o tema guardado no localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setIsDark(true);
    } else {
      // Se 'light' ou null/undefined, define como false
      setIsDark(false);
    }
  }, []);

  // Sempre que isDark mudar (e não for null), aplica no <html> e salva em localStorage
  useEffect(() => {
    if (isDark === null) return; // ainda não carregamos
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Enquanto não soubermos o valor real, não renderiza o switch
  if (isDark === null) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xl">☀️</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isDark}
          onChange={() => setIsDark(!isDark)}
        />
        <div
          className="
            w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full
            peer dark:bg-gray-600 peer-checked:bg-primary
            peer-checked:after:translate-x-5
            after:content-[''] after:absolute after:top-[2px] after:left-[2px]
            after:bg-white after:border-gray-300 after:border
            after:rounded-full after:h-5 after:w-5 after:transition-all
          "
        />
      </label>
      <span className="text-xl">🌙</span>
    </div>
  );
}
