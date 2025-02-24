import { ReactNode } from "react";

export const metadata = {
  title: "Contacto - Auto JNI",
  description:
    "Entre em contacto com a equipa da AutoJNI. Veja informações de contacto, morada e horários de funcionamento.",
};

export default function ContactoLayout({ children }: { children: ReactNode }) {
  // Segue a mesma estrutura da pasta "sobre",
  // apenas retorna um <main> envolvendo o conteúdo
  return <main className="container mx-auto px-4 py-12">{children}</main>;
}
