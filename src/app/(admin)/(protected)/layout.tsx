"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Providers } from "@/app/providers"; // Ajuste se necessário

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 transition-colors">
        <aside className="w-64 bg-gray-800 text-gray-200 p-6 flex flex-col shadow-lg">
          <h2 className="text-2xl font-bold tracking-wide mb-8">Admin Panel</h2>
          <nav className="flex-1 space-y-2">
            <Link
              href="/dashboard"
              className="block px-3 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/users"
              className="block px-3 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Users
            </Link>
            <Link
              href="/posts"
              className="block px-3 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Posts
            </Link>
          </nav>
          <footer className="mt-8 text-sm opacity-70">
            <p>
              © {new Date().getFullYear()} Desenvolvido por MegaPC. Todos os
              direitos reservados.
            </p>
            <p>Versão 1.0</p>
          </footer>
        </aside>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </Providers>
  );
}
