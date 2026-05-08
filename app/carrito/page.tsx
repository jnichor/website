"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/store";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-display text-3xl font-bold">Carrito</h1>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center gap-6 px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground" aria-hidden />
        <div>
          <h1 className="font-display text-3xl font-bold">Tu carrito está vacío</h1>
          <p className="mt-2 text-muted-foreground">
            Explorá nuestros productos y armá tu setup ideal.
          </p>
        </div>
        <Button asChild variant="accent" size="lg">
          <Link href="/productos">Ver productos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold md:text-4xl">Carrito de compras</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        <CartSummary />
      </div>
    </div>
  );
}
