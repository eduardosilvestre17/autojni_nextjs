"use client";

export default function ContactoPage() {
  return (
    <section className="space-y-12 text-gray-700 dark:text-gray-200">
      {/* Título Principal */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Contacte-nos</h1>
        <p className="leading-relaxed text-lg">
          Precisa de ajuda ou mais informações? Estamos aqui para si.
        </p>
      </div>

      {/* Cartões de Contacto em 2x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card: Oficina */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm p-6 hover:shadow-lg transition hover:-translate-y-1">
          <h2 className="text-xl font-semibold mb-2">Oficina</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Telefones para assistência na oficina.
          </p>
          <div className="space-y-2">
            <a
              href="tel:249544150"
              className="block text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              249 544 150
            </a>
            <a
              href="tel:249099132"
              className="block text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              249 099 132
            </a>
          </div>
        </div>

        {/* Card: Telemóveis */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm p-6 hover:shadow-lg transition hover:-translate-y-1">
          <h2 className="text-xl font-semibold mb-2">Telemóveis</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Contacte diretamente os nossos profissionais.
          </p>
          <div className="space-y-2">
            <a
              href="tel:919180354"
              className="block text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              919 180 354
            </a>
            <a
              href="tel:919400382"
              className="block text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              919 400 382
            </a>
          </div>
        </div>

        {/* Card: Tacógrafos */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm p-6 hover:shadow-lg transition hover:-translate-y-1">
          <h2 className="text-xl font-semibold mb-2">Tacógrafos</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Informações sobre verificação e calibração de tacógrafos.
          </p>
          <a
            href="tel:918770717"
            className="block text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            918 770 717
          </a>
        </div>

        {/* Card: E-mail */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm p-6 hover:shadow-lg transition hover:-translate-y-1">
          <h2 className="text-xl font-semibold mb-2">E-mail</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Prefere escrever-nos? Envie um e-mail.
          </p>
          <a
            href="mailto:geral@autojni.pt"
            className="block text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            geral@autojni.pt
          </a>
        </div>
      </div>

      {/* Google Maps (Menor Altura) */}
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold text-center">Onde Estamos</h2>
        <div className="w-full h-64 md:h-80 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden">
          <iframe
            title="Auto JNI Localização"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3071.7721948976073!2d-8.594365923626658!3d39.654841101657375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd18820d0f65b481%3A0x4aea4112cf224347!2sAuto%20JNI!5e0!3m2!1spt-PT!2spt!4v1740256676660!5m2!1spt-PT!2spt"
            className="w-full h-full"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      {/* Horários de Funcionamento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Oficina */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm p-6 space-y-2">
          <h3 className="text-xl font-semibold">Horário - Oficina</h3>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
            <li>
              Seg - Sex: <strong>09:00 - 13:00</strong> &{" "}
              <strong>14:30 - 19:00</strong>
            </li>
            <li>
              Sáb: <strong>09:00 - 13:00</strong>
            </li>
          </ul>
        </div>

        {/* Tacógrafos */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm p-6 space-y-2">
          <h3 className="text-xl font-semibold">Horário - Tacógrafos</h3>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
            <li>
              Seg - Sex: <strong>08:00 - 20:00</strong>
            </li>
            <li>
              Sáb: <strong>09:00 - 13:00</strong>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
