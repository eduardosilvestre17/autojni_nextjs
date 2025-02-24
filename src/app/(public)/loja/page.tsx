import { prisma } from "@/lib/prisma";

interface Product {
  id: number;
  titulo: string;
  precoPrincipal: any; // Pode ser um Decimal do Prisma
  imagens: string[];
}

export default async function LojaPage() {
  // Busca os produtos do banco de dados
  const products: Product[] = await prisma.product.findMany({
    select: {
      id: true,
      titulo: true,
      precoPrincipal: true,
      imagens: true,
    },
  });

  return (
    <section>
      <h1 className="text-2xl font-bold mb-6 text-foreground dark:text-dark-foreground">
        Loja
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          // Usa a primeira imagem se existir; caso contrário, usa um placeholder
          const imageSrc =
            product.imagens && product.imagens.length > 0
              ? product.imagens[0]
              : "/images/placeholder.jpg";

          // Converte o preço para número, caso seja um Decimal
          const price = Number(product.precoPrincipal);

          return (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded shadow p-4 flex flex-col"
            >
              <img
                src={imageSrc}
                alt={product.titulo}
                className="w-full h-48 object-cover rounded mb-4"
              />

              <h2 className="text-lg font-semibold text-foreground dark:text-dark-foreground mb-2">
                {product.titulo}
              </h2>

              <p className="text-primary dark:text-myOrange text-xl font-bold mb-4">
                {`€ ${price.toFixed(2)}`}
              </p>

              <button
                className="bg-primary dark:bg-myOrange text-white py-2 rounded 
                           hover:bg-primary-dark dark:hover:bg-myOrange-dark 
                           transition-colors"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
