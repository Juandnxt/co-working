"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const [step, setStep] = useState<"form" | "verify">("form");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError(t("auth.passwordMismatch"));
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError(t("auth.passwordTooShort"));
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("auth.userExists"));
        setLoading(false);
        return;
      }

      setStep("verify");
      setSuccess(t("auth.codeSent"));
    } catch {
      setError(t("auth.connectionError"));
      setLoading(false);
    }
  };

  const submitVerify = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          code,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("auth.invalidCode"));
        setLoading(false);
        return;
      }

      setLoading(false);
      router.push(`/${locale}/login?registered=true`);
    } catch (err) {
      console.error("Error:", err);
      setError(t("auth.connectionError"));
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitVerify();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">CW</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("auth.registerTitle")}</h1>
          <p className="text-gray-600">
            {step === "form" 
              ? t("auth.registerSubtitle")
              : t("auth.verifySubtitle")}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {step === "form" ? (
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                {t("auth.fullName")}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                {t("common.email")}
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                {t("common.confirmPassword")}
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
            >
              {loading ? t("auth.registering") : t("common.register")}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifySubmit} className="space-y-6">
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
                    e.preventDefault();
                    void submitVerify();
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                placeholder="000000"
              />
              <p className="text-sm text-gray-500 mt-2">
                {t("auth.checkEmail")}: {formData.email}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
            >
              {loading ? t("auth.verifying") : t("auth.verifyEmail")}
            </button>

            <button
              type="button"
              onClick={() => setStep("form")}
              className="w-full text-gray-600 py-2 hover:text-gray-900"
            >
              {t("common.back")}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {t("auth.alreadyHaveAccount")}{" "}
            <Link href={`/${locale}/login`} className="text-blue-600 font-semibold hover:text-blue-700">
              {t("common.login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
