// src/app/(public)/loja/layout.tsx
import { ReactNode } from "react";

export const metadata = {
  title: "Loja - AutoJNI",
};

export default function LojaLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
