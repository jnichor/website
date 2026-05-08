"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/store";

export function CartIcon() {
  const [mounted, setMounted] = useState(false);
  const count = useCart((s) => s.getItemCount());

  useEffect(() => setMounted(true), []);

  return (
    <Link
      href="/carrito"
      aria-label={`Ir al carrito, ${mounted ? count : 0} productos`}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <ShoppingCart className="h-5 w-5" aria-hidden />
      {mounted && count > 0 && (
        <span
          className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground"
          aria-live="polite"
        >
          {count}
        </span>
      )}
    </Link>
  );
}
