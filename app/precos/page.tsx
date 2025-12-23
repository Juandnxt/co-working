"use client";

import { useState } from "react";

// Product types with subtypes and images
const products = [
  {
    id: "lugar-flexivel",
    type: "Mesas partilhadas (hot desks)",
    description: "Flexibilidade total: escolhe uma mesa disponível e muda quando quiseres.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
    highlights: ["Sem fidelização", "Ideal para day pass", "Networking natural"],
    subtypes: [
      { name: "Passe Diário", unit: "Dia", price: "14€" },
      { name: "Passe Semanal", unit: "Semana", price: "30€" },
      { name: "Pack 3 dias", unit: "Pack", price: "55€" },
      { name: "Pack 5 dias", unit: "Pack", price: "60€" },
      { name: "Pack 10 dias", unit: "Pack", price: "110€" },
    ],
  },
  {
    id: "lugar-fixo",
    type: "Lugar Fixo",
    description: "O teu lugar garantido: cadeira reservada exclusivamente para ti numa mesa partilhada.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80",
    highlights: ["Lugar sempre disponível", "Mesa partilhada", "Comunidade fixa"],
    subtypes: [
      { name: "Mensal", unit: "Mês", price: "150€" },
      { name: "Semanal", unit: "Semana", price: "50€" },
    ],
  },
  {
    id: "mesa-fixa",
    type: "Mesa Fixa",
    description: "Privacidade e espaço próprio: mesa reservada exclusivamente para ti.",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80",
    highlights: ["Mesa exclusiva", "Impressora incluída", "Espaço comum"],
    subtypes: [
      { name: "Mensal", unit: "Mês", price: "170€" },
      { name: "Semanal", unit: "Semana", price: "70€" },
      { name: "Full-time Premium", unit: "Mensal", price: "180€" },
    ],
  },
  {
    id: "part-time",
    type: "Part-time",
    description: "Flexível e económico: acesso parcial para quem não precisa de estar todos os dias.",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80",
    highlights: ["Dias à escolha", "Café incluído", "Sala reuniões"],
    subtypes: [
      { name: "Pack 2 dias/semana", unit: "Mensal", price: "85€" },
      { name: "Pack 10 dias/mês", unit: "Mensal", price: "110€" },
    ],
  },
];

function ProductCard({ product }: { product: typeof products[0] }) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="relative rounded-[24px] overflow-hidden shadow-soft bg-white border border-black/5 flex flex-col">
      {/* Background image */}
      <div className="relative aspect-[16/9] overflow-hidden shrink-0">
        <img
          src={product.image}
          alt={product.type}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute left-5 bottom-5 right-5">
          <h2 className="text-xl lg:text-2xl font-extrabold text-white drop-shadow-lg">
            {product.type}
          </h2>
        </div>
      </div>

      {/* Default content - always in flow to maintain height */}
      <div className={`p-5 lg:p-6 flex-1 flex flex-col transition-opacity duration-300 ${showOptions ? "invisible" : "visible"}`}>
        <p className="text-base text-black/70 mb-4 leading-relaxed">
          {product.description}
        </p>
        
        {/* Highlights */}
        <ul className="space-y-2 mb-5">
          {product.highlights.map((h, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm text-black/80">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" aria-hidden />
              <span>{h}</span>
            </li>
          ))}
        </ul>

        {/* Opções button */}
        <button
          onClick={() => setShowOptions(true)}
          className="mt-auto w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:shadow-lg transition-all cursor-pointer"
        >
          Ver Opções
        </button>
      </div>

      {/* Options overlay - positioned over content area only */}
      <div 
        className={`absolute inset-0 top-0 transition-all duration-300 ${
          showOptions ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Dark background */}
        <div className="absolute inset-0 bg-[#1A1A1A] rounded-[24px]" />

        {/* Options content */}
        <div className="relative z-10 h-full p-5 lg:p-6 text-white flex flex-col">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-lg font-bold">
              {product.type}
            </h3>
          </div>

          {/* Pricing options with minimal scrollbar */}
          <div className="flex-1 space-y-2 overflow-y-auto scrollbar-thin pr-1">
            {product.subtypes.map((subtype, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-medium text-white">{subtype.name}</span>
                  <span className="text-xs text-white/50">
                    {subtype.unit}
                  </span>
                </div>
                <span className="text-sm font-bold text-white">
                  {subtype.price}
                </span>
              </div>
            ))}
          </div>

          {/* IVA note */}
          <p className="mt-3 text-xs text-white/40 text-center">
            + IVA
          </p>

          {/* Close button */}
          <button
            onClick={() => setShowOptions(false)}
            className="mt-3 w-full flex items-center justify-center gap-1 p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-colors cursor-pointer"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PrecosPage() {
  return (
    <div className="bg-[#F7F7F5] min-h-screen text-[#1A1A1A]">
      {/* Minimal scrollbar styles */}
      <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>

      {/* Header */}
      <section className="container mx-auto px-5 py-12 lg:py-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50 mb-3">
            Preços
          </p>
          <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight mb-4">
            Planos Gaia Coworking
          </h1>
          <p className="text-lg text-black/70">
            Escolhe a opção perfeita para o teu trabalho. Desde lugares flexíveis até mesas
            dedicadas, temos o espaço ideal para ti em Vila Nova de Gaia.
          </p>
        </div>
      </section>

      {/* Product Cards - Grid layout */}
      <section className="container mx-auto px-5 pb-12 lg:pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-5 pb-16">
        <div className="rounded-[24px] bg-gradient-to-r from-blue-600 to-purple-600 p-8 lg:p-12 text-white text-center">
          <h2 className="text-2xl lg:text-3xl font-extrabold mb-4">
            Tens dúvidas sobre qual plano escolher?
          </h2>
          <p className="text-lg text-white/80 mb-6 max-w-xl mx-auto">
            Fala connosco e ajudamos-te a encontrar a solução perfeita para o teu trabalho.
          </p>
          <a
            href="mailto:hello@gaiacoworking.pt"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-soft hover:shadow-md transition-shadow"
          >
            Contactar
          </a>
        </div>
      </section>
    </div>
  );
}
