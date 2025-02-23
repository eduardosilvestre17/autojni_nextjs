// src/app/layout.tsx (Server Component)
import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Meu Site",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
