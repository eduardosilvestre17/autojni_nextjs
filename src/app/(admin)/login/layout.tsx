import "../../globals.css";
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
    <html lang="pt-BR" className={`${varelaRound.variable} dark`}>
      <body className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors">
        {children}
      </body>
    </html>
  );
}
