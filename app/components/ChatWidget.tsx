"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  role: "bot" | "user";
  text: string;
};

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uid(),
      role: "bot",
      text: "Olá! Sou o assistente da Gaia Coworking. Em que posso ajudar?"
    }
  ]);

  const whatsappHref = useMemo(() => "https://wa.me/351000000000", []);
  const panelRef = useRef<HTMLDivElement | null>(null);

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

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "user", text: trimmed },
      {
        id: uid(),
        role: "bot",
        text: "Obrigado! Para resposta imediata, podes falar connosco no WhatsApp ou pedir preços/horários aqui."
      }
    ]);
    setInput("");
  };

  const quickReply = (label: string) => {
    switch (label) {
      case "Preços":
        setMessages((prev) => [
          ...prev,
          { id: uid(), role: "user", text: "Quero ver preços" },
          {
            id: uid(),
            role: "bot",
            text: "Perfeito — vê a secção de preços na página (ou diz-me o tipo de plano: day pass, mensal, equipa)."
          }
        ]);
        return;
      case "Horários":
        setMessages((prev) => [
          ...prev,
          { id: uid(), role: "user", text: "Quais são os horários?" },
          {
            id: uid(),
            role: "bot",
            text: "Diz-me o dia/necessidade (day pass, sala de reuniões, tour) e eu indico o melhor horário disponível."
          }
        ]);
        return;
      case "Agendar tour":
        setMessages((prev) => [
          ...prev,
          { id: uid(), role: "user", text: "Quero agendar um tour" },
          {
            id: uid(),
            role: "bot",
            text: "Ótimo! Diz-me 2 datas/horas preferidas e quantas pessoas vão."
          }
        ]);
        return;
      default:
        send(label);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Chat de suporte"
          className="mb-3 w-[320px] overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl shadow-black/20"
        >
          <div className="relative bg-[#0F0F0F] text-white">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/35 to-purple-600/35" />
            <div className="relative flex items-start justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                  Assistente
                </p>
                <p className="text-base font-bold leading-tight">Gaia Coworking</p>
                <p className="text-xs text-white/70 mt-1">
                  Resposta rápida · WhatsApp disponível
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

          <div className="max-h-[320px] space-y-3 overflow-auto px-4 py-4">
            {messages.map((m) => (
              <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-md bg-[#0F0F0F] px-4 py-3 text-sm text-white shadow-soft"
                      : "max-w-[85%] rounded-2xl rounded-bl-md bg-[#F7F7F5] px-4 py-3 text-sm text-black/80 border border-black/5"
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 pb-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {["Preços", "Horários", "Agendar tour"].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => quickReply(label)}
                  className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-black/70 hover:border-blue-300 hover:text-black transition-colors"
                >
                  {label}
                </button>
              ))}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow-soft hover:shadow-md transition-shadow"
              >
                WhatsApp
              </a>
            </div>

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
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-soft hover:shadow-md transition-shadow"
                aria-label="Enviar"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
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


