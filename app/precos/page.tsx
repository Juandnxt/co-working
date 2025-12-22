/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

// Datos organizados por categorías con imágenes
const ofertas = [
  {
    title: "Lugar Flexível - Passe Diário",
    desc: "Um lugar disponível em qualquer mesa",
    highlights: ["14€ + IVA", "Por dia", "Mesa partilhada", "Flexibilidade total"],
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80",
    tipo: "Lugar Flexível",
    subtipo: "Passe Diário",
    preco: "14€ + IVA",
    unidade: "Dia"
  },
  {
    title: "Lugar Flexível - Passe Semanal",
    desc: "Uso de qualquer lugar disponível durante 1 semana, mesa partilhada",
    highlights: ["30€ + IVA", "Por semana", "Mesa partilhada", "5 dias úteis"],
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
    tipo: "Lugar Flexível",
    subtipo: "Passe Semanal",
    preco: "30€ + IVA",
    unidade: "Semana"
  },
  {
    title: "Lugar Flexível - Pack 3 dias",
    desc: "Uso de qualquer lugar disponível em 3 dias à escolha, mesa partilhada",
    highlights: ["55€ + IVA", "Pack 3 dias", "À escolha", "Mesa partilhada"],
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    tipo: "Lugar Flexível",
    subtipo: "Pack 3 dias",
    preco: "55€ + IVA",
    unidade: "Pack"
  },
  {
    title: "Lugar Flexível - Pack 5 dias",
    desc: "Uso de qualquer lugar disponível em 5 dias à escolha, mesa partilhada",
    highlights: ["60€ + IVA", "Pack 5 dias", "À escolha", "Mesa partilhada"],
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80",
    tipo: "Lugar Flexível",
    subtipo: "Pack 5 dias",
    preco: "60€ + IVA",
    unidade: "Pack"
  },
  {
    title: "Lugar Flexível - Pack 10 dias",
    desc: "Uso de qualquer lugar disponível em 10 dias à escolha, mesa partilhada",
    highlights: ["110€ + IVA", "Pack 10 dias", "À escolha", "Mesa partilhada"],
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80",
    tipo: "Lugar Flexível",
    subtipo: "Pack 10 dias",
    preco: "110€ + IVA",
    unidade: "Pack"
  },
  {
    title: "Lugar Fixo - Mensal",
    desc: "Cadeira fixa numa mesa partilhada, sempre reservada para a pessoa durante o mês",
    highlights: ["150€ + IVA", "Por mês", "Lugar fixo", "Mesa partilhada"],
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80",
    tipo: "Lugar Fixo",
    subtipo: "Mensal",
    preco: "150€ + IVA",
    unidade: "Mês"
  },
  {
    title: "Lugar Fixo - Semanal",
    desc: "Cadeira fixa numa mesa partilhada, sempre reservada para a pessoa durante uma semana",
    highlights: ["50€ + IVA", "Por semana", "Lugar fixo", "Mesa partilhada"],
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80",
    tipo: "Lugar Fixo",
    subtipo: "Semanal",
    preco: "50€ + IVA",
    unidade: "Semana"
  },
  {
    title: "Mesa Fixa - Mensal",
    desc: "Mesa reservada exclusivamente para uma pessoa durante 1 mês, acesso à impressora e espaço comum",
    highlights: ["170€ + IVA", "Por mês", "Mesa exclusiva", "Impressora incluída"],
    image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=1600&q=80",
    tipo: "Mesa Fixa",
    subtipo: "Mensal",
    preco: "170€ + IVA",
    unidade: "Mês"
  },
  {
    title: "Mesa Fixa - Semanal",
    desc: "Mesa reservada exclusivamente para uma pessoa durante 1 semana, acesso à impressora e espaço comum",
    highlights: ["70€ + IVA", "Por semana", "Mesa exclusiva", "Impressora incluída"],
    image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1600&q=80",
    tipo: "Mesa Fixa",
    subtipo: "Semanal",
    preco: "70€ + IVA",
    unidade: "Semana"
  },
  {
    title: "Mesa Fixa - Full-time Premium",
    desc: "Mesa fixa com acesso 24/7, impressão incluída, cacifo/locker individual, café e água gratuitos",
    highlights: ["180€ + IVA", "Por mês", "Acesso 24/7", "Premium completo"],
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80",
    tipo: "Mesa Fixa",
    subtipo: "Full - time premium (24/7 + impressão + lockers)",
    preco: "180€ + IVA",
    unidade: "Mensal"
  },
  {
    title: "Part-time - Pack 2 dias",
    desc: "Acesso 2 dias por semana (09:00–19:00), mesa flexível, café e água incluídos",
    highlights: ["85€ + IVA", "Por dia", "2 dias/semana", "Café incluído"],
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
    tipo: "Part-time (2 dias p/semana)",
    subtipo: "Pack 2 dias",
    preco: "85€ + IVA",
    unidade: "Dia"
  },
  {
    title: "Part-time - Pack 10 dias",
    desc: "Acesso a qualquer 10 dias no mês, mesa flexível, café e água incluídos; 8h mensais gratuitas na sala de reuniões",
    highlights: ["110€ + IVA", "Mensal", "10 dias/mês", "Sala reuniões incluída"],
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    tipo: "Part-time (10 dias p/mês)",
    subtipo: "Pack 10 dias",
    preco: "110€ + IVA",
    unidade: "Mensal"
  }
];

