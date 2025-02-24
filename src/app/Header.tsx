"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeSwitch } from "@/components/ThemeSwitch";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  // Ícones (favoritos, carrinho, login) + ThemeSwitch
  const IconsAndTheme = () => (
    <div className="flex items-center space-x-4">
      <Link
        href="/favoritos"
        className="flex items-center p-2 
                   text-foreground dark:text-dark-foreground 
                   hover:text-red-500 dark:hover:text-red-400
                   transition-colors"
      >
        <i className="fa-solid fa-heart text-lg"></i>
      </Link>
      <Link
        href="/carrinho"
        className="flex items-center p-2
                   text-foreground dark:text-dark-foreground
                   hover:text-primary-dark dark:hover:text-primary
                   transition-colors"
      >
        <i className="fa-solid fa-cart-shopping text-lg"></i>
      </Link>
      <Link
        href="/login"
        className="inline-flex items-center space-x-2 whitespace-nowrap p-2
                   text-foreground dark:text-dark-foreground
                   hover:text-primary-dark dark:hover:text-primary 
                   transition-colors"
      >
        <i className="fa-solid fa-user text-lg"></i>
        <span className="hidden md:inline">Iniciar Sessão</span>
      </Link>

      <ThemeSwitch />
    </div>
  );

  return (
    <header className="bg-white dark:bg-gray-900 shadow relative">
      <div className="container mx-auto px-4 py-4">
        {/* Em telas md+: 3 colunas (grid). Em telas menores: flex col. */}
        <div className="flex flex-col items-center gap-4 md:grid md:grid-cols-3">
          {/* Coluna 1 (Esquerda): Hambúrguer + Logo */}
          <div className="flex items-center justify-between w-full md:w-auto md:col-span-1">
            <div className="flex items-center gap-2">
              {/* Botão Hambúrguer */}
              <button
                onClick={toggleMobileMenu}
                aria-label="Abrir menu"
                className="inline-flex items-center leading-none align-middle
                           text-primary dark:text-white
                           transition-colors
                           hover:text-myOrange dark:hover:text-myOrange"
              >
                <svg
                  className="w-6 h-6 mt-[3px]"
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

              {/* Texto "AutoJNI" */}
              <Link
                href="/"
                className="inline-flex items-center leading-none align-middle
                           text-2xl font-bold
                           text-primary dark:text-white
                           transition-colors
                           hover:text-myOrange dark:hover:text-myOrange"
              >
                AutoJNI
              </Link>
            </div>

            {/* Ícones + tema (apenas no mobile) */}
            <div className="md:hidden">
              <IconsAndTheme />
            </div>
          </div>

          {/* Coluna 2 (Centro): Barra de pesquisa */}
          <div className="flex justify-center w-full md:col-span-1">
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
                aria-label="Pesquisar"
                className="absolute right-2 top-1/2 -translate-y-1/2
                           text-foreground dark:text-dark-foreground
                           hover:text-primary-dark dark:hover:text-primary
                           transition-colors"
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
                    d="M21 21l-4.35-4.35M9.5 17a7.5 7.5 0 1 1 0-15 
                       7.5 7.5 0 0 1 0 15z"
                  />
                </svg>
              </button>
            </form>
          </div>

          {/* Coluna 3 (Direita): Ícones + tema (só em telas md+) */}
          <div className="hidden md:flex md:col-span-1 justify-end">
            <IconsAndTheme />
          </div>
        </div>
      </div>

      {/* Drawer (menu) + Overlay (mobile) */}
      <div
        className={`
          fixed inset-0 z-50 transition-all duration-300 ease-in-out
          ${
            mobileMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Painel lateral */}
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

          <nav className="p-4">
            <ul className="flex flex-col space-y-4 font-medium text-foreground dark:text-dark-foreground">
              <li>
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 
                             hover:text-myOrange dark:hover:text-myOrange 
                             transition-colors"
                >
                  <i className="fa-solid fa-house text-lg"></i>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 
                             hover:text-myOrange dark:hover:text-myOrange 
                             transition-colors"
                >
                  <i className="fa-solid fa-circle-info text-lg"></i>
                  <span>Sobre</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 
                             hover:text-myOrange dark:hover:text-myOrange 
                             transition-colors"
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
