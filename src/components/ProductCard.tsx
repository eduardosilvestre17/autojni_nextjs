// components/ProductCard.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";

// Interface refletindo o seu modelo Article
export interface Product {
  id: string;
  description: string;
  sellingPrice?: number | null;
  imageUrl?: string | null;
  active: boolean;
  brand?: string | null;
  stockQuantity?: number | null;
  articleType?: string | null;
  purchasingPrice?: number | null;
}

interface ProductCardProps {
  product: Product;
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface HeartPosition {
  x: number;
  y: number;
  rot: number;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { id, description, sellingPrice, imageUrl } = product;

  // Se a imagem não existir ou for string vazia, usa um fallback genérico
  const fallback = "/images/generic.jpg"; // troque pelo seu caminho
  const imageSrc = imageUrl && imageUrl.trim() !== "" ? imageUrl : fallback;

  // Trata preço
  const priceText =
    sellingPrice != null ? `€ ${sellingPrice.toFixed(2)}` : "Sem preço";

  // Animações Wishlist
  const [explodeHearts, setExplodeHearts] = useState(false);
  const [iconPop, setIconPop] = useState(false);
  const [heartsPositions, setHeartsPositions] = useState<HeartPosition[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  function handleWishlistClick() {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    setExplodeHearts(false);
    setIconPop(false);

    const newHearts = Array.from({ length: 8 }, (_, i) => {
      const minAngle = i * 45;
      const maxAngle = (i + 1) * 45;
      const angle = Math.random() * (maxAngle - minAngle) + minAngle;
      const distance = randomBetween(40, 60);
      const rad = (angle * Math.PI) / 180;
      const x = distance * Math.cos(rad);
      const y = -distance * Math.sin(rad);
      const rot = randomBetween(360, 720);

      return { x, y, rot };
    });

    setHeartsPositions(newHearts);

    timeoutsRef.current.push(
      setTimeout(() => {
        setExplodeHearts(true);
        setIconPop(true);
      }, 0)
    );
    timeoutsRef.current.push(setTimeout(() => setExplodeHearts(false), 1000));
    timeoutsRef.current.push(setTimeout(() => setIconPop(false), 600));
  }

  return (
    <div
      key={id}
      className={`
        relative group
        border border-gray-200 dark:border-gray-700
        rounded
        bg-white dark:bg-gray-800
        transition-transform transform-gpu
        hover:scale-[1.01]
        hover:shadow-2xl
        dark:hover:shadow-[0_0_20px_0_rgba(249,175,34,0.5)]
      `}
      style={{ overflow: "visible" }}
    >
      <div className="p-4 flex flex-col h-full">
        {/* Imagem */}
        <div className="mb-3">
          <img
            src={imageSrc}
            alt={description}
            className="w-full aspect-square object-cover rounded"
          />
        </div>

        {/* Descrição */}
        <h2
          className="text-sm font-semibold text-foreground dark:text-dark-foreground mb-1 line-clamp-2"
          style={{ minHeight: "2.8em" }}
        >
          {description}
        </h2>

        {/* Preço */}
        <p className="text-lg font-bold text-primary dark:text-myOrange mb-2">
          {priceText}
        </p>

        {/* Botões */}
        <div className="mt-auto">
          <div className="flex items-stretch gap-4">
            {/* Botão de Carrinho */}
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

            {/* Botão de Wishlist */}
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
              style={{ overflow: "visible" }}
            >
              <i
                className={`
                  fa-solid fa-heart text-red-500
                  ${iconPop ? "animate-pop" : ""}
                `}
              />
              {explodeHearts && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative">
                    {heartsPositions.map((heart, index) => (
                      <span
                        key={index}
                        className="absolute text-red-500 heart-burst"
                        style={
                          {
                            "--tx": `${heart.x}px`,
                            "--ty": `${heart.y}px`,
                            "--rot": `${heart.rot}deg`,
                          } as React.CSSProperties
                        }
                      >
                        ♥
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

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

        /* Explosão de corações (usando variáveis CSS) */
        @keyframes heartBurst {
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
            transform: scale(1) translate(var(--tx), var(--ty))
              rotate(var(--rot));
          }
        }
        .heart-burst {
          animation: heartBurst 0.6s forwards ease-out;
        }
      `}</style>
    </div>
  );
}
