"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/(admin)/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Carregando...</p>;
  }

  const email = session?.user?.email ?? "desconhecido";

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Bem-vindo ao Dashboard!</h1>
      <p>Você está logado como {email}</p>
    </div>
  );
}
