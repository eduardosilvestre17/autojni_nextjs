// src/app/Header.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Controla o tema (light/dark) adicionando/removendo "dark" no <html>
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

  // Componente para ícones (favoritos, carrinho, login) + switch de tema
  const IconsAndTheme = () => (
    <div className="flex items-center space-x-4">
      {/* Ícone de favoritos */}
      <Link
        href="/favoritos"
        className="flex items-center p-2 
                   text-foreground dark:text-dark-foreground 
                   hover:text-red-500 dark:hover:text-red-400 
                   transition-colors"
      >
        <i className="fa-solid fa-heart text-lg"></i>
      </Link>

      {/* Ícone de carrinho */}
      <Link
        href="/carrinho"
        className="flex items-center p-2 
                   text-foreground dark:text-dark-foreground 
                   hover:text-primary-dark dark:hover:text-primary 
                   transition-colors"
      >
        <i className="fa-solid fa-cart-shopping text-lg"></i>
      </Link>

      {/* Ícone + texto de "Iniciar Sessão" */}
      <Link
        href="/login"
        className="inline-flex items-center space-x-2 whitespace-nowrap p-2
                   text-foreground dark:text-dark-foreground
                   hover:text-primary-dark dark:hover:text-primary 
                   transition-colors"
      >
        <i className="fa-solid fa-user text-lg"></i>
        {/* "hidden md:inline" -> texto aparece só em telas md+ */}
        <span className="hidden md:inline">Iniciar Sessão</span>
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
  );

  return (
    <header className="bg-white dark:bg-gray-900 shadow relative">
      {/* Container principal do header */}
      <div className="container mx-auto px-4 py-4">
        {/* Em telas pequenas, 2 linhas. Em telas md+, 1 linha. */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Linha de cima (mobile): Hamburguer + Logo à esquerda, Ícones+Switch à direita */}
          <div className="flex items-center justify-between w-full md:w-auto">
            {/* Botão Hamburguer */}
            <button
              onClick={toggleMobileMenu}
              aria-label="Abrir menu"
              className="
                p-2 
                text-primary dark:text-primary 
                transition-colors
                hover:text-myOrange dark:hover:text-myOrange
              "
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

            {/* Logo (AutoJNI) */}
            <Link
              href="/"
              className="
                text-2xl font-bold 
                text-primary dark:text-primary 
                transition-colors
                hover:text-myOrange dark:hover:text-myOrange
              "
            >
              AutoJNI
            </Link>

            {/* Ícones + tema (apenas no mobile) */}
            <div className="md:hidden">
              <IconsAndTheme />
            </div>
          </div>

          {/* Barra de pesquisa */}
          <div className="flex justify-center w-full">
            <form className="relative max-w-md w-full">
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
                           hover:text-primary-dark dark:hover:text-primary
                           transition-colors"
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

          {/* Ícones + tema (em telas md+, aparece no final da linha) */}
          <div className="hidden md:flex">
            <IconsAndTheme />
          </div>
        </div>
      </div>

      {/* Drawer (menu) + Overlay */}
      <div
        className={`
          fixed inset-0 z-50 
          transition-all duration-300 ease-in-out
          ${
            mobileMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
      >
        {/* Overlay (fundo escurecido) */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Painel lateral (drawer) */}
        <div
          className={`
            absolute left-0 top-0 bottom-0 w-64 
            bg-white dark:bg-gray-900 shadow-lg
            transform transition-transform duration-300 ease-in-out
            ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="p-4 flex items-center justify-between border-b dark:border-gray-700">
            <span className="text-xl font-bold text-primary dark:text-primary">
              Menu
            </span>
            {/* Botão fechar */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Fechar menu"
              className="text-foreground dark:text-dark-foreground 
                         hover:text-primary-dark dark:hover:text-primary
                         transition-colors"
            >
              <i className="fa-solid fa-xmark text-2xl"></i>
            </button>
          </div>

          {/* Menu: ícones e texto alinhados */}
          <nav className="p-4">
            <ul className="flex flex-col space-y-4 font-medium text-foreground dark:text-dark-foreground">
              <li>
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="
                    flex items-center gap-2
                    hover:text-myOrange dark:hover:text-myOrange
                    transition-colors
                  "
                >
                  <i className="fa-solid fa-house text-lg"></i>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre"
                  onClick={() => setMobileMenuOpen(false)}
                  className="
                    flex items-center gap-2
                    hover:text-myOrange dark:hover:text-myOrange
                    transition-colors
                  "
                >
                  <i className="fa-solid fa-circle-info text-lg"></i>
                  <span>Sobre</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  onClick={() => setMobileMenuOpen(false)}
                  className="
                    flex items-center gap-2
                    hover:text-myOrange dark:hover:text-myOrange
                    transition-colors
                  "
                >
                  <i className="fa-solid fa-envelope text-lg"></i>
                  <span>Contacto</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
