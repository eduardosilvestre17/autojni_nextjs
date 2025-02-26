"use client";
import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export function ThemeSwitch() {
  // Em vez de isDark: boolean | null, faremos boolean
  // Default: assume "light" e depois corrigimos se localStorage = "dark"
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, []);

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

  // Agora nunca retornamos null.
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={isDark}
        onChange={() => setIsDark(!isDark)}
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
