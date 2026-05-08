"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * IzipayEmbedded
 *
 * En PRODUCCIÓN:
 *   - Cargar el SDK oficial de Izipay vía <Script>:
 *     `https://api.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js`
 *   - Llamar a `KR.setFormConfig({ formToken, language: 'es-PE' })`
 *   - Montar `<div class="kr-embedded">` con `kr-public-key` data attribute.
 *   - Suscribirse a `KR.onSubmit(...)` y `KR.onFormReady(...)`.
 *
 * En DEV / SANDBOX (este componente):
 *   - Llama a /api/payment/create para obtener un mock formToken.
 *   - Renderiza un placeholder iframe con un botón "Pagar (sandbox)" que
 *     simula el flujo POST-eando al webhook con un payload firmado HMAC.
 *
 * NUNCA renderizamos inputs propios para card number / CVV. Eso es PCI-DSS
 * forbidden.
 */
export interface IzipayEmbeddedProps {
  orderId: string;
  amount: number; // gross PEN
  paymentMethodCode: string; // CARDS / YAPE / PLIN
  installments: number;
  customerEmail: string;
  onSuccess: (paymentId: string) => void;
  onError: (reason: string) => void;
}

export function IzipayEmbedded({
  orderId,
  amount,
  paymentMethodCode,
  installments,
  customerEmail,
  onSuccess,
  onError,
}: IzipayEmbeddedProps) {
  const [tokenState, setTokenState] = useState<
    | { status: "loading" }
    | { status: "ready"; formToken: string; publicKey: string }
    | { status: "error"; reason: string }
  >({ status: "loading" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/payment/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            amount,
            currency: "PEN",
            paymentMethodCode,
            installments,
            customer: { email: customerEmail, reference: orderId },
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? `HTTP ${res.status}`);
        }
        const data = (await res.json()) as { formToken: string; publicKey: string };
        if (!cancelled) {
          setTokenState({ status: "ready", formToken: data.formToken, publicKey: data.publicKey });
        }
      } catch (err) {
        if (!cancelled) {
          setTokenState({
            status: "error",
            reason: err instanceof Error ? err.message : "Unknown error",
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId, amount, paymentMethodCode, installments, customerEmail]);

  if (tokenState.status === "loading") {
    return (
      <div className="flex items-center gap-2 rounded-md border bg-muted p-4 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Inicializando pasarela segura…
      </div>
    );
  }

  if (tokenState.status === "error") {
    return (
      <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
        No se pudo cargar Izipay: {tokenState.reason}
      </div>
    );
  }

  const handleSandboxPay = async () => {
    setSubmitting(true);
    try {
      const paymentId = `sim-${Date.now()}`;
      const payload = {
        paymentId,
        orderId,
        status: "PAID",
        amount: Math.round(amount * 100),
        timestamp: Math.floor(Date.now() / 1000),
      };
      const rawBody = JSON.stringify(payload);

      // Get HMAC signature from a dev-only endpoint and POST to webhook
      const sigRes = await fetch("/api/payment/dev-sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: rawBody,
      });
      if (!sigRes.ok) throw new Error("Dev signing endpoint failed");
      const { signature } = (await sigRes.json()) as { signature: string };

      const wh = await fetch("/api/payment/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "kr-hash": signature,
          "kr-hash-key": "sha256_hmac",
        },
        body: rawBody,
      });
      if (!wh.ok) {
        const err = await wh.json().catch(() => ({}));
        throw new Error(err.error ?? `Webhook ${wh.status}`);
      }
      onSuccess(paymentId);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        id="kr-embedded"
        data-kr-public-key={tokenState.publicKey}
        data-kr-form-token={tokenState.formToken}
        className="rounded-md border-2 border-dashed border-muted-foreground/30 bg-muted/40 p-6 text-center text-sm text-muted-foreground"
        // In production, KR-Embedded's JS SDK auto-renders Visa/Mastercard inputs inside an
        // Izipay-hosted iframe. We never collect PAN/CVV ourselves.
      >
        <p className="font-semibold text-foreground">Pasarela segura Izipay</p>
        <p className="mt-2">
          En producción, este contenedor monta el iframe oficial KR-Embedded con los inputs
          de tarjeta hospedados por Izipay.
        </p>
        <p className="mt-2 text-xs">
          Form token activo: <code className="rounded bg-background px-1">{tokenState.formToken.slice(0, 24)}…</code>
        </p>
      </div>

      <Button
        type="button"
        size="lg"
        variant="accent"
        className="w-full"
        onClick={handleSandboxPay}
        disabled={submitting}
        aria-busy={submitting}
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Procesando…
          </>
        ) : (
          "Pagar (sandbox)"
        )}
      </Button>
    </div>
  );
}
