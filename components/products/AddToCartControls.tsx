"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store";
import type { Product } from "@/lib/types";

export function AddToCartControls({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCart((s) => s.addItem);
  const max = product.stockQty ?? 0;
  const [qty, setQty] = useState(1);

  if (!product.inStock || max === 0) {
    return (
      <Button disabled size="lg" className="w-full">
        Sin stock
      </Button>
    );
  }

  const handleAdd = () => {
    addItem(product, qty);
    toast.success("Producto agregado al carrito", {
      description: `${product.name} x${qty}`,
    });
  };

  const handleBuyNow = () => {
    addItem(product, qty);
    router.push("/checkout");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center rounded-md border">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Disminuir cantidad"
          >
            <Minus className="h-4 w-4" aria-hidden />
          </button>
          <span className="w-12 text-center font-medium" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(max, q + 1))}
            className="flex h-10 w-10 items-center justify-center hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Aumentar cantidad"
          >
            <Plus className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <p className="text-xs text-muted-foreground">{max} disponibles</p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={handleAdd} variant="accent" size="lg" className="flex-1">
          <ShoppingCart className="h-4 w-4" aria-hidden />
          Agregar al carrito
        </Button>
        <Button onClick={handleBuyNow} size="lg" variant="default">
          <Zap className="h-4 w-4" aria-hidden />
          Comprar ahora
        </Button>
      </div>
    </div>
  );
}
