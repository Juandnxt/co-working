"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("auth.invalidCredentials"));
        setLoading(false);
        return;
      }

      if (data.success) {
        // Redirect based on user role
        setLoading(false);
        if (data.isAdmin) {
          window.location.href = `/${locale}/admin/dashboard`;
        } else {
          router.push(`/${locale}`);
          router.refresh();
        }
        return;
      }

      setStep("code");
    } catch (err) {
      setError(t("auth.connectionError"));
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code,
          isLogin: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("auth.invalidCode"));
        setLoading(false);
        return;
      }

      setLoading(false);
      router.push(`/${locale}`);
      router.refresh();
    } catch (err) {
      console.error("Error:", err);
      setError(t("auth.connectionError"));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">CW</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("auth.loginTitle")}</h1>
          <p className="text-gray-600">
            {step === "email" 
              ? t("auth.loginSubtitle")
              : t("auth.verifySubtitle")}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {step === "email" ? (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                {t("common.email")}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                {t("common.password")}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
            >
              {loading ? t("auth.sending") : t("common.continue")}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCodeSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                {t("auth.verificationCode")}
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && code.length === 6 && !loading) {
                    handleCodeSubmit(e as any);
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                placeholder="000000"
              />
              <p className="text-sm text-gray-500 mt-2">
                {t("auth.checkEmail")}: {email}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
            >
              {loading ? t("auth.verifying") : t("auth.verifyAndEnter")}
            </button>

            <button
              type="button"
              onClick={() => setStep("email")}
              className="w-full text-gray-600 py-2 hover:text-gray-900"
            >
              {t("common.back")}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {t("auth.noAccount")}{" "}
            <Link href={`/${locale}/register`} className="text-blue-600 font-semibold hover:text-blue-700">
              {t("common.register")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
