// src/app/(admin)/login/layout.tsx
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
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"
          integrity="sha512-VVN8tGDM8cY5YX7iMv5AlajqMl7A6NUKvuHiBxzjKx/oA5lwAju+uNYl3uuOXg7GpH3ZVk7PaqMtnGt7/eKpRQ=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="min-h-screen flex items-center justify-center">
        {children}
      </body>
    </html>
  );
}
