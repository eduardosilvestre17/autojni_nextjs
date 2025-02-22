import { ReactNode } from "react";

export const metadata = {
  title: "Login - Backoffice",
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      {children}
    </main>
  );
}
