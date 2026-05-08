"use client";

import { useState } from "react";
import { Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PAYMENT_METHODS, TEST_CARDS, detectCardBrand } from "@/lib/izipay";
import { IzipayEmbedded } from "./IzipayEmbedded";
import type { PaymentMethodId } from "@/lib/types";

interface Props {
  orderId: string;
  amount: number;
  customerEmail: string;
  isSandbox: boolean;
  bankTransferEnabled: boolean;
  onSuccess: (info: {
    method: PaymentMethodId;
    installments: number;
    operationNumber?: string;
    paymentId: string;
  }) => void;
}

const INSTALLMENT_OPTIONS = [1, 3, 6, 12];

export function PaymentForm({
  orderId,
  amount,
  customerEmail,
  isSandbox,
  bankTransferEnabled,
  onSuccess,
}: Props) {
  const [method, setMethod] = useState<PaymentMethodId>("yape");
  const [installments, setInstallments] = useState<number>(1);
  const [operationNumber, setOperationNumber] = useState("");
  const [pan4, setPan4] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submittingWallet, setSubmittingWallet] = useState(false);

  const config = PAYMENT_METHODS.find((p) => p.id === method);
  const isCard = config?.type === "card";
  const isWallet = config?.type === "wallet";
  const isCredit = isCard && config?.cardType === "credit";
  const detectedBrand =
    isCard && pan4.length >= 1 ? detectCardBrand(pan4) : null;

  const expectedBrand =
    isCard && config?.brand === "visa"
      ? "visa"
      : isCard && config?.brand === "mastercard"
        ? "mastercard"
        : null;
  const brandMismatch =
    expectedBrand && detectedBrand && detectedBrand !== "unknown" && detectedBrand !== expectedBrand;

  const handleWalletPay = async () => {
    setError(null);
    if (!/^\d{8,10}$/.test(operationNumber)) {
      setError("El número de operación debe tener entre 8 y 10 dígitos");
      return;
    }
    setSubmittingWallet(true);
    try {
      // POST sandbox webhook for Yape/Plin
      const paymentId = `op-${operationNumber}`;
      const payload = {
        paymentId,
        orderId,
        status: "PAID",
        amount: Math.round(amount * 100),
        timestamp: Math.floor(Date.now() / 1000),
      };
      const rawBody = JSON.stringify(payload);
      const sigRes = await fetch("/api/payment/dev-sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: rawBody,
      });
      const { signature } = (await sigRes.json()) as { signature: string };
      const res = await fetch("/api/payment/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "kr-hash": signature,
          "kr-hash-key": "sha256_hmac",
        },
        body: rawBody,
      });
      if (!res.ok) throw new Error("Webhook rechazado");
      onSuccess({ method, installments: 1, operationNumber, paymentId });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error procesando pago");
    } finally {
      setSubmittingWallet(false);
    }
  };

  const visibleMethods = bankTransferEnabled
    ? [...PAYMENT_METHODS, { id: "transfer" as const, label: "Transferencia bancaria", type: "transfer", installments: false, logo: "/payments/transfer.svg" }]
    : PAYMENT_METHODS;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-lg font-semibold">Elegí tu método de pago</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Aceptamos billeteras y tarjetas oficiales. Tu información viaja siempre cifrada.
        </p>
      </div>

      <RadioGroup
        value={method}
        onValueChange={(v) => {
          setMethod(v as PaymentMethodId);
          setInstallments(1);
          setError(null);
        }}
        className="grid gap-3 sm:grid-cols-2"
      >
        {visibleMethods.map((m) => (
          <label
            key={m.id}
            htmlFor={`pm-${m.id}`}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 transition-colors ${
              method === m.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
            }`}
          >
            <RadioGroupItem id={`pm-${m.id}`} value={m.id} />
            <span className="flex h-8 w-12 items-center justify-center rounded bg-white text-[10px] font-bold uppercase">
              {m.id === "yape" && <span className="text-[#742583]">Yape</span>}
              {m.id === "plin" && <span className="text-[#00BFE7]">Plin</span>}
              {m.id.includes("visa") && <span className="text-[#1A1F71]">VISA</span>}
              {m.id.includes("mc-") && <span className="text-[#EB001B]">MC</span>}
              {m.id === "transfer" && <span>BANK</span>}
            </span>
            <span className="flex-1 text-sm font-medium">{m.label}</span>
          </label>
        ))}
      </RadioGroup>

      {/* Card credit installments */}
      {isCredit && (
        <div className="rounded-lg border bg-muted/50 p-4">
          <Label className="mb-2 block">Cuotas</Label>
          <RadioGroup
            value={String(installments)}
            onValueChange={(v) => setInstallments(Number(v))}
            className="flex flex-wrap gap-3"
          >
            {INSTALLMENT_OPTIONS.map((n) => (
              <label
                key={n}
                className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm"
              >
                <RadioGroupItem value={String(n)} />
                {n === 1 ? "1 pago" : `${n} cuotas`}
              </label>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Card UX-only brand validation */}
      {isCard && (
        <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
          <Label htmlFor="pan-prefix" className="text-xs">
            Primeros 4 dígitos (validación local — no se envía al backend)
          </Label>
          <Input
            id="pan-prefix"
            value={pan4}
            onChange={(e) => setPan4(e.target.value.replace(/\D/g, "").slice(0, 4))}
            inputMode="numeric"
            maxLength={4}
            placeholder="4xxx"
            aria-invalid={brandMismatch ? true : undefined}
          />
          {brandMismatch && (
            <p className="text-xs text-destructive">
              Estos dígitos parecen pertenecer a otra marca. Verificá el método elegido.
            </p>
          )}
        </div>
      )}

      {/* Card -> Izipay iframe */}
      {isCard && (
        <IzipayEmbedded
          orderId={orderId}
          amount={amount}
          paymentMethodCode={config?.brand === "visa" ? "VISA" : "MASTERCARD"}
          installments={installments}
          customerEmail={customerEmail}
          onSuccess={(paymentId) =>
            onSuccess({ method, installments, paymentId })
          }
          onError={(reason) => setError(reason)}
        />
      )}

      {/* Yape/Plin */}
      {isWallet && (
        <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center justify-center rounded-md bg-white p-6">
            <div className="flex h-40 w-40 items-center justify-center border-2 border-dashed border-muted-foreground/40 text-xs text-muted-foreground">
              QR de {config?.label}
            </div>
          </div>
          <ol className="list-decimal space-y-1.5 pl-5 text-sm">
            <li>Abrí la app de {config?.label}</li>
            <li>Escaneá el QR de arriba</li>
            <li>Ingresá el monto: S/ {amount.toFixed(2)}</li>
            <li>Copiá el N° de operación</li>
          </ol>
          <div>
            <Label htmlFor="operation-number">N° de operación</Label>
            <Input
              id="operation-number"
              value={operationNumber}
              onChange={(e) => setOperationNumber(e.target.value.replace(/\D/g, ""))}
              inputMode="numeric"
              maxLength={10}
              placeholder="12345678"
            />
          </div>
          <Button
            type="button"
            variant="accent"
            size="lg"
            className="w-full"
            disabled={submittingWallet || !/^\d{8,10}$/.test(operationNumber)}
            onClick={handleWalletPay}
          >
            {submittingWallet ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Verificando…
              </>
            ) : (
              "Confirmar pago"
            )}
          </Button>
        </div>
      )}

      {/* Bank transfer */}
      {method === "transfer" && (
        <div className="space-y-3 rounded-lg border bg-muted/30 p-4 text-sm">
          <p className="font-semibold">Datos para transferencia</p>
          <ul className="space-y-1">
            <li>BCP: 191-2345678901-0-23</li>
            <li>Interbank: 200-3001234567</li>
            <li>BBVA: 0011-0123-0100012345</li>
          </ul>
          <p className="text-xs text-muted-foreground">
            El pedido queda en estado “pendiente de verificación” hasta validar el comprobante
            (TODO: integrar uploader de comprobante con el PSE).
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Sandbox test cards hint — only en TEST */}
      {isSandbox && isCard && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900">
          <div className="mb-2 flex items-center gap-2 font-semibold">
            <Info className="h-4 w-4" aria-hidden />
            Tarjetas de prueba (TEST)
          </div>
          <ul className="space-y-1">
            {TEST_CARDS.map((c) => (
              <li key={c.number}>
                <span className="font-mono">{c.number}</span> · CVV {c.cvv} · {c.exp} ·{" "}
                {c.brand} ({c.result})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
