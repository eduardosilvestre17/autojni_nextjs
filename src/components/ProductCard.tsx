// src/app/(public)/loja/ProductCard.tsx

"use client"; // Se você usar algo de hooks do React no componente

import React from "react";

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

  return (
    <div
      key={id}
      className="group relative bg-white dark:bg-gray-800 
                 border border-gray-200 dark:border-gray-700 
                 rounded p-4 flex flex-col justify-between 
                 transition-transform transform-gpu 
                 hover:scale-[1.02] hover:shadow-md"
    >
      {/* Se for novo, exibe o "Novo" */}
      {isNew && (
        <span className="absolute top-2 left-2 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
          Novo
        </span>
      )}

      {/* Imagem do produto */}
      <img
        src={imageSrc}
        alt={titulo}
        className="w-full aspect-square object-cover rounded mb-3"
      />

      {/* Título do produto */}
      <h2 className="text-sm font-semibold text-foreground dark:text-dark-foreground mb-1 line-clamp-2">
        {titulo}
      </h2>

      {/* Preço */}
      <p className="text-lg font-bold text-primary dark:text-myOrange mb-1">
        € {price.toFixed(2)}
      </p>

      {/* Ícones de carrinho e wishlist (decorativos) */}
      <div className="flex items-center gap-4 mt-auto">
        <button
          className="flex-1 flex items-center justify-center gap-1 
                     text-sm font-medium py-2 rounded 
                     bg-primary dark:bg-myOrange text-white 
                     hover:bg-primary-dark dark:hover:bg-myOrange-dark
                     transition-colors"
        >
          {/* Ícone de carrinho (ilustrativo) */}
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
              d="M2.25 2.25l1.5 1.5M3.75 3.75l16.5 16.5M2.25 2.25l16.5 16.5"
            />
          </svg>
          Carrinho
        </button>
        <button
          className="p-2 rounded border border-gray-200 
                     dark:border-gray-700 
                     hover:bg-gray-100 dark:hover:bg-gray-700 
                     transition-colors"
          title="Adicionar à Wishlist"
        >
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
              d="M2.318 6.318c2.834-2.834 7.384-2.835 10.219 0l.463.464.464-.464c2.834-2.834 7.384-2.835 10.219 0 2.833 2.834 2.833 7.384 0 10.219l-9.219 9.219a1.5 1.5 0 01-2.122 0l-9.219-9.219c-2.833-2.835-2.833-7.385 0-10.219z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
