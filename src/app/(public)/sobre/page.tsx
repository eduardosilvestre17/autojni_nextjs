"use client";

import Image from "next/image";
import bannerImage from "@/app/images/A_nossa_oficina.jpg";
import avatar1 from "@/app/images/reviews/1.png";
import avatar2 from "@/app/images/reviews/2.png";
import avatar3 from "@/app/images/reviews/3.png";
import avatar4 from "@/app/images/reviews/4.png";

// Importa os dois botões
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";

const reviews = [
  {
    rating: "★★★★★",
    text: "“Secretárias muito simpáticas, sempre disponíveis para quaisquer questões, Proprietário idem.”",
    author: "– Cátia Peguinho",
    from: "Retirado do Google",
    avatar: avatar1,
  },
  {
    rating: "★★★★★",
    text: "“Excelente atendimento. Serviço Prestado de ótima qualidade e preço justo.”",
    author: "– Eliane Santos",
    from: "Retirado do Google",
    avatar: avatar2,
  },
  {
    rating: "★★★★★",
    text: "“Serviço super atencioso e profissional!”",
    author: "– Alexandre Chainho",
    from: "Retirado do Google",
    avatar: avatar3,
  },
  {
    rating: "★★★★★",
    text: "“Equipa com excelentes profissionais. Os trabalhos têm acabamentos top.”",
    author: "– amadeira2225",
    from: "Retirado do Google",
    avatar: avatar4,
  },
];

export default function SobrePage() {
  const extendedReviews = [...reviews, ...reviews];

  return (
    <section className="space-y-8">
      {/* HERO */}
      <div className="flex flex-col md:flex-row items-center bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg p-8 shadow-lg">
        <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Sobre a Auto JNI
          </h1>
          <p className="mb-6 leading-relaxed">
            Iniciámos atividade em 2011, dando continuidade ao projeto do Sr.
            João Lourenço Alves, com mais de 30 anos de experiência no ramo
            automóvel.
          </p>
          {/* Usando o SecondaryButton no "Ver Mais" */}
          <PrimaryButton>Ver Mais</PrimaryButton>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <Image
            src={bannerImage}
            alt="A Nossa Oficina"
            className="rounded-lg shadow-2xl"
            placeholder="blur"
            priority
          />
        </div>
      </div>

      {/* QUEM SOMOS */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-gray-700 dark:text-gray-200">
        <h2 className="text-2xl font-semibold mb-2">Quem Somos</h2>
        <ul className="list-disc ml-5 leading-relaxed">
          <li>Equipa com formação contínua em mecânica e eletricidade.</li>
          <li>Equipamentos modernos de diagnóstico para todas as marcas.</li>
          <li>
            Dedicação total ao cliente e respeito pelos padrões do fabricante.
          </li>
        </ul>
      </div>

      {/* A NOSSA OFICINA */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-gray-700 dark:text-gray-200">
        <h2 className="text-2xl font-semibold mb-2">A Nossa Oficina</h2>
        <p className="leading-relaxed">
          Dispomos de uma área equipada com bancadas de teste, computadores de
          última geração e ferramentas especiais para cada tipo de veículo.
        </p>
        <p className="mt-3 font-bold">
          Espaço e equipamentos da Oficina Auto JNI
        </p>
      </div>

      {/* SERVIÇOS */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-gray-700 dark:text-gray-200">
        <h2 className="text-2xl font-semibold mb-4">Os Nossos Serviços</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded p-4 shadow hover:shadow-lg transition">
            <h3 className="text-lg font-bold mb-2">Instalação GPL</h3>
            <p>
              Poupe nos custos de combustível ao converter o seu veículo para
              Gás GPL.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded p-4 shadow hover:shadow-lg transition">
            <h3 className="text-lg font-bold mb-2">
              Verificação de Tacógrafos
            </h3>
            <p>
              Centro certificado para verificação e calibração de tacógrafos
              analógicos e digitais.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded p-4 shadow hover:shadow-lg transition">
            <h3 className="text-lg font-bold mb-2">Revisão Automóvel</h3>
            <p>
              Mantenha o seu carro em perfeito estado com a nossa revisão
              completa.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded p-4 shadow hover:shadow-lg transition">
            <h3 className="text-lg font-bold mb-2">Oficina/Manutenção Geral</h3>
            <p>
              Reparação e manutenção multimarca, com equipamentos modernos e
              técnicos experientes.
            </p>
          </div>
        </div>
        <div className="mt-6">
          {/* Aqui vamos usar um PrimaryButton (azul) */}
          <PrimaryButton>Conhecer os nossos serviços!</PrimaryButton>
        </div>
      </div>

      {/* OPINIÕES (CARROSSEL) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-gray-700 dark:text-gray-200 relative">
        <h2 className="text-2xl font-semibold mb-4">
          Opiniões dos Nossos Clientes
        </h2>
        <div className="overflow-hidden relative w-full">
          <div
            className="relative w-[200%] flex"
            style={{ animation: "marquee 25s linear infinite" }}
          >
            {extendedReviews.map((review, i) => (
              <div
                key={i}
                className="w-[25%] px-4 py-6 text-center whitespace-normal break-words leading-relaxed bg-white dark:bg-gray-700 border dark:border-gray-600 rounded shadow flex flex-col justify-between mx-2"
                style={{ minHeight: "220px" }}
              >
                <div>
                  <p className="text-yellow-500 mb-2">{review.rating}</p>
                  <p className="italic mb-3">{review.text}</p>
                </div>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <Image
                    src={review.avatar}
                    alt={review.author}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div>
                    <p className="text-sm font-bold">{review.author}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {review.from}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Fades laterais */}
          <div className="absolute left-0 top-0 h-full w-16 pointer-events-none z-10 bg-gradient-to-r from-white to-transparent dark:from-gray-800 dark:to-transparent" />
          <div className="absolute right-0 top-0 h-full w-16 pointer-events-none z-10 bg-gradient-to-l from-white to-transparent dark:from-gray-800 dark:to-transparent" />

          <style jsx>{`
            @keyframes marquee {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
          `}</style>
        </div>
      </div>

      {/* FILOSOFIA */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-gray-700 dark:text-gray-200">
        <h2 className="text-2xl font-semibold mb-2">
          Filosofia & Transparência
        </h2>
        <p className="leading-relaxed">
          Queremos que se sinta confiante de que o seu automóvel está em boas
          mãos. Trabalhamos com peças de elevada qualidade para manter a
          fiabilidade do seu veículo.
        </p>
        <p className="mt-2 leading-relaxed">
          Mantemos sempre uma comunicação clara sobre orçamentos e prazos, para
          garantir a melhor experiência de reparação possível.
        </p>
      </div>
    </section>
  );
}
