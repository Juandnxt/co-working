/* eslint-disable @next/next/no-img-element */
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function EspacosPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations();

  const spaces = locale === "en"
    ? [
        {
          title: "Flexible Spot (Open Space)",
          desc: "Bright environment for focus and community — choose an available table and start working.",
          highlights: ["Fast Wi‑Fi", "Shared table", "Flexible daily access", "From 14€ + VAT"],
          image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Fixed Spot (Dedicated Table)",
          desc: "Your fixed spot with more privacy and comfort for routine and productivity.",
          highlights: ["Fixed spot", "More privacy", "24/7 access (plans)", "From 150€ + VAT/month"],
          image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Fixed Table (Exclusive)",
          desc: "Table reserved exclusively for you, with access to printer and common space.",
          highlights: ["Exclusive table", "Printer included", "Common space", "From 170€ + VAT/month"],
          image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Private Office",
          desc: "For teams, clients and important decisions — total privacy to work or receive.",
          highlights: ["Total privacy", "1-3 people", "Meeting room", "From 180€ + VAT/month"],
          image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Large Meeting Room",
          desc: "For teams, clients and important decisions — book by the hour and enter.",
          highlights: ["Up to 8 people", "Monitor/projector", "Good acoustics", "20€ + VAT/hour"],
          image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Small Meeting Room",
          desc: "Calls without noise and interruptions, with privacy and good lighting.",
          highlights: ["1-2 people", "Privacy", "Reservable", "12€ + VAT/hour"],
          image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Kitchen / Coffee Point",
          desc: "Coffee, water and micro-moments that help your day flow.",
          highlights: ["Coffee/water", "Refrigerator", "Quick meals", "Included in plans"],
          image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Lounge Area",
          desc: "Comfortable breaks and networking — great for quick conversations and rest.",
          highlights: ["Comfortable sofas", "Social area", "Calm environment", "Free access"],
          image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
        },
      ]
    : [
        {
          title: "Lugar Flexível (Open Space)",
          desc: "Ambiente luminoso para foco e comunidade — escolhe uma mesa disponível e começa a trabalhar.",
          highlights: ["Wi‑Fi rápido", "Mesa partilhada", "Acesso diário flexível", "Desde 14€ + IVA"],
          image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Lugar Fixo (Mesa Dedicada)",
          desc: "O teu lugar fixo com mais privacidade e conforto para rotina e produtividade.",
          highlights: ["Posto fixo", "Mais privacidade", "Acesso 24/7 (planos)", "Desde 150€ + IVA/mês"],
          image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Mesa Fixa (Exclusiva)",
          desc: "Mesa reservada exclusivamente para ti, com acesso à impressora e espaço comum.",
          highlights: ["Mesa exclusiva", "Impressora incluída", "Espaço comum", "Desde 170€ + IVA/mês"],
          image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Escritório Privado",
          desc: "Para equipas, clientes e decisões importantes — privacidade total para trabalhar ou receber.",
          highlights: ["Privacidade total", "1-3 pessoas", "Sala reuniões", "Desde 180€ + IVA/mês"],
          image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Sala de Reuniões Grande",
          desc: "Para equipas, clientes e decisões importantes — reserva por hora e entra.",
          highlights: ["Até 8 pessoas", "Monitor/projetor", "Boa acústica", "20€ + IVA/hora"],
          image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Sala de Reuniões Pequena",
          desc: "Chamadas sem ruído e sem interrupções, com privacidade e boa iluminação.",
          highlights: ["1-2 pessoas", "Privacidade", "Reservável", "12€ + IVA/hora"],
          image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Cozinha / Coffee Point",
          desc: "Café, água e micro‑momentos que ajudam o teu dia a fluir.",
          highlights: ["Café/água", "Frigorífico", "Refeições rápidas", "Incluído em planos"],
          image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Zona Lounge",
          desc: "Pausas confortáveis e networking — ótimo para conversas rápidas e descanso.",
          highlights: ["Sofás confortáveis", "Zona social", "Ambiente calmo", "Acesso livre"],
          image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
        },
      ];

  return (
    <div className="bg-[#F7F7F5] min-h-screen text-[#1A1A1A]">
      <section className="container mx-auto px-5 py-12 lg:py-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50 mb-3">
            {t("espacos.page.label")}
          </p>
          <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight mb-4">
            {t("espacos.page.title")}
          </h1>
          <p className="text-lg text-black/70">
            {t("espacos.page.subtitle")}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-5 pb-12 lg:pb-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {spaces.map((space) => (
            <article
              key={space.title}
              className="group overflow-hidden rounded-[28px] bg-white border border-black/5 shadow-soft hover:shadow-lg hover:-translate-y-0.5 transition"
            >
              <div className="relative aspect-[16/10] bg-black/5">
                <img
                  src={space.image}
                  alt={space.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0" />
                <div className="absolute left-4 bottom-4 right-4">
                  <p className="text-white text-base font-extrabold leading-tight drop-shadow">
                    {space.title}
                  </p>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <p className="text-sm text-black/70 leading-relaxed">{space.desc}</p>
                <ul className="space-y-2 text-sm text-black/80">
                  {space.highlights.map((h, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-hidden />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
