"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, X, RefreshCw, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatInput } from "./ChatInput";
import { ChatMessage, type ChatMessageData, type ChatProductRef } from "./ChatMessage";

const STORAGE_KEY = "novatech-chat-history-v1";
const WELCOME_MESSAGE: ChatMessageData = {
  id: "welcome",
  role: "model",
  content:
    "¡Hola! Soy Nova, el asistente de NovaTech Hardware. Puedo ayudarte a encontrar productos, consultar stock o precios. ¿Qué buscas hoy?",
};

interface ChatApiResponse {
  message: string;
  products?: ChatProductRef[];
  error?: string;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageData[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessageData[];
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      }
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
    } catch {
      // storage full or disabled — fine
    }
  }, [messages, hydrated]);

  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, open, loading]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: ChatMessageData = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const payload = nextMessages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });

      const data = (await res.json()) as ChatApiResponse;

      if (!res.ok) {
        setError(data.error ?? "Algo salió mal. Intenta de nuevo.");
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          role: "model",
          content: data.message,
          products: data.products,
        },
      ]);
    } catch {
      setError("No pude conectar con el servidor. Revisa tu conexión.");
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const reset = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    setError(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar chat" : "Abrir chat con Nova"}
        aria-expanded={open}
        className={cn(
          "fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all",
          "bg-primary text-primary-foreground hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          open && "scale-90 opacity-0 pointer-events-none",
        )}
      >
        <MessageCircle className="h-7 w-7" />
        <span
          aria-hidden
          className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-60" />
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Chat con Nova, asistente de NovaTech Hardware"
          className={cn(
            "fixed z-50 flex flex-col border bg-background shadow-2xl",
            "inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[600px] sm:max-h-[calc(100vh-3rem)] sm:w-[380px] sm:rounded-xl",
          )}
        >
          <header className="flex items-center justify-between gap-2 border-b bg-primary px-4 py-3 text-primary-foreground sm:rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/15">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <div className="font-semibold">Nova</div>
                <div className="text-xs opacity-80">Asistente NovaTech</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={reset}
                aria-label="Reiniciar conversación"
                className="rounded-md p-1.5 hover:bg-primary-foreground/15"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar chat"
                className="rounded-md p-1.5 hover:bg-primary-foreground/15"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-background px-3 py-4"
          >
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" />
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <ChatInput value={input} onChange={setInput} onSubmit={send} disabled={loading} />
        </div>
      )}
    </>
  );
}