const escritorios = [
  {
    title: "Escritório Privado Pequeno 1",
    desc: "Escritório privado para 1 pessoa, ideal para trabalhar sozinho, acesso a impressora e espaço comum",
    highlights: ["180€ + IVA", "Por mês", "1 pessoa", "Impressora incluída"],
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80",
    tipo: "Escritório Privado",
    subtipo: "Pequeno 1",
    preco: "180€ + IVA",
    unidade: "Mês",
    capacidade: "1 pessoa"
  },
  {
    title: "Escritório Privado Pequeno 2",
    desc: "Escritório privado para 1 pessoa, ideal para trabalhar sozinho, acesso a impressora e espaço comum",
    highlights: ["180€ + IVA", "Por mês", "1 pessoa", "Impressora incluída"],
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80",
    tipo: "Escritório Privado",
    subtipo: "Pequeno 2",
    preco: "180€ + IVA",
    unidade: "Mês",
    capacidade: "1 pessoa"
  },
  {
    title: "Escritório Privado Médio",
    desc: "Escritório privado para 1 pessoas, adequado para trabalhar sozinho ou receber 1 convidado, acesso a impressora e sala de reuniões",
    highlights: ["200€ + IVA", "Por mês", "2 pessoas", "Sala reuniões"],
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80",
    tipo: "Escritório Privado",
    subtipo: "Médio",
    preco: "200€ + IVA",
    unidade: "Mês",
    capacidade: "2 pessoas"
  },
  {
    title: "Escritório Privado Maior",
    desc: "Escritório privado maior para 2–3 pessoas, para trabalhar ou receber convidados, acesso a impressora, sala de reuniões e espaço comum",
    highlights: ["230€ + IVA", "Por mês", "2-3 pessoas", "Espaço completo"],
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80",
    tipo: "Escritório Privado",
    subtipo: "Maior",
    preco: "230€ + IVA",
    unidade: "Mês",
    capacidade: "2-3 pessoas"
  },
  {
    title: "Escritório Privado Pequeno (Hora)",
    desc: "Escritório privado para realizar reunião online, trabalhar sozinho",
    highlights: ["10€ + IVA", "Por hora", "1 pessoa", "Ideal para calls"],
    image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=1600&q=80",
    tipo: "Escritório Privado",
    subtipo: "Pequeno",
    preco: "10€ + IVA",
    unidade: "Hora",
    capacidade: "1 pessoa"
  },
  {
    title: "Escritório Privado Pequeno (Dia)",
    desc: "Escritório privado para realizar reunião online, trabalhar sozinho",
    highlights: ["35€ + IVA", "Por dia", "1 pessoa", "Ideal para calls"],
    image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1600&q=80",
    tipo: "Escritório Privado",
    subtipo: "Pequeno",
    preco: "35€ + IVA",
    unidade: "Dia",
    capacidade: "1 pessoa"
  },
  {
    title: "Escritório Privado Médio (Hora)",
    desc: "Escritório privado para 1–2 pessoas, reservado por dia, ideal para trabalhar ou receber alguém",
    highlights: ["12€ + IVA", "Por hora", "1-2 pessoas", "Flexível"],
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80",
    tipo: "Escritório Privado",
    subtipo: "Médio",
    preco: "12€ + IVA",
    unidade: "Hora",
    capacidade: "1-2 pessoas"
  },
  {
    title: "Escritório Privado Médio (Dia)",
    desc: "Escritório privado para 1–2 pessoas, reservado por dia, ideal para trabalhar ou receber alguém",
    highlights: ["55€ + IVA", "Por dia", "1-2 pessoas", "Flexível"],
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
    tipo: "Escritório Privado",
    subtipo: "Médio",
    preco: "55€ + IVA",
    unidade: "Dia",
    capacidade: "1-2 pessoas"
  },
  {
    title: "Escritório Privado Grande (Hora)",
    desc: "Escritório privado para 2–3 pessoas, reservado por dia, acesso a sala de reuniões e impressora",
    highlights: ["15€ + IVA", "Por hora", "2-3 pessoas", "Sala reuniões"],
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    tipo: "Escritório Privado",
    subtipo: "Grande",
    preco: "15€ + IVA",
    unidade: "Hora",
    capacidade: "2-3 pessoas"
  },
  {
    title: "Escritório Privado Grande (Dia)",
    desc: "Escritório privado para 2–3 pessoas, reservado por dia, acesso a sala de reuniões e impressora",
    highlights: ["65€ + IVA", "Por dia", "2-3 pessoas", "Sala reuniões"],
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80",
    tipo: "Escritório Privado",
    subtipo: "Grande",
    preco: "65€ + IVA",
    unidade: "Dia",
    capacidade: "2-3 pessoas"
  }
];

