// ============================================================================
// Stub DB layer.
//
// In production this file should export a Prisma client singleton:
//
//   import { PrismaClient } from "@prisma/client";
//   const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
//   export const prisma = globalForPrisma.prisma ?? new PrismaClient();
//   if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
//
// For local dev we keep an in-memory store backed by lib/products.ts. This
// keeps `npm run dev` working with no real database.
// ============================================================================

import { PRODUCTS, getProductById } from "./products";
import type { OrderInput, Product } from "./types";

export interface MockOrder {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  paymentId?: string;
  installments: number;
  invoiceType: "boleta" | "factura";
  documentType: "DNI" | "RUC";
  documentNumber: string;
  customer: OrderInput["customer"];
  items: { productId: string; productName: string; productSku: string; price: number; quantity: number }[];
  subtotalNet: number;
  igv: number;
  subtotalGross: number;
  shipping: number;
  total: number;
  acceptedTermsAt: string;
  createdAt: string;
  updatedAt: string;
}

const ordersStore = new Map<string, MockOrder>();
const ordersByPaymentId = new Map<string, string>();

export interface MockComplaint {
  id: string;
  complaintNumber: string;
  status: string;
  type: "reclamo" | "queja";
  fullName: string;
  email: string;
  createdAt: string;
}

const complaintsStore: MockComplaint[] = [];

export const db = {
  product: {
    list(): Product[] {
      return PRODUCTS;
    },
    findById(id: string): Product | undefined {
      return getProductById(id);
    },
  },

  order: {
    create(order: MockOrder) {
      ordersStore.set(order.id, order);
      if (order.paymentId) ordersByPaymentId.set(order.paymentId, order.id);
      return order;
    },
    findById(id: string) {
      return ordersStore.get(id);
    },
    findByPaymentId(paymentId: string) {
      const id = ordersByPaymentId.get(paymentId);
      return id ? ordersStore.get(id) : undefined;
    },
    findByOrderNumber(orderNumber: string) {
      for (const o of ordersStore.values()) {
        if (o.orderNumber === orderNumber) return o;
      }
      return undefined;
    },
    update(id: string, patch: Partial<MockOrder>) {
      const existing = ordersStore.get(id);
      if (!existing) return undefined;
      const updated = { ...existing, ...patch, updatedAt: new Date().toISOString() };
      ordersStore.set(id, updated);
      if (updated.paymentId) ordersByPaymentId.set(updated.paymentId, id);
      return updated;
    },
  },

  complaint: {
    create(complaint: MockComplaint) {
      complaintsStore.push(complaint);
      return complaint;
    },
    nextSeq() {
      return complaintsStore.length + 1;
    },
  },
};

/**
 * Atomic stock validation. Returns failed items if any product lacks stock.
 * In production this should run inside `prisma.$transaction([...])` with
 * SELECT ... FOR UPDATE on each product row.
 */
export function validateStockAtomically(items: { productId: string; quantity: number }[]) {
  const failed: { productId: string; requested: number; available: number; name: string }[] = [];
  for (const item of items) {
    const product = getProductById(item.productId);
    if (!product) {
      failed.push({ productId: item.productId, requested: item.quantity, available: 0, name: "Producto desconocido" });
      continue;
    }
    const stock = product.stockQty ?? 0;
    if (item.quantity > stock) {
      failed.push({
        productId: item.productId,
        requested: item.quantity,
        available: stock,
        name: product.name,
      });
    }
  }
  return failed;
}

/**
 * Decrement stock — only called from webhook on successful payment.
 * In prod: prisma.product.update({ where, data: { stockQty: { decrement: q } } }) inside transaction.
 */
export function decrementStock(items: { productId: string; quantity: number }[]) {
  for (const item of items) {
    const product = getProductById(item.productId);
    if (product && typeof product.stockQty === "number") {
      product.stockQty = Math.max(0, product.stockQty - item.quantity);
      if (product.stockQty === 0) product.inStock = false;
    }
  }
}
