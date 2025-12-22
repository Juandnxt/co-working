/* eslint-disable @next/next/no-img-element */

const spaces = [
  {
    title: "Open Space (mesas partilhadas)",
    desc: "Ambiente luminoso para foco e comunidade — chega, senta-te e começa a trabalhar.",
    highlights: ["Wi‑Fi rápido", "Lounge + cozinha", "Acesso diário flexível"],
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Secretária individual (mesa dedicada)",
    desc: "O teu lugar fixo com mais privacidade e conforto para rotina e produtividade.",
    highlights: ["Posto fixo", "Mais privacidade", "Acesso 24/7 (planos)"],
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Mesas partilhadas (hot desks)",
    desc: "Flexibilidade total: escolhe uma mesa disponível e muda quando quiseres.",
    highlights: ["Sem fidelização", "Ideal para day pass", "Networking natural"],
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Sala de Reuniões",
    desc: "Para equipas, clientes e decisões importantes — reserva por hora e entra.",
    highlights: ["Ecrã/TV", "Boa acústica", "Café/água"],
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Sala de videochamada (phone booth)",
    desc: "Chamadas sem ruído e sem interrupções, com privacidade e boa iluminação.",
    highlights: ["Privacidade", "Reservável", "Perfeita para calls"],
    image:
      "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Restaurante (perto) + almoço fácil",
    desc: "Opções de almoço a poucos minutos — ideal para recarregar energias.",
    highlights: ["Restaurantes próximos", "Cafés", "Takeaway"],
    image:
      "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Cozinha / coffee point",
    desc: "Café, água e micro‑momentos que ajudam o teu dia a fluir.",
    highlights: ["Café/água", "Frigorífico", "Refeições rápidas"],
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Zona lounge",
    desc: "Pausas confortáveis e networking — ótimo para conversas rápidas e descanso.",
    highlights: ["Sofás confortáveis", "Zona social", "Ambiente calmo"],
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
  },
];

export default function EspacosPage() {
  return (
    <div className="bg-[#F7F7F5] min-h-screen text-[#1A1A1A]">
      <section className="container mx-auto px-5 py-12 lg:py-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50 mb-3">
            Espaços
          </p>
          <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight mb-4">
            Encontra o espaço certo para o teu dia
          </h1>
          <p className="text-lg text-black/70">
            8 ambientes diferentes — desde mesas partilhadas a salas para reuniões e videochamadas.
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
    </div>
  );
}


