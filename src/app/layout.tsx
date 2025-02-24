// src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Meu Site",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // Script inline para definir a classe 'dark' no HTML antes de o React montar
  const setInitialTheme = `
    (function() {
      try {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {}
    })();
  `;

  return (
    <html lang="pt-BR">
      <head>
        {/* Link Font Awesome (versão 6.3.0, por exemplo) */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css"
          integrity="sha512-..."
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        {/* Script que ajusta o tema imediatamente antes do React */}
        <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
