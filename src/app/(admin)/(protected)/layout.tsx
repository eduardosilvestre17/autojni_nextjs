"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { Providers } from "@/app/providers";
import { signOut } from "next-auth/react";
import { ThemeSwitch } from "@/components/ThemeSwitch";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /**
   * handleLogout:
   * Chamamos "signOut()" com "callbackUrl", o que garante que o usuário seja
   * redirecionado para "/login" imediatamente após o logout.
   */
  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <Providers>
      {/*
        min-h-screen -> ocupa a altura inteira da tela
        flex         -> layout em colunas
        bg-background dark:bg-dark-bg -> usa cores do tailwind.config
        transition-colors -> animação suave ao trocar tema
      */}
      <div className="min-h-screen flex bg-background dark:bg-dark-bg transition-colors relative">
        {/* ===================== SIDEBAR (DESKTOP) ===================== */}
        <aside className="hidden md:flex md:flex-col md:w-64 bg-primary dark:bg-primary-dark text-white p-6 shadow-lg transition-colors">
          <h2 className="text-2xl font-bold tracking-wide mb-8">Admin Panel</h2>

          <nav className="flex-1 space-y-2">
            <Link
              href="/dashboard"
              className="
                block px-3 py-2 
                rounded 
                hover:bg-myOrange 
                dark:hover:bg-myOrange-dark
                transition-colors 
                cursor-pointer
              "
            >
              Dashboard
            </Link>
            <Link
              href="/produtos"
              className="
                block px-3 py-2 
                rounded 
                hover:bg-myOrange 
                dark:hover:bg-myOrange-dark
                transition-colors 
                cursor-pointer
              "
            >
              Produtos
            </Link>
          </nav>

          <button
            onClick={handleLogout}
            className="
              mt-4 
              w-full
              rounded
              bg-myOrange 
              hover:bg-myOrange-dark 
              dark:hover:bg-myOrange-dark
              transition-colors 
              cursor-pointer
              px-3 py-2
            "
          >
            Logout
          </button>

          {/*
            Switch de tema:
            Componente que alterna entre modo claro/escuro.
          */}
          <div className="flex items-center justify-center my-4">
            <ThemeSwitch />
          </div>

          <footer className="mt-8 text-sm opacity-70">
            <p>
              © {new Date().getFullYear()} Desenvolvido por MegaPC. Todos os
              direitos reservados.
            </p>
            <p>Versão 1.0</p>
          </footer>
        </aside>

        {/* ===================== HEADER (MOBILE) ===================== */}
        {/*
          Em telas menores que "md", exibimos um "header" com o hambúrguer
          que controla a abertura/fechamento da sidebar.
        */}
        <header
          className="
            md:hidden 
            flex items-center 
            bg-primary 
            dark:bg-primary-dark 
            text-white 
            p-4 
            shadow-lg 
            cursor-pointer
            transition-colors
          "
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {sidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </header>

        {/* ===================== SIDEBAR (MOBILE) ===================== */}
        <div
          className={`
            md:hidden 
            fixed inset-0 z-50 
            flex
            transition-all 
            duration-300
            ${
              sidebarOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }
          `}
        >
          {/* Conteúdo da Sidebar Mobile */}
          <div
            className={`
              w-64 
              bg-primary 
              dark:bg-primary-dark 
              text-white 
              p-6 
              shadow-lg 
              transform 
              transition-transform 
              duration-300 
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-wide">Admin Panel</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="focus:outline-none cursor-pointer"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <nav className="flex-1 space-y-2">
              <Link
                href="/dashboard"
                onClick={() => setSidebarOpen(false)}
                className="
                  block px-3 py-2 
                  rounded 
                  hover:bg-myOrange 
                  dark:hover:bg-myOrange-dark
                  transition-colors 
                  cursor-pointer
                "
              >
                Dashboard
              </Link>
              <Link
                href="/produtos"
                onClick={() => setSidebarOpen(false)}
                className="
                  block px-3 py-2 
                  rounded 
                  hover:bg-myOrange 
                  dark:hover:bg-myOrange-dark
                  transition-colors 
                  cursor-pointer
                "
              >
                Produtos
              </Link>
            </nav>

            <button
              onClick={handleLogout}
              className="
                mt-4 
                w-full
                rounded
                bg-myOrange 
                hover:bg-myOrange-dark 
                dark:hover:bg-myOrange-dark 
                transition-colors 
                cursor-pointer
                px-3 py-2
              "
            >
              Logout
            </button>

            {/* Switch de tema (Mobile) */}
            <div className="flex items-center justify-center my-4">
              <ThemeSwitch />
            </div>

            <footer className="mt-8 text-sm opacity-70">
              <p>
                © {new Date().getFullYear()} Desenvolvido por MegaPC. Todos os
                direitos reservados.
              </p>
              <p>Versão 1.0</p>
            </footer>
          </div>

          {/*
            Overlay:
            Quando a sidebar está aberta, exibimos um overlay preto semi-transparente
            para cobrir o resto do conteúdo. Ao clicar, fecha o menu.
          */}
          <div
            className={`
              flex-1 
              transition-opacity 
              duration-300 
              ${
                sidebarOpen
                  ? "opacity-100 bg-black bg-opacity-50"
                  : "opacity-0 pointer-events-none"
              }
            `}
            onClick={() => setSidebarOpen(false)}
          ></div>
        </div>

        {/*
          CONTEÚDO PRINCIPAL:
          Aqui é onde o resto da aplicação é renderizado (children).
        */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </Providers>
  );
}
