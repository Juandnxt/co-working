"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { locales } from "@/i18n";
import ChatOpenLink from "./ChatOpenLink";

function getBasePath(pathname: string) {
  const seg = pathname.split("/").filter(Boolean)[0];
  return seg && (locales as readonly string[]).includes(seg) ? `/${seg}` : "";
}

function safeHref(href: string) {
  return href.replace(/\/{2,}/g, "/");
}

export default function SiteFooter() {
  const pathname = usePathname() || "/";
  const basePath = useMemo(() => getBasePath(pathname), [pathname]);

  const links = [
    { label: "Espaços", href: safeHref(`${basePath}/espacos`) },
    { label: "Preços", href: safeHref(`${basePath}/#precos`) },
    { label: "Day Pass", href: safeHref(`${basePath}/#day-pass`) },
    { label: "Contacto", href: safeHref(`${basePath}/#contacto`) }
  ];

  return (
    <footer className="border-t border-black/5 bg-[#0F0F0F] text-white">
      <div className="container mx-auto px-5 py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <a href={basePath || "/"} className="inline-flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-soft flex items-center justify-center text-xl font-bold text-white">
                GC
              </div>
              <div>
                <p className="text-lg font-semibold leading-tight">Gaia Coworking</p>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                  Vila Nova de Gaia · Porto
                </p>
              </div>
            </a>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">
              Um espaço moderno para trabalhar com tranquilidade, comunidade e apoio presencial —
              perto do metro e a minutos do Porto.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href="mailto:hello@gaiacoworking.pt"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition-colors"
              >
                <IconMail />
                hello@gaiacoworking.pt
              </a>
              <ChatOpenLink
                href="#chat"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:shadow-md transition-shadow"
              >
                <IconChat />
                Chat
              </ChatOpenLink>
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 mb-4">
              Links
            </p>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm font-semibold">
              {links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-white/80 hover:text-white transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={safeHref(`${basePath}/login`)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Login
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 mb-4">
              Morada
            </p>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                  <IconPin />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">Gaia Coworking</p>
                  <p className="mt-1 text-sm text-white/70 leading-relaxed">
                    Vila Nova de Gaia, Portugal
                    <br />
                    (Adicionar rua e código‑postal)
                  </p>
                  <a
                    href="https://www.google.com/maps"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white/85 hover:text-white transition-colors"
                  >
                    Ver no Google Maps <IconArrow />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Gaia Coworking. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacidade
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Termos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function IconMail() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h16v12H4V6zm16 0l-8 7L4 6"
      />
    </svg>
  );
}

function IconChat() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4z"
      />
    </svg>
  );
}

function IconPin() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s7-4.4 7-10a7 7 0 10-14 0c0 5.6 7 10 7 10z"
      />
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 11a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7" />
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 7h8v8" />
    </svg>
  );
}


