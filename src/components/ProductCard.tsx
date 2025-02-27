"use client";

import React, { useState } from "react";

// Se estiver usando Font Awesome, lembre de importar o CSS em algum lugar global:
// ex.: via <Head> ou _app.tsx:  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

export interface Product {
  id: string;
  titulo: string;
  slug: string;
  precoPrincipal: number;
  imagens: string[];
  isNew?: boolean;
  inStock?: boolean;
  // Adicione outras propriedades, se precisar
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

  // Animação do coração
  const [explodeHearts, setExplodeHearts] = useState(false);

  function handleWishlistClick() {
    setExplodeHearts(true);
    setTimeout(() => setExplodeHearts(false), 1000);
  }

  return (
    <div
      key={id}
      className={`
        relative group
        border border-gray-200 dark:border-gray-700
        rounded
        bg-white dark:bg-gray-800
        
        // Leve aumento (1%) no hover
        transition-transform transform-gpu
        hover:scale-[1.01]

        // Sombra grande no modo claro
        hover:shadow-2xl
        // Sombra "glow" laranja no modo escuro
        dark:hover:shadow-[0_0_20px_0_rgba(249,175,34,0.5)]
      `}
      style={{ overflow: "visible" }} // Para não cortar a sombra
    >
      <div className="p-4 overflow-hidden">
        {/* Selinho "Novo", se precisar */}
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

        {/* Contêiner dos botões: "items-stretch" para ter mesma altura */}
        <div className="flex items-stretch gap-4 mt-auto">
          {/* Botão de Carrinho */}
          <button
            className={`
              flex-1
              flex items-center justify-center gap-2
              text-sm font-medium
              px-4 py-2
              rounded
              bg-primary dark:bg-myOrange text-white
              hover:bg-primary-dark dark:hover:bg-myOrange-dark
              transition-colors
            `}
          >
            {/* Ícone de carrinho (FontAwesome) */}
            <i className="fa-solid fa-cart-shopping"></i>
            Carrinho
          </button>

          {/* Wishlist (coração) - Mesma altura do carrinho */}
          <div
            className={`
              relative
              flex items-center justify-center
              px-4 py-2
              border border-gray-200 dark:border-gray-700
              rounded
              hover:bg-gray-100 dark:hover:bg-gray-700
              transition-colors
              overflow-hidden
            `}
          >
            <button
              onClick={handleWishlistClick}
              title="Adicionar à Wishlist"
              className="text-red-500"
            >
              {/* Ícone coração (FontAwesome) */}
              <i className="fa-solid fa-heart"></i>
            </button>

            {/* Explosão de corações */}
            {explodeHearts && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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
            transform: scale(0) translate(0, 0);
          }
          20% {
            opacity: 1;
            transform: scale(1.3) translate(0, 0);
          }
          100% {
            opacity: 0;
            transform: scale(0.8) translate(-25px, -40px) rotate(360deg);
          }
        }
        @keyframes heartBurst2 {
          0% {
            opacity: 0;
            transform: scale(0) translate(0, 0);
          }
          20% {
            opacity: 1;
            transform: scale(1.2) translate(0, 0);
          }
          100% {
            opacity: 0;
            transform: scale(1) translate(25px, -35px) rotate(-360deg);
          }
        }
        @keyframes heartBurst3 {
          0% {
            opacity: 0;
            transform: scale(0) translate(0, 0);
          }
          20% {
            opacity: 1;
            transform: scale(1.1) translate(0, 0);
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
