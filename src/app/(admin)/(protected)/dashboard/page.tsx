"use client";
// (somente se você precisar de Hooks, ex: useSession)

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Carregando...</p>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Bem-vindo ao Dashboard!</h1>
      <p>Você está logado como {session?.user?.email ?? "desconhecido"}.</p>
    </div>
  );
}
