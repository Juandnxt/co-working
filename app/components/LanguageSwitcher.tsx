"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales } from "@/i18n";

const languageNames: Record<string, { name: string; code: string }> = {
  pt: { name: "Português", code: "PT" },
  en: { name: "English", code: "EN" }
};

export default function LanguageSwitcher() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  
  // Detectar el locale actual
  const segments = pathname.split("/").filter(Boolean);
  const currentLocale = segments[0] && locales.includes(segments[0] as any) 
    ? segments[0] 
    : "pt";
  
  const switchLanguage = (newLocale: string) => {
    // Guardar la posición del scroll antes de cambiar
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    
    const newSegments = [...segments];
    
    // Si ya hay un locale, reemplazarlo
    if (segments[0] && locales.includes(segments[0] as any)) {
      newSegments[0] = newLocale;
    } else {
      // Si no hay locale, agregarlo al inicio
      newSegments.unshift(newLocale);
    }
    
    const newPath = `/${newSegments.join("/")}`;
    
    // Guardar la posición en sessionStorage para restaurarla después
    sessionStorage.setItem('scrollPosition', JSON.stringify({ x: scrollX, y: scrollY }));
    
    // Usar replace para no agregar al historial
    router.replace(newPath);
    
    // Restaurar la posición del scroll después de que la página se haya renderizado
    // Usamos requestAnimationFrame para asegurar que el DOM esté listo
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const saved = sessionStorage.getItem('scrollPosition');
        if (saved) {
          try {
            const { x, y } = JSON.parse(saved);
            window.scrollTo(x, y);
            sessionStorage.removeItem('scrollPosition');
          } catch (e) {
            // Si hay error, usar la posición guardada directamente
            window.scrollTo(scrollX, scrollY);
          }
        } else {
          window.scrollTo(scrollX, scrollY);
        }
      });
    });
  };

  return (
    <div className="flex items-center gap-2 text-xs font-semibold rounded-full border border-black/10 px-3 py-1.5 bg-white shadow-soft">
      {locales.map((locale) => {
        const isActive = currentLocale === locale;
        return (
          <button
            key={locale}
            onClick={() => switchLanguage(locale)}
            className={`px-1 transition-colors ${
              isActive 
                ? "text-blue-600 font-bold" 
                : "text-black/60 hover:text-black/80 cursor-pointer"
            }`}
            type="button"
          >
            {languageNames[locale]?.code || locale.toUpperCase()}
          </button>
        );
      })}
      {locales.length > 1 && (
        <span className="text-black/30">|</span>
      )}
    </div>
  );
}

