"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
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
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
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
        setError(data.error || "User already exists");
        setLoading(false);
        return;
      }

      setStep("verify");
      setSuccess("Verification code sent to your email");
      setLoading(false); // Reset loading when moving to verify step
    } catch {
      setError("Connection error");
      setLoading(false);
    }
  };

  const submitVerify = async () => {
    if (loading || code.length !== 6) return;
    
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

      // Read the response once
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid code");
        setLoading(false);
        return;
      }

      if (data.success) {
        // Reset loading before redirect to prevent stuck state
        setLoading(false);
        router.push("/login?registered=true");
      } else {
        setError(data.error || "Invalid code");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Connection error. Please try again.");
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">
            {step === "form" 
              ? "Complete the form to register"
              : "Verify your email with the code sent"}
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
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Password
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
                Confirm Password
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
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-2">
                We sent a verification code to
              </p>
              <p className="text-gray-900 font-semibold">
                {formData.email}
              </p>
            </div>

            <form onSubmit={handleVerifySubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-3 text-center">
                  Enter Verification Code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => {
                    const newCode = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setCode(newCode);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && code.length === 6 && !loading) {
                      e.preventDefault();
                      void submitVerify();
                    }
                  }}
                  autoFocus
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-3xl tracking-[0.5em] font-mono font-bold"
                  placeholder="000000"
                  style={{ letterSpacing: '0.5em' }}
                />
                <div className="mt-3 text-center">
                  <p className="text-sm text-gray-500">
                    {code.length}/6 digits
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform ${
                  loading || code.length !== 6
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                }`}
                onClick={(e) => {
                  if (code.length === 6 && !loading) {
                    e.preventDefault();
                    void submitVerify();
                  }
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  "Verify Email"
                )}
              </button>

              {code.length !== 6 && (
                <p className="text-sm text-center text-gray-500">
                  Please enter all 6 digits to continue
                </p>
              )}

              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setCode("");
                  setError("");
                  setSuccess("");
                  setLoading(false);
                }}
                disabled={loading}
                className="w-full text-gray-600 py-3 hover:text-gray-900 disabled:opacity-50 font-medium"
              >
                ← Back to registration
              </button>
            </form>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
