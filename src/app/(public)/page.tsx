"use client";

import { PrimaryButton, SecondaryButton } from "@/components/Buttons";

export default function HomePage() {
  return (
    <section className="mb-8">
      {/* Hero Section */}
      <div
        className="flex flex-col md:flex-row items-center 
        bg-gradient-to-r from-primary to-secondary 
        text-white rounded-lg p-8 mb-8 shadow-lg
      "
      >
        <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Bem-vindo ao AutoJNI!
          </h1>
          <p className="mb-6 leading-relaxed">
            Seu projeto Next.js com Tailwind CSS, construído de forma moderna e
            escalável. Personalize como quiser e crie interfaces incríveis.
          </p>

          {/* Usando o componente PrimaryButton */}
          <SecondaryButton>Saiba Mais</SecondaryButton>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <img
            src="/hero-image.png"
            alt="Hero Image"
            className="w-full max-w-sm rounded-lg shadow-2xl"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-foreground dark:text-dark-foreground">
            Fácil de Usar
          </h2>
          <p className="text-foreground/70 dark:text-dark-foreground/70">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odit,
            recusandae?
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-foreground dark:text-dark-foreground">
            Alta Performance
          </h2>
          <p className="text-foreground/70 dark:text-dark-foreground/70">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos,
            velit.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2 text-foreground dark:text-dark-foreground">
            Flexível e Escalável
          </h2>
          <p className="text-foreground/70 dark:text-dark-foreground/70">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam,
            provident.
          </p>
        </div>
      </div>
    </section>
  );
}
