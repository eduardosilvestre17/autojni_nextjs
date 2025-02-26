"use client";

import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { SearchInput } from "@/components/SearchInput";

// Hook simples de debounce
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const sp = useSearchParams();
  const pathname = usePathname();

  // Guardamos a página onde o utilizador estava antes de começar a digitar
  const [backPath, setBackPath] = useState("");

  // No primeiro render, capturamos a URL atual
  useEffect(() => {
    if (typeof window !== "undefined") {
      setBackPath(window.location.pathname + window.location.search);
    }
  }, []);

  // 1) Obter valor inicial de ?search= da URL (caso exista)
  useEffect(() => {
    const init = sp?.get("search");
    if (init) {
      setSearchTerm(init);
    }
  }, [sp]);

  // 2) debounce de 300ms no texto digitado
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // 3) Sempre que 'debouncedSearchTerm' mudar, atualiza a rota
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      router.replace(`/loja?search=${encodeURIComponent(debouncedSearchTerm)}`);
    } else {
      if (backPath) {
        router.replace(backPath);
      } else {
        router.replace("/");
      }
    }
  }, [debouncedSearchTerm, router, backPath]);

  // 4) Limpar campo caso saia da "/loja"
  useEffect(() => {
    if (pathname !== "/loja") {
      setSearchTerm("");
    }
  }, [pathname]);

  // Botão de menu mobile
  function toggleMobileMenu() {
    setMobileMenuOpen(!mobileMenuOpen);
  }

  // Ícones à direita
  const IconsAndTheme = () => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {/* Favoritos */}
        <Link
          href="/favoritos"
          className="flex items-center p-2 text-foreground dark:text-dark-foreground
                     hover:text-red-500 dark:hover:text-red-400
                     transition-colors text-lg"
        >
          <i className="fa-solid fa-heart" />
        </Link>
        {/* Carrinho */}
        <Link
          href="/carrinho"
          className="flex items-center p-2 text-foreground dark:text-dark-foreground
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
      {/* Switch de tema */}
      <ThemeSwitch />
    </div>
  );

  return (
    <header className="bg-white dark:bg-gray-900 shadow relative">
      <div className="container mx-auto px-4 py-4">
        {/* 
          Usamos uma grid responsiva que organiza:
          [Botão + Logo] - [Barra de pesquisa] - [Ícones]
        */}
        <div className="flex flex-col items-center gap-4 md:grid md:grid-cols-[auto,1fr,auto]">
          {/* Parte esquerda: hambúrguer + logo */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-2">
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

            {/* Ícones (mobile) */}
            <div className="md:hidden">
              <IconsAndTheme />
            </div>
          </div>

          {/* Campo de pesquisa (central) */}
          <div className="flex justify-center w-full relative">
            {/* 
              w-full: ocupa toda a largura possível 
              max-w-xl: limita a um tamanho adequado para desktop 
              mx-auto: centraliza se houver espaço sobrando
            */}
            <div className="w-full max-w-xl mx-auto">
              <SearchInput
                placeholder="Pesquisar produtos..."
                withIcon
                value={searchTerm}
                onChange={setSearchTerm}
              />
            </div>
          </div>

          {/* Ícones + tema (desktop) */}
          <div className="hidden md:flex justify-end">
            <IconsAndTheme />
          </div>
        </div>
      </div>

      {/* Drawer (mobile) */}
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
        {/* Overlay escuro */}
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
                         transition-colors text-2xl"
            >
              <i className="fa-solid fa-xmark" />
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
