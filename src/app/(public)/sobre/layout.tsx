// src/app/(public)/sobre/layout.tsx
import { ReactNode } from "react";

export const metadata = {
  title: "Sobre Nós - Auto JNI",
  description:
    "Conheça mais sobre a Auto JNI: história, oficina, serviços e opiniões de clientes.",
};

export default function SobreLayout({ children }: { children: ReactNode }) {
  return <main className="container mx-auto px-4 py-8">{children}</main>;
}
