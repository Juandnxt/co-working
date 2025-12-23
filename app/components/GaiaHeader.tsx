"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { locales } from "@/i18n";
import LanguageSwitcher from "./LanguageSwitcher";

type Props = {
  basePath?: string;
};

const buildNavLinks = (basePath: string, locale: string = "pt") => {
  const labels = {
    pt: {
      prices: "Preços",
      spaces: "Espaços",
      dayPass: "Day Pass",
      contact: "Contacto"
    },
    en: {
      prices: "Prices",
      spaces: "Spaces",
      dayPass: "Day Pass",
      contact: "Contact"
    }
  };
  
  const t = labels[locale as keyof typeof labels] || labels.pt;
  
  return [
    { label: t.prices, href: `${basePath}/precos` },
    { label: t.spaces, href: `${basePath}/espacos` },
    { label: t.dayPass, href: `${basePath}#day-pass` },
    { label: t.contact, href: `${basePath}#contacto` },
  ];
};

export default function GaiaHeader({ basePath = "" }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname() || "/";
  const autoBasePath = (() => {
    if (basePath) return basePath;
    const seg = pathname.split("/").filter(Boolean)[0];
    return seg && (locales as readonly string[]).includes(seg) ? `/${seg}` : "";
  })();
  
  const currentLocale = (() => {
    const seg = pathname.split("/").filter(Boolean)[0];
    return seg && (locales as readonly string[]).includes(seg) ? seg : "pt";
  })();

  const navLinks = buildNavLinks(autoBasePath, currentLocale);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-black/5">
      <div className="container mx-auto flex items-center justify-between px-5 py-4 lg:py-5">
        <a href={`${autoBasePath || "/"}`} className="flex items-center gap-3" aria-label="Voltar à página inicial">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-soft flex items-center justify-center text-xl font-bold text-white">
            GC
          </div>
          <span className="text-lg font-semibold tracking-tight">Gaia Coworking</span>
        </a>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hover:text-blue-600 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex">
            <LanguageSwitcher />
          </div>
          <a
            href={`${autoBasePath}/login`.replace("//", "/")}
            className="hidden sm:inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[#1A1A1A] shadow-soft hover:bg-[#F7F7F5] transition"
          >
            Login
          </a>
          <button
            className="lg:hidden flex items-center justify-center rounded-full border border-black/10 bg-white h-10 w-10 shadow-soft cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Abrir menu"
            type="button"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
              {menuOpen ? (
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="lg:hidden border-t border-black/5 bg-white/95 backdrop-blur-sm shadow-soft animate-dropdown">
          <div className="container mx-auto px-5 py-4 space-y-4">
            <div className="w-fit">
              <LanguageSwitcher />
            </div>
            <div className="grid gap-2">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between rounded-2xl bg-[#F7F7F5] px-4 py-3 text-sm font-semibold text-[#1A1A1A] shadow-soft"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <a
                href={`${autoBasePath}/login`.replace("//", "/")}
                className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-[#1A1A1A] shadow-soft"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </a>
              <a
                href={`${autoBasePath}/#day-pass`.replace("//", "/")}
                className="inline-flex items-center justify-center rounded-full border border-blue-600 px-4 py-3 text-sm font-semibold text-blue-700 shadow-soft"
                onClick={() => setMenuOpen(false)}
              >
                Day Pass
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

