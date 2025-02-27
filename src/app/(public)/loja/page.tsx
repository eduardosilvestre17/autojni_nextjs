// src/app/(public)/loja/page.tsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

// Importa o seu Card e o tipo Product
import ProductCard, { Product } from "@/components/ProductCard";
// Importa o SelectInput customizado
import { SelectInput } from "@/components/SelectInput";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function LojaPage() {
  const [showFilters, setShowFilters] = useState(true);
  const [orderBy, setOrderBy] = useState(""); // Controle do dropdown custom

  const sp = useSearchParams();
  const searchTerm = sp?.get("search") ?? "";

  // Endpoint da sua API
  const endpoint = searchTerm.trim()
    ? `/api/products?search=${encodeURIComponent(searchTerm)}`
    : "/api/products";

  const { data, error, isLoading } = useSWR<Product[]>(endpoint, fetcher, {
    refreshInterval: 5000,
  });

  // Exibir/ocultar filtros
  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  if (error) {
    return (
      <section className="p-4">
        <h1 className="text-2xl font-bold mb-6 text-red-600">
          Erro ao carregar a loja
        </h1>
        <p>{String(error)}</p>
      </section>
    );
  }

  if (isLoading || !data) {
    return (
      <section className="p-4">
        <h1 className="text-2xl font-bold mb-6 text-foreground dark:text-dark-foreground">
          Loja
        </h1>
        <p>Carregando produtos...</p>
      </section>
    );
  }

  // Exemplo simples de total de resultados
  const totalResults = data.length;

  return (
    <section className="p-4">
      {/* Barra superior 
          Removido o 'flex-wrap' para evitar quebra desnecessária. */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {/* Botão Esconder/Mostrar Filtros */}
          <button
            onClick={toggleFilters}
            className="border border-gray-300 dark:border-gray-700 
                       rounded px-3 py-2 bg-white dark:bg-gray-800 
                       text-foreground dark:text-dark-foreground 
                       hover:bg-gray-100 dark:hover:bg-gray-700 
                       transition-colors"
          >
            {showFilters ? "Esconder Filtros" : "Mostrar Filtros"}
          </button>

          {/* Exemplo de texto indicando quantos resultados foram encontrados */}
          <p className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
            {totalResults} resultado{totalResults !== 1 && "s"}.
          </p>
        </div>

        {/* Ordenar por (SelectInput custom) 
            Adicionamos "flex items-center gap-2" para ficar na mesma linha. */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="orderBy"
            className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap"
          >
            Ordenar por:
          </label>
          <SelectInput
            options={[
              { label: "Relevância", value: "relevancia" },
              { label: "Menor Preço", value: "menor-preco" },
              { label: "Maior Preço", value: "maior-preco" },
              { label: "Mais Recentes", value: "mais-recentes" },
            ]}
            value={orderBy}
            onChange={(val) => setOrderBy(val)}
            placeholder="Selecionar"
          />
        </div>
      </div>

      {/* Layout principal: Filtros à esquerda (condicional) + grid de produtos */}
      <div
        className={`grid gap-6 transition-[grid-template-columns] duration-300 ease-in-out ${
          showFilters ? "grid-cols-1 md:grid-cols-[260px_1fr]" : "grid-cols-1"
        }`}
      >
        {/* ASIDE / FILTROS */}
        {showFilters && (
          <aside className="bg-white dark:bg-gray-800 p-4 rounded shadow self-start">
            {/* Exemplos de Filtros (estáticos) */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-semibold text-foreground dark:text-dark-foreground">
                  Disponibilidade
                </h2>
                <span className="text-sm text-gray-500 cursor-pointer">-</span>
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <input type="checkbox" className="mr-2" /> Em Stock (10616)
                </label>
                <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <input type="checkbox" className="mr-2" /> Poucas Unidades
                  (3184)
                </label>
                <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <input type="checkbox" className="mr-2" /> Esgotado (2217)
                </label>
                <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <input type="checkbox" className="mr-2" /> Em Liquidação (262)
                </label>
                <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <input type="checkbox" className="mr-2" /> Pré-Reserva (807)
                </label>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-semibold text-foreground dark:text-dark-foreground">
                  Preço
                </h2>
                <span className="text-sm text-gray-500 cursor-pointer">-</span>
              </div>
              <div className="flex items-center mb-2">
                <input
                  type="range"
                  min="0"
                  max="3860"
                  className="w-full"
                  // onChange={...}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Min: 0,12</span>
                <span>Máx: 3860,00</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-semibold text-foreground dark:text-dark-foreground">
                  Marca
                </h2>
                <span className="text-sm text-gray-500 cursor-pointer">-</span>
              </div>
              <input
                type="text"
                placeholder="Pesquisar marca..."
                className="w-full mb-2 p-2 border border-gray-300 dark:border-gray-700 
                           rounded text-sm bg-white dark:bg-gray-800 
                           text-foreground dark:text-dark-foreground"
              />
              <div className="flex flex-col space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" /> 1OPOS (23)
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" /> 2-POWER (3)
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" /> 3GO (24)
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" /> ADIDAS (12)
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" /> AEROCOOL (6)
                </label>
              </div>
              <a
                href="#"
                className="text-sm text-primary dark:text-myOrange mt-2 inline-block"
              >
                Mostrar Tudo (238)
              </a>
            </div>
          </aside>
        )}

        {/* GRID DE PRODUTOS */}
        <main>
          <div
            className={`
              grid gap-4
              xs:grid-cols-1
              sm:grid-cols-2
              md:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            `}
          >
            {data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </main>
      </div>
    </section>
  );
}
