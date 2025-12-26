"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense, useRef } from "react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [mounted, setMounted] = useState(false);
  const confirmedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    
    // Confirmar el pago automáticamente
    const confirmPayment = async () => {
      if (!sessionId || confirmedRef.current) return;
      confirmedRef.current = true;
      
      console.log("[Success] Confirmando pago para session:", sessionId);
      
      try {
        const response = await fetch("/api/confirmar-pago", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        
        const result = await response.json();
        console.log("[Success] Respuesta:", result);
        
        // Abrir el chat con mensaje de éxito
        setTimeout(() => {
          const event = new CustomEvent("gc:chat", {
            detail: { 
              open: true,
              systemMessage: "🎉 **Pagamento confirmado com sucesso!**\n\nA tua reserva está feita e enviámos um email de confirmação com todos os detalhes.\n\n📍 Esperamos-te no Gaia Coworking!\n\nSe tiveres alguma dúvida, estou aqui para ajudar 😊"
            }
          });
          window.dispatchEvent(event);
        }, 500);
      } catch (error) {
        console.error("[Success] Error:", error);
        // Mostrar mensaje de éxito de todas formas
        setTimeout(() => {
          const event = new CustomEvent("gc:chat", {
            detail: { 
              open: true,
              systemMessage: "🎉 **Pagamento recebido!**\n\nA tua reserva está a ser processada.\n\n📍 Até breve no Gaia Coworking!"
            }
          });
          window.dispatchEvent(event);
        }, 500);
      }
    };
    
    confirmPayment();
  }, [sessionId]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-12 text-center">
            <div className="relative">
              <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6">
                <svg className="w-10 h-10 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20,6 9,17 4,12" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Pagamento Confirmado!</h1>
              <p className="text-white/80 text-lg">A tua reserva foi processada com sucesso</p>
            </div>
          </div>

          <div className="px-8 py-8">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Email de confirmação enviado</h3>
                  <p className="text-sm text-green-700">Vais receber um email com todos os detalhes da tua reserva.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-black/80">O que acontece a seguir?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <span className="text-sm text-black/70">Recebe o email de confirmação</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <span className="text-sm text-black/70">Apresenta-te na data reservada</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <span className="text-sm text-black/70">Desfruta do teu espaço!</span>
                </div>
              </div>
            </div>

            {sessionId && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-xs text-black/50 mb-1">Referência</p>
                <p className="text-sm font-mono text-black/70 break-all">{sessionId.slice(0, 25)}...</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/" className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                Voltar ao Início
              </Link>
              <a href="mailto:hello@gaiacoworking.pt" className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-2xl border border-black/10 bg-white text-black/70 font-semibold hover:bg-gray-50 transition-colors">
                Preciso de Ajuda
              </a>
            </div>
          </div>
        </div>
        <p className="text-center text-sm text-black/50 mt-6">Obrigado por escolheres o Gaia Coworking 🌿</p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

