// src/app/(public)/loja/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";

interface Product {
  id: string;
  titulo: string;
  slug: string;
  precoPrincipal: any;
  imagens: string[];
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function LojaPage() {
  const sp = useSearchParams();
  const searchTerm = sp?.get("search") ?? "";
  const endpoint = searchTerm.trim()
    ? `/api/products?search=${encodeURIComponent(searchTerm)}`
    : "/api/products";
  const { data, error, isLoading } = useSWR<Product[]>(endpoint, fetcher, {
    refreshInterval: 5000,
  });
  if (error) {
    return (
      <section>
        <h1 className="text-2xl font-bold mb-6 text-red-600">
          Erro ao carregar a loja
        </h1>
        <p>{String(error)}</p>
      </section>
    );
  }
  if (isLoading || !data) {
    return (
      <section>
        <h1 className="text-2xl font-bold mb-6 text-foreground dark:text-dark-foreground">
          Loja
        </h1>
        <p>Carregando produtos...</p>
      </section>
    );
  }
  return (
    <section>
      <h1 className="text-2xl font-bold mb-6 text-foreground dark:text-dark-foreground">
        Loja
      </h1>
      {searchTerm && (
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Resultados para: <strong>{searchTerm}</strong>
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.map((product) => {
          const imageSrc = product.imagens?.[0] || "/images/placeholder.jpg";
          const price = Number(product.precoPrincipal);
          return (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded shadow p-4 flex flex-col"
            >
              <img
                src={imageSrc}
                alt={product.titulo}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h2 className="text-lg font-semibold text-foreground dark:text-dark-foreground mb-2">
                {product.titulo}
              </h2>
              <p className="text-primary dark:text-myOrange text-xl font-bold mb-4">
                {`€ ${price.toFixed(2)}`}
              </p>
              <button
                className="bg-primary dark:bg-myOrange text-white py-2 rounded 
                           hover:bg-primary-dark dark:hover:bg-myOrange-dark 
                           transition-colors"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
