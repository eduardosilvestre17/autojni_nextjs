"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

// Ajuste caminhos conforme seu projeto:
import ProductCard, { Product } from "@/components/ProductCard";
import { SelectInput } from "@/components/SelectInput";

// Função de fetch simples
const fetcher = (url: string) => fetch(url).then((r) => r.json());

// Valores mínimo e máximo para o slider de preço
const MIN = 0;
const MAX = 3860;

export default function LojaPage() {
  // Exibir/ocultar todo o bloco de filtros (aside)
  const [showFilters, setShowFilters] = useState(true);

  // Estados de cada seção de filtro (abrir/fechar)
  const [dispOpen, setDispOpen] = useState(true);
  const [precoOpen, setPrecoOpen] = useState(true);
  const [marcaOpen, setMarcaOpen] = useState(true);

  // Estados do preço (um “slider” com dois thumbs)
  const [minVal, setMinVal] = useState(MIN);
  const [maxVal, setMaxVal] = useState(MAX);

  // Estado para o dropdown de ordenação
  const [orderBy, setOrderBy] = useState("");

  // Lê "search" da URL (Next.js)
  const sp = useSearchParams();
  const searchTerm = sp?.get("search") ?? "";

  // Monta o endpoint de acordo com a busca
  const endpoint = searchTerm.trim()
    ? `/api/products?search=${encodeURIComponent(searchTerm)}`
    : "/api/products";

  // Fetch usando SWR
  const { data, error, isLoading } = useSWR(endpoint, fetcher, {
    refreshInterval: 5000, // opcional
  });

  // Função para exibir/ocultar todo o aside
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

  // Verifica se o retorno é um array de produtos
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

  // Manipular mudanças nos sliders (impede cruzamento invertido)
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value <= maxVal) setMinVal(value);
  };
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= minVal) setMaxVal(value);
  };

  // Cálculo de porcentagem para a barra “ativa” (entre as duas bolinhas)
  const minPercent = ((minVal - MIN) / (MAX - MIN)) * 100;
  const maxPercent = ((maxVal - MIN) / (MAX - MIN)) * 100;

  return (
    <section className="p-4">
      {/* Barra superior: botão + contagem + ordenação */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleFilters}
            className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800 text-foreground dark:text-dark-foreground hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {showFilters ? "Esconder Filtros" : "Mostrar Filtros"}
          </button>
          <p className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
            {totalResults} resultado{totalResults !== 1 && "s"}.
          </p>
        </div>
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

      {/* Layout principal: Filtros (aside) + Grid de produtos */}
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
              <div
                className="flex items-center justify-between mb-2 cursor-pointer"
                onClick={() => setDispOpen(!dispOpen)}
              >
                <h2 className="text-base font-semibold text-foreground dark:text-dark-foreground">
                  Disponibilidade
                </h2>
                <span className="text-3xl text-gray-500 select-none hover:text-gray-700 transition-colors">
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

            {/* Filtro: Preço (um slider com dois "thumbs") */}
            <div className="mb-6">
              <div
                className="flex items-center justify-between mb-2 cursor-pointer"
                onClick={() => setPrecoOpen(!precoOpen)}
              >
                <h2 className="text-base font-semibold text-foreground dark:text-dark-foreground">
                  Preço
                </h2>
                <span className="text-3xl text-gray-500 select-none hover:text-gray-700 transition-colors">
                  {precoOpen ? "−" : "+"}
                </span>
              </div>
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  precoOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {/* Slider “único” com dois ranges sobrepostos */}
                <div className="relative w-full h-8">
                  {/* Trilha “inativa” (cinza) */}
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 dark:bg-gray-700 rounded transform -translate-y-1/2" />
                  {/* Trilha “ativa” (entre as duas bolinhas) */}
                  <div
                    className="absolute top-1/2 h-1 bg-blue-500 dark:bg-blue-400 rounded transform -translate-y-1/2"
                    style={{
                      left: `${
                        minVal === MIN
                          ? 0
                          : ((minVal - MIN) / (MAX - MIN)) * 100
                      }%`,
                      right: `${
                        maxVal === MAX
                          ? 0
                          : 100 - ((maxVal - MIN) / (MAX - MIN)) * 100
                      }%`,
                    }}
                  />
                  {/* Input range para o minVal (thumb esquerdo) */}
                  <input
                    type="range"
                    min={MIN}
                    max={MAX}
                    value={minVal}
                    onChange={handleMinChange}
                    className="absolute w-full h-0 appearance-none pointer-events-none bg-transparent top-0"
                    style={{ zIndex: 3 }}
                  />
                  {/* Input range para o maxVal (thumb direito) */}
                  <input
                    type="range"
                    min={MIN}
                    max={MAX}
                    value={maxVal}
                    onChange={handleMaxChange}
                    className="absolute w-full h-0 appearance-none pointer-events-none bg-transparent top-0"
                    style={{ zIndex: 4 }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>
                    Min:{" "}
                    <strong className="text-foreground dark:text-dark-foreground">
                      {minVal.toFixed(2)}€
                    </strong>
                  </span>
                  <span>
                    Máx:{" "}
                    <strong className="text-foreground dark:text-dark-foreground">
                      {maxVal.toFixed(2)}€
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Filtro: Marca */}
            <div>
              <div
                className="flex items-center justify-between mb-2 cursor-pointer"
                onClick={() => setMarcaOpen(!marcaOpen)}
              >
                <h2 className="text-base font-semibold text-foreground dark:text-dark-foreground">
                  Marca
                </h2>
                <span className="text-3xl text-gray-500 select-none hover:text-gray-700 transition-colors">
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
                  className="w-full mb-2 p-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-foreground dark:text-dark-foreground"
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

      {/* Estilos para os "thumbs" do slider (você pode mover para um CSS global, se preferir) */}
      <style jsx>{`
        /* WebKit (Chrome, Safari etc.) */
        input[type="range"]::-webkit-slider-thumb {
          width: 1rem;
          height: 1rem;
          background: #3b82f6; /* Azul do Tailwind "blue-500" */
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          margin-top: 0.5rem; /* Aumentado para alinhar melhor com a barra */
          appearance: none;
          pointer-events: all;
        }
        input[type="range"]::-webkit-slider-runnable-track {
          height: 0; /* Esconde a trilha padrão */
        }

        /* Firefox */
        input[type="range"]::-moz-range-thumb {
          width: 1rem;
          height: 1rem;
          background: #3b82f6;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          pointer-events: all;
          margin-top: -0.5rem; /* Aumentado para alinhar melhor com a barra */
        }
        input[type="range"]::-moz-range-track {
          height: 0; /* Esconde a trilha padrão */
        }
      `}</style>
    </section>
  );
}
