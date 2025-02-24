"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeSwitch } from "@/components/ThemeSwitch";
// Importe o componente de pesquisa
import { SearchInput } from "@/components/SearchInput";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  // Agrupamos ícones e switch em dois "blocos" para aumentar a distância
  const IconsAndTheme = () => (
    <div className="flex items-center gap-4">
      {/* Bloco de ícones */}
      <div className="flex items-center gap-2">
        {/* Favoritos */}
        <Link
          href="/favoritos"
          className="flex items-center p-2 
                     text-foreground dark:text-dark-foreground 
                     hover:text-red-500 dark:hover:text-red-400
                     transition-colors text-lg"
        >
          <i className="fa-solid fa-heart" />
        </Link>
        {/* Carrinho */}
        <Link
          href="/carrinho"
          className="flex items-center p-2
                     text-foreground dark:text-dark-foreground
                     hover:text-primary-dark dark:hover:text-primary
                     transition-colors text-lg"
        >
          <i className="fa-solid fa-cart-shopping" />
        </Link>
        {/* Login */}
        <Link
          href="/login"
          className="inline-flex items-center space-x-2 whitespace-nowrap p-2
                     text-foreground dark:text-dark-foreground
                     hover:text-primary-dark dark:hover:text-primary 
                     transition-colors text-lg"
        >
          <i className="fa-solid fa-user" />
          <span className="hidden md:inline">Iniciar Sessão</span>
        </Link>
      </div>

      {/* Switch de tema fica mais afastado dos ícones */}
      <ThemeSwitch />
    </div>
  );

  return (
    <header className="bg-white dark:bg-gray-900 shadow relative">
      <div className="container mx-auto px-4 py-4">
        {/* 
          Em telas md+, definimos 3 "colunas" manuais:
          1) auto (hambúrguer + logo)
          2) 1fr  (barra de pesquisa)
          3) auto (ícones + switch)
        */}
        <div className="flex flex-col items-center gap-4 md:grid md:grid-cols-[auto,1fr,auto]">
          {/* Coluna 1 (Esquerda): Hambúrguer + Logo */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-2">
              {/* Botão Hambúrguer */}
              <button
                onClick={toggleMobileMenu}
                aria-label="Abrir menu"
                className="inline-flex items-center leading-none align-middle
                           text-primary dark:text-white
                           transition-colors hover:text-myOrange 
                           dark:hover:text-myOrange"
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

            {/* Ícones + Switch (apenas no mobile) */}
            <div className="md:hidden">
              <IconsAndTheme />
            </div>
          </div>

          {/* Coluna 2 (Centro): Barra de pesquisa (sem lupa) */}
          <div className="flex justify-center w-full">
            <SearchInput
              placeholder="Pesquisar produtos..."
              withIcon={true}
              // Se quiser com lupa, mude para withIcon={true}
            />
          </div>

          {/* Coluna 3 (Direita): Ícones + switch (somente md+) */}
          <div className="hidden md:flex justify-end">
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
              {/* Loja Online */}
              <li>
                <Link
                  href="/loja"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2
                             hover:text-myOrange dark:hover:text-myOrange
                             transition-colors"
                >
                  <i className="fa-solid fa-store text-lg"></i>
                  <span>Loja Online</span>
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
