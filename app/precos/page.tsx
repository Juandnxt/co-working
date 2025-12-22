/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";

const services = [
  {
    name: "Day Pass",
    price: "20€ / dia (+ IVA)",
    imageSrc:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Trabalho em open space",
    details: [
      "Acesso a áreas comuns e open space.",
      "Wi-Fi de alta velocidade.",
      "Zonas lounge e cozinha com café/água.",
      "1x uso de phone booth (mediante disponibilidade).",
      "Suporte da equipa na receção.",
      "Impressões básicas (fair use).",
      "Ideal para freelancers e remote workers a minutos do Porto.",
    ],
    excludes: ["Sem cacifo.", "Sem sala de reuniões dedicada.", "Sem receção de correio/encomendas."],
    conditions: [
      "Horário: 09h-19h, dias úteis.",
      "Lugar rotativo em zona partilhada.",
      "Não requer caução.",
      "Chamadas em phone booth ou zonas indicadas.",
    ],
  },
  {
    name: "Week Pass",
    price: "75€ / semana (+ IVA)",
    imageSrc:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Espaço moderno de coworking",
    details: [
      "Lugar rotativo 5 dias seguidos em mesa partilhada.",
      "Wi-Fi rápido e zonas lounge.",
      "Cozinha com café/água incluídos.",
      "Até 2x reservas de phone booth curtas/dia (sujeito a disponibilidade).",
      "Suporte da equipa na receção.",
      "Impressões básicas (fair use).",
      "Perfeito para trabalhar em Gaia com ligações rápidas ao Porto.",
    ],
    excludes: ["Sem sala de reuniões formal.", "Sem cacifo dedicado.", "Sem receção de correio."],
    conditions: [
      "Horário: 09h-19h, dias úteis.",
      "Sem caução.",
      "Não acumulável com outras semanas.",
      "Chamadas em zonas indicadas.",
    ],
  },
  {
    name: "Half-Day Flex (Manhã/Tarde)",
    price: "12€ / meio-dia (+ IVA)",
    imageSrc:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Ambiente de trabalho calmo",
    details: [
      "Lugar rotativo em zona partilhada.",
      "Wi-Fi rápido e zonas lounge.",
      "Cozinha com café/água.",
      "Suporte da equipa.",
      "Ideal para passagens rápidas entre Gaia e Porto.",
    ],
    excludes: [
      "Sem sala de reuniões.",
      "Sem phone booth reservado.",
      "Sem impressões.",
      "Sem cacifo; sem correio.",
    ],
    conditions: [
      "Manhã 09h-13h ou tarde 14h-19h.",
      "Dias úteis.",
      "Uso silencioso em open space.",
      "Sem caução.",
    ],
  },
  {
    name: "Flex Desk (Mesa Partilhada) · Mensal",
    price: "160€ / mês (+ IVA)",
    imageSrc:
      "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Mesa partilhada para trabalhar",
    details: [
      "Acesso dias úteis 09h-19h.",
      "Lugar rotativo em open space.",
      "Wi-Fi rápido, lounge e cozinha com café/água.",
      "4h/mês sala de reuniões (reserva).",
      "5h/mês phone booth.",
      "Impressões básicas (fair use).",
      "Suporte da equipa.",
    ],
    excludes: ["Sem cacifo dedicado.", "Sem receção de correio/encomendas (opção extra).", "Sem acesso 24/7."],
    conditions: [
      "Permanência mínima 1 mês.",
      "Sem caução para particulares (pode ser solicitada para empresas).",
      "Uso responsável de reuniões/phone booth.",
    ],
  },
  {
    name: "Fixed Desk (Mesa Dedicada) · Mensal",
    price: "220€ / mês (+ IVA)",
    imageSrc:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Secretária dedicada com conforto",
    details: [
      "Posto dedicado com cadeira ergonómica.",
      "Acesso 24/7.",
      "Wi-Fi rápido; lounge; cozinha café/água.",
      "Cacifo incluído.",
      "6h/mês sala de reuniões (reserva).",
      "8h/mês phone booth.",
      "Impressões básicas (fair use) e receção de correio/encomendas.",
      "Suporte da equipa.",
    ],
    excludes: ["Horas extra de sala de reuniões (custo adicional).", "Parking não incluído."],
    conditions: [
      "Permanência mínima 1 mês.",
      "Caução de 1 mês.",
      "Regras de silêncio e chamadas em áreas definidas.",
    ],
  },
  {
    name: "Escritório Virtual · Mensal",
    price: "45€ / mês (+ IVA)",
    imageSrc:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Trabalho remoto e morada fiscal",
    details: [
      "Morada fiscal e comercial em Vila Nova de Gaia.",
      "Receção de correio/encomendas e notificação por email.",
      "2h/mês sala de reuniões em dias úteis (reserva).",
      "Apoio da equipa na receção.",
    ],
    excludes: [
      "Sem lugar de trabalho diário.",
      "Sem acesso ao open space.",
      "Sem phone booth ou impressões incluídas.",
    ],
    conditions: [
      "Permanência mínima 1 mês.",
      "Caução de 1 mês.",
      "Recolha de correio em 09h-19h.",
    ],
  },
  {
    name: "Sala de Reuniões",
    price: "18€ / 1h (+ IVA) · 32€ / 2h (+ IVA)",
    imageSrc:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Sala de reuniões moderna",
    details: [
      "Sala equipada (ecrã/TV ou projeção) com Wi-Fi rápido.",
      "Água/café incluídos.",
      "Apoio da equipa; climatização.",
      "Ideal para equipas locais ou clientes que vêm do Porto.",
    ],
    excludes: ["Sem catering (opcional).", "Sem impressão de grandes volumes."],
    conditions: [
      "Reserva antecipada; dias úteis 09h-19h.",
      "Excedentes faturados por hora.",
      "Cumprir horários e capacidade indicada.",
    ],
  },
];

