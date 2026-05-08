"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "@/lib/types";
import { useCart } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function CartItem({ item }: { item: CartItemType }) {
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const isOutOfStock = item.stockQty === 0;
  const exceedsStock = item.quantity > item.stockQty;

  return (
    <div className="grid grid-cols-[80px_1fr] gap-4 rounded-lg border bg-card p-4 sm:grid-cols-[100px_1fr_auto] sm:gap-6">
      <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
        <Image src={item.image} alt={item.name} fill sizes="100px" className="object-cover" />
      </div>

      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{item.brand}</p>
        <Link
          href={`/productos/${item.slug}`}
          className="line-clamp-2 text-sm font-medium hover:text-primary"
        >
          {item.name}
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">SKU: {item.sku}</p>

        {isOutOfStock && (
          <Badge variant="destructive" className="mt-2">
            Agotado
          </Badge>
        )}
        {!isOutOfStock && exceedsStock && (
          <Badge variant="warning" className="mt-2">
            Solo quedan {item.stockQty}
          </Badge>
        )}

        <div className="mt-3 flex items-center gap-3 sm:hidden">
          <QtyStepper item={item} onChange={(q) => updateQuantity(item.productId, q)} />
          <p className="ml-auto font-semibold text-primary">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>

      <div className="hidden flex-col items-end gap-3 sm:flex">
        <p className="font-display text-lg font-bold text-primary">
          {formatPrice(item.price * item.quantity)}
        </p>
        <QtyStepper item={item} onChange={(q) => updateQuantity(item.productId, q)} />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeItem(item.productId)}
          aria-label={`Eliminar ${item.name}`}
        >
          <Trash2 className="h-4 w-4" aria-hidden />
          Eliminar
        </Button>
      </div>

      <div className="col-span-2 flex justify-end sm:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeItem(item.productId)}
          aria-label={`Eliminar ${item.name}`}
        >
          <Trash2 className="h-4 w-4" aria-hidden />
          Eliminar
        </Button>
      </div>
    </div>
  );
}

function QtyStepper({
  item,
  onChange,
}: {
  item: CartItemType;
  onChange: (q: number) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-md border">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, item.quantity - 1))}
        className="flex h-9 w-9 items-center justify-center hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Disminuir cantidad"
      >
        <Minus className="h-3.5 w-3.5" aria-hidden />
      </button>
      <span className="w-10 text-center text-sm font-medium" aria-live="polite">
        {item.quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(item.stockQty, item.quantity + 1))}
        disabled={item.quantity >= item.stockQty}
        className="flex h-9 w-9 items-center justify-center hover:bg-muted disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Aumentar cantidad"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden />
      </button>
    </div>
  );
}
