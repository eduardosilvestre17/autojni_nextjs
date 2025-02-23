// src/app/Header.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
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
    <header className="bg-white dark:bg-gray-900 shadow relative">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Área Esquerda (Hamburger + Logo) */}
        <div className="flex items-center space-x-2">
          {/* Botão Hamburger (sempre visível) */}
          <button
            className="p-2 text-primary dark:text-primary hover:text-primary-dark"
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

        {/* Barra de busca (agora aparece em todas as telas) */}
        <div className="flex flex-1 justify-center mx-4">
          <form className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Pesquisar produtos..."
              className="w-full border dark:border-gray-700 
                         rounded px-4 py-2 focus:outline-none 
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

        {/* Ícones (coração, carrinho) + Tema */}
        <div className="flex items-center space-x-4">
          {/* Ícones de coração e carrinho */}
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

          {/* Switch para Dark Mode */}
          <div className="ml-2 flex items-center gap-2">
            <span className="text-xl">☀️</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isDarkMode}
                onChange={handleToggleDark}
              />
              <div
                className="w-11 h-6 bg-gray-200 peer-focus:outline-none 
                           rounded-full peer dark:bg-gray-600 
                           peer-checked:bg-primary peer-checked:after:translate-x-5 
                           after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                           after:bg-white after:border-gray-300 after:border 
                           after:rounded-full after:h-5 after:w-5 after:transition-all"
              />
            </label>
            <span className="text-xl">🌙</span>
          </div>
        </div>
      </div>

      {/* Drawer (menu que desliza da esquerda) */}
      <div
        className={`fixed inset-0 z-50 flex ${
          mobileMenuOpen ? "block" : "hidden"
        }`}
      >
        {/* Overlay (fundo escurecido) com animação */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50 
                     transition-opacity duration-300 ease-in-out"
          style={{
            opacity: mobileMenuOpen ? 1 : 0,
          }}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Conteúdo do drawer com animação */}
        <div
          className={`relative bg-white dark:bg-gray-900 w-64 h-full shadow-lg 
                      transform transition-transform duration-300 ease-in-out
                      ${
                        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                      }`}
        >
          <div className="p-4 flex items-center justify-between border-b dark:border-gray-700">
            <span className="text-xl font-bold text-primary dark:text-primary">
              Menu
            </span>
            {/* Botão para fechar via "X" */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-foreground dark:text-dark-foreground 
                         hover:text-primary-dark dark:hover:text-primary"
              aria-label="Fechar menu"
            >
              <i className="fa-solid fa-xmark text-2xl"></i>
            </button>
          </div>

          {/* Links de navegação (apenas dentro do drawer) */}
          <nav className="p-4">
            <ul className="flex flex-col space-y-4 font-medium text-foreground dark:text-dark-foreground">
              <li>
                <Link
                  href="/"
                  className="hover:text-primary-dark dark:hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre"
                  className="hover:text-primary-dark dark:hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sobre
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="hover:text-primary-dark dark:hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
