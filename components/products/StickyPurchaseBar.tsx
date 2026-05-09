"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function StickyPurchaseBar({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show after the hero (~80vh) is mostly off-screen.
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const inStock = product.inStock && (product.stockQty ?? 0) > 0;

  const handleAdd = () => {
    addItem(product, 1);
    toast.success("Producto agregado al carrito", { description: product.name });
  };

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-slate-950/95 backdrop-blur-md transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="container mx-auto flex items-center gap-4 px-4 py-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-white">
          <Image src={product.image} alt="" fill sizes="48px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs uppercase tracking-wider text-slate-400">
            {product.brand}
          </p>
          <p className="truncate text-sm font-medium text-white">{product.name}</p>
        </div>
        <div className="hidden text-right sm:block">
          <p className="font-display text-lg font-bold text-cyan-400">
            {formatPrice(product.price)}
          </p>
        </div>
        <Button
          onClick={handleAdd}
          disabled={!inStock}
          variant="accent"
          size="default"
          className="shrink-0"
        >
          <ShoppingCart className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Agregar</span>
        </Button>
      </div>
    </div>
  );
}