const notes = [
  "Horário: dias úteis 09h-19h (24/7 apenas mesas dedicadas).",
  "Silêncio/chamadas: phone booths para chamadas; open space silencioso; reuniões em salas dedicadas.",
  "Cancelamentos: passes não reembolsáveis; salas podem ser remarcadas com 24h; planos mensais renovam salvo aviso de 30 dias.",
  "Faturação: emitimos fatura com NIF; valores acrescem IVA à taxa legal em Portugal.",
  "Reservas/adesão: email/telefone/WhatsApp; visitas e tours mediante marcação; disponibilidade limitada.",
];

export default function PrecosPage() {
  const [openKey, setOpenKey] = useState<string | null>(null);

  const items = useMemo(() => services, []);

  return (
    <div className="bg-[#F7F7F5] min-h-screen text-[#1A1A1A]">
      <section className="container mx-auto px-5 py-12 lg:py-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50 mb-3">Preços</p>
          <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight mb-4">Planos Gaia Coworking</h1>
          <p className="text-lg text-black/70">
            A minutos do Porto, com opções pensadas para freelancers, equipas pequenas e remote workers
            que querem flexibilidade e um espaço moderno em Vila Nova de Gaia.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-5 pb-12 lg:pb-16 space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((service) => {
            const isOpen = openKey === service.name;
            return (
              <article
                key={service.name}
                className="group rounded-[28px] bg-white border border-black/5 shadow-soft overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition relative flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-black/5">
                  <img
                    src={service.imageSrc}
                    alt={service.imageAlt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />
                  <div className="absolute left-4 bottom-4 right-4 flex items-end justify-between gap-3">
                    <h2 className="text-lg font-extrabold text-white leading-tight drop-shadow">
                      {service.name}
                    </h2>
                    <span className="shrink-0 inline-flex items-center rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#1A1A1A] shadow-soft">
                      {service.price}
                    </span>
                  </div>
                </div>

                <div
                  className={`p-5 transition flex-1 flex flex-col ${
                    isOpen ? "blur-sm opacity-60 pointer-events-none select-none" : ""
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50 mb-3">
                    Destaques
                  </p>
                  <div className="flex-1">
                    <ul className="space-y-2 text-sm text-black/80">
                      {service.details.slice(0, 3).map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-hidden />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto pt-5 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setOpenKey((prev) => (prev === service.name ? null : service.name))}
                      className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[#1A1A1A] hover:bg-[#F7F7F5] transition"
                      aria-expanded={isOpen}
                    >
                      Ver detalhes
                      <svg
                        className="h-4 w-4 transition-transform"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden
                      >
                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    <a
                      href="mailto:hello@gaiacoworking.pt"
                      className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:shadow-md transition-shadow"
                    >
                      Reservar
                    </a>
                  </div>
                </div>

                {isOpen && (
                  <div className="absolute inset-0 z-10">
                    <button
                      type="button"
                      aria-label="Fechar detalhes"
                      onClick={() => setOpenKey(null)}
                      className="absolute inset-0 bg-white/70 backdrop-blur-md"
                    />

                    <div className="absolute inset-3 rounded-[24px] bg-white shadow-2xl shadow-black/20 border border-black/10 overflow-hidden flex flex-col">
                      <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-purple-600" />
                      <div className="px-4 py-3 border-b border-black/5 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                            Detalhes
                          </p>
                          <p className="text-base font-extrabold leading-tight truncate">{service.name}</p>
                          <span className="mt-2 inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1 text-[11px] font-semibold text-white shadow-soft">
                            {service.price}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setOpenKey(null)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white hover:bg-[#F7F7F5] transition"
                          aria-label="Fechar"
                        >
                          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
                            <path strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                          </svg>
                        </button>
                      </div>

                      <div className="gc-scrollbar flex-1 min-h-0 overflow-auto px-4 py-4 space-y-4">
                        <section className="rounded-2xl bg-[#F7F7F5] border border-black/5 p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-soft">
                              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                                <path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
                              </svg>
                            </span>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/50">
                              Inclui
                            </p>
                          </div>
                          <ul className="space-y-2 text-[13px] leading-relaxed text-black/80">
                            {service.details.map((item) => (
                              <li key={item} className="flex gap-2">
                                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-hidden />
                                <span className="min-w-0">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </section>

                        <div className="grid gap-4">
                          <section className="rounded-2xl bg-white border border-black/5 p-4 shadow-soft">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-black/10 text-black/70">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                                  <path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                                </svg>
                              </span>
                              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/50">
                                Não inclui
                              </p>
                            </div>
                            <ul className="space-y-2 text-[13px] leading-relaxed text-black/80">
                              {service.excludes.map((item) => (
                                <li key={item} className="flex gap-2">
                                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-black/25" aria-hidden />
                                  <span className="min-w-0">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </section>

                          <section className="rounded-2xl bg-white border border-black/5 p-4 shadow-soft">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-soft">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                                  <path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                                </svg>
                              </span>
                              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/50">
                                Condições
                              </p>
                            </div>
                            <ul className="space-y-2 text-[13px] leading-relaxed text-black/80">
                              {service.conditions.map((item) => (
                                <li key={item} className="flex gap-2">
                                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-hidden />
                                  <span className="min-w-0">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </section>
                        </div>
                      </div>

                      <div className="px-4 py-3 border-t border-black/5 bg-white flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setOpenKey(null)}
                          className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[#1A1A1A] hover:bg-[#F7F7F5] transition"
                        >
                          Fechar
                        </button>
                        <a
                          href="mailto:hello@gaiacoworking.pt"
                          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:shadow-md transition-shadow"
                        >
                          Reservar
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="container mx-auto px-5 pb-16">
        <div className="rounded-[28px] bg-white border border-black/5 shadow-soft overflow-hidden">
          <div className="px-6 py-5 lg:px-8 lg:py-6 border-b border-black/5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
              Notas gerais
            </p>
            <p className="mt-2 text-base font-semibold text-black/80">
              Detalhes importantes sobre horários, silêncio e faturação.
            </p>
          </div>
          <div className="px-6 py-6 lg:px-8 lg:py-7">
            <ul className="grid gap-3 md:grid-cols-2 text-sm text-black/80">
              {notes.map((item) => (
                <li key={item} className="flex gap-3 rounded-2xl bg-[#F7F7F5] p-4 border border-black/5">
                  <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-soft shrink-0">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                      <path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
                    </svg>
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

