"use client";

import Image from "next/image";
import { useCart } from "@/lib/store";
import { calcShipping } from "@/lib/shipping";
import { formatPrice } from "@/lib/utils";
import { IgvBreakdown } from "@/components/cart/IgvBreakdown";

export function OrderSummary() {
  const items = useCart((s) => s.items);
  const subtotalGross = useCart((s) => s.getSubtotalGross());
  const zoneId = useCart((s) => s.shippingZoneId);
  const shipping = calcShipping(zoneId, subtotalGross);

  return (
    <aside className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="font-display text-lg font-semibold">Tu pedido</h2>

      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
              <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.brand} • Cantidad {item.quantity}
              </p>
            </div>
            <p className="shrink-0 text-sm font-semibold">
              {formatPrice(item.price * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t pt-4">
        <IgvBreakdown subtotalGross={subtotalGross} shipping={shipping} />
      </div>
    </aside>
  );
}
