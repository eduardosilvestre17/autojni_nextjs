// src/app/(admin)/login/layout.tsx
import { ReactNode } from "react";
import localFont from "next/font/local";

const varelaRound = localFont({
  src: "../../fonts/VarelaRound.ttf",
  variable: "--font-varela-round",
});

export const metadata = {
  title: "Login - Backoffice",
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`
        ${varelaRound.variable} min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors
      `}
    >
      {children}
    </div>
  );
}
