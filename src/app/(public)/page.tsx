"use client";

import Image from "next/image";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background dark:bg-dark-bg text-foreground dark:text-dark-foreground">
      {/* HERO SECTION */}
      <section className="relative w-full bg-gradient-to-r from-primary to-myOrange text-white py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Bem-vindo à <span className="text-myOrange">AutoJNI</span>
            </h1>
            <p className="mb-6 text-lg">
              A sua loja online para encontrar as melhores peças e acessórios
              para o seu automóvel. Qualidade garantida e entrega rápida!
            </p>
            <PrimaryButton>Ver Produtos</PrimaryButton>
          </div>

          <div className="hidden md:block">
            <Image
              src="/hero-image.png"
              alt="Hero Banner"
              width={500}
              height={500}
              className="mx-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* CATEGORIAS EM DESTAQUE */}
      <section className="max-w-7xl mx-auto py-12 px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Categorias</h2>
        <div className="grid gap-6 md:grid-cols-4">
          {/* Card 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
            <Image
              src="/category-1.png"
              alt="Categoria"
              width={100}
              height={100}
              className="mb-4"
            />
            <h3 className="font-semibold text-lg mb-2">Motor</h3>
            <p className="text-sm text-center text-foreground/70 dark:text-dark-foreground/70">
              Peças e acessórios para o motor do seu carro
            </p>
          </div>
          {/* Card 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
            <Image
              src="/category-2.png"
              alt="Categoria"
              width={100}
              height={100}
              className="mb-4"
            />
            <h3 className="font-semibold text-lg mb-2">Interior</h3>
            <p className="text-sm text-center text-foreground/70 dark:text-dark-foreground/70">
              Tudo para manter o interior impecável
            </p>
          </div>
          {/* Card 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
            <Image
              src="/category-3.png"
              alt="Categoria"
              width={100}
              height={100}
              className="mb-4"
            />
            <h3 className="font-semibold text-lg mb-2">Exterior</h3>
            <p className="text-sm text-center text-foreground/70 dark:text-dark-foreground/70">
              Cuide da estética e da proteção externa
            </p>
          </div>
          {/* Card 4 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
            <Image
              src="/category-4.png"
              alt="Categoria"
              width={100}
              height={100}
              className="mb-4"
            />
            <h3 className="font-semibold text-lg mb-2">Iluminação</h3>
            <p className="text-sm text-center text-foreground/70 dark:text-dark-foreground/70">
              Faróis, lâmpadas e tudo que precisa para ver e ser visto
            </p>
          </div>
        </div>
      </section>

      {/* PRODUTOS EM DESTAQUE */}
      <section className="max-w-7xl mx-auto py-12 px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          Produtos em Destaque
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Produto 1 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex flex-col">
            <Image
              src="/product-1.png"
              alt="Produto 1"
              width={300}
              height={200}
              className="w-full h-auto mb-4 rounded-md"
            />
            <h3 className="text-lg font-semibold mb-2">Óleo para Motor XYZ</h3>
            <p className="text-sm text-foreground/70 dark:text-dark-foreground/70 mb-4">
              Garanta desempenho e durabilidade com a melhor lubrificação
            </p>
            <div className="mt-auto flex items-center justify-between">
              <span className="font-bold text-lg">€19,90</span>
              <SecondaryButton>Adicionar</SecondaryButton>
            </div>
          </div>
          {/* Produto 2 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex flex-col">
            <Image
              src="/product-2.png"
              alt="Produto 2"
              width={300}
              height={200}
              className="w-full h-auto mb-4 rounded-md"
            />
            <h3 className="text-lg font-semibold mb-2">Tapetes de Borracha</h3>
            <p className="text-sm text-foreground/70 dark:text-dark-foreground/70 mb-4">
              Proteja o interior do seu veículo com estilo e praticidade
            </p>
            <div className="mt-auto flex items-center justify-between">
              <span className="font-bold text-lg">€29,90</span>
              <SecondaryButton>Adicionar</SecondaryButton>
            </div>
          </div>
          {/* Produto 3 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex flex-col">
            <Image
              src="/product-3.png"
              alt="Produto 3"
              width={300}
              height={200}
              className="w-full h-auto mb-4 rounded-md"
            />
            <h3 className="text-lg font-semibold mb-2">Kit de Faróis LED</h3>
            <p className="text-sm text-foreground/70 dark:text-dark-foreground/70 mb-4">
              Aumente a visibilidade e a segurança na estrada
            </p>
            <div className="mt-auto flex items-center justify-between">
              <span className="font-bold text-lg">€49,00</span>
              <SecondaryButton>Adicionar</SecondaryButton>
            </div>
          </div>
        </div>
      </section>

      {/* BANNER PROMOCIONAL */}
      <section className="my-12 mx-auto max-w-7xl px-4 md:px-8">
        <div className="relative bg-myOrange text-white rounded-lg overflow-hidden p-8 flex flex-col md:flex-row items-center gap-6 shadow-lg">
          <div className="md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Promoção Especial de Inverno
            </h2>
            <p className="mb-4">
              Até <span className="font-bold">-30% OFF</span> em itens
              selecionados. Garanta já!
            </p>
            <PrimaryButton>Conferir Agora</PrimaryButton>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/promo-banner.png"
              alt="Banner Promoção"
              width={500}
              height={300}
              className="mx-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* TESTEMUNHOS / REVIEWS */}
      <section className="max-w-7xl mx-auto py-12 px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          O que dizem nossos clientes
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Testemunho 1 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex flex-col">
            <p className="text-sm text-foreground/70 dark:text-dark-foreground/70 mb-4 italic">
              “Encontrei tudo o que precisava para meu carro num só lugar. Ótimo
              atendimento e entrega rápida!”
            </p>
            <div className="mt-auto">
              <span className="block font-semibold">João Silva</span>
              <span className="text-xs text-foreground/50 dark:text-dark-foreground/50">
                Porto, Portugal
              </span>
            </div>
          </div>
          {/* Testemunho 2 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex flex-col">
            <p className="text-sm text-foreground/70 dark:text-dark-foreground/70 mb-4 italic">
              “Excelente variedade e preços competitivos. Certamente voltarei a
              comprar!”
            </p>
            <div className="mt-auto">
              <span className="block font-semibold">Maria Oliveira</span>
              <span className="text-xs text-foreground/50 dark:text-dark-foreground/50">
                Lisboa, Portugal
              </span>
            </div>
          </div>
          {/* Testemunho 3 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex flex-col">
            <p className="text-sm text-foreground/70 dark:text-dark-foreground/70 mb-4 italic">
              “A qualidade dos produtos é impecável. Meu carro agradece!”
            </p>
            <div className="mt-auto">
              <span className="block font-semibold">Carlos Mendes</span>
              <span className="text-xs text-foreground/50 dark:text-dark-foreground/50">
                Faro, Portugal
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-primary-dark dark:bg-primary py-12 px-4 md:px-8 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Receba nossas novidades
          </h2>
          <p className="mb-8">
            Inscreva-se na nossa newsletter e não perca nenhuma oferta!
          </p>
          <div className="max-w-md mx-auto flex flex-col md:flex-row gap-4">
            <input
              type="email"
              placeholder="Seu e-mail"
              className="flex-1 px-4 py-3 rounded-md text-foreground
                         bg-white text-sm focus:outline-none focus:ring-2 focus:ring-myOrange"
            />
            <PrimaryButton>Subscrever</PrimaryButton>
          </div>
        </div>
      </section>
    </main>
  );
}
