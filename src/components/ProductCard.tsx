"use client";

import React, { useState } from "react";

export interface Product {
  id: string;
  titulo: string;
  slug: string;
  precoPrincipal: number;
  imagens: string[];
  isNew?: boolean;
  inStock?: boolean;
  // Adicione outras propriedades se precisar
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const {
    id,
    titulo,
    precoPrincipal,
    imagens,
    isNew = false,
    inStock = true,
  } = product;

  const imageSrc = imagens?.[0] || "/images/placeholder.jpg";
  const price = Number(precoPrincipal);

  // Estado para animar corações
  const [explodeHearts, setExplodeHearts] = useState(false);

  function handleWishlistClick() {
    setExplodeHearts(true);
    setTimeout(() => setExplodeHearts(false), 1000);
  }

  return (
    // CONTAINER EXTERNO: sombra + scale(1.05) no hover
    <div
      key={id}
      className={`
        relative group
        border border-gray-200 dark:border-gray-700
        rounded
        bg-white dark:bg-gray-800
        
        // 5% maior no hover
        transition-transform transform-gpu
        hover:scale-[1.01]

        // Sombra grande e simétrica no modo claro
        hover:shadow-2xl
        // Sombra circular laranja no modo escuro
        dark:hover:shadow-[0_0_20px_0_rgba(249,175,34,0.5)]
      `}
      style={{
        // overflow: visible => não corta a sombra
        overflow: "visible",
      }}
    >
      {/* CONTAINER INTERNO: se quiser evitar corações saindo, usar overflow-hidden */}
      <div className="p-4 overflow-hidden">
        {/* Se for novo, exibe "Novo" */}
        {isNew && (
          <span className="absolute top-2 left-2 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded z-10">
            Novo
          </span>
        )}

        {/* Imagem do produto */}
        <div className="mb-3">
          <img
            src={imageSrc}
            alt={titulo}
            className="w-full aspect-square object-cover rounded"
          />
        </div>

        {/* Título */}
        <h2 className="text-sm font-semibold text-foreground dark:text-dark-foreground mb-1 line-clamp-2">
          {titulo}
        </h2>

        {/* Preço */}
        <p className="text-lg font-bold text-primary dark:text-myOrange mb-1">
          € {price.toFixed(2)}
        </p>

        {/* Botões (Carrinho + Wishlist) */}
        <div className="flex items-center gap-4 mt-auto">
          {/* Carrinho */}
          <button
            className={`
              flex-1 flex items-center justify-center gap-1 
              text-sm font-medium py-2 rounded 
              bg-primary dark:bg-myOrange text-white 
              hover:bg-primary-dark dark:hover:bg-myOrange-dark
              transition-colors
            `}
          >
            {/* Ícone carrinho (Heroicon) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 2.25h1.5l1.5 12.75h13.5l1.5-8.25H6.75"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 20.25a1.5 1.5 0 100-3 
                   1.5 1.5 0 000 3zM17.25 20.25
                   a1.5 1.5 0 100-3 1.5 1.5
                   0 000 3z"
              />
            </svg>
            Carrinho
          </button>

          {/* Wishlist (coração) */}
          <div className="relative">
            <button
              onClick={handleWishlistClick}
              className={`
                p-2 rounded border border-gray-200 
                dark:border-gray-700 
                hover:bg-gray-100 dark:hover:bg-gray-700 
                transition-colors
              `}
              title="Adicionar à Wishlist"
            >
              {/* Ícone coração */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-red-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.318 6.318c2.834-2.834
                     7.384-2.835 10.219 0l.463.464.464-.464
                     c2.834-2.834 7.384-2.835
                     10.219 0 2.833 2.834 2.833 7.384
                     0 10.219l-9.219 9.219a1.5 1.5 
                     0 01-2.122 0l-9.219-9.219
                     c-2.833-2.835-2.833-7.385
                     0-10.219z"
                />
              </svg>
            </button>

            {/* Explosão de corações */}
            {explodeHearts && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="relative">
                  <span className="absolute w-4 h-4 text-red-500 animate-heart-burst">
                    ♥
                  </span>
                  <span className="absolute w-4 h-4 text-red-500 animate-heart-burst2">
                    ♥
                  </span>
                  <span className="absolute w-4 h-4 text-red-500 animate-heart-burst3">
                    ♥
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animações dos corações */}
      <style jsx>{`
        @keyframes heartBurst {
          0% {
            opacity: 0;
            transform: scale(0) translate(0, 0) rotate(0deg);
          }
          20% {
            opacity: 1;
            transform: scale(1.3) translate(0, 0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: scale(0.8) translate(-25px, -40px) rotate(360deg);
          }
        }

        @keyframes heartBurst2 {
          0% {
            opacity: 0;
            transform: scale(0) translate(0, 0) rotate(0deg);
          }
          20% {
            opacity: 1;
            transform: scale(1.2) translate(0, 0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: scale(1) translate(25px, -35px) rotate(-360deg);
          }
        }

        @keyframes heartBurst3 {
          0% {
            opacity: 0;
            transform: scale(0) translate(0, 0) rotate(0deg);
          }
          20% {
            opacity: 1;
            transform: scale(1.1) translate(0, 0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: scale(0.9) translate(0, -45px) rotate(360deg);
          }
        }

        .animate-heart-burst {
          animation: heartBurst 0.8s forwards ease-out;
        }
        .animate-heart-burst2 {
          animation: heartBurst2 0.8s forwards ease-out;
        }
        .animate-heart-burst3 {
          animation: heartBurst3 0.8s forwards ease-out;
        }
      `}</style>
    </div>
  );
}
