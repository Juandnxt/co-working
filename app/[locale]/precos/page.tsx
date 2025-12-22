/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";

export default function PrecosPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<"ofertas" | "escritorios" | "salas">("ofertas");

  // Datos en portugués (original)
  const ofertasPT = [
    {
      title: "Lugar Flexível - Passe Diário",
      desc: "Um lugar disponível em qualquer mesa",
      highlights: ["14€ + IVA", "Por dia", "Mesa partilhada", "Flexibilidade total"],
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Lugar Flexível - Passe Semanal",
      desc: "Uso de qualquer lugar disponível durante 1 semana, mesa partilhada",
      highlights: ["30€ + IVA", "Por semana", "Mesa partilhada", "5 dias úteis"],
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Lugar Flexível - Pack 3 dias",
      desc: "Uso de qualquer lugar disponível em 3 dias à escolha, mesa partilhada",
      highlights: ["55€ + IVA", "Pack 3 dias", "À escolha", "Mesa partilhada"],
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Lugar Flexível - Pack 5 dias",
      desc: "Uso de qualquer lugar disponível em 5 dias à escolha, mesa partilhada",
      highlights: ["60€ + IVA", "Pack 5 dias", "À escolha", "Mesa partilhada"],
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Lugar Flexível - Pack 10 dias",
      desc: "Uso de qualquer lugar disponível em 10 dias à escolha, mesa partilhada",
      highlights: ["110€ + IVA", "Pack 10 dias", "À escolha", "Mesa partilhada"],
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Lugar Fixo - Mensal",
      desc: "Cadeira fixa numa mesa partilhada, sempre reservada para a pessoa durante o mês",
      highlights: ["150€ + IVA", "Por mês", "Lugar fixo", "Mesa partilhada"],
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Lugar Fixo - Semanal",
      desc: "Cadeira fixa numa mesa partilhada, sempre reservada para a pessoa durante uma semana",
      highlights: ["50€ + IVA", "Por semana", "Lugar fixo", "Mesa partilhada"],
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Mesa Fixa - Mensal",
      desc: "Mesa reservada exclusivamente para uma pessoa durante 1 mês, acesso à impressora e espaço comum",
      highlights: ["170€ + IVA", "Por mês", "Mesa exclusiva", "Impressora incluída"],
      image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Mesa Fixa - Semanal",
      desc: "Mesa reservada exclusivamente para uma pessoa durante 1 semana, acesso à impressora e espaço comum",
      highlights: ["70€ + IVA", "Por semana", "Mesa exclusiva", "Impressora incluída"],
      image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Mesa Fixa - Full-time Premium",
      desc: "Mesa fixa com acesso 24/7, impressão incluída, cacifo/locker individual, café e água gratuitos",
      highlights: ["180€ + IVA", "Por mês", "Acesso 24/7", "Premium completo"],
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Part-time - Pack 2 dias",
      desc: "Acesso 2 dias por semana (09:00–19:00), mesa flexível, café e água incluídos",
      highlights: ["85€ + IVA", "Por dia", "2 dias/semana", "Café incluído"],
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Part-time - Pack 10 dias",
      desc: "Acesso a qualquer 10 dias no mês, mesa flexível, café e água incluídos; 8h mensais gratuitas na sala de reuniões",
      highlights: ["110€ + IVA", "Mensal", "10 dias/mês", "Sala reuniões incluída"],
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    }
  ];

  const escritoriosPT = [
    {
      title: "Escritório Privado Pequeno 1",
      desc: "Escritório privado para 1 pessoa, ideal para trabalhar sozinho, acesso a impressora e espaço comum",
      highlights: ["180€ + IVA", "Por mês", "1 pessoa", "Impressora incluída"],
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Escritório Privado Pequeno 2",
      desc: "Escritório privado para 1 pessoa, ideal para trabalhar sozinho, acesso a impressora e espaço comum",
      highlights: ["180€ + IVA", "Por mês", "1 pessoa", "Impressora incluída"],
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Escritório Privado Médio",
      desc: "Escritório privado para 1 pessoas, adequado para trabalhar sozinho ou receber 1 convidado, acesso a impressora e sala de reuniões",
      highlights: ["200€ + IVA", "Por mês", "2 pessoas", "Sala reuniões"],
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Escritório Privado Maior",
      desc: "Escritório privado maior para 2–3 pessoas, para trabalhar ou receber convidados, acesso a impressora, sala de reuniões e espaço comum",
      highlights: ["230€ + IVA", "Por mês", "2-3 pessoas", "Espaço completo"],
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Escritório Privado Pequeno (Hora)",
      desc: "Escritório privado para realizar reunião online, trabalhar sozinho",
      highlights: ["10€ + IVA", "Por hora", "1 pessoa", "Ideal para calls"],
      image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Escritório Privado Pequeno (Dia)",
      desc: "Escritório privado para realizar reunião online, trabalhar sozinho",
      highlights: ["35€ + IVA", "Por dia", "1 pessoa", "Ideal para calls"],
      image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Escritório Privado Médio (Hora)",
      desc: "Escritório privado para 1–2 pessoas, reservado por dia, ideal para trabalhar ou receber alguém",
      highlights: ["12€ + IVA", "Por hora", "1-2 pessoas", "Flexível"],
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Escritório Privado Médio (Dia)",
      desc: "Escritório privado para 1–2 pessoas, reservado por dia, ideal para trabalhar ou receber alguém",
      highlights: ["55€ + IVA", "Por dia", "1-2 pessoas", "Flexível"],
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Escritório Privado Grande (Hora)",
      desc: "Escritório privado para 2–3 pessoas, reservado por dia, acesso a sala de reuniões e impressora",
      highlights: ["15€ + IVA", "Por hora", "2-3 pessoas", "Sala reuniões"],
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Escritório Privado Grande (Dia)",
      desc: "Escritório privado para 2–3 pessoas, reservado por dia, acesso a sala de reuniões e impressora",
      highlights: ["65€ + IVA", "Por dia", "2-3 pessoas", "Sala reuniões"],
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80",
    }
  ];

  const salasReuniaoPT = [
    {
      title: "Sala de Reuniões Grande",
      desc: "Sala grande para reuniões de equipa, apresentações ou workshops; equipada com monitor/projetor e mesa grande",
      highlights: ["20€ + IVA", "Por hora", "Até 8 pessoas", "Monitor/projetor"],
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Sala de Reuniões Grande - Meio-dia",
      desc: "Reserva para manhã (9–13h) ou tarde (14–18h)",
      highlights: ["65€ + IVA", "Meio-dia", "Até 8 pessoas", "Manhã ou tarde"],
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Sala de Reuniões Grande - Dia",
      desc: "Reserva da sala durante o dia inteiro, ideal para eventos, formações ou reuniões longas",
      highlights: ["110€ + IVA", "Por dia", "Até 8 pessoas", "Dia completo"],
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Sala de Reuniões Pequena 1",
      desc: "Sala pequena ideal para chamadas, entrevistas ou reuniões rápidas",
      highlights: ["12€ + IVA", "Por hora", "1-2 pessoas", "Ideal para calls"],
      image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Sala de Reuniões Pequena 1 - Meio-dia",
      desc: "Reserva da manhã ou tarde",
      highlights: ["35€ + IVA", "Meio-dia", "1-2 pessoas", "Manhã ou tarde"],
      image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Sala de Reuniões Pequena 1 - Dia",
      desc: "Uso exclusivo o dia todo",
      highlights: ["60€ + IVA", "Por dia", "1-2 pessoas", "Dia completo"],
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Sala de Reuniões Pequena 2",
      desc: "Sala pequena ideal para chamadas, entrevistas ou reuniões rápidas",
      highlights: ["12€ + IVA", "Por hora", "1-2 pessoas", "Ideal para calls"],
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Sala de Reuniões Pequena 2 - Meio-dia",
      desc: "Reserva da manhã ou tarde",
      highlights: ["35€ + IVA", "Meio-dia", "1-2 pessoas", "Manhã ou tarde"],
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
    }
  ];

  // Datos en inglés
  const ofertasEN = ofertasPT.map(item => ({
    ...item,
    title: item.title.replace("Lugar Flexível", "Flexible Spot").replace("Passe Diário", "Daily Pass").replace("Passe Semanal", "Weekly Pass").replace("Pack", "Pack").replace("Lugar Fixo", "Fixed Spot").replace("Mensal", "Monthly").replace("Semanal", "Weekly").replace("Mesa Fixa", "Fixed Table").replace("Full-time Premium", "Full-time Premium").replace("Part-time", "Part-time"),
    desc: item.desc.replace("mesa", "table").replace("partilhada", "shared").replace("pessoa", "person").replace("mês", "month").replace("semana", "week").replace("dias", "days").replace("impressora", "printer").replace("espaço comum", "common space").replace("café e água", "coffee and water").replace("sala de reuniões", "meeting room")
  }));

  const escritoriosEN = escritoriosPT.map(item => ({
    ...item,
    title: item.title.replace("Escritório Privado", "Private Office").replace("Pequeno", "Small").replace("Médio", "Medium").replace("Maior", "Large").replace("Hora", "Hour").replace("Dia", "Day"),
    desc: item.desc.replace("pessoa", "person").replace("pessoas", "people").replace("impressora", "printer").replace("espaço comum", "common space").replace("sala de reuniões", "meeting room")
  }));

  const salasReuniaoEN = salasReuniaoPT.map(item => ({
    ...item,
    title: item.title.replace("Sala de Reuniões", "Meeting Room").replace("Grande", "Large").replace("Pequena", "Small").replace("Meio-dia", "Half Day").replace("Dia", "Day"),
    desc: item.desc.replace("equipa", "team").replace("pessoas", "people").replace("monitor/projetor", "monitor/projector")
  }));

  const ofertas = locale === "en" ? ofertasEN : ofertasPT;
  const escritorios = locale === "en" ? escritoriosEN : escritoriosPT;
  const salasReuniao = locale === "en" ? salasReuniaoEN : salasReuniaoPT;

  const getCurrentItems = () => {
    switch (activeTab) {
      case "ofertas":
        return ofertas;
      case "escritorios":
        return escritorios;
      case "salas":
        return salasReuniao;
      default:
        return ofertas;
    }
  };

  return (
    <div className="bg-[#F7F7F5] min-h-screen text-[#1A1A1A]">
      <section className="container mx-auto px-5 py-12 lg:py-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50 mb-3">
            {t("precos.page.label")}
          </p>
          <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight mb-4">
            {t("precos.page.title")}
          </h1>
          <p className="text-lg text-black/70">
            {t("precos.page.subtitle")}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-5 mb-8">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveTab("ofertas")}
            className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${
              activeTab === "ofertas"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "bg-white text-black/70 hover:bg-gray-50 border border-black/10"
            }`}
          >
            {t("precos.tabs.ofertas")}
          </button>
          <button
            onClick={() => setActiveTab("escritorios")}
            className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${
              activeTab === "escritorios"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "bg-white text-black/70 hover:bg-gray-50 border border-black/10"
            }`}
          >
            {t("precos.tabs.escritorios")}
          </button>
          <button
            onClick={() => setActiveTab("salas")}
            className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${
              activeTab === "salas"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "bg-white text-black/70 hover:bg-gray-50 border border-black/10"
            }`}
          >
            {t("precos.tabs.salas")}
          </button>
        </div>
      </section>

      <section className="container mx-auto px-5 pb-12 lg:pb-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {getCurrentItems().map((item, idx) => (
            <article
              key={`${item.title}-${idx}`}
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
                  {item.highlights.map((h, hIdx) => (
                    <li key={hIdx} className="flex gap-2">
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
