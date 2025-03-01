"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

// Importe o seu ProductCard e o tipo Product (ajuste o caminho conforme seu projeto)
import ProductCard, { Product } from "@/components/ProductCard";
// Importe o SelectInput customizado (ajuste o caminho conforme seu projeto)
import { SelectInput } from "@/components/SelectInput";

// Função simples de fetch
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function LojaPage() {
  // Exibir/ocultar todo o aside (filtros)
  const [showFilters, setShowFilters] = useState(true);

  // Estados de cada secção de filtro (abrir/fechar)
  const [dispOpen, setDispOpen] = useState(true);
  const [precoOpen, setPrecoOpen] = useState(true);
  const [marcaOpen, setMarcaOpen] = useState(true);

  // Estados do preço mínimo e máximo (para as duas “bolas” do range)
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3860);

  // Controle do dropdown de ordenação
  const [orderBy, setOrderBy] = useState("");

  // Pegar parâmetro "search" da URL (Next.js)
  const sp = useSearchParams();
  const searchTerm = sp?.get("search") ?? "";

  // Montar o endpoint de acordo com a busca
  const endpoint = searchTerm.trim()
    ? `/api/products?search=${encodeURIComponent(searchTerm)}`
    : "/api/products";

  // Fetch usando SWR
  const { data, error, isLoading } = useSWR(endpoint, fetcher, {
    refreshInterval: 5000, // opcional
  });

  // Função para exibir/ocultar o aside completo
  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  // Tratamento de erro
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

  // Tratamento de loading
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

  // Se a API não retornar um array, faça o tratamento necessário
  const arrayData = Array.isArray(data) ? data : [];
  if (!Array.isArray(data)) {
    return (
      <section className="p-4">
        <h1 className="text-2xl font-bold mb-6 text-red-600">
          Dados inválidos
        </h1>
        <p>
          A resposta da API não é um array. Verifique o retorno do endpoint.
        </p>
      </section>
    );
  }

  // Exemplo simples de total de resultados
  const totalResults = arrayData.length;

  // Handlers para sincronizar min e max (evitando que fiquem invertidos)
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    // Se o valor for maior que o max, ajusta para max-1
    if (value >= maxPrice) {
      setMinPrice(maxPrice - 1);
    } else {
      setMinPrice(value);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    // Se o valor for menor que o min, ajusta para min+1
    if (value <= minPrice) {
      setMaxPrice(minPrice + 1);
    } else {
      setMaxPrice(value);
    }
  };

  return (
    <section className="p-4">
      {/* Barra superior: botão de esconder/mostrar + contagem + ordenação */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
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
          <p className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
            {totalResults} resultado{totalResults !== 1 && "s"}.
          </p>
        </div>

        {/* Ordenar por (SelectInput custom) */}
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

      {/* Layout principal: ASIDE + GRID */}
      <div
        className={`grid gap-6 transition-[grid-template-columns] duration-300 ease-in-out ${
          showFilters ? "grid-cols-1 md:grid-cols-[260px_1fr]" : "grid-cols-1"
        }`}
      >
        {/* ASIDE / FILTROS */}
        {showFilters && (
          <aside className="bg-white dark:bg-gray-800 p-4 rounded shadow self-start">
            {/* Filtro: Disponibilidade */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-semibold text-foreground dark:text-dark-foreground">
                  Disponibilidade
                </h2>
                <span
                  className="text-3xl text-gray-500 cursor-pointer select-none hover:text-gray-700 transition-colors"
                  onClick={() => setDispOpen(!dispOpen)}
                >
                  {dispOpen ? "−" : "+"}
                </span>
              </div>
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  dispOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
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
                    <input type="checkbox" className="mr-2" /> Em Liquidação
                    (262)
                  </label>
                  <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <input type="checkbox" className="mr-2" /> Pré-Reserva (807)
                  </label>
                </div>
              </div>
            </div>

            {/* Filtro: Preço (dois sliders) */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-semibold text-foreground dark:text-dark-foreground">
                  Preço
                </h2>
                <span
                  className="text-3xl text-gray-500 cursor-pointer select-none hover:text-gray-700 transition-colors"
                  onClick={() => setPrecoOpen(!precoOpen)}
                >
                  {precoOpen ? "−" : "+"}
                </span>
              </div>
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  precoOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {/* Range para preço mínimo */}
                <div className="flex flex-col mb-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    Preço Mínimo: {minPrice.toFixed(2)}€
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="3860"
                    value={minPrice}
                    onChange={handleMinChange}
                    className="w-full mt-1"
                  />
                </div>

                {/* Range para preço máximo */}
                <div className="flex flex-col mb-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    Preço Máximo: {maxPrice.toFixed(2)}€
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="3860"
                    value={maxPrice}
                    onChange={handleMaxChange}
                    className="w-full mt-1"
                  />
                </div>

                {/* Valores atuais exibidos lado a lado */}
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Min: {minPrice.toFixed(2)}</span>
                  <span>Máx: {maxPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Filtro: Marca */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-semibold text-foreground dark:text-dark-foreground">
                  Marca
                </h2>
                <span
                  className="text-3xl text-gray-500 cursor-pointer select-none hover:text-gray-700 transition-colors"
                  onClick={() => setMarcaOpen(!marcaOpen)}
                >
                  {marcaOpen ? "−" : "+"}
                </span>
              </div>
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  marcaOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
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
            </div>
          </aside>
        )}

        {/* GRID DE PRODUTOS */}
        <main>
          <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {arrayData.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </main>
      </div>
    </section>
  );
}
