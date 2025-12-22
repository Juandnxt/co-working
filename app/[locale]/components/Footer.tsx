"use client";

import { useTranslations, useLocale } from "next-intl";

export default function Footer() {
  const t = useTranslations();
  useLocale();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">CW</span>
              </div>
              <span className="text-2xl font-bold">CoWorking</span>
            </div>
            <p className="text-gray-400">
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#inicio" className="hover:text-white transition-colors">{t("common.home")}</a></li>
              <li><a href="#servicios" className="hover:text-white transition-colors">{t("common.services")}</a></li>
              <li><a href="#espacios" className="hover:text-white transition-colors">{t("common.spaces")}</a></li>
              <li><a href="#reservar" className="hover:text-white transition-colors">{t("common.book")}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">{t("footer.contact")}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>📍 Calle Principal 123</li>
              <li>📧 info@coworking.com</li>
              <li>📞 +34 900 000 000</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">{t("footer.followUs")}</h3>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <span className="text-lg">📘</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors">
                <span className="text-lg">🐦</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors">
                <span className="text-lg">📷</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <span className="text-lg">💼</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2024 CoWorking Space. {t("footer.rights")}.</p>
        </div>
      </div>
    </footer>
  );
}
