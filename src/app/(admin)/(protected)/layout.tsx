"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { Providers } from "@/app/providers";
import { signOut } from "next-auth/react";
import { ThemeSwitch } from "@/components/ThemeSwitch";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <Providers>
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
            <Link
              href="/clientes"
              className="
                block px-3 py-2 
                rounded 
                hover:bg-myOrange 
                dark:hover:bg-myOrange-dark
                transition-colors 
                cursor-pointer
              "
            >
              Clientes
            </Link>
            <Link
              href="/listagem"
              className="
                block px-3 py-2 
                rounded 
                hover:bg-myOrange 
                dark:hover:bg-myOrange-dark
                transition-colors 
                cursor-pointer
              "
            >
              Listagem Produtos
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
          <svg className="w-6 h-6" fill="none" stroke="currentColor">
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
            fixed inset-0 
            z-50 
            transition-all 
            duration-300
            ${
              sidebarOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }
          `}
        >
          {/* Overlay atrás da Sidebar */}
          <div
            onClick={() => setSidebarOpen(false)}
            className={`
              absolute
              inset-0 
              bg-black 
              bg-opacity-50
              transition-opacity 
              duration-300
              ${sidebarOpen ? "opacity-100" : "opacity-0"}
            `}
          />

          {/* Container da Sidebar em si */}
          <div
            className={`
              absolute
              left-0
              top-0
              bottom-0
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
                <svg className="w-6 h-6" fill="none" stroke="currentColor">
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
              <Link
                href="/clientes"
                className="
                block px-3 py-2 
                rounded 
                hover:bg-myOrange 
                dark:hover:bg-myOrange-dark
                transition-colors 
                cursor-pointer
              "
              >
                Clientes
              </Link>
              <Link
                href="/listagem"
                className="
                block px-3 py-2 
                rounded 
                hover:bg-myOrange 
                dark:hover:bg-myOrange-dark
                transition-colors 
                cursor-pointer
              "
              >
                Listagem Produtos
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
        </div>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </Providers>
  );
}
