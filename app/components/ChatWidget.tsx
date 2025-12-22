"use client";

import { useEffect, useRef, useState } from "react";

type ChatItem =
  | { id: string; role: "bot" | "user"; kind: "text"; text: string }
  | { id: string; role: "bot"; kind: "daypass_picker" };

type ChatFlow = null | "daypass";

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [flow, setFlow] = useState<ChatFlow>(null);
  const [dayPassDate, setDayPassDate] = useState<string>("");
  const [messages, setMessages] = useState<ChatItem[]>([
    {
      id: uid(),
      role: "bot",
      kind: "text",
      text: "Olá! Sou o assistente da Gaia Coworking. Em que posso ajudar?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onMouseDown = (e: MouseEvent) => {
      const el = panelRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, [open]);

  useEffect(() => {
    const onChatEvent = (e: Event) => {
      const ev = e as CustomEvent<{ open?: boolean; flow?: ChatFlow }>;
      if (ev.detail?.open) {
        setOpen(true);
      }
      if (ev.detail?.flow) {
        setFlow(ev.detail.flow);
        if (ev.detail.flow === "daypass") {
          setDayPassDate("");
          setMessages((prev) => [
            ...prev,
            { id: uid(), role: "bot", kind: "text", text: "Perfeito — escolhe a data do teu Day Pass:" },
            { id: uid(), role: "bot", kind: "daypass_picker" }
          ]);
        }
      }
    };
    window.addEventListener("gc:chat", onChatEvent);
    return () => window.removeEventListener("gc:chat", onChatEvent);
  }, []);

  useEffect(() => {
    if (!open) return;
    // keep the latest content visible when opening / adding messages
    requestAnimationFrame(() => {
      scrollRef.current?.scrollIntoView({ block: "end" });
    });
  }, [open, messages.length, flow]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Agregar mensaje del usuario inmediatamente
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "user", kind: "text", text: trimmed }
    ]);
    setInput("");
    setIsLoading(true);

    try {
      // Enviar mensaje al webhook de n8n
      const response = await fetch("/api/webhook/e05bf1eb-8902-4711-beb1-136110b75941", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
          conversationId: "chat-widget",
        }),
      });

      const data = await response.json();
      
      console.log("Response data from API:", data);
      
      // Si hay un error en la respuesta
      if (!response.ok || data.error) {
        console.error("Error from webhook:", data);
        
        // Mensaje específico para workflow no activo
        if (data.error === "El workflow de n8n no está activado" || data.message?.includes("not registered")) {
          throw new Error("El workflow de n8n no está activado. Por favor, activa el workflow en n8n.");
        }
        
        throw new Error(data.error || data.message || `Error ${response.status}: ${response.statusText}`);
      }

      // Extraer la respuesta del bot - n8n puede devolver en diferentes formatos
      let botResponse = null;
      
      console.log("Processing response data:", JSON.stringify(data, null, 2));
      
      // Si es un string directo
      if (typeof data === 'string') {
        botResponse = data;
      }
      // Si es un array (formato típico de n8n)
      else if (Array.isArray(data) && data.length > 0) {
        const firstItem = data[0];
        botResponse = firstItem.json?.answer ||
                     firstItem.json?.response || 
                     firstItem.json?.message || 
                     firstItem.json?.text ||
                     firstItem.json?.output ||
                     firstItem.answer ||
                     firstItem.response ||
                     firstItem.message ||
                     firstItem.text ||
                     firstItem.body ||
                     firstItem.output;
      }
      // Si es un objeto
      else if (typeof data === 'object' && data !== null) {
        // Buscar en múltiples campos posibles, incluyendo "answer" que es común en n8n
        botResponse = 
          data.answer ||
          data.response || 
          data.message || 
          data.text || 
          data.body ||
          data.output ||
          data.json?.answer ||
          data.json?.response ||
          data.json?.message ||
          data.json?.text ||
          data.json?.output ||
          data.output?.message ||
          data.output?.response ||
          data.output?.text ||
          data.output?.answer;
      }
      
      // Si aún no encontramos la respuesta, intentar más opciones
      if (!botResponse) {
        // Intentar acceder a propiedades comunes de n8n en arrays
        if (Array.isArray(data) && data[0]?.json) {
          const jsonData = data[0].json;
          botResponse = jsonData.answer || jsonData.response || jsonData.message || jsonData.text || jsonData.output;
        }
        // Si aún no hay respuesta, intentar convertir el objeto completo
        if (!botResponse) {
          console.warn("No se encontró respuesta en formato esperado, datos recibidos:", data);
          // Si es un objeto con una sola propiedad, usar esa propiedad
          if (typeof data === 'object' && data !== null) {
            const keys = Object.keys(data);
            if (keys.length === 1) {
              botResponse = data[keys[0]];
            } else {
              // Intentar encontrar cualquier propiedad que sea un string
              for (const key of keys) {
                if (typeof data[key] === 'string' && data[key].length > 0) {
                  botResponse = data[key];
                  break;
                }
              }
            }
          }
          // Último recurso: convertir a string
          if (!botResponse) {
            botResponse = JSON.stringify(data);
          }
        }
      }
      
      // Asegurar que botResponse sea un string válido
      if (botResponse === null || botResponse === undefined) {
        botResponse = "Desculpe, não consegui processar a resposta do chatbot.";
      } else if (typeof botResponse !== 'string') {
        // Si es un objeto, intentar extraer valores string
        if (typeof botResponse === 'object') {
          // Buscar el primer valor que sea string en el objeto
          const stringValue = Object.values(botResponse).find(v => typeof v === 'string' && v.length > 0);
          if (stringValue) {
            botResponse = stringValue;
          } else {
            // Si no hay strings, intentar convertir el objeto completo
            try {
              botResponse = JSON.stringify(botResponse);
            } catch {
              botResponse = "Desculpe, não consegui processar a resposta do chatbot.";
            }
          }
        } else {
          botResponse = String(botResponse);
        }
      }
      
      // Verificar que no sea "[object Object]"
      if (botResponse === "[object Object]") {
        console.error("Received [object Object], trying to extract from data:", data);
        // Intentar extraer directamente del objeto original
        if (typeof data === 'object' && data !== null) {
          const extracted = data.answer || data.response || data.message || data.text || data.output;
          if (extracted && typeof extracted === 'string') {
            botResponse = extracted;
          } else {
            botResponse = "Desculpe, ocorreu um erro ao processar a resposta.";
          }
        } else {
          botResponse = "Desculpe, ocorreu um erro ao processar a resposta.";
        }
      }
      
      // Limpiar caracteres de escape como \n (asegurar que sea string)
      if (typeof botResponse === 'string') {
        botResponse = botResponse.replace(/\\n/g, '\n').replace(/\\"/g, '"').trim();
      } else {
        botResponse = String(botResponse).replace(/\\n/g, '\n').replace(/\\"/g, '"').trim();
      }
      
      console.log("Final extracted bot response:", botResponse);

      // Agregar respuesta del bot
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "bot", kind: "text", text: botResponse }
      ]);
    } catch (error: any) {
      console.error("Error sending message to webhook:", error);
      // Mensaje de error amigable con más detalles en desarrollo
      const errorText = process.env.NODE_ENV === 'development' 
        ? `Erro: ${error.message || "Erro desconhecido"}. Verifique a consola para mais detalhes.`
        : "Desculpe, ocorreu um erro. Por favor, tente novamente.";
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "bot", kind: "text", text: errorText }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickReply = (label: string) => {
    switch (label) {
      case "Day Pass":
        setOpen(true);
        setFlow("daypass");
        setDayPassDate("");
        setMessages((prev) => [
          ...prev,
          { id: uid(), role: "user", kind: "text", text: "Quero um Day Pass" },
          { id: uid(), role: "bot", kind: "text", text: "Boa! Escolhe a data do teu Day Pass:" },
          { id: uid(), role: "bot", kind: "daypass_picker" }
        ]);
        return;
      case "Preços":
        send("Quero ver preços");
        return;
      case "Horários":
        send("Quais são os horários?");
        return;
      case "Agendar tour":
        send("Quero agendar um tour");
        return;
      default:
        send(label);
    }
  };

  const confirmDayPass = () => {
    if (!dayPassDate) return;
    const date = new Date(`${dayPassDate}T00:00:00`);
    const pretty = date.toLocaleDateString("pt-PT", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "user", kind: "text", text: `Day Pass: ${pretty}` },
      {
        id: uid(),
        role: "bot",
        kind: "text",
        text: `Perfeito! Recebemos o teu pedido de Day Pass para ${pretty}. Entraremos em contacto em breve para confirmar disponibilidade e preços.`
      }
    ]);
    setFlow(null);
    setDayPassDate("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Chat de suporte"
          className="mb-3 w-[360px] max-w-[calc(100vw-2rem)] h-[min(640px,calc(100dvh-7rem))] overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl shadow-black/20 flex flex-col"
        >
          <div className="relative bg-[#0F0F0F] text-white">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/35 to-purple-600/35" />
            <div className="relative flex items-start justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                  Assistente
                </p>
                <p className="text-base font-bold leading-tight">Gaia Coworking</p>
                <p className="text-xs text-white/70 mt-1">
                  Resposta rápida
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/15 transition-colors"
                aria-label="Fechar chat"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
                  <path strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Scrollable content area (messages + quick actions + optional calendar) */}
          <div className="flex-1 min-h-0 overflow-auto px-4 py-4 space-y-4">
            <div className="space-y-3">
              {messages.map((m) => {
                const isUser = m.role === "user";
                const wrapperClass = isUser ? "flex justify-end" : "flex justify-start";
                const bubbleClass = isUser
                  ? "max-w-[85%] rounded-2xl rounded-br-md bg-[#0F0F0F] px-4 py-3 text-sm text-white shadow-soft"
                  : "max-w-[85%] rounded-2xl rounded-bl-md bg-[#F7F7F5] px-4 py-3 text-sm text-black/80 border border-black/5";

                if (m.kind === "text") {
                  return (
                    <div key={m.id} className={wrapperClass}>
                      <div className={bubbleClass}>{m.text}</div>
                    </div>
                  );
                }

                if (m.kind === "daypass_picker") {
                  return (
                    <div key={m.id} className="flex justify-start">
                      <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-white border border-black/10 shadow-soft p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50 mb-2">
                          Day Pass · escolher data
                        </p>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <input
                            type="date"
                            value={dayPassDate}
                            onChange={(e) => setDayPassDate(e.target.value)}
                            className="h-11 w-full sm:flex-1 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                          />
                          <button
                            type="button"
                            onClick={confirmDayPass}
                            disabled={!dayPassDate}
                            className="inline-flex h-11 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 text-sm font-semibold text-white shadow-soft hover:shadow-md transition-shadow disabled:opacity-50"
                          >
                            Confirmar
                          </button>
                        </div>
                        <p className="mt-2 text-xs text-black/50">
                          Depois confirmamos disponibilidade e preços através do chat.
                        </p>
                      </div>
                    </div>
                  );
                }

              })}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-[#F7F7F5] px-4 py-3 text-sm text-black/80 border border-black/5">
                    <div className="flex items-center gap-1">
                      <span className="inline-block w-2 h-2 bg-black/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="inline-block w-2 h-2 bg-black/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="inline-block w-2 h-2 bg-black/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            <div className="flex flex-wrap gap-2">
              {["Day Pass", "Preços", "Horários", "Agendar tour"].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => quickReply(label)}
                  className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-black/70 hover:border-blue-300 hover:text-black transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Fixed input bar */}
          <div className="px-4 pb-4 pt-3 border-t border-black/5 bg-white">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send(input);
                }}
                placeholder="Escreve a tua mensagem..."
                className="h-11 flex-1 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={() => send(input)}
                disabled={isLoading}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-soft hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Enviar"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group inline-flex items-center gap-2 rounded-full bg-[#0F0F0F] px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-black/20 hover:translate-y-[-2px] transition"
        aria-label={open ? "Fechar chat" : "Abrir chat"}
      >
        <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" aria-hidden>
            <path
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4z"
            />
          </svg>
        </span>
        <span className="hidden sm:inline">{open ? "Fechar" : "Chat"}</span>
        <span className="inline sm:hidden">{open ? "×" : "Chat"}</span>
      </button>
    </div>
  );
}
