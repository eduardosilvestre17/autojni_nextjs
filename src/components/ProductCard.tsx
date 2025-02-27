"use client";

import React, { useState, useRef, useEffect } from "react";

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

// Função auxiliar para sortear um número inteiro entre min e max (inclusive)
function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface HeartPosition {
  x: number;
  y: number;
  rot: number;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { id, titulo, precoPrincipal, imagens, isNew = false } = product;

  const imageSrc = imagens?.[0] || "/images/placeholder.jpg";
  const price = Number(precoPrincipal);

  // Estados para animações
  const [explodeHearts, setExplodeHearts] = useState(false);
  const [iconPop, setIconPop] = useState(false);

  // Guarda as posições/rotações dos corações
  const [heartsPositions, setHeartsPositions] = useState<HeartPosition[]>([]);

  // Referência para armazenar timeouts
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Limpa timeouts no desmontar do componente
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // Clique no coração
  function handleWishlistClick() {
    // Limpa eventuais timeouts pendentes
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    // Reinicia estados de animação
    setExplodeHearts(false);
    setIconPop(false);

    // Gera posições/rotações aleatórias para cada um dos 8 "setores" de 45 graus
    const newHearts = Array.from({ length: 8 }, (_, i) => {
      // Cada zona: i*45 até (i+1)*45
      const minAngle = i * 45;
      const maxAngle = (i + 1) * 45;
      // Ângulo aleatório dentro da zona
      const angle = Math.random() * (maxAngle - minAngle) + minAngle;
      // Distância aleatória (entre 40 e 60 px)
      const distance = randomBetween(40, 60);
      // Converte ângulo para radianos
      const rad = (angle * Math.PI) / 180;

      // Define deslocamento (x e y)
      // Ângulo 0° => para a direita (Eixo X).
      // Precisamos injetar a componente Y negativa p/ ir "para cima" quando sin é positivo.
      const x = distance * Math.cos(rad);
      const y = -distance * Math.sin(rad);

      // Rotação final (entre 360° e 720°)
      const rot = randomBetween(360, 720);

      return { x, y, rot };
    });

    // Guarda posições no state
    setHeartsPositions(newHearts);

    // Dispara animações (assíncrono para "reiniciar do zero")
    timeoutsRef.current.push(
      setTimeout(() => {
        setExplodeHearts(true);
        setIconPop(true);
      }, 0)
    );

    // Desliga a explosão após 1s
    timeoutsRef.current.push(setTimeout(() => setExplodeHearts(false), 1000));

    // Desliga o pop após 0.6s
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

              {/* Explosão de corações (8 direções aleatórias) */}
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

      {/* Styles: animação "pop" do ícone + explosão (8 corações a partir do centro) */}
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

        /* Explosão de corações usando variáveis CSS (x, y, rot) */
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
