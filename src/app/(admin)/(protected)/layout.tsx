// layout.tsx
"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { Providers } from "@/app/providers";
import { signOut } from "next-auth/react";
import { ThemeSwitch } from "@/components/ThemeSwitch";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    signOut();
  };

  return (
    <Providers>
      <div className="min-h-screen flex bg-background dark:bg-dark-bg transition-colors relative">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:flex-col md:w-64 bg-primary dark:bg-primary-dark text-white p-6 shadow-lg">
          <h2 className="text-2xl font-bold tracking-wide mb-8">Admin Panel</h2>
          <nav className="flex-1 space-y-2">
            <Link
              href="/dashboard"
              className="block px-3 py-2 rounded hover:bg-[#012f63] transition-colors cursor-pointer"
            >
              Dashboard
            </Link>
            <Link
              href="/produtos"
              className="block px-3 py-2 rounded hover:bg-[#012f63] transition-colors cursor-pointer"
            >
              Produtos
            </Link>
            <Link
              href="/posts"
              className="block px-3 py-2 rounded hover:bg-[#012f63] transition-colors cursor-pointer"
            >
              Posts
            </Link>
          </nav>
          <button
            onClick={handleLogout}
            className="mt-4 px-3 py-2 w-fit rounded bg-myOrange hover:bg-myOrange-dark transition-colors cursor-pointer"
          >
            Logout
          </button>
          {/* Switch de tema */}
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

        {/* Mobile header: Entire header clickable */}
        <header
          className="md:hidden flex items-center bg-primary dark:bg-primary-dark text-white p-4 shadow-lg cursor-pointer"
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

        {/* Mobile sidebar overlay */}
        <div
          className={`md:hidden fixed inset-0 z-50 flex transition-all duration-300 ${
            sidebarOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className={`w-64 bg-primary dark:bg-primary-dark text-white p-6 shadow-lg transform transition-transform duration-300 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
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
                className="block px-3 py-2 rounded hover:bg-[#012f63] transition-colors cursor-pointer"
              >
                Dashboard
              </Link>
              <Link
                href="/produtos"
                onClick={() => setSidebarOpen(false)}
                className="block px-3 py-2 rounded hover:bg-[#012f63] transition-colors cursor-pointer"
              >
                Produtos
              </Link>
              <Link
                href="/posts"
                onClick={() => setSidebarOpen(false)}
                className="block px-3 py-2 rounded hover:bg-[#012f63] transition-colors cursor-pointer"
              >
                Posts
              </Link>
            </nav>
            <button
              onClick={handleLogout}
              className="mt-4 px-3 py-2 w-fit rounded bg-myOrange hover:bg-myOrange-dark transition-colors cursor-pointer"
            >
              Logout
            </button>
            {/* Switch de tema para mobile */}
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
          <div
            className={`flex-1 transition-opacity duration-300 ${
              sidebarOpen
                ? "opacity-100 bg-black bg-opacity-50"
                : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setSidebarOpen(false)}
          ></div>
        </div>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </Providers>
  );
}
