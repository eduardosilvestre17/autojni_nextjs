"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import ProductCard, { Product } from "@/components/ProductCard";

/**
 * Função fetcher para uso com SWR
 */
const fetcher = (url: string) => fetch(url).then((r) => r.json());

/**
 * ===========================
 * Componente PriceRangeSlider
 * ===========================
 * - Calcula e salva a largura do slider (em px) ao montar,
 * - Faz o clamp do movimento em px para que a bolinha não saia,
 * - Converte valor -> px e px -> valor.
 */
interface PriceRangeSliderProps {
  minPrice: number;
  maxPrice: number;
  onChange: (newMin: number, newMax: number) => void;
  minLimit: number; // Ex: 0
  maxLimit: number; // Ex: 1000
}

function PriceRangeSlider({
  minPrice,
  maxPrice,
  onChange,
  minLimit,
  maxLimit,
}: PriceRangeSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  // Largura real do slider (px) - medida ao montar
  const [sliderWidth, setSliderWidth] = useState(0);

  // Diâmetro da bolinha (w-4/h-4 => 16px)
  const thumbDiameter = 16;

  // Qual bolinha está sendo arrastada?
  const [draggingThumb, setDraggingThumb] = useState<"min" | "max" | null>(
    null
  );

  // Ao montar, mede a largura do slider e guarda em estado
  useEffect(() => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      setSliderWidth(rect.width);
    }
  }, []);

  // Converte valor (0..1000) -> posição em px no slider
  const valueToPx = useCallback(
    (value: number) => {
      if (sliderWidth <= 0) return 0;

      // Fração de 0..1
      const fraction = (value - minLimit) / (maxLimit - minLimit);
      // Posição em px (lado esquerdo da bolinha)
      // Ela pode ir de 0 até (sliderWidth - thumbDiameter)
      return fraction * (sliderWidth - thumbDiameter);
    },
    [sliderWidth, minLimit, maxLimit, thumbDiameter]
  );

  // Converte posição em px -> valor (0..1000)
  const pxToValue = useCallback(
    (px: number) => {
      if (sliderWidth <= 0) return minLimit;

      // Fração de 0..1 com base na posição
      const fraction = px / (sliderWidth - thumbDiameter);
      // Mapeia para o range minLimit..maxLimit
      return Math.round(minLimit + fraction * (maxLimit - minLimit));
    },
    [sliderWidth, minLimit, maxLimit, thumbDiameter]
  );

  // Ao arrastar, pega o x do mouse/touch e converte p/ valor
  const handleMove = useCallback(
    (clientX: number) => {
      if (!draggingThumb) return;
      if (!sliderRef.current) return;

      // Descobre o X relativo ao início do slider
      const rect = sliderRef.current.getBoundingClientRect();
      const x = clientX - rect.left;

      // Clampa esse x para [0 .. sliderWidth - thumbDiameter],
      // para que a bolinha não saia pelos limites
      const clampedX = Math.max(0, Math.min(x, sliderWidth - thumbDiameter));

      // Converte px -> valor
      const newValue = pxToValue(clampedX);

      if (draggingThumb === "min") {
        // Nunca deixa o min passar do max
        onChange(Math.min(newValue, maxPrice), maxPrice);
      } else {
        // Nunca deixa o max ir abaixo do min
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

  // Início do arrasto
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

  // Fim do arrasto
  const handleEndDrag = useCallback(() => {
    setDraggingThumb(null);
  }, []);

  // Listeners globais p/ mouse/touch (movimento + soltar)
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

  // =================================
  // Renderização das bolinhas e da faixa
  // =================================
  // Posições em px (0..sliderWidth - thumbDiameter)
  const minPx = valueToPx(minPrice);
  const maxPx = valueToPx(maxPrice);

  // Para a faixa colorida (entre min e max):
  const leftTrack = Math.min(minPx, maxPx);
  const widthTrack = Math.abs(maxPx - minPx);

  return (
    // Removido padding lateral: queremos que a bolinha vá até a borda do container
    <div ref={sliderRef} className="relative w-full h-6">
      {/* Trilha de fundo (100% da largura) */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-gray-300 rounded pointer-events-none" />

      {/* Faixa colorida entre minPx e maxPx */}
      <div
        className="absolute top-1/2 -translate-y-1/2 h-2 bg-blue-500 rounded pointer-events-none"
        style={{
          left: `${leftTrack}px`,
          width: `${widthTrack}px`,
        }}
      />

      {/* Thumb do min */}
      <div
        className="absolute w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md cursor-pointer"
        style={{
          // Aqui o left é o lado esquerdo da bolinha, sem translateX(-50%)
          left: `${minPx}px`,
          top: "50%",
          transform: "translateY(-50%)",
        }}
        onMouseDown={(e) => handleStartDrag("min", e)}
        onTouchStart={(e) => handleStartDrag("min", e)}
      />

      {/* Thumb do max */}
      <div
        className="absolute w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md cursor-pointer"
        style={{
          left: `${maxPx}px`,
          top: "50%",
          transform: "translateY(-50%)",
        }}
        onMouseDown={(e) => handleStartDrag("max", e)}
        onTouchStart={(e) => handleStartDrag("max", e)}
      />
    </div>
  );
}

/**
 * =====================
 * Página principal (Loja)
 * =====================
 */
export default function LojaPage() {
  // Estados e SWR
  const [showFilters, setShowFilters] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [showOrderDropdown, setShowOrderDropdown] = useState(false);

  // Collapses dos filtros
  const [dispOpen, setDispOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [marcaOpen, setMarcaOpen] = useState(true);

  // Estados para a faixa de preço (inicialmente 0..1000)
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  // Ordenação
  const [orderBy, setOrderBy] = useState("");

  // Lógica de busca e SWR
  const sp = useSearchParams();
  const searchTerm = sp?.get("search") ?? "";

  const endpoint = searchTerm.trim()
    ? `/api/products?search=${encodeURIComponent(searchTerm)}`
    : "/api/products";

  const { data, error, isLoading } = useSWR(endpoint, fetcher, {
    refreshInterval: 5000,
  });

  const toggleFilters = () => setShowFilters((prev) => !prev);

  // Lidando com erros de SWR
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

  // Agora data é um array
  const arrayData = data;
  const totalResults = arrayData.length;

  // Função para ordenar via mobile
  const handleOrderClick = (value: string) => {
    setOrderBy(value);
    setShowOrderDropdown(false);
  };

  /**
   * Filtros (aside)
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

      {/* Faixa de Preço */}
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
            }}
            minLimit={0}
            maxLimit={1000}
          />
        </div>
      </div>

      {/* Marca */}
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

      {/* Menu lateral de filtros (Mobile) */}
      {mobileFilterOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMobileFilterOpen(false)}
          />
          <aside
            className={`fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-800 z-50 transform transition-transform ${
              mobileFilterOpen ? "translate-x-0" : "-translate-x-full"
            } p-4 overflow-auto`}
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

      {/* Layout principal: Filtros (se visíveis) + Grid de produtos */}
      <div
        className={`grid gap-6 transition-[grid-template-columns] duration-300 ease-in-out ${
          showFilters ? "grid-cols-1 md:grid-cols-[260px_1fr]" : "grid-cols-1"
        }`}
      >
        {/* Filtro lateral (Desktop) */}
        {showFilters && (
          <aside className="bg-white dark:bg-gray-800 p-4 rounded shadow self-start hidden md:block">
            {FiltersAsideContent}
          </aside>
        )}

        {/* Lista de produtos */}
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
