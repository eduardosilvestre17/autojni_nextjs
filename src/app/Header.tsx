// src/app/Header.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  // 1) Começa como escuro por padrão, casando com layout.tsx
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const htmlEl = document.documentElement;
    if (isDarkMode) {
      htmlEl.classList.add("dark");
    } else {
      htmlEl.classList.remove("dark");
    }
  }, [isDarkMode]);

  function toggleMobileMenu() {
    setMobileMenuOpen(!mobileMenuOpen);
  }

  function handleToggleDark() {
    setIsDarkMode(!isDarkMode);
  }

  return (
    <header className="bg-white dark:bg-gray-900 shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Área Esquerda (Hamburger + Logo) */}
        <div className="flex items-center space-x-2">
          {/* Botão Hamburger (mobile) */}
          <button
            className="md:hidden p-2 text-primary dark:text-primary hover:text-primary-dark"
            onClick={toggleMobileMenu}
            aria-label="Abrir menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-primary dark:text-primary"
          >
            AutoJNI
          </Link>
        </div>

        {/* Barra de busca (desktop) */}
        <div className="hidden md:flex flex-1 mx-4">
          <form className="w-full relative">
            <input
              type="text"
              placeholder="Pesquisar produtos..."
              className="w-full border dark:border-gray-700 rounded-full px-4 py-2 focus:outline-none 
                         focus:border-primary dark:focus:border-primary-dark 
                         bg-white dark:bg-gray-800 
                         text-foreground dark:text-dark-foreground"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 
                         text-foreground dark:text-dark-foreground 
                         hover:text-primary-dark dark:hover:text-primary"
              aria-label="Pesquisar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M9.5 17a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
                />
              </svg>
            </button>
          </form>
        </div>

        {/* Menu desktop + Ícones */}
        <div className="hidden md:flex items-center space-x-4">
          <nav>
            <ul className="flex space-x-6 font-medium text-foreground dark:text-dark-foreground">
              <li>
                <Link
                  href="/"
                  className="hover:text-primary-dark dark:hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre"
                  className="hover:text-primary-dark dark:hover:text-primary transition-colors"
                >
                  Sobre
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="hover:text-primary-dark dark:hover:text-primary transition-colors"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </nav>

          {/* Ícones de coração e carrinho (Font Awesome) */}
          <Link
            href="/favoritos"
            className="p-2 text-foreground dark:text-dark-foreground 
                       hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            <i className="fa-solid fa-heart text-lg"></i>
          </Link>
          <Link
            href="/carrinho"
            className="p-2 text-foreground dark:text-dark-foreground 
                       hover:text-primary-dark dark:hover:text-primary transition-colors"
          >
            <i className="fa-solid fa-cart-shopping text-lg"></i>
          </Link>

          {/* Botão de toggle dark */}
          <button
            onClick={handleToggleDark}
            className="ml-4 py-2 px-3 rounded border dark:border-gray-700 text-sm 
                       text-foreground dark:text-dark-foreground 
                       hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            {isDarkMode ? "Modo Claro" : "Modo Escuro"}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-700">
          <nav className="px-4 py-2">
            <ul className="flex flex-col space-y-2 text-foreground dark:text-dark-foreground">
              <li>
                <Link
                  href="/"
                  className="block py-1 hover:text-primary-dark dark:hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre"
                  className="block py-1 hover:text-primary-dark dark:hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sobre
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="block py-1 hover:text-primary-dark dark:hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contato
                </Link>
              </li>
              <li className="flex items-center space-x-4 mt-2">
                <Link
                  href="/favoritos"
                  className="text-foreground dark:text-dark-foreground hover:text-red-500 dark:hover:text-red-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fa-solid fa-heart text-lg"></i>
                </Link>
                <Link
                  href="/carrinho"
                  className="text-foreground dark:text-dark-foreground hover:text-primary-dark dark:hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className="fa-solid fa-cart-shopping text-lg"></i>
                </Link>
              </li>
              {/* Botão modo escuro no menu mobile */}
              <li>
                <button
                  onClick={() => {
                    handleToggleDark();
                    setMobileMenuOpen(false);
                  }}
                  className="mt-2 py-2 px-3 rounded border dark:border-gray-700 text-sm 
                             hover:bg-gray-200 dark:hover:bg-gray-800 transition w-full text-left"
                >
                  {isDarkMode ? "Modo Claro" : "Modo Escuro"}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
