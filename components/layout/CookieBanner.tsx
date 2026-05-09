"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "novatech-cookies-consent";

export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setOpen(true);
  }, []);

  const choose = (value: "all" | "necessary" | "custom") => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ value, timestamp: new Date().toISOString() })
    );
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed inset-x-2 bottom-2 z-50 mx-auto max-w-3xl rounded-xl border bg-card p-4 shadow-2xl sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex-1">
          <h2 className="font-display text-base font-semibold">Tu privacidad importa</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Usamos cookies para mejorar tu experiencia, analizar el tráfico y personalizar
            contenido. Puedes elegir cómo se usan tus datos. Más info en nuestra{" "}
            <Link href="/privacidad" className="underline hover:text-primary">
              Política de Privacidad
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button variant="outline" size="sm" onClick={() => choose("necessary")}>
            Solo necesarias
          </Button>
          <Button variant="outline" size="sm" onClick={() => choose("custom")}>
            Personalizar
          </Button>
          <Button size="sm" onClick={() => choose("all")}>
            Aceptar todas
          </Button>
        </div>
      </div>
    </div>
  );
}
