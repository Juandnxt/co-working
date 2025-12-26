"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";

// Product data with only non-translatable info (images, prices)
const productsData = [
  {
    id: "lugar-flexivel",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
    subtypes: [
      { key: "daily", price: "14€", priceCents: 1400, unitKey: "day" },
      { key: "weekly", price: "30€", priceCents: 3000, unitKey: "week" },
      { key: "pack3", price: "55€", priceCents: 5500, unitKey: "pack" },
      { key: "pack5", price: "60€", priceCents: 6000, unitKey: "pack" },
      { key: "pack10", price: "110€", priceCents: 11000, unitKey: "pack" },
    ],
  },
  {
    id: "lugar-fixo",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=80",
    subtypes: [
      { key: "weekly", price: "50€", priceCents: 5000, unitKey: "week" },
      { key: "monthly", price: "150€", priceCents: 15000, unitKey: "month" },
    ],
  },
  {
    id: "mesa-fixa",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80",
    subtypes: [
      { key: "weekly", price: "70€", priceCents: 7000, unitKey: "week" },
      { key: "monthly", price: "170€", priceCents: 17000, unitKey: "month" },
      { key: "premium", price: "180€", priceCents: 18000, unitKey: "monthly" },
    ],
  },
  {
    id: "part-time",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80",
    subtypes: [
      { key: "pack2", price: "85€", priceCents: 8500, unitKey: "monthly" },
      { key: "pack10", price: "110€", priceCents: 11000, unitKey: "monthly" },
    ],
  },
  {
    id: "escritorio-grande",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
    subtypes: [
      { key: "hourly", price: "15€", priceCents: 1500, unitKey: "hour" },
      { key: "daily", price: "65€", priceCents: 6500, unitKey: "day" },
      { key: "monthly", price: "230€", priceCents: 23000, unitKey: "month" },
    ],
  },
  {
    id: "escritorio-medio",
    image: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=1600&q=80",
    subtypes: [
      { key: "hourly", price: "12€", priceCents: 1200, unitKey: "hour" },
      { key: "daily", price: "55€", priceCents: 5500, unitKey: "day" },
      { key: "monthly", price: "200€", priceCents: 20000, unitKey: "month" },
    ],
  },
  {
    id: "escritorio-pequeno",
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=1600&q=80",
    subtypes: [
      { key: "hourly", price: "10€", priceCents: 1000, unitKey: "hour" },
      { key: "daily", price: "35€", priceCents: 3500, unitKey: "day" },
      { key: "monthly", price: "180€", priceCents: 18000, unitKey: "month" },
    ],
  },
  {
    id: "sala-grande",
    image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=1600&q=80",
    subtypes: [
      { key: "hourly", price: "20€", priceCents: 2000, unitKey: "hour" },
      { key: "halfDay", price: "65€", priceCents: 6500, unitKey: "halfDay" },
      { key: "fullDay", price: "110€", priceCents: 11000, unitKey: "day" },
    ],
  },
  {
    id: "sala-pequena",
    image: "https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?auto=format&fit=crop&w=1600&q=80",
    subtypes: [
      { key: "hourly", price: "12€", priceCents: 1200, unitKey: "hour" },
      { key: "halfDay", price: "35€", priceCents: 3500, unitKey: "halfDay" },
      { key: "fullDay", price: "60€", priceCents: 6000, unitKey: "day" },
    ],
  },
];

type SubtypeData = {
  key: string;
  price: string;
  priceCents: number;
  unitKey: string;
};

type ProductData = typeof productsData[0];