const salasReuniones = [
  {
    title: "Sala de Reuniões Grande",
    desc: "Sala grande para reuniões de equipa, apresentações ou workshops; equipada com monitor/projetor e mesa grande",
    highlights: ["20€ + IVA", "Por hora", "Até 8 pessoas", "Monitor/projetor"],
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80",
    tipo: "Sala de Reuniões Grande",
    subtipo: "Hora",
    preco: "20€ + IVA",
    pessoas: "até 8 pessoas"
  },
  {
    title: "Sala de Reuniões Grande - Meio-dia",
    desc: "Reserva para manhã (9–13h) ou tarde (14–18h)",
    highlights: ["65€ + IVA", "Meio-dia", "Até 8 pessoas", "Manhã ou tarde"],
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80",
    tipo: "Sala de Reuniões Grande",
    subtipo: "Meio-dia",
    preco: "65€ + IVA",
    pessoas: "até 8 pessoas"
  },
  {
    title: "Sala de Reuniões Grande - Dia",
    desc: "Reserva da sala durante o dia inteiro, ideal para eventos, formações ou reuniões longas",
    highlights: ["110€ + IVA", "Por dia", "Até 8 pessoas", "Dia completo"],
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80",
    tipo: "Sala de Reuniões Grande",
    subtipo: "Dia",
    preco: "110€ + IVA",
    pessoas: "até 8 pessoas"
  },
  {
    title: "Sala de Reuniões Pequena 1",
    desc: "Sala pequena ideal para chamadas, entrevistas ou reuniões rápidas",
    highlights: ["12€ + IVA", "Por hora", "1-2 pessoas", "Ideal para calls"],
    image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=1600&q=80",
    tipo: "Sala de Reuniões Pequena 1",
    subtipo: "Hora",
    preco: "12€ + IVA",
    pessoas: "1 - 2 pessoas"
  },
  {
    title: "Sala de Reuniões Pequena 1 - Meio-dia",
    desc: "Reserva da manhã ou tarde",
    highlights: ["35€ + IVA", "Meio-dia", "1-2 pessoas", "Manhã ou tarde"],
    image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1600&q=80",
    tipo: "Sala de Reuniões Pequena 1",
    subtipo: "Meio-dia",
    preco: "35€ + IVA",
    pessoas: "1 - 2 pessoas"
  },
  {
    title: "Sala de Reuniões Pequena 1 - Dia",
    desc: "Uso exclusivo o dia todo",
    highlights: ["60€ + IVA", "Por dia", "1-2 pessoas", "Dia completo"],
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80",
    tipo: "Sala de Reuniões Pequena 1",
    subtipo: "Dia",
    preco: "60€ + IVA",
    pessoas: "1 - 2 pessoas"
  },
  {
    title: "Sala de Reuniões Pequena 2",
    desc: "Sala pequena ideal para chamadas, entrevistas ou reuniões rápidas",
    highlights: ["12€ + IVA", "Por hora", "1-2 pessoas", "Ideal para calls"],
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80",
    tipo: "Sala de Reuniões Pequena 2",
    subtipo: "Hora",
    preco: "12€ + IVA",
    pessoas: "1 - 2 pessoas"
  },
  {
    title: "Sala de Reuniões Pequena 2 - Meio-dia",
    desc: "Reserva da manhã ou tarde",
    highlights: ["35€ + IVA", "Meio-dia", "1-2 pessoas", "Manhã ou tarde"],
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
    tipo: "Sala de Reuniões Pequena 2",
    subtipo: "Meio-dia",
    preco: "35€ + IVA",
    pessoas: "1 - 2 pessoas"
  }
];

