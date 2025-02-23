// src/app/(admin)/layout.tsx
import { ReactNode } from "react";

export const metadata = {
  title: "Área de Admin",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Sem Header e Footer */}
        {children}
      </body>
    </html>
  );
}