function ProductCard({ 
  product, 
  onSelectOption, 
  t 
}: { 
  product: ProductData;
  onSelectOption: (productType: string, subtypeName: string, price: string, priceCents: number) => void;
  t: ReturnType<typeof useTranslations<"precos">>;
}) {
  const [showOptions, setShowOptions] = useState(false);

  // Get translated product info
  const typeDisplay = t(`products.${product.id}.typeDisplay` as any);
  const type = t(`products.${product.id}.type` as any);
  const description = t(`products.${product.id}.description` as any);
  const highlights = t.raw(`products.${product.id}.highlights` as any) as string[];

  const handleSelectOption = (subtype: SubtypeData) => {
    const subtypeName = t(`products.${product.id}.subtypes.${subtype.key}` as any);
    onSelectOption(type, subtypeName, subtype.price, subtype.priceCents);
    setShowOptions(false);
  };

  return (
    <div className="relative rounded-[24px] overflow-hidden shadow-soft bg-white border border-black/5 flex flex-col" suppressHydrationWarning>
      {/* Background image */}
      <div className="relative aspect-[16/9] overflow-hidden shrink-0">
        <img
          src={product.image}
          alt={typeDisplay}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute left-5 bottom-5 right-5">
          <h2 className="text-xl lg:text-2xl font-extrabold text-white drop-shadow-lg">
            {typeDisplay}
          </h2>
        </div>
      </div>

      {/* Default content */}
      <div className={`p-5 lg:p-6 flex-1 flex flex-col transition-opacity duration-300 ${showOptions ? "invisible" : "visible"}`} suppressHydrationWarning>
        <p className="text-base text-black/70 mb-4 leading-relaxed">
          {description}
        </p>
        
        {/* Highlights */}
        <ul className="space-y-2 mb-5">
          {highlights.map((h, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm text-black/80">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" aria-hidden />
              <span>{h}</span>
            </li>
          ))}
        </ul>

        {/* Options button */}
        <button
          onClick={() => setShowOptions(true)}
          className="mt-auto w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:shadow-lg transition-all cursor-pointer"
        >
          {t("viewOptions")}
        </button>
      </div>

      {/* Options overlay */}
      <div 
        className={`absolute inset-0 top-0 transition-all duration-300 ${
          showOptions ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        suppressHydrationWarning
      >
        <div className="absolute inset-0 bg-[#1A1A1A] rounded-[24px]" />

        <div className="relative z-10 h-full p-5 lg:p-6 text-white flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-bold">
              {typeDisplay}
            </h3>
            <p className="text-xs text-white/60 mt-1">
              {t("clickToBook")}
            </p>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto scrollbar-thin pr-1">
            {product.subtypes.map((subtype, idx) => {
              const subtypeName = t(`products.${product.id}.subtypes.${subtype.key}` as any);
              const unitName = t(`units.${subtype.unitKey}` as any);
              
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(subtype)}
                  className="w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 hover:scale-[1.02] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-medium text-white">{subtypeName}</span>
                    <span className="text-xs text-white/50">{unitName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{subtype.price}</span>
                    <svg className="h-4 w-4 text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-xs text-white/40 text-center">
            {t("ivaNote")}
          </p>

          <button
            onClick={() => setShowOptions(false)}
            className="mt-3 w-full flex items-center justify-center gap-1 p-2.5 rounded-lg bg-white/10 text-white/80 text-sm font-medium hover:bg-white/20 transition-colors cursor-pointer"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PrecosPage() {
  const t = useTranslations("precos");
  
  const handleSelectOption = useCallback((productType: string, subtypeName: string, price: string, priceCents: number) => {
    const message = `Quero reservar ${productType} - ${subtypeName} (${price})`;
    
    const event = new CustomEvent("gc:chat", {
      detail: { 
        open: true,
        message: message,
        booking: {
          product: productType,
          subtype: subtypeName,
          price: price,
          priceCents: priceCents
        }
      }
    });
    window.dispatchEvent(event);
  }, []);

  return (
    <div className="bg-[#F7F7F5] min-h-screen text-[#1A1A1A]" suppressHydrationWarning>
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
      <section className="container mx-auto px-5 py-12 lg:py-16" suppressHydrationWarning>
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50 mb-3">
            {t("page.label")}
          </p>
          <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight mb-4">
            {t("page.title")}
          </h1>
          <p className="text-lg text-black/70">
            {t("page.subtitle")}
          </p>
        </div>
      </section>

      {/* Product Cards */}
      <section className="container mx-auto px-5 pb-12 lg:pb-16" suppressHydrationWarning>
        <div className="grid gap-6 md:grid-cols-2">
          {productsData.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onSelectOption={handleSelectOption}
              t={t}
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-5 pb-16" suppressHydrationWarning>
        <div className="rounded-[24px] bg-gradient-to-r from-blue-600 to-purple-600 p-8 lg:p-12 text-white text-center">
          <h2 className="text-2xl lg:text-3xl font-extrabold mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-lg text-white/80 mb-6 max-w-xl mx-auto">
            {t("cta.subtitle")}
          </p>
          <a
            href="mailto:hello@gaiacoworking.pt"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-soft hover:shadow-md transition-shadow"
          >
            {t("cta.button")}
          </a>
        </div>
      </section>
    </div>
  );
}
