import "../globals.css";
import { ReactNode } from "react";
import localFont from "next/font/local";
import Header from "../Header";

// Ajuste aqui o path, subindo 1 nível para acessar "fonts"
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
    <div className={varelaRound.variable}>
      <Header />
      <main className="container mx-auto px-4 py-8">{children}</main>
      <footer className="border-t border-gray-200 dark:border-gray-600 py-4 mt-8 text-center text-sm">
        © {new Date().getFullYear()} AutoJNI - Todos os direitos reservados.
      </footer>
    </div>
  );
}
