// src/app/(admin)/(protected)/layout.tsx
import { ReactNode } from "react";
import Link from "next/link";

// Metadados para SEO (opcional)
export const metadata = {
  title: "Admin - Painel de Controlo",
  description: "Área protegida do backoffice",
};

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <section className="flex min-h-screen">
      {/* Sidebar (Navegação Lateral) */}
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          <Link
            href="/(admin)/(protected)/dashboard"
            className="block hover:bg-gray-700 px-2 py-1 rounded"
          >
            Dashboard
          </Link>
          <Link
            href="/(admin)/(protected)/users"
            className="block hover:bg-gray-700 px-2 py-1 rounded"
          >
            Users
          </Link>
          <Link
            href="/(admin)/(protected)/posts"
            className="block hover:bg-gray-700 px-2 py-1 rounded"
          >
            Posts
          </Link>
          {/* Acrescente mais rotas conforme necessidade */}
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 bg-gray-100 p-6">{children}</main>
    </section>
  );
}