type Category = "ofertas" | "escritorios" | "salas";

export default function PrecosPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("ofertas");

  const getCurrentItems = () => {
    switch (activeCategory) {
      case "ofertas":
        return ofertas;
      case "escritorios":
        return escritorios;
      case "salas":
        return salasReuniones;
      default:
        return ofertas;
    }
  };

  return (
    <div className="bg-[#F7F7F5] min-h-screen text-[#1A1A1A]">
      <section className="container mx-auto px-5 py-12 lg:py-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50 mb-3">Preços</p>
          <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight mb-4">
            Planos e Ofertas Gaia Coworking
          </h1>
          <p className="text-lg text-black/70">
            Escolhe a opção perfeita para o teu trabalho. Desde lugares flexíveis até escritórios privados, 
            temos o espaço ideal para ti em Vila Nova de Gaia.
          </p>
        </div>
      </section>

      {/* Categorías Tabs */}
      <section className="container mx-auto px-5 mb-8">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveCategory("ofertas")}
            className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${
              activeCategory === "ofertas"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "bg-white text-black/70 hover:bg-gray-50 border border-black/10"
            }`}
          >
            🪑 Ofertas
          </button>
          <button
            onClick={() => setActiveCategory("escritorios")}
            className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${
              activeCategory === "escritorios"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "bg-white text-black/70 hover:bg-gray-50 border border-black/10"
            }`}
          >
            🚪 Escritórios
          </button>
          <button
            onClick={() => setActiveCategory("salas")}
            className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${
              activeCategory === "salas"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "bg-white text-black/70 hover:bg-gray-50 border border-black/10"
            }`}
          >
            👥 Salas de Reuniões
          </button>
        </div>
      </section>

      {/* Content - Mismo estilo que espaços */}
      <section className="container mx-auto px-5 pb-12 lg:pb-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {getCurrentItems().map((item) => (
            <article
              key={item.title}
              className="group overflow-hidden rounded-[28px] bg-white border border-black/5 shadow-soft hover:shadow-lg hover:-translate-y-0.5 transition"
            >
              <div className="relative aspect-[16/10] bg-black/5">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0" />
                <div className="absolute left-4 bottom-4 right-4">
                  <p className="text-white text-base font-extrabold leading-tight drop-shadow">
                    {item.title}
                  </p>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <p className="text-sm text-black/70 leading-relaxed">{item.desc}</p>
                <ul className="space-y-2 text-sm text-black/80">
                  {item.highlights.map((h) => (
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

      {/* CTA Section */}
      <section className="container mx-auto px-5 pb-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 lg:p-12 text-white text-center">
          <h2 className="text-2xl lg:text-3xl font-extrabold mb-4">
            Tens dúvidas sobre qual plano escolher?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Fala connosco através do chat e ajudamos-te a encontrar a solução perfeita.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent("gc:chat", { detail: { open: true } }));
              }}
              className="px-6 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-50 transition-colors"
            >
              Abrir Chat
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
