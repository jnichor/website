"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, Product } from "./types";

interface CartState {
  items: CartItem[];
  shippingZoneId: string;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setShippingZone: (zoneId: string) => void;
  getItemCount: () => number;
  getSubtotalGross: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      shippingZoneId: "lima-metropolitana",

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === product.id);
          const max = product.stockQty ?? 0;
          if (existing) {
            const newQty = Math.min(existing.quantity + quantity, max || existing.quantity + quantity);
            return {
              items: state.items.map((i) =>
                i.productId === product.id ? { ...i, quantity: newQty } : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                id: `cart-${product.id}`,
                productId: product.id,
                name: product.name,
                slug: product.slug,
                brand: product.brand,
                price: product.price,
                image: product.image,
                quantity: Math.min(quantity, max || quantity),
                stockQty: max,
                sku: product.sku,
              },
            ],
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.productId === productId
                ? {
                    ...i,
                    quantity: Math.max(0, Math.min(quantity, i.stockQty || quantity)),
                  }
                : i
            )
            .filter((i) => i.quantity > 0),
        })),

      clearCart: () => set({ items: [] }),

      setShippingZone: (zoneId) => set({ shippingZoneId: zoneId }),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getSubtotalGross: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "novatech-hardware-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
