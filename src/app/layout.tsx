// src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

// Defina metadata se quiser
export const metadata = {
  title: "Meu Site",
  description: "Descrição do site",
};

// Este layout é um Server Component (não deve ter "use client")
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Font Awesome (exemplo) */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css"
          integrity="sha512-..."
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        {/* 
          Envolvemos toda a aplicação com ThemeProvider do next-themes,
          que aplica automaticamente "dark" no <html> de acordo com localStorage ou prefers-color-scheme.
          'attribute="class"' => usa .dark no <html>.
          'defaultTheme="system"' => se não houver localStorage, segue preferências do SO.
        */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
