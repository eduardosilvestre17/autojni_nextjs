"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 text-foreground dark:text-dark-foreground mt-8">
      {/* Seção principal: 4 colunas */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        {/* COLUNA 1: Horários */}
        <div className="space-y-4">
          {/* Oficina */}
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
          {/* Tacógrafos */}
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

        {/* COLUNA 2: Navegação (Home, Sobre, Contacto, Loja) */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-myOrange mb-1">
            Navegação
          </h3>
          <nav>
            <ul className="flex flex-col space-y-3">
              {/* Home */}
              <li>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2
                             transition-transform duration-200 
                             hover:scale-110 hover:text-myOrange"
                >
                  <i className="fa-solid fa-house text-lg" />
                  <span>Home</span>
                </Link>
              </li>
              {/* Loja Online */}
              <li>
                <Link
                  href="/loja"
                  className="inline-flex items-center gap-2
                             transition-transform duration-200
                             hover:scale-110 hover:text-myOrange"
                >
                  <i className="fa-solid fa-store text-lg" />
                  <span>Loja Online</span>
                </Link>
              </li>
              {/* Sobre */}
              <li>
                <Link
                  href="/sobre"
                  className="inline-flex items-center gap-2
                             transition-transform duration-200
                             hover:scale-110 hover:text-myOrange"
                >
                  <i className="fa-solid fa-circle-info text-lg" />
                  <span>Sobre</span>
                </Link>
              </li>
              {/* Contacto */}
              <li>
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2
                             transition-transform duration-200
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
            // inline-block + leading-tight evita saltar a linha ao dar hover scale
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
              className="underline underline-offset-2 transition-transform duration-200
                         hover:scale-110 hover:text-myOrange"
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

      {/* Rodapé final */}
      <div className="border-t border-gray-300 dark:border-gray-700 py-4 text-center text-xs">
        <p className="text-gray-500 dark:text-gray-400 mb-1">
          © 2025 Desenvolvido por MegaPC. Todos os direitos reservados.
        </p>
        {/* Disclaimers e links */}
        <div className="flex flex-wrap justify-center items-center gap-4 text-gray-500 dark:text-gray-400">
          <a
            href="#"
            className="underline underline-offset-2 transition-transform duration-200
                       hover:text-myOrange hover:scale-110"
          >
            Política de Cookies e Privacidade
          </a>
          <a
            href="#"
            className="underline underline-offset-2 transition-transform duration-200
                       hover:text-myOrange hover:scale-110"
          >
            Termos e Condições
          </a>
          <a
            href="#"
            className="underline underline-offset-2 transition-transform duration-200
                       hover:text-myOrange hover:scale-110"
          >
            Entregas e Devoluções
          </a>
          <a
            href="https://www.livroreclamacoes.pt/Inicio/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-transform duration-200
                       hover:text-myOrange hover:scale-110"
          >
            Livro de Reclamações Online
          </a>
        </div>
      </div>
    </footer>
  );
}
