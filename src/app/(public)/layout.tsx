// app/layout.tsx
import "../globals.css";
import { ReactNode } from "react";
import localFont from "next/font/local";
import Header from "../Header";
import Footer from "../Footer";

const varelaRound = localFont({
  src: "../fonts/VarelaRound.ttf",
  variable: "--font-varela-round",
});

export const metadata = {
  title: "Auto JNI",
  description: "website AutoJNI",
};

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    // Classe min-h-screen ocupa altura total da janela;
    // flex flex-col permite empilhar Header, Main e Footer verticalmente
    <div className={`${varelaRound.variable} min-h-screen flex flex-col`}>
      <Header />
      {/* flex-1 faz o main expandir e empurrar o Footer para o fim da tela */}
      <main className="container mx-auto px-4 py-8 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
