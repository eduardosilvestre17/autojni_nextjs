"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

// Ajuste caminhos conforme seu projeto:
import ProductCard, { Product } from "@/components/ProductCard";

// Função de fetch simples
const fetcher = (url: string) => fetch(url).then((r) => r.json());

// Valores mínimo e máximo para o slider de preço
const MIN = 0;
const MAX = 3860;

export default function LojaPage() {
  // Exibir/ocultar o aside no DESKTOP
  const [showFilters, setShowFilters] = useState(true);

  // Abrir/fechar o menu lateral no MOBILE (hambúrguer)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Abrir/fechar dropdown de ordenar no MOBILE
  const [showOrderDropdown, setShowOrderDropdown] = useState(false);

  // Estados de cada seção de filtro (abrir/fechar)
  const [dispOpen, setDispOpen] = useState(true);
  const [precoOpen, setPrecoOpen] = useState(true);
  const [marcaOpen, setMarcaOpen] = useState(true);

  // Estados do preço (um “slider” com dois thumbs)
  const [minVal, setMinVal] = useState(MIN);
  const [maxVal, setMaxVal] = useState(MAX);

  // Estado para guardar a opção de ordenação
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

  // Função para exibir/ocultar todo o aside (DESKTOP)
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

  // Ao escolher uma opção no dropdown mobile, salvamos no estado e fechamos o menu
  const handleOrderClick = (value: string) => {
    setOrderBy(value);
    setShowOrderDropdown(false);
  };

  // JSX do bloco de filtros (usado tanto em desktop quanto no mobile-drawer)
  const FiltersAsideContent = (
    <>
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
              <input type="checkbox" className="mr-2" /> Poucas Unidades (3184)
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
          {/* Container para as duas ranges */}
          <div className="relative w-full h-12">
            {/* Mínimo */}
            <input
              type="range"
              min={MIN}
              max={MAX}
              value={minVal}
              onChange={handleMinChange}
              className="myPriceSlider absolute w-full top-0 left-0 pointer-events-auto"
              style={{ zIndex: 3 }}
            />
            {/* Máximo */}
            <input
              type="range"
              min={MIN}
              max={MAX}
              value={maxVal}
              onChange={handleMaxChange}
              className="myPriceSlider absolute w-full top-0 left-0 pointer-events-auto"
              style={{ zIndex: 10 }} // Maior que o 1º input
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
    </>
  );

  return (
    <section className="p-4">
      {/* --------------------------- MODO MOBILE --------------------------- */}
      {/* Botões Filtrar e Ordenar - só aparece abaixo de md */}
      <div className="md:hidden mb-4 flex flex-col gap-2 w-full">
        <div className="flex gap-2 w-full">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex-1 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800 text-center text-foreground dark:text-dark-foreground hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Filtrar
          </button>
          <button
            onClick={() => setShowOrderDropdown((prev) => !prev)}
            className="flex-1 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800 text-center text-foreground dark:text-dark-foreground hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Ordenar
          </button>

          {/* Dropdown manual para ordenar */}
          {showOrderDropdown && (
            <>
              {/* Overlay para fechar ao clicar fora */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowOrderDropdown(false)}
              />
              <div className="absolute mt-12 right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-2 z-50 rounded shadow">
                <ul className="flex flex-col min-w-[140px]">
                  <li>
                    <button
                      className="w-full text-left px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => handleOrderClick("relevancia")}
                    >
                      Relevância
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full text-left px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => handleOrderClick("menor-preco")}
                    >
                      Menor Preço
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full text-left px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => handleOrderClick("maior-preco")}
                    >
                      Maior Preço
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full text-left px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => handleOrderClick("mais-recentes")}
                    >
                      Mais Recentes
                    </button>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Texto de total de resultados */}
        <p className="text-gray-600 dark:text-gray-400">
          {totalResults} resultado{totalResults !== 1 && "s"}.
        </p>
      </div>

      {/* Drawer lateral de filtros (mobile) */}
      {mobileFilterOpen && (
        <>
          {/* Overlay escuro ao fundo (clicar fecha) */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMobileFilterOpen(false)}
          />
          {/* Aside em modo "hambúrguer" */}
          <aside
            className={`fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-800 z-50 transform transition-transform ${
              mobileFilterOpen ? "translate-x-0" : "-translate-x-full"
            } p-4 overflow-auto`}
          >
            {/* Botão de fechar dentro do aside */}
            <button
              className="mb-4 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800 text-foreground dark:text-dark-foreground hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setMobileFilterOpen(false)}
            >
              Fechar
            </button>
            {FiltersAsideContent}
          </aside>
        </>
      )}

      {/* --------------------------- MODO DESKTOP --------------------------- */}
      {/* Barra superior - só aparece de md para cima */}
      <div className="hidden md:flex items-center justify-between gap-4 mb-4">
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
          {/* Exemplo simples de <select> nativo no desktop */}
          <select
            id="orderBy"
            className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 text-foreground dark:text-dark-foreground"
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
          >
            <option value="relevancia">Relevância</option>
            <option value="menor-preco">Menor Preço</option>
            <option value="maior-preco">Maior Preço</option>
            <option value="mais-recentes">Mais Recentes</option>
          </select>
        </div>
      </div>

      {/* Layout principal: Filtros (aside) + Grid de produtos em DESKTOP */}
      <div
        className={`grid gap-6 transition-[grid-template-columns] duration-300 ease-in-out ${
          showFilters ? "grid-cols-1 md:grid-cols-[260px_1fr]" : "grid-cols-1"
        }`}
      >
        {/* ASIDE / FILTROS no DESKTOP */}
        {showFilters && (
          <aside className="bg-white dark:bg-gray-800 p-4 rounded shadow self-start hidden md:block">
            {FiltersAsideContent}
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

      {/* Estilos do range */}
      <style jsx>{`
        .myPriceSlider {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          width: 100%;
          height: 40px; /* Aumente para ter mais espaço vertical */
          background: transparent;
          position: relative;
        }

        /* Trilha - Chrome */
        .myPriceSlider::-webkit-slider-runnable-track {
          height: 4px;
          background: #cbd5e1; /* cinzinha */
          border-radius: 9999px;
          position: absolute;
          top: 50%; /* centraliza vertical */
          transform: translateY(-50%);
          z-index: 1; /* track fica atrás */
        }

        .myPriceSlider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: #3b82f6;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          position: relative;
          top: 20px; /* empurra a bolinha para baixo */
          z-index: 2; /* a bolinha acima da track */
        }

        /* Trilha - Firefox */
        .myPriceSlider::-moz-range-track {
          height: 4px;
          background: #cbd5e1;
          border-radius: 9999px;
          z-index: 1;
        }

        .myPriceSlider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #3b82f6;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          position: relative;
          top: 20px; /* empurra a bolinha para baixo */
          z-index: 2;
        }
      `}</style>
    </section>
  );
}
