"use client";

import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store";
import { SHIPPING_ZONES, calcShipping, FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import { IgvBreakdown } from "./IgvBreakdown";
import { formatPrice } from "@/lib/utils";

export function CartSummary() {
  const subtotalGross = useCart((s) => s.getSubtotalGross());
  const items = useCart((s) => s.items);
  const zoneId = useCart((s) => s.shippingZoneId);
  const setShippingZone = useCart((s) => s.setShippingZone);

  const shipping = calcShipping(zoneId, subtotalGross);
  const blockCheckout = items.some((i) => i.quantity > i.stockQty || i.stockQty === 0);

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotalGross);

  return (
    <aside className="sticky top-24 rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="font-display text-lg font-semibold">Resumen del pedido</h2>

      <div className="mt-4 space-y-2">
        <label className="text-sm font-medium" htmlFor="shipping-zone">
          Zona de envío
        </label>
        <Select value={zoneId} onValueChange={setShippingZone}>
          <SelectTrigger id="shipping-zone">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SHIPPING_ZONES.map((z) => (
              <SelectItem key={z.id} value={z.id}>
                {z.name} — {formatPrice(z.price)} ({z.minDeliveryDays}-{z.maxDeliveryDays} días)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {remainingForFreeShipping > 0 && shipping > 0 && (
        <p className="mt-3 rounded-md bg-amber-50 p-3 text-xs text-amber-800">
          Agregá <span className="font-semibold">{formatPrice(remainingForFreeShipping)}</span> más
          para obtener envío <span className="font-semibold">gratis</span>.
        </p>
      )}

      <div className="mt-6 border-t pt-4">
        <IgvBreakdown subtotalGross={subtotalGross} shipping={shipping} />
      </div>

      <div className="mt-6">
        <Button
          asChild={!blockCheckout}
          disabled={blockCheckout}
          variant="accent"
          size="lg"
          className="w-full"
        >
          {blockCheckout ? (
            <span>Hay items sin stock</span>
          ) : (
            <Link href="/checkout">Proceder al pago</Link>
          )}
        </Button>
        {blockCheckout && (
          <p className="mt-2 text-center text-xs text-destructive">
            Ajustá las cantidades de los items resaltados para continuar.
          </p>
        )}
      </div>
    </aside>
  );
}
