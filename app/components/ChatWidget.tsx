"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ChatItem =
  | { id: string; role: "bot" | "user"; kind: "text"; text: string }
  | { id: string; role: "bot"; kind: "daypass_picker" }
  | { id: string; role: "bot"; kind: "date_picker" }
  | { id: string; role: "bot"; kind: "email_input" }
  | { id: string; role: "bot"; kind: "name_input" }
  | { id: string; role: "bot"; kind: "confirm_reservation" }
  | { id: string; role: "bot"; kind: "payment_link"; href: string; text: string }
  | { id: string; role: "bot"; kind: "whatsapp_cta"; href: string; label?: string };

type ChatFlow = null | "daypass" | "reservation";

// Datos de la reserva en progreso
interface ReservationData {
  producto: string;
  subtipo: string;
  precio: string;
  precioCentavos: number;
  fecha?: string;
  email?: string;
  nombre?: string;
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Detectar si el mensaje del bot está pidiendo una fecha
function isAskingForDate(text: string): boolean {
  const dateKeywords = [
    "qual é a data", "qual a data", "que data", "que dia", "quando",
    "escolha a data", "escolhe a data", "seleciona a data", "selecione a data",
    "indica a data", "indique a data", "gostaria de reservar",
    "data que você gostaria", "data que gostaria", "data desejada",
  ];
  const lowerText = text.toLowerCase();
  return dateKeywords.some(keyword => lowerText.includes(keyword));
}

// Extraer link de pago de Stripe del mensaje
function extractPaymentLink(text: string): string | null {
  const stripePattern = /https:\/\/checkout\.stripe\.com\/[^\s\)\]]+/gi;
  const match = text.match(stripePattern);
  if (match) return match[0];
  return null;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [flow, setFlow] = useState<ChatFlow>(null);
  const [dayPassDate, setDayPassDate] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [reservationData, setReservationData] = useState<ReservationData | null>(null);
  const [reservationStep, setReservationStep] = useState<"date" | "email" | "name" | "confirm" | null>(null);
  const [tempEmail, setTempEmail] = useState("");
  const [tempName, setTempName] = useState("");
  const [messages, setMessages] = useState<ChatItem[]>([
    {
      id: uid(),
      role: "bot",
      kind: "text",
      text: "Olá! 👋 Sou o assistente da Gaia Coworking. Em que posso ajudar?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const whatsappHref = useMemo(() => "https://wa.me/351000000000", []);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const pendingMessageRef = useRef<string | null>(null);
  const pendingBookingRef = useRef<ReservationData | null>(null);

  // Close on escape/click outside
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

  // Handle custom events (from price page and success page)
  useEffect(() => {
    const onChatEvent = (e: Event) => {
      const ev = e as CustomEvent<{ 
        open?: boolean; 
        flow?: ChatFlow;
        message?: string;
        systemMessage?: string;
        booking?: {
          product: string;
          subtype: string;
          price: string;
          priceCents: number;
        };
      }>;
      
      if (ev.detail?.open) {
        setOpen(true);
      }
      
      // Mensaje del sistema (de la página de success)
      if (ev.detail?.systemMessage) {
        setMessages((prev) => [
          ...prev,
          { id: uid(), role: "bot", kind: "text", text: ev.detail.systemMessage! }
        ]);
        // Limpiar cualquier flujo de reserva activo
        setFlow(null);
        setReservationData(null);
        setReservationStep(null);
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
      
      // Si viene de la página de precios con datos de reserva
      if (ev.detail?.booking) {
        const booking = ev.detail.booking;
        pendingBookingRef.current = {
          producto: booking.product,
          subtipo: booking.subtype,
          precio: booking.price,
          precioCentavos: booking.priceCents,
        };
      }
      
      if (ev.detail?.message) {
        pendingMessageRef.current = ev.detail.message;
      }
    };
    window.addEventListener("gc:chat", onChatEvent);
    return () => window.removeEventListener("gc:chat", onChatEvent);
  }, []);

  // Handle pending booking when chat opens
  useEffect(() => {
    if (open && pendingBookingRef.current) {
      const booking = pendingBookingRef.current;
      pendingBookingRef.current = null;
      pendingMessageRef.current = null; // Clear pending message too
      
      // Start reservation flow
      setReservationData(booking);
      setFlow("reservation");
      setReservationStep("date");
      
      setMessages((prev) => [
        ...prev,
        { 
          id: uid(), 
          role: "user", 
          kind: "text", 
          text: `Quero reservar ${booking.producto} - ${booking.subtipo} (${booking.precio})` 
        },
        { 
          id: uid(), 
          role: "bot", 
          kind: "text", 
          text: `Excelente escolha! 🎉\n\n📦 **${booking.producto}**\n📋 **${booking.subtipo}**\n💰 **${booking.precio}**\n\nVamos fazer a tua reserva. Primeiro, escolhe a data:` 
        },
        { id: uid(), role: "bot", kind: "date_picker" }
      ]);
    } else if (open && pendingMessageRef.current) {
      const messageToSend = pendingMessageRef.current;
      pendingMessageRef.current = null;
      setTimeout(() => {
        send(messageToSend);
      }, 300);
    }
  }, [open]);

  // Auto-scroll
  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      scrollRef.current?.scrollIntoView({ block: "end" });
    });
  }, [open, messages.length, flow, reservationStep]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage: ChatItem = { id: uid(), role: "user", kind: "text", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/webhook/e05bf1eb-8902-4711-beb1-136110b75941", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          sessionId: "chat-widget",
        }),
      });

      const data = await response.json();
      
      if (!response.ok || data.error) {
        throw new Error(data.error || data.message || `Error ${response.status}`);
      }

      let botResponse: string | null = null;
      
      if (typeof data === 'string') {
        botResponse = data;
      } else if (Array.isArray(data) && data.length > 0) {
        const firstItem = data[0];
        botResponse = firstItem.json?.answer || firstItem.json?.response || 
                     firstItem.json?.message || firstItem.answer || firstItem.response;
      } else if (typeof data === 'object' && data !== null) {
        botResponse = data.answer || data.response || data.message || data.text || data.output;
      }
      
      if (!botResponse || botResponse === "[object Object]") {
        botResponse = "Desculpe, não consegui processar a resposta.";
      }
      
      if (typeof botResponse === 'string') {
        botResponse = botResponse.replace(/\\n/g, '\n').replace(/\\"/g, '"').trim();
      }

      // Check for payment link
      const paymentLink = extractPaymentLink(botResponse);
      
      if (paymentLink) {
        const cleanText = botResponse.replace(paymentLink, '').trim();
        const newMessages: ChatItem[] = [];
        
        if (cleanText) {
          newMessages.push({ id: uid(), role: "bot", kind: "text", text: cleanText });
        }
        newMessages.push({ id: uid(), role: "bot", kind: "payment_link", href: paymentLink, text: "💳 Pagar Agora" });
        
        setMessages((prev) => [...prev, ...newMessages]);
      } else {
        const botMessage: ChatItem = { id: uid(), role: "bot", kind: "text", text: botResponse };
        
        // Check if we should show date picker
        if (isAskingForDate(botResponse) && !reservationStep) {
          setMessages((prev) => [...prev, botMessage, { id: uid(), role: "bot", kind: "date_picker" }]);
        } else {
          setMessages((prev) => [...prev, botMessage]);
        }
      }
    } catch (error: unknown) {
      const errorText = error instanceof Error ? error.message : "Erro desconhecido";
      const errorMessage: ChatItem = {
        id: uid(),
        role: "bot",
        kind: "text",
        text: `Desculpe, ocorreu um erro. Por favor, tenta novamente. 😔`,
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error("Chat error:", errorText);
    } finally {
      setIsLoading(false);
    }
  };

  // RESERVATION FLOW HANDLERS
  const handleDateConfirm = () => {
    if (!selectedDate || !reservationData) return;
    
    const date = new Date(`${selectedDate}T12:00:00`);
    const prettyDate = date.toLocaleDateString("pt-PT", { 
      weekday: "long", day: "numeric", month: "long", year: "numeric" 
    });
    
    setReservationData({ ...reservationData, fecha: selectedDate });
    setReservationStep("email");
    setSelectedDate("");
    
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "user", kind: "text", text: `📅 ${prettyDate}` },
      { id: uid(), role: "bot", kind: "text", text: `Perfeito! Data selecionada: **${prettyDate}** ✅\n\nAgora preciso do teu email:` },
      { id: uid(), role: "bot", kind: "email_input" }
    ]);
  };

  const handleEmailConfirm = () => {
    const email = tempEmail.trim().toLowerCase();
    if (!email || !email.includes("@") || !reservationData) return;
    
    setReservationData({ ...reservationData, email });
    setReservationStep("name");
    setTempEmail("");
    
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "user", kind: "text", text: `📧 ${email}` },
      { id: uid(), role: "bot", kind: "text", text: `Email registado! ✅\n\nPor último, qual é o teu nome completo?` },
      { id: uid(), role: "bot", kind: "name_input" }
    ]);
  };

  const handleNameConfirm = () => {
    const name = tempName.trim();
    if (!name || name.length < 2 || !reservationData) return;
    
    const updatedData = { ...reservationData, nombre: name };
    setReservationData(updatedData);
    setReservationStep("confirm");
    setTempName("");
    
    const date = new Date(`${updatedData.fecha}T12:00:00`);
    const prettyDate = date.toLocaleDateString("pt-PT", { 
      weekday: "long", day: "numeric", month: "long" 
    });
    
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "user", kind: "text", text: `👤 ${name}` },
      { 
        id: uid(), 
        role: "bot", 
        kind: "text", 
        text: `Obrigado, ${name}! 🎉\n\n**Resumo da Reserva:**\n\n📦 **Produto:** ${updatedData.producto}\n📋 **Plano:** ${updatedData.subtipo}\n📅 **Data:** ${prettyDate}\n💰 **Preço:** ${updatedData.precio}\n📧 **Email:** ${updatedData.email}\n👤 **Nome:** ${name}\n\nTudo correto?` 
      },
      { id: uid(), role: "bot", kind: "confirm_reservation" }
    ]);
  };

  const handleReservationConfirm = async () => {
    if (!reservationData || !reservationData.fecha || !reservationData.email || !reservationData.nombre) return;
    
    setIsLoading(true);
    setReservationStep(null);
    setFlow(null);
    
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "user", kind: "text", text: "✅ Confirmar reserva" },
      { id: uid(), role: "bot", kind: "text", text: "A processar a tua reserva... ⏳" }
    ]);
    
    try {
      // Enviar al webhook PRINCIPAL con mensaje formateado para el AI Agent
      // El AI Agent llamará al subworkflow crear_reserva
      const formattedMessage = `CRIAR RESERVA:
- Produto: ${reservationData.producto}
- Plano: ${reservationData.subtipo}
- Data: ${reservationData.fecha}
- Email: ${reservationData.email}
- Nome: ${reservationData.nombre}
- Preço: ${reservationData.precioCentavos} centavos

Por favor, usa a ferramenta criar_reserva com estes dados: produto="${reservationData.producto}", subtipo="${reservationData.subtipo}", fechas=["${reservationData.fecha}"], email="${reservationData.email}", nombre="${reservationData.nombre}", precio_centavos=${reservationData.precioCentavos}`;

      const response = await fetch("/api/webhook/e05bf1eb-8902-4711-beb1-136110b75941", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: formattedMessage,
          sessionId: `reserva-${Date.now()}`,
        }),
      });
      
      const data = await response.json();
      console.log("Reservation response:", data);
      
      // Extraer respuesta del AI Agent
      let responseText = "";
      if (typeof data === 'string') {
        responseText = data;
      } else if (Array.isArray(data) && data.length > 0) {
        responseText = data[0].json?.answer || data[0].json?.response || data[0].answer || data[0].response || "";
      } else if (typeof data === 'object') {
        responseText = data.answer || data.response || data.message || data.text || "";
      }
      
      if (typeof responseText !== 'string') {
        responseText = JSON.stringify(responseText);
      }
      
      responseText = responseText.replace(/\\n/g, '\n').trim();
      
      // Check for payment link in the response
      const paymentLink = extractPaymentLink(responseText);
      
      if (paymentLink) {
        setReservationData(null);
        
        const cleanText = responseText.replace(paymentLink, '').trim();
        
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { id: uid(), role: "bot", kind: "text", text: cleanText || "✅ Reserva criada com sucesso!" },
          { id: uid(), role: "bot", kind: "payment_link", href: paymentLink, text: "💳 Pagar Agora" }
        ]);
      } else if (data.error) {
        throw new Error(data.message || responseText || "Erro ao criar reserva");
      } else {
        // No payment link - show the response
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { id: uid(), role: "bot", kind: "text", text: responseText || "Reserva processada! O AI está a processar o teu pedido." }
        ]);
      }
    } catch (error: unknown) {
      const errorText = error instanceof Error ? error.message : "Erro desconhecido";
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { 
          id: uid(), 
          role: "bot", 
          kind: "text", 
          text: `Desculpe, ocorreu um erro: ${errorText}\n\nPor favor, tenta novamente ou contacta-nos via WhatsApp. 😔` 
        }
      ]);
    } finally {
      setIsLoading(false);
      setReservationData(null);
    }
  };

  const handleReservationCancel = () => {
    setFlow(null);
    setReservationData(null);
    setReservationStep(null);
    setSelectedDate("");
    setTempEmail("");
    setTempName("");
    
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "user", kind: "text", text: "❌ Cancelar" },
      { id: uid(), role: "bot", kind: "text", text: "Reserva cancelada. Se precisares de ajuda, estou aqui! 😊" }
    ]);
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
    const text = `Olá! Gostaria de reservar um Day Pass para ${pretty}.`;
    const wa = `${whatsappHref}?text=${encodeURIComponent(text)}`;

    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "user", kind: "text", text: `Day Pass: ${pretty}` },
      { id: uid(), role: "bot", kind: "text", text: "Perfeito! Para confirmarmos disponibilidade, envia-nos esta data no WhatsApp:" },
      { id: uid(), role: "bot", kind: "whatsapp_cta", href: wa, label: "Enviar no WhatsApp" }
    ]);
    setFlow(null);
    setDayPassDate("");
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
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
          {/* Header */}
          <div className="relative bg-[#0F0F0F] text-white">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/35 to-purple-600/35" />
            <div className="relative flex items-start justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Assistente</p>
                <p className="text-base font-bold leading-tight">Gaia Coworking</p>
                <p className="text-xs text-white/70 mt-1">Resposta rápida · WhatsApp disponível</p>
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

          {/* Messages */}
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
                      <div className={bubbleClass} style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
                    </div>
                  );
                }

                if (m.kind === "daypass_picker") {
                  return (
                    <div key={m.id} className="flex justify-start">
                      <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-white border border-black/10 shadow-soft p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50 mb-2">Day Pass · escolher data</p>
                        <div className="flex flex-col gap-2">
                          <input
                            type="date"
                            value={dayPassDate}
                            min={getMinDate()}
                            onChange={(e) => setDayPassDate(e.target.value)}
                            className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                          />
                          <button
                            type="button"
                            onClick={confirmDayPass}
                            disabled={!dayPassDate}
                            className="h-11 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 text-sm font-semibold text-white shadow-soft hover:shadow-md transition-shadow disabled:opacity-50"
                          >
                            Confirmar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (m.kind === "date_picker") {
                  return (
                    <div key={m.id} className="flex justify-start">
                      <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 shadow-soft p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-700 mb-3">📅 Selecionar Data</p>
                        <div className="flex flex-col gap-2">
                          <input
                            type="date"
                            value={selectedDate}
                            min={getMinDate()}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="h-12 w-full rounded-xl border border-blue-200 bg-white px-4 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleDateConfirm}
                              disabled={!selectedDate}
                              className="flex-1 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 text-sm font-semibold text-white shadow-soft disabled:opacity-50"
                            >
                              ✓ Confirmar
                            </button>
                            {reservationStep && (
                              <button
                                type="button"
                                onClick={handleReservationCancel}
                                className="h-11 px-4 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50"
                              >
                                Cancelar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (m.kind === "email_input") {
                  return (
                    <div key={m.id} className="flex justify-start">
                      <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 shadow-soft p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-700 mb-3">📧 O teu Email</p>
                        <div className="flex flex-col gap-2">
                          <input
                            type="email"
                            value={tempEmail}
                            onChange={(e) => setTempEmail(e.target.value)}
                            placeholder="email@exemplo.com"
                            className="h-12 w-full rounded-xl border border-blue-200 bg-white px-4 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleEmailConfirm}
                              disabled={!tempEmail.includes("@")}
                              className="flex-1 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 text-sm font-semibold text-white shadow-soft disabled:opacity-50"
                            >
                              ✓ Confirmar
                            </button>
                            <button
                              type="button"
                              onClick={handleReservationCancel}
                              className="h-11 px-4 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (m.kind === "name_input") {
                  return (
                    <div key={m.id} className="flex justify-start">
                      <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 shadow-soft p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-700 mb-3">👤 O teu Nome</p>
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            placeholder="Nome completo"
                            className="h-12 w-full rounded-xl border border-blue-200 bg-white px-4 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleNameConfirm}
                              disabled={tempName.trim().length < 2}
                              className="flex-1 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 text-sm font-semibold text-white shadow-soft disabled:opacity-50"
                            >
                              ✓ Confirmar
                            </button>
                            <button
                              type="button"
                              onClick={handleReservationCancel}
                              className="h-11 px-4 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (m.kind === "confirm_reservation") {
                  return (
                    <div key={m.id} className="flex justify-start">
                      <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 shadow-soft p-4">
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={handleReservationConfirm}
                            disabled={isLoading}
                            className="h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-4 text-sm font-semibold text-white shadow-soft hover:shadow-md disabled:opacity-50"
                          >
                            {isLoading ? "A processar..." : "✅ Confirmar e Pagar"}
                          </button>
                          <button
                            type="button"
                            onClick={handleReservationCancel}
                            disabled={isLoading}
                            className="h-10 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 disabled:opacity-50"
                          >
                            ❌ Cancelar Reserva
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (m.kind === "payment_link") {
                  return (
                    <div key={m.id} className="flex justify-start">
                      <a
                        href={m.href}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full max-w-[90%] flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                      >
                        {m.text}
                      </a>
                    </div>
                  );
                }

                // whatsapp_cta
                return (
                  <div key={m.id} className="flex justify-start">
                    <a
                      href={m.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-soft hover:shadow-md transition-shadow"
                    >
                      {m.label ?? "WhatsApp"}
                    </a>
                  </div>
                );
              })}
              
              {isLoading && !reservationStep && (
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

            {/* Quick actions - only show when not in reservation flow */}
            {!reservationStep && (
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
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow-soft hover:shadow-md transition-shadow"
                >
                  WhatsApp
                </a>
              </div>
            )}
          </div>

          {/* Input - hide during reservation flow steps */}
          {!reservationStep && (
            <div className="px-4 pb-4 pt-3 border-t border-black/5 bg-white">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !isLoading) send(input); }}
                  placeholder="Escreve a tua mensagem..."
                  className="h-11 flex-1 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => send(input)}
                  disabled={isLoading}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-soft hover:shadow-md transition-shadow disabled:opacity-50"
                  aria-label="Enviar"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="group inline-flex items-center gap-2 rounded-full bg-[#0F0F0F] px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-black/20 hover:translate-y-[-2px] transition"
        aria-label={open ? "Fechar chat" : "Abrir chat"}
      >
        <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4z" />
          </svg>
        </span>
        <span className="hidden sm:inline">{open ? "Fechar" : "Chat"}</span>
        <span className="inline sm:hidden">{open ? "×" : "Chat"}</span>
      </button>
    </div>
  );
}
