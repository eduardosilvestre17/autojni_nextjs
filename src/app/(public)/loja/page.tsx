// src/app/(public)/loja/page.tsx
"use client";

import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function LojaPage() {
  // Exemplo de dados estáticos
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "Produto A",
      price: 99.9,
      image: "/images/produtoA.jpg",
    },
    {
      id: 2,
      name: "Produto B",
      price: 149.0,
      image: "/images/produtoB.jpg",
    },
    {
      id: 3,
      name: "Produto C",
      price: 59.9,
      image: "/images/produtoC.jpg",
    },
    {
      id: 4,
      name: "Produto D",
      price: 199.0,
      image: "/images/produtoD.jpg",
    },
    // Adicione quantos desejar...
  ]);

  return (
    <section>
      {/* Título da seção na página */}
      <h1 className="text-2xl font-bold mb-6 text-foreground dark:text-dark-foreground">
        Loja
      </h1>

      {/* Grid de Produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 rounded shadow p-4 flex flex-col"
          >
            {/* Imagem do produto (ajuste src se tiver imagens) */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded mb-4"
            />

            {/* Nome */}
            <h2 className="text-lg font-semibold text-foreground dark:text-dark-foreground mb-2">
              {product.name}
            </h2>

            {/* Preço */}
            <p className="text-primary dark:text-myOrange text-xl font-bold mb-4">
              {`€ ${product.price.toFixed(2)}`}
            </p>

            {/* Botão de adicionar ao carrinho */}
            <button
              className="bg-primary dark:bg-myOrange text-white py-2 rounded 
                         hover:bg-primary-dark dark:hover:bg-myOrange-dark 
                         transition-colors"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
