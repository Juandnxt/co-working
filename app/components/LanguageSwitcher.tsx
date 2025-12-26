"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales } from "@/i18n";

const localeLabels: Record<string, { label: string; flag: string }> = {
  pt: { label: "Português", flag: "🇵🇹" },
  en: { label: "English", flag: "🇬🇧" },
};

export default function LanguageSwitcher() {
  const pathname = usePathname() || "/";
  const router = useRouter();

  // Extract current locale from path
  const segments = pathname.split("/").filter(Boolean);
  const currentLocale = segments[0] && (locales as readonly string[]).includes(segments[0]) 
    ? segments[0] 
    : "pt";

  const handleChange = (newLocale: string) => {
    if (newLocale === currentLocale) return;

    let newPath: string;
    
    // If current path has a locale prefix, replace it
    if ((locales as readonly string[]).includes(segments[0])) {
      segments[0] = newLocale;
      newPath = `/${segments.join("/")}`;
    } else {
      // Add locale prefix
      newPath = `/${newLocale}${pathname}`;
    }

    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-black/10 bg-white p-1 shadow-soft">
      {locales.map((locale) => {
        const isActive = locale === currentLocale;
        const { flag, label } = localeLabels[locale] || { label: locale.toUpperCase(), flag: "" };
        
        return (
          <button
            key={locale}
            type="button"
            onClick={() => handleChange(locale)}
            className={`
              inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all
              ${isActive 
                ? "bg-[#0F0F0F] text-white shadow-soft" 
                : "text-black/60 hover:bg-[#F7F7F5] hover:text-black"
              }
            `}
            aria-label={`Mudar para ${label}`}
            aria-current={isActive ? "true" : undefined}
          >
            <span className="text-sm">{flag}</span>
            <span className="hidden sm:inline">{locale.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
}

