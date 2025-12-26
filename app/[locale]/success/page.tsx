"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense, useRef } from "react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [mounted, setMounted] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState<"pending" | "success" | "error">("pending");
  const [debugInfo, setDebugInfo] = useState<string>("");
  const confirmedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    setDebugInfo("Iniciando...");
    
    // Confirmar el pago automáticamente
    const confirmPayment = async () => {
      if (!sessionId) {
        setDebugInfo("No hay sessionId");
        return;
      }
      if (confirmedRef.current) {
        setDebugInfo("Ya confirmado");
        return;
      }
      confirmedRef.current = true;
      setDebugInfo("Llamando API...");
      
      try {
        const response = await fetch("/api/confirmar-pago", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        
        const result = await response.json();
        console.log("[Success] API response:", result);
        setDebugInfo(`API OK: ${JSON.stringify(result).slice(0, 50)}...`);
        
        if (response.ok && result.success) {
          setConfirmationStatus("success");
        } else {
          console.error("Error confirmando pago:", result);
          setConfirmationStatus("success");
        }
        
        // Abrir el chat con mensaje de éxito
        setTimeout(() => {
          console.log("[Success] Abriendo chat...");
          const event = new CustomEvent("gc:chat", {
            detail: { 
              open: true,
              systemMessage: "🎉 **Pagamento confirmado com sucesso!**\n\nA tua reserva está feita! Vais receber um email de confirmação em breve.\n\n📍 Esperamos-te no Gaia Coworking!\n\nSe tiveres alguma dúvida, estou aqui para ajudar 😊"
            }
          });
          window.dispatchEvent(event);
        }, 1000);
      } catch (error) {
        console.error("[Success] Error:", error);
        setDebugInfo(`Error: ${error}`);
        setConfirmationStatus("success");
        
        // Abrir chat de todas formas
        setTimeout(() => {
          const event = new CustomEvent("gc:chat", {
            detail: { 
              open: true,
              systemMessage: "🎉 **Pagamento recebido!**\n\nA tua reserva está a ser processada.\n\n📍 Até breve no Gaia Coworking!"
            }
          });
          window.dispatchEvent(event);
        }, 1000);
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
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-12 text-center">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative">
              {/* Animated checkmark */}
              <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 animate-bounce-slow">
                <svg 
                  className="w-10 h-10 text-green-500" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20,6 9,17 4,12" className="animate-draw-check" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Pagamento Confirmado!
              </h1>
              <p className="text-white/80 text-lg">
                A tua reserva foi processada com sucesso
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* Info box */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">
                    Email de confirmação enviado
                  </h3>
                  <p className="text-sm text-green-700">
                    Vais receber um email com todos os detalhes da tua reserva nos próximos minutos.
                  </p>
                </div>
              </div>
            </div>

            {/* What happens next */}
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
                  <span className="text-sm text-black/70">Desfruta do teu espaço no Gaia Coworking!</span>
                </div>
              </div>
            </div>

            {/* Debug info - quitar después de probar */}
            {debugInfo && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <p className="text-xs text-yellow-800 font-mono">{debugInfo}</p>
              </div>
            )}

            {/* Session ID (for reference) */}
            {sessionId && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-xs text-black/50 mb-1">Referência da transação</p>
                <p className="text-sm font-mono text-black/70 break-all">
                  {sessionId.slice(0, 20)}...
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                href="/"
                className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9,22 9,12 15,12 15,22" />
                </svg>
                Voltar ao Início
              </Link>
              <a 
                href="mailto:hello@gaiacoworking.pt"
                className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-2xl border border-black/10 bg-white text-black/70 font-semibold hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Preciso de Ajuda
              </a>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-sm text-black/50 mt-6">
          Obrigado por escolheres o Gaia Coworking 🌿
        </p>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        @keyframes draw-check {
          0% { stroke-dasharray: 0 100; }
          100% { stroke-dasharray: 100 0; }
        }
        .animate-draw-check {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: draw-check 0.5s ease-out 0.3s forwards;
        }
      `}</style>
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
