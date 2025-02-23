import "../globals.css";
import { ReactNode } from "react";
import localFont from "next/font/local";
import Header from "../Header";

const varelaRound = localFont({
  src: "../fonts/VarelaRound.ttf",
  variable: "--font-varela-round",
});

export const metadata = {
  title: "AutoJNI",
  description: "website AutoJNI",
};

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${varelaRound.variable} dark`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css"
          integrity="sha512-..."
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        {/* Header e Footer aparecem apenas aqui */}
        <Header />
        <main className="container mx-auto px-4 py-8">{children}</main>
        <footer className="border-t border-gray-200 dark:border-gray-600 py-4 mt-8 text-center text-sm">
          © {new Date().getFullYear()} AutoJNI - Todos os direitos reservados.
        </footer>
      </body>
    </html>
  );
}
