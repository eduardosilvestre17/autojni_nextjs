"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import ProductCard, {
  type Product as ProductType,
} from "@/components/ProductCard";
import { SelectInput } from "@/components/SelectInput";
import Pagination from "@/components/Pagination";

/**
 * ===========================
 * Função fetcher para uso com SWR
 * ===========================
 */
const fetcher = (url: string) => fetch(url).then((r) => r.json());

/**
 * ===========================
 * Componente PriceRangeSlider
 * ===========================
 */
interface PriceRangeSliderProps {
  minPrice: number;
  maxPrice: number;
  onChange: (newMin: number, newMax: number) => void;
  minLimit: number;
  maxLimit: number;
}

function PriceRangeSlider({
  minPrice,
  maxPrice,
  onChange,
  minLimit,
  maxLimit,
}: PriceRangeSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderWidth, setSliderWidth] = useState(0);
  const thumbDiameter = 16;
  const [draggingThumb, setDraggingThumb] = useState<"min" | "max" | null>(
    null
  );

  useEffect(() => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      setSliderWidth(rect.width);
    }
  }, []);

  const valueToPx = useCallback(
    (value: number) => {
      if (sliderWidth <= 0) return 0;
      const fraction = (value - minLimit) / (maxLimit - minLimit);
      return fraction * (sliderWidth - thumbDiameter);
    },
    [sliderWidth, minLimit, maxLimit, thumbDiameter]
  );

  const pxToValue = useCallback(
    (px: number) => {
      if (sliderWidth <= 0) return minLimit;
      const fraction = px / (sliderWidth - thumbDiameter);
      return Math.round(minLimit + fraction * (maxLimit - minLimit));
    },
    [sliderWidth, minLimit, maxLimit, thumbDiameter]
  );

  const handleMove = useCallback(
    (clientX: number) => {
      if (!draggingThumb || !sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const clampedX = Math.max(0, Math.min(x, sliderWidth - thumbDiameter));
      const newValue = pxToValue(clampedX);

      if (draggingThumb === "min") {
        onChange(Math.min(newValue, maxPrice), maxPrice);
      } else {
        onChange(minPrice, Math.max(newValue, minPrice));
      }
    },
    [
      draggingThumb,
      sliderWidth,
      thumbDiameter,
      minPrice,
      maxPrice,
      onChange,
      pxToValue,
    ]
  );

  const handleStartDrag = (
    thumb: "min" | "max",
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingThumb(thumb);

    if ("clientX" in e) {
      handleMove(e.clientX);
    } else {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleEndDrag = useCallback(() => {
    setDraggingThumb(null);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (draggingThumb) handleMove(e.clientX);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (draggingThumb) handleMove(e.touches[0].clientX);
    };
    const onMouseUp = () => handleEndDrag();
    const onTouchEnd = () => handleEndDrag();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [draggingThumb, handleMove, handleEndDrag]);

  const minPx = valueToPx(minPrice);
  const maxPx = valueToPx(maxPrice);

  const leftEdge = Math.min(minPx, maxPx);
  const rightEdge = Math.max(minPx, maxPx) + thumbDiameter;
  const trackLeft = Math.max(0, leftEdge);
  const trackRight = Math.min(sliderWidth, rightEdge);
  const trackWidth = Math.max(0, trackRight - trackLeft);

  return (
    <div ref={sliderRef} className="relative w-full h-6">
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-gray-300 rounded pointer-events-none" />
      <div
        className="absolute top-1/2 -translate-y-1/2 h-2 bg-blue-500 rounded pointer-events-none"
        style={{ left: `${trackLeft}px`, width: `${trackWidth}px` }}
      />
      {/* Thumb min */}
      <div
        className="absolute"
        style={{
          left: `${minPx}px`,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <div className="relative w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md pointer-events-none" />
        <div
          className="absolute inset-0 -m-2 md:-m-0 cursor-pointer"
          onMouseDown={(e) => handleStartDrag("min", e)}
          onTouchStart={(e) => handleStartDrag("min", e)}
        />
      </div>
      {/* Thumb max */}
      <div
        className="absolute"
        style={{
          left: `${maxPx}px`,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <div className="relative w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md pointer-events-none" />
        <div
          className="absolute inset-0 -m-2 md:-m-0 cursor-pointer"
          onMouseDown={(e) => handleStartDrag("max", e)}
          onTouchStart={(e) => handleStartDrag("max", e)}
        />
      </div>
    </div>
  );
}

/**
 * =====================
 * Página principal (Loja)
 * =====================
 */
export default function LojaPage() {
  // Mostrar/esconder filtros
  const [showFilters, setShowFilters] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [showOrderDropdown, setShowOrderDropdown] = useState(false);

  // Collapses dos filtros
  const [dispOpen, setDispOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [marcaOpen, setMarcaOpen] = useState(true);

  // Faixa de preço
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  // Ordenação
  const [orderBy, setOrderBy] = useState(""); // "menor-preco", "maior-preco", "relevancia", etc.

  // Filtro de stock
  const [inStock, setInStock] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);

  // Paginação
  const limit = 20;
  const [page, setPage] = useState(1);
  const offset = (page - 1) * limit;

  // Busca
  const sp = useSearchParams();
  const searchTerm = sp?.get("search") ?? "";

  /**
   * Monta a query string para /api/articles
   * Exemplos:
   *   ?limit=20&offset=0&orderBy=menor-preco&minPrice=10&maxPrice=500&stock=inStock,outOfStock
   */
  const stockFilters: string[] = [];
  if (inStock) stockFilters.push("inStock");
  if (outOfStock) stockFilters.push("outOfStock");

  const endpointParams = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    minPrice: String(minPrice),
    maxPrice: String(maxPrice),
  });
  if (searchTerm.trim()) {
    endpointParams.set("search", searchTerm.trim());
  }
  if (orderBy) {
    endpointParams.set("orderBy", orderBy);
  }
  if (stockFilters.length > 0) {
    endpointParams.set("stock", stockFilters.join(",")); // ex.: "inStock,outOfStock"
  }

  const endpoint = `/api/articles?${endpointParams.toString()}`;

  // SWR para buscar dados
  const { data, error, isLoading } = useSWR(endpoint, fetcher, {
    refreshInterval: 5000,
  });

  // Lida com clique no menu "Ordenar"
  const handleOrderClick = (value: string) => {
    setOrderBy(value);
    setShowOrderDropdown(false);
    setPage(1); // resetar para primeira página
  };

  const toggleFilters = () => setShowFilters((prev) => !prev);

  // Marcamos inStock/outOfStock
  function handleStockChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { checked, value } = e.target;
    if (value === "inStock") setInStock(checked);
    if (value === "outOfStock") setOutOfStock(checked);
    setPage(1); // volta para página 1
  }

  // Erros e loading
  if (error) {
  return (
    <section className="p-4 overflow-x-hidden">
        <h1 className="text-2xl font-bold mb-6 text-red-600">
          Erro ao carregar a loja
        </h1>
        <p>{String(error)}</p>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="p-4 overflow-x-hidden">
        <h1 className="text-2xl font-bold mb-6 text-foreground dark:text-dark-foreground">
          Loja
        </h1>
        <p>Carregando artigos...</p>
      </section>
    );
  }

  // Verifica a estrutura do retorno
  if (!data || !data.articles) {
    return (
      <section className="p-4 overflow-x-hidden">
        <h1 className="text-2xl font-bold mb-6 text-red-600">
          Dados inválidos
        </h1>
        <p>A resposta de /api/articles não contém 'articles'.</p>
      </section>
    );
  }

  const { articles, total } = data;
  if (!Array.isArray(articles)) {
    return (
      <section className="p-4 overflow-x-hidden">
        <h1 className="text-2xl font-bold mb-6 text-red-600">
          Dados inválidos
        </h1>
        <p>"articles" não é um array.</p>
      </section>
    );
  }

  // Lista final de produtos
  const arrayData = articles as ProductType[];
  const totalResults = arrayData.length;
  const totalPages = Math.ceil(total / limit);

  /**
   * Conteúdo do Menu Lateral (Filtros)
   */
  const FiltersAsideContent = (
    <>
      {/* Disponibilidade */}
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
          className={`transition-all duration-300 ${
            dispOpen
              ? "max-h-[500px] opacity-100 overflow-visible"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="flex flex-col space-y-2">
            {/* Em Stock */}
            <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                value="inStock"
                checked={inStock}
                onChange={handleStockChange}
              />
              Em Stock
            </label>
            {/* Sem Stock */}
            <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                value="outOfStock"
                checked={outOfStock}
                onChange={handleStockChange}
              />
              Sem Stock
            </label>
          </div>
        </div>
      </div>

      {/* Preço */}
      <div className="mb-6">
        <div
          className="flex items-center justify-between mb-2 cursor-pointer"
          onClick={() => setPriceOpen(!priceOpen)}
        >
          <h2 className="text-base font-semibold text-foreground dark:text-dark-foreground">
            Preço
          </h2>
          <span className="text-3xl text-gray-500 select-none hover:text-gray-700 transition-colors">
            {priceOpen ? "−" : "+"}
          </span>
        </div>
        <div
          className={`transition-all duration-300 ${
            priceOpen
              ? "max-h-[500px] opacity-100 overflow-visible"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2 mb-1 px-1">
            <span>Mínimo: {minPrice}€</span>
            <span>Máximo: {maxPrice}€</span>
          </div>
          <PriceRangeSlider
            minPrice={minPrice}
            maxPrice={maxPrice}
            onChange={(newMin, newMax) => {
              setMinPrice(newMin);
              setMaxPrice(newMax);
              setPage(1); // se mudar a faixa de preço, voltamos à página 1
            }}
            minLimit={0}
            maxLimit={1000}
          />
        </div>
      </div>

      {/* Marca (Exemplo, mas não implementamos no back-end agora) */}
      <div className="mb-6">
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
          className={`transition-all duration-300 ${
            marcaOpen
              ? "max-h-[500px] opacity-100 overflow-visible"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <input
            type="text"
            placeholder="Pesquisar marca..."
            className="w-full mb-2 p-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-foreground dark:text-dark-foreground"
          />
          <div className="flex flex-col space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Marca X
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Marca Y
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Marca Z
            </label>
          </div>
        </div>
      </div>
    </>
  );

  // Paginação: ao mudar de página, chama setPage
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <section className="p-4 overflow-x-hidden">
      {/* Filtros e Ordenação (Mobile) */}
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
          {showOrderDropdown && (
            <>
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
        <p className="text-gray-600 dark:text-gray-400">
          {totalResults} resultado{totalResults !== 1 && "s"}.
        </p>
      </div>

      {mobileFilterOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMobileFilterOpen(false)}
          />
          <aside
            className={`fixed top-0 left-0 w-full h-full bg-white dark:bg-gray-800 z-50 transform transition-transform ${
              mobileFilterOpen ? "translate-x-0" : "-translate-x-full"
            } p-4 overflow-auto overscroll-none`}
          >
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

      {/* Filtros e Ordenação (Desktop) */}
      <div className="hidden md:flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleFilters}
            className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800 text-foreground dark:text-dark-foreground hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {showFilters ? "Esconder Filtros" : "Mostrar Filtros"}
          </button>

          <p className="text-gray-600 dark:text-gray-400 whitespace-nowrap ml-4">
            {totalResults} resultado{totalResults !== 1 && "s"}.
          </p>
        </div>
        {/* Ordenação (Desktop) */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
            Ordenar por:
          </span>
          <div className="w-52">
            <SelectInput
              options={[
                { label: "Relevância", value: "relevancia" },
                { label: "Menor Preço", value: "menor-preco" },
                { label: "Maior Preço", value: "maior-preco" },
                { label: "Mais Recentes", value: "mais-recentes" },
              ]}
              value={orderBy}
              onChange={(val) => {
                setOrderBy(val);
                setPage(1); // Reseta para página 1 ao mudar a ordenação
              }}
              placeholder="Selecione..."
            />
          </div>
        </div>
      </div>

      {/* Layout principal */}
      <div
        className={`grid gap-6 transition-[grid-template-columns] duration-300 ease-in-out ${
          showFilters ? "grid-cols-1 md:grid-cols-[260px_1fr]" : "grid-cols-1"
        }`}
      >
        {/* Menu lateral (Desktop) */}
        {showFilters && (
          <aside className="bg-white dark:bg-gray-800 p-4 rounded shadow self-start hidden md:block">
            {FiltersAsideContent}
          </aside>
        )}

        {/* Lista de Produtos / Artigos */}
        <main>
          <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {arrayData.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Paginação */}
          <div className="mt-6">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              maxDelta={2}
            />
          </div>
        </main>
      </div>
    </section>
  );
}
