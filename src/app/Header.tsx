"use client";

import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { SearchInput } from "@/components/SearchInput";

/**
 * Hook de debounce:
 * Retorna 'value' somente após "delay" ms sem que o usuário digite.
 */
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Ao mudar de rota:
  // - Se estamos em "/loja", capturamos o ?search= da URL e setamos no campo
  // - Se saímos de "/loja", limpamos o campo
  useEffect(() => {
    if (pathname === "/loja") {
      const initSearch = searchParams?.get("search") || "";
      setSearchTerm(initSearch);
    } else {
      setSearchTerm("");
    }
  }, [pathname, searchParams]);

  // Faz debounce no 'searchTerm'
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Guardamos o último valor que enviamos para a rota,
  // para não redirecionar repetidamente com o mesmo valor.
  const lastSearchRef = useRef<string>("");

  /**
   * Efeito principal que faz a navegação:
   * - Se o 'debouncedSearchTerm' mudou em relação ao 'lastSearchRef.current':
   *   - Se houver texto, vamos para /loja?search=texto
   *   - Se estiver vazio e estivermos em /loja, removemos ?search (router.replace("/loja"))
   *   - Caso contrário, não fazemos nada (para não "forçar" o user de volta à loja).
   */
  useEffect(() => {
    const currentSearch = debouncedSearchTerm.trim();

    // Se não houve mudança no valor, não faz nada
    if (currentSearch === lastSearchRef.current) return;

    // Atualiza o ref
    lastSearchRef.current = currentSearch;

    // Se o usuário digitou algo
    if (currentSearch) {
      // Se já estiver na loja, replace para não poluir o histórico
      if (pathname === "/loja") {
        router.replace(`/loja?search=${encodeURIComponent(currentSearch)}`);
      } else {
        // Caso contrário, push para /loja?search=...
        router.push(`/loja?search=${encodeURIComponent(currentSearch)}`);
      }
    } else {
      // Se não há texto e estamos na /loja, remove o ?search
      if (pathname === "/loja") {
        router.replace("/loja");
      }
      // Se não está na loja, não faz nada
    }
  }, [debouncedSearchTerm, pathname, router]);

  // Botão menu mobile
  function toggleMobileMenu() {
    setMobileMenuOpen(!mobileMenuOpen);
  }

  // Ícones e switch de tema (lado direito)
  const IconsAndTheme = () => (
    <div className="flex items-center gap-4">
      {/* Link destacado para localização */}
      <Link
        href="https://maps.app.goo.gl/2hVdvtqxuJF4e52v5"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 p-2
                   text-primary dark:text-primary
                   hover:text-myOrange dark:hover:text-myOrange
                   transition-colors"
      >
        {/* Ícone maior; texto "Visite-nos" só aparece em telas md ou maiores */}
        <i className="fa-solid fa-location-dot text-xl md:text-2xl" />
        <span className="hidden md:inline text-xl font-bold">Visite-nos</span>
      </Link>

      {/* Demais ícones */}
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
        {/* Layout: [Botão + Logo] - [Barra de pesquisa] - [Ícones] */}
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

          {/* Barra de pesquisa (central) */}
          <div className="flex justify-center w-full relative">
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
                  <i className="fa-solid fa-house text-lg" />
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
                  <i className="fa-solid fa-store text-lg" />
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
                  <i className="fa-solid fa-circle-info text-lg" />
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
                  <i className="fa-solid fa-envelope text-lg" />
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
