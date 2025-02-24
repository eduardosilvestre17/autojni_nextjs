// LoginPage.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PrimaryButton } from "@/components/Buttons";
import { ThemeSwitch } from "@/components/ThemeSwitch";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsSubmitting(false);
    if (result?.error) {
      setErrorMsg(result.error);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded shadow-md p-6">
      {/* Toggle de tema */}
      <div className="flex items-center justify-center mb-4">
        <ThemeSwitch />
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        Área de Admin
      </h2>

      {errorMsg && (
        <p className="text-red-500 mb-4 border border-red-300 rounded p-2">
          {errorMsg}
        </p>
      )}

      <form onSubmit={handleLogin} className="space-y-8">
        {/* Campo E-mail */}
        <div className="relative z-0 w-full group">
          <input
            type="email"
            id="email"
            autoComplete="email"
            className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 dark:text-white dark:border-gray-600 focus:border-primary dark:focus:border-primary focus:outline-none focus:ring-0"
            placeholder=" "
            required
            disabled={isSubmitting}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label
            htmlFor="email"
            className="cursor-text absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-7 scale-75 top-4 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7"
          >
            E-mail
          </label>
        </div>

        {/* Campo Senha */}
        <div className="relative z-0 w-full group">
          <input
            type="password"
            id="password"
            autoComplete="current-password"
            className="peer block w-full border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 dark:text-white dark:border-gray-600 focus:border-primary dark:focus:border-primary focus:outline-none focus:ring-0"
            placeholder=" "
            required
            disabled={isSubmitting}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label
            htmlFor="password"
            className="cursor-text absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-7 scale-75 top-2 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7"
          >
            Senha
          </label>
        </div>

        {/* Botão Login */}
        <PrimaryButton
          type="submit"
          disabled={isSubmitting}
          className="w-full disabled:opacity-50"
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </PrimaryButton>
      </form>

      <div className="mt-4 text-sm text-center">
        <Link
          href="/(admin)/forgot-password"
          className="text-primary hover:text-primary-dark"
        >
          Esqueceu a senha?
        </Link>
      </div>
    </div>
  );
}
