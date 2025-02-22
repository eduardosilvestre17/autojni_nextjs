// src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import localFont from "next/font/local";
import Header from "./Header";

// Carrega a fonte local "Varela Round"
const varelaRound = localFont({
  src: "./fonts/VarelaRound.ttf",
  variable: "--font-varela-round",
});

export const metadata = {
  title: "AutoJNI",
  description: "Projeto com modo claro/escuro",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // 1) Já incluo "dark" para iniciar em modo escuro no SSR
    <html lang="pt-BR" className={`${varelaRound.variable} dark`}>
      <head>
        {/* Import do Font Awesome (CDN) */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css"
          integrity="sha512-..."
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <Header />
        <main className="container mx-auto px-4 py-8">{children}</main>
        <footer className="border-t border-gray-200 dark:border-gray-600 py-4 mt-8 text-center text-sm">
          © {new Date().getFullYear()} AutoJNI - Todos os direitos reservados.
        </footer>
      </body>
    </html>
  );
}
