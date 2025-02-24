// src/app/(admin)/layout.tsx
import { ReactNode } from "react";

export const metadata = {
  title: "Área de Admin",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      {/* Sem Header e Footer aqui. Apenas um contêiner */}
      {children}
    </div>
  );
}
