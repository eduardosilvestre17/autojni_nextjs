"use client";

import Image from "next/image";
import Link from "next/link";
import fundosEApoios from "@/app/images/footer/fundos_e_apoios.png"; // Import direto
import { SearchInput } from "@/components/SearchInput"; // Import do seu componente

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 text-foreground dark:text-dark-foreground mt-8">
      {/* CTA Newsletter */}
      <div className="bg-gray-100 dark:bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Subscreva a nossa Newsletter
          </h2>
          <p className="text-gray-700 dark:text-gray-200 mb-6">
            Não deixe o seu email sem revisão! Subscreva-se à nossa Newsletter e
            mantenha-o tão afinado como o seu carro.
          </p>

          {/* Formulário de Newsletter usando o SearchInput como campo de email */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Lógica para subscrição da Newsletter
              alert("Obrigado por subscrever!");
            }}
            className="flex flex-col sm:flex-row justify-center items-center gap-2"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Seu Email
            </label>
            <SearchInput
              type="email"
              placeholder="Insira o seu email"
              required={true}
              withIcon={false} // Se quiser o ícone de "lupa", coloque true
              className="w-full sm:w-auto" // Classes extras se desejar
            />
            <button
              type="submit"
              className="bg-myOrange text-white font-semibold px-6 py-2 rounded-md 
                         hover:bg-orange-500 transition-colors"
            >
              Subscrever
            </button>
          </form>
        </div>
      </div>

      {/* Seção principal: 4 colunas */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        {/* COLUNA 1: Horários */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-myOrange mb-1">
              Oficina
            </h3>
            <p>
              <strong>Seg-Sex:</strong> 09:00h - 13:00h, 14:30h - 19:00h
            </p>
            <p>
              <strong>Sáb:</strong> 09:00h - 13:00h
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-myOrange mb-1">
              Tacógrafos
            </h3>
            <p>
              <strong>Seg-Sex:</strong> 08:00h - 20:00h
            </p>
            <p>
              <strong>Sáb:</strong> 09:00h - 13:00h
            </p>
          </div>
        </div>

        {/* COLUNA 2: Navegação */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-myOrange mb-1">
            Navegação
          </h3>
          <nav>
            <ul className="flex flex-col space-y-3">
              <li>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 transition-transform duration-200 
                             hover:scale-110 hover:text-myOrange"
                >
                  <i className="fa-solid fa-house text-lg" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/loja"
                  className="inline-flex items-center gap-2 transition-transform duration-200 
                             hover:scale-110 hover:text-myOrange"
                >
                  <i className="fa-solid fa-store text-lg" />
                  <span>Loja Online</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre"
                  className="inline-flex items-center gap-2 transition-transform duration-200 
                             hover:scale-110 hover:text-myOrange"
                >
                  <i className="fa-solid fa-circle-info text-lg" />
                  <span>Sobre</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 transition-transform duration-200 
                             hover:scale-110 hover:text-myOrange"
                >
                  <i className="fa-solid fa-envelope text-lg" />
                  <span>Contacto</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* COLUNA 3: Dados da Empresa */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-myOrange mb-1">
            Auto JNI reparações auto, Lda.
          </h3>
          <a
            href="https://maps.app.goo.gl/2hVdvtqxuJF4e52v5"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block transition-transform duration-200 hover:scale-110 hover:text-myOrange leading-tight"
          >
            Estrada Nacional, 113
            <br />
            Corredoura
            <br />
            2490-550 Ourém
          </a>
        </div>

        {/* COLUNA 4: Contactos */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-myOrange mb-1">
            Contactos
          </h3>
          <p>
            <strong>Tel. Oficina:</strong> 249 544 150* / Peças: 249 099 132*
          </p>
          <p>
            <strong>Telemóvel:</strong> 919 180 354** / 919 400 382**
          </p>
          <p>
            <strong>Tacógrafos:</strong> 918 770 717**
          </p>
          <p>
            <strong>E-mail:</strong>{" "}
            <a
              href="mailto:geral@autojni.pt"
              className="underline underline-offset-2 transition-transform duration-200 hover:scale-110 hover:text-myOrange"
            >
              geral@autojni.pt
            </a>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            *Chamada para a rede fixa nacional / **Chamada para rede móvel
            nacional
          </p>
        </div>
      </div>

      {/* Imagem de Fundos e Apoios (import local) */}
      <div className="flex justify-center py-4">
        <Image
          src={fundosEApoios}
          alt="Fundos e Apoios"
          width={400}
          height={0}
          style={{ height: "auto" }}
        />
      </div>

      {/* Rodapé final */}
      <div className="border-t border-gray-300 dark:border-gray-700 py-4 text-center text-xs">
        <p className="text-gray-500 dark:text-gray-400 mb-1">
          © {new Date().getFullYear()} Desenvolvido por MegaPC. Todos os
          direitos reservados.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-4 text-gray-500 dark:text-gray-400">
          <a
            href="#"
            className="underline underline-offset-2 transition-transform duration-200 hover:text-myOrange hover:scale-110"
          >
            Política de Cookies e Privacidade
          </a>
          <a
            href="#"
            className="underline underline-offset-2 transition-transform duration-200 hover:text-myOrange hover:scale-110"
          >
            Termos e Condições
          </a>
          <a
            href="#"
            className="underline underline-offset-2 transition-transform duration-200 hover:text-myOrange hover:scale-110"
          >
            Entregas e Devoluções
          </a>
          <a
            href="https://www.livroreclamacoes.pt/Inicio/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-transform duration-200 hover:text-myOrange hover:scale-110"
          >
            Livro de Reclamações Online
          </a>
        </div>
      </div>
    </footer>
  );
}
