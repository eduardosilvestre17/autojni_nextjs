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
  // Outras propriedades se precisar
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { id, titulo, precoPrincipal, imagens, isNew = false } = product;

  const imageSrc = imagens?.[0] || "/images/placeholder.jpg";
  const price = Number(precoPrincipal);

  // Estados para animações
  const [explodeHearts, setExplodeHearts] = useState(false);
  const [iconPop, setIconPop] = useState(false);

  // Clique no coração
  function handleWishlistClick() {
    // Dispara explosão + anima pop
    setExplodeHearts(true);
    setIconPop(true);

    // Desliga a explosão após 1s
    setTimeout(() => setExplodeHearts(false), 1000);
    // Desliga o pop após 0.6s
    setTimeout(() => setIconPop(false), 600);
  }

  return (
    <div
      key={id}
      className={`
        relative group
        border border-gray-200 dark:border-gray-700
        rounded
        bg-white dark:bg-gray-800
        
        // Leve aumento no hover
        transition-transform transform-gpu
        hover:scale-[1.01]

        // Sombra grande (claro)
        hover:shadow-2xl
        // Sombra laranja (escuro)
        dark:hover:shadow-[0_0_20px_0_rgba(249,175,34,0.5)]
      `}
      style={{ overflow: "visible" }} // Permite a sombra do card e corações escaparem
    >
      <div className="p-4 flex flex-col h-full">
        {/* Se "Novo", exibe badge */}
        {isNew && (
          <span className="absolute top-2 left-2 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded z-10">
            Novo
          </span>
        )}

        {/* Imagem */}
        <div className="mb-3">
          <img
            src={imageSrc}
            alt={titulo}
            className="w-full aspect-square object-cover rounded"
          />
        </div>

        {/* Título (fixa altura p/ 2 linhas) */}
        <h2
          className="text-sm font-semibold text-foreground dark:text-dark-foreground mb-1 line-clamp-2"
          style={{ minHeight: "2.8em" }} // ~2 linhas de 1.4em cada
        >
          {titulo}
        </h2>

        {/* Preço */}
        <p className="text-lg font-bold text-primary dark:text-myOrange mb-2">
          € {price.toFixed(2)}
        </p>

        {/* Botões => "items-stretch" p/ mesma altura */}
        <div className="mt-auto">
          <div className="flex items-stretch gap-4">
            {/* Botão de Carrinho (flex-1 => ocupa resto da linha) */}
            <button
              className={`
                flex-1 flex items-center justify-center gap-2
                text-sm font-medium
                px-4 py-2
                rounded
                bg-primary dark:bg-myOrange
                text-white
                hover:bg-primary-dark dark:hover:bg-myOrange-dark
                transition-colors
              `}
            >
              <i className="fa-solid fa-cart-shopping"></i>
              Carrinho
            </button>

            {/* Botão de Wishlist => sem overflow-hidden para corações escaparem */}
            <button
              onClick={handleWishlistClick}
              title="Adicionar à Wishlist"
              className={`
                relative
                px-4 py-2
                border border-gray-200 dark:border-gray-700
                rounded
                hover:bg-gray-100 dark:hover:bg-gray-700
                transition-colors
                flex items-center justify-center
              `}
              style={{ overflow: "visible" }} // corações podem sair
            >
              {/* Ícone coração (FontAwesome) com pop */}
              <i
                className={`
                  fa-solid fa-heart text-red-500
                  ${iconPop ? "animate-pop" : ""}
                `}
              />

              {/* Explosão de corações (5 direções) */}
              {explodeHearts && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative">
                    <span className="absolute text-red-500 animate-heart-burst1">
                      ♥
                    </span>
                    <span className="absolute text-red-500 animate-heart-burst2">
                      ♥
                    </span>
                    <span className="absolute text-red-500 animate-heart-burst3">
                      ♥
                    </span>
                    <span className="absolute text-red-500 animate-heart-burst4">
                      ♥
                    </span>
                    <span className="absolute text-red-500 animate-heart-burst5">
                      ♥
                    </span>
                  </div>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Styles: animação "pop" do ícone + 5 direções de corações */}
      <style jsx>{`
        /* Pop do ícone de wishlist */
        @keyframes pop {
          0% {
            transform: scale(1);
          }
          30% {
            transform: scale(1.4);
          }
          50% {
            transform: scale(0.9);
          }
          70% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-pop {
          animation: pop 0.6s ease-out forwards;
        }

        /* Explosão de corações (1s, 5 direções) */
        @keyframes heartBurst1 {
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
            transform: scale(1) translate(-40px, -10px) rotate(540deg);
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
            transform: scale(1) translate(40px, -10px) rotate(-540deg);
          }
        }
        @keyframes heartBurst3 {
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
            transform: scale(1) translate(-20px, -40px) rotate(540deg);
          }
        }
        @keyframes heartBurst4 {
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
            transform: scale(1) translate(20px, -40px) rotate(-540deg);
          }
        }
        @keyframes heartBurst5 {
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
            transform: scale(1) translate(0, -50px) rotate(540deg);
          }
        }

        .animate-heart-burst1 {
          animation: heartBurst1 0.5s forwards ease-out;
        }
        .animate-heart-burst2 {
          animation: heartBurst2 0.5s forwards ease-out;
        }
        .animate-heart-burst3 {
          animation: heartBurst3 0.5s forwards ease-out;
        }
        .animate-heart-burst4 {
          animation: heartBurst4 0.5s forwards ease-out;
        }
        .animate-heart-burst5 {
          animation: heartBurst5 0.5s forwards ease-out;
        }
      `}</style>
    </div>
  );
}
