"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useCart } from "@/lib/store";
import { ShippingForm } from "@/components/checkout/ShippingForm";
import { PaymentForm } from "@/components/checkout/PaymentForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { Button } from "@/components/ui/button";
import { calcShipping } from "@/lib/shipping";
import type { ShippingFormValues } from "@/lib/validators";
import type { PaymentMethodId } from "@/lib/types";

type Step = "shipping" | "payment" | "processing" | "success";

const IS_SANDBOX = (process.env.NEXT_PUBLIC_IZIPAY_PUBLIC_KEY ?? "").startsWith("dev_") ||
  process.env.NODE_ENV !== "production";

export default function CheckoutPage() {
  const items = useCart((s) => s.items);
  const subtotalGross = useCart((s) => s.getSubtotalGross());
  const zoneId = useCart((s) => s.shippingZoneId);
  const clearCart = useCart((s) => s.clearCart);
  const shipping = calcShipping(zoneId, subtotalGross);
  const total = subtotalGross + shipping;

  const [step, setStep] = useState<Step>("shipping");
  const [shippingValues, setShippingValues] = useState<ShippingFormValues | null>(null);
  const [orderResult, setOrderResult] = useState<{ orderNumber: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const stepIndex = useMemo(() => {
    return { shipping: 0, payment: 1, processing: 2, success: 3 }[step];
  }, [step]);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-display text-3xl font-bold">Checkout</h1>
      </div>
    );
  }

  if (items.length === 0 && step !== "success") {
    return (
      <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 py-12 text-center">
        <h1 className="font-display text-2xl font-bold">No hay productos en el carrito</h1>
        <Button asChild>
          <Link href="/productos">Ver productos</Link>
        </Button>
      </div>
    );
  }

  const handleShippingSubmit = (values: ShippingFormValues) => {
    setShippingValues(values);
    setStep("payment");
  };

  const finalizeOrder = async (paymentInfo: {
    method: PaymentMethodId;
    installments: number;
    operationNumber?: string;
    paymentId: string;
  }) => {
    if (!shippingValues) return;
    setStep("processing");
    setError(null);

    try {
      // 2-3s simulated processing as per spec
      await new Promise((r) => setTimeout(r, 2500));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            firstName: shippingValues.firstName,
            lastName: shippingValues.lastName,
            email: shippingValues.email,
            phone: shippingValues.phone,
            address: shippingValues.address,
            district: shippingValues.district,
            city: shippingValues.city,
            reference: shippingValues.reference,
            documentType: shippingValues.documentType,
            documentNumber: shippingValues.documentNumber,
            companyName: shippingValues.companyName,
            fiscalAddress: shippingValues.fiscalAddress,
          },
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          shippingZoneId: shippingValues.shippingZoneId,
          invoiceType: shippingValues.invoiceType,
          paymentMethod: paymentInfo.method,
          installments: paymentInfo.installments,
          acceptedTermsAt: new Date().toISOString(),
          paymentId: paymentInfo.paymentId,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Error ${res.status}`);
      }

      const data = (await res.json()) as { orderNumber: string };
      setOrderResult({ orderNumber: data.orderNumber });
      clearCart();
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setStep("payment");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold md:text-4xl">Checkout</h1>

      <ol className="mt-6 flex flex-wrap gap-2 text-xs" aria-label="Progreso del checkout">
        {[
          { id: "shipping", label: "1. Envío" },
          { id: "payment", label: "2. Pago" },
          { id: "processing", label: "3. Procesando" },
          { id: "success", label: "4. Éxito" },
        ].map((s, idx) => (
          <li
            key={s.id}
            className={`rounded-full px-3 py-1 ${idx <= stepIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            aria-current={s.id === step ? "step" : undefined}
          >
            {s.label}
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          {step === "shipping" && (
            <div className="rounded-xl border bg-card p-6">
              <h2 className="mb-4 font-display text-xl font-semibold">Datos de envío</h2>
              <ShippingForm defaultZoneId={zoneId} onSubmit={handleShippingSubmit} />
            </div>
          )}

          {step === "payment" && shippingValues && (
            <div className="space-y-4 rounded-xl border bg-card p-6">
              <h2 className="font-display text-xl font-semibold">Método de pago</h2>
              {error && (
                <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <PaymentForm
                orderId={`pending-${Date.now()}`}
                amount={total}
                customerEmail={shippingValues.email}
                isSandbox={IS_SANDBOX}
                bankTransferEnabled={true}
                onSuccess={finalizeOrder}
              />
              <Button variant="outline" onClick={() => setStep("shipping")}>
                Volver a datos de envío
              </Button>
            </div>
          )}

          {step === "processing" && (
            <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-xl border bg-card p-12 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" aria-hidden />
              <h2 className="font-display text-xl font-bold">Procesando tu pago…</h2>
              <p className="text-sm text-muted-foreground">
                Estamos confirmando con la pasarela. No cierres esta ventana.
              </p>
            </div>
          )}

          {step === "success" && orderResult && (
            <div className="rounded-xl border bg-card p-8 text-center">
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" aria-hidden />
              <h2 className="mt-4 font-display text-2xl font-bold">¡Pedido confirmado!</h2>
              <p className="mt-2 text-muted-foreground">Recibirás un email con los detalles.</p>
              <div className="mx-auto mt-6 inline-block rounded-md bg-muted px-4 py-2 font-mono text-lg font-bold">
                {orderResult.orderNumber}
              </div>

              <div className="mx-auto mt-8 max-w-md text-left">
                <h3 className="font-display text-base font-semibold">Próximos pasos</h3>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
                  <li>Recibirás un email de confirmación en los próximos minutos.</li>
                  <li>Preparamos tu pedido en nuestro almacén (1–2 días hábiles).</li>
                  <li>Te avisamos cuando salga a despacho con número de seguimiento.</li>
                </ol>
              </div>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild>
                  <Link href="/">Volver al inicio</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/productos">Seguir comprando</Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        {step !== "success" && (
          <div>
            <OrderSummary />
          </div>
        )}
      </div>
    </div>
  );
}
