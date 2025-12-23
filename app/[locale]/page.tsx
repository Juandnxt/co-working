/* eslint-disable @next/next/no-img-element */
import ChatOpenLink from "@/app/components/ChatOpenLink";
import { getTranslations } from "next-intl/server";

const heroImage =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1800&q=80";

const galleryTop = [
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
];

const galleryBottom = [
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
];

function IconBullet() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 shadow-soft">
      <svg
        aria-hidden
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations();

  // Datos traducibles
  const facilities = locale === "en" 
    ? ["Fast Wi-Fi", "Meeting room", "Phone booths", "Equipped kitchen", "Lockers", "Printing", "Package reception", "Secure access"]
    : ["Wi-Fi rápido", "Sala de reuniões", "Cabines para chamadas", "Cozinha equipada", "Cacifos", "Impressão", "Receção de encomendas", "Acesso seguro"];

  const valueHighlights = locale === "en"
    ? [
        { title: "Membership Plans", desc: "Flexible options for teams and freelancers." },
        { title: "Dedicated offices", desc: "Privacy with access to the Gaia community." },
      ]
    : [
        { title: "Planos de Membership", desc: "Opções flexíveis para equipas e freelancers." },
        { title: "Escritórios dedicados", desc: "Privacidade com acesso à comunidade Gaia." },
      ];

  const commute = locale === "en"
    ? [
        { label: "Metro", desc: "Quickly connects to Porto" },
        { label: "Parking", desc: "Nearby parks and streets" },
        { label: "Cafes", desc: "Restaurants and coffee spots" },
        { label: "Access", desc: "Ponte do Infante and A1" },
      ]
    : [
        { label: "Metro", desc: "Liga rapidamente ao Porto" },
        { label: "Estacionamento", desc: "Parques e ruas próximas" },
        { label: "Cafés", desc: "Restaurantes e coffee spots" },
        { label: "Acessos", desc: "Ponte do Infante e A1" },
      ];

  const spaces = locale === "en"
    ? [
        {
          title: "Open Space (shared tables)",
          desc: "Bright environment for focus and community — arrive, sit down and start working.",
          highlights: ["Fast Wi‑Fi", "Lounge + kitchen", "Flexible daily access"],
          image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Individual desk (dedicated table)",
          desc: "Your fixed spot with more privacy and comfort for routine and productivity.",
          highlights: ["Fixed spot", "More privacy", "24/7 access (plans)"],
          image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Shared tables (hot desks)",
          desc: "Total flexibility: choose an available table and change whenever you want.",
          highlights: ["No commitment", "Ideal for day pass", "Natural networking"],
          image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Meeting Room",
          desc: "For teams, clients and important decisions — book by the hour and enter.",
          highlights: ["Screen/TV", "Good acoustics", "Coffee/water"],
          image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Video call room (phone booth)",
          desc: "Calls without noise and interruptions, with privacy and good lighting.",
          highlights: ["Privacy", "Reservable", "Perfect for calls"],
          image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Restaurant (nearby) + easy lunch",
          desc: "Lunch options a few minutes away — ideal for recharging.",
          highlights: ["Nearby restaurants", "Cafes", "Takeaway"],
          image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Kitchen / coffee point",
          desc: "Coffee, water and micro-moments that help your day flow.",
          highlights: ["Coffee/water", "Refrigerator", "Quick meals"],
          image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Lounge area",
          desc: "Comfortable breaks and networking — great for quick conversations and rest.",
          highlights: ["Comfortable sofas", "Social area", "Calm environment"],
          image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
        },
      ]
    : [
        {
          title: "Open Space (mesas partilhadas)",
          desc: "Ambiente luminoso para foco e comunidade — chega, senta-te e começa a trabalhar.",
          highlights: ["Wi‑Fi rápido", "Lounge + cozinha", "Acesso diário flexível"],
          image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Secretária individual (mesa dedicada)",
          desc: "O teu lugar fixo com mais privacidade e conforto para rotina e produtividade.",
          highlights: ["Posto fixo", "Mais privacidade", "Acesso 24/7 (planos)"],
          image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Mesas partilhadas (hot desks)",
          desc: "Flexibilidade total: escolhe uma mesa disponível e muda quando quiseres.",
          highlights: ["Sem fidelização", "Ideal para day pass", "Networking natural"],
          image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Sala de Reuniões",
          desc: "Para equipas, clientes e decisões importantes — reserva por hora e entra.",
          highlights: ["Ecrã/TV", "Boa acústica", "Café/água"],
          image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Sala de videochamada (phone booth)",
          desc: "Chamadas sem ruído e sem interrupções, com privacidade e boa iluminação.",
          highlights: ["Privacidade", "Reservável", "Perfeita para calls"],
          image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Restaurante (perto) + almoço fácil",
          desc: "Opções de almoço a poucos minutos — ideal para recarregar energias.",
          highlights: ["Restaurantes próximos", "Cafés", "Takeaway"],
          image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Cozinha / coffee point",
          desc: "Café, água e micro‑momentos que ajudam o teu dia a fluir.",
          highlights: ["Café/água", "Frigorífico", "Refeições rápidas"],
          image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80",
        },
        {
          title: "Zona lounge",
          desc: "Pausas confortáveis e networking — ótimo para conversas rápidas e descanso.",
          highlights: ["Sofás confortáveis", "Zona social", "Ambiente calmo"],
          image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
        },
      ];

  return (
    <div className="bg-[#F7F7F5] text-[#1A1A1A] min-h-screen">
      <main className="">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="blur-blob bg-blue-600/20 left-[-10%] top-[-10%]" />
          <div className="blur-blob bg-purple-600/15 right-[-12%] top-[20%]" />
          <div className="blur-blob bg-white/40 right-[10%] bottom-[-20%]" />
        </div>

        <section
          className="relative isolate overflow-hidden rounded-b-[48px] bg-[#0F0F0F] text-white"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.55)), url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container mx-auto px-5 py-16 lg:py-24">
            <div className="max-w-3xl space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                {t("hero.location")}
              </p>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight">
                {t("hero.title")}
              </h1>
              <p className="text-lg lg:text-xl text-white/80 max-w-2xl">
                {t("hero.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#reservar"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 hover:shadow-xl transition-shadow"
                >
                  {t("hero.bookTour")}
                </a>
                <ChatOpenLink
                  href="#day-pass"
                  flow="daypass"
                  className="inline-flex items-center justify-center rounded-full border border-blue-400 bg-white/5 px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-white/10 transition-colors"
                >
                  {t("hero.dayPass")}
                </ChatOpenLink>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-5 py-12 lg:py-16" id="espacos">
          <div className="mb-8 lg:mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50 mb-3">
              {t("spaces.title")}
            </p>
            <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight">
              {t("spaces.subtitle")}
            </h2>
            <p className="mt-3 text-base lg:text-lg text-black/70 max-w-3xl">
              {t("spaces.description")}
            </p>
          </div>

          <div className="grid gap-4 rounded-[32px] bg-white p-4 shadow-soft lg:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {galleryTop.map((src, idx) => (
                <div key={src} className="overflow-hidden rounded-3xl shadow-soft">
                  <img
                    src={src}
                    alt={idx === 0 ? (locale === "en" ? "Open space Gaia Coworking" : "Open space Gaia Coworking") : (locale === "en" ? "Gaia meeting room" : "Sala de reuniões Gaia")}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {galleryBottom.map((src, idx) => (
                <div key={src} className="overflow-hidden rounded-3xl shadow-soft">
                  <img
                    src={src}
                    alt={locale === "en" ? `Gaia Coworking environment ${idx + 1}` : `Gaia Coworking ambiente ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 lg:mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                    {space.highlights.map((h) => (
                      <li key={h} className="flex gap-2">
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

        <section className="container mx-auto px-5 py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="relative">
              <div className="rounded-[28px] overflow-hidden shadow-soft">
                <img
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1400&q=80"
                  alt={locale === "en" ? "Gaia Coworking Lounge" : "Lounge Gaia Coworking"}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="relative">
              <div className="rounded-[32px] bg-gradient-to-br from-blue-600 to-purple-600 p-8 lg:p-10 shadow-soft text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 mb-3">
                  {t("productivity.title")}
                </p>
                <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight mb-5">
                  {t("productivity.subtitle")}
                </h2>
                <p className="text-base lg:text-lg font-medium text-white/80 leading-relaxed">
                  {t("productivity.description")}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-5 py-12 lg:py-16" id="precos">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                {t("facilities.title")}
              </p>
              <h3 className="text-3xl lg:text-4xl font-extrabold leading-tight">
                {t("facilities.subtitle")}
              </h3>
              <p className="text-base lg:text-lg text-black/70">
                {t("facilities.description")}
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {facilities.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-soft"
                  >
                    <IconBullet />
                    <span className="text-sm font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-[32px] shadow-soft">
                <img
                  src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80"
                  alt={locale === "en" ? "Lounge and work at Gaia" : "Lounge e trabalho em Gaia"}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute left-6 bottom-6 max-w-xs rounded-3xl bg-white/90 backdrop-blur p-5 shadow-xl border border-white/70">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50 mb-2">
                  {locale === "en" ? "Everything you need" : "Tudo o que precisas"}
                </p>
                <p className="text-sm font-medium text-black/80">
                  {locale === "en" 
                    ? "On-site support, welcoming community and a calm space to deliver your best work."
                    : "Suporte presencial, comunidade acolhedora e um espaço calmo para entregar o teu melhor trabalho."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-5 py-12 lg:py-16" id="day-pass">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="relative">
              <div className="overflow-hidden rounded-[32px] shadow-soft">
                <img
                  src="https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&w=1400&q=80"
                  alt={locale === "en" ? "Work space at Gaia" : "Espaço de trabalho em Gaia"}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -top-6 left-6 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-soft">
                {t("prices.flexible")}
              </div>
            </div>
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                {t("prices.title")}
              </p>
              <h3 className="text-3xl lg:text-4xl font-extrabold leading-tight">
                {t("prices.subtitle")}
              </h3>
              <p className="text-base lg:text-lg text-black/70">
                {t("prices.description")}
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {valueHighlights.map((item) => (
                  <div key={item.title} className="flex gap-3 rounded-2xl bg-white p-4 shadow-soft">
                    <IconBullet />
                    <div className="space-y-1">
                      <p className="text-sm font-bold">{item.title}</p>
                      <p className="text-sm text-black/70">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a
                href={`/${locale}/precos`}
                className="inline-flex items-center gap-2 rounded-full border border-blue-600 px-5 py-3 text-sm font-semibold text-blue-700 shadow-soft hover:bg-blue-50 transition-colors"
              >
                {t("prices.viewPrices")}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-5 py-12 lg:py-16" id="contacto">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center rounded-[32px] bg-white p-8 shadow-soft">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                {t("location.title")}
              </p>
              <h3 className="text-3xl lg:text-4xl font-extrabold leading-tight">
                {t("location.subtitle")}
              </h3>
              <p className="text-base lg:text-lg text-black/70">
                {t("location.description")}
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {commute.map((item) => (
                  <div key={item.label} className="flex items-start gap-3 rounded-2xl bg-[#F7F7F5] p-3">
                    <IconBullet />
                    <div>
                      <p className="text-sm font-bold">{item.label}</p>
                      <p className="text-sm text-black/70">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="overflow-hidden rounded-[28px] bg-[#0F0F0F] text-white shadow-soft">
                <div className="h-64 w-full bg-gradient-to-br from-[#1F1F1F] to-[#111] relative">
                  <div className="absolute inset-0 flex items-center justify-center text-sm text-white/70">
                    {locale === "en" ? "Map and directions (placeholder)" : "Mapa e direções (placeholder)"}
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                    {t("location.address")}
                  </p>
                  <p className="text-lg font-bold">Gaia Coworking</p>
                  <p className="text-sm text-white/80">
                    {t("location.addressLine2")}
                  </p>
                  <p className="text-sm text-white/70">{t("location.addressLine3")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden px-5 pb-16" id="reservar">
          <div className="container mx-auto">
            <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-blue-600 to-purple-600 shadow-soft">
              <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/30 blur-3xl" />
              <div className="absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-white/20 blur-3xl" />
              <div className="relative px-8 py-12 lg:px-12 lg:py-16 text-white">
                <h3 className="text-3xl lg:text-4xl font-extrabold mb-4">
                  {t("cta.title")}
                </h3>
                <p className="text-base lg:text-lg text-white/80 mb-6 max-w-2xl">
                  {t("cta.description")}
                </p>
                <a
                  href="mailto:hello@gaiacoworking.pt"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-soft hover:shadow-md transition-shadow"
                >
                  {t("cta.bookVisit")}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
