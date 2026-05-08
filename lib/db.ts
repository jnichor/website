import { PrismaClient, Prisma } from "@prisma/client";
import type { OrderInput } from "./types";

// Singleton pattern: Next.js dev mode hot-reloads modules, which would create
// a new PrismaClient on every reload and exhaust the connection pool. The
// global cache prevents that. In production (serverless), each cold start gets
// its own client — that's expected.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export type StockFailure = {
  productId: string;
  requested: number;
  available: number;
  name: string;
};

/**
 * Validates stock against the DB. Reads current stockQty for every requested
 * productId in a single query. Returns the list of items that don't have
 * enough stock (empty if everything is OK).
 */
export async function validateStockAtomically(
  items: { productId: string; quantity: number }[]
): Promise<StockFailure[]> {
  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
    select: { id: true, stockQty: true, name: true },
  });
  const byId = new Map(products.map((p) => [p.id, p]));
  const failed: StockFailure[] = [];
  for (const item of items) {
    const product = byId.get(item.productId);
    if (!product) {
      failed.push({
        productId: item.productId,
        requested: item.quantity,
        available: 0,
        name: "Producto desconocido",
      });
      continue;
    }
    if (item.quantity > product.stockQty) {
      failed.push({
        productId: item.productId,
        requested: item.quantity,
        available: product.stockQty,
        name: product.name,
      });
    }
  }
  return failed;
}

/**
 * Decrements stock atomically. Called from the payment webhook after Izipay
 * confirms a successful charge. Wrapped in a transaction so partial decrements
 * never persist if any update fails.
 */
export async function decrementStock(
  items: { productId: string; quantity: number }[]
): Promise<void> {
  await prisma.$transaction(
    items.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stockQty: { decrement: item.quantity } },
      })
    )
  );
  await prisma.product.updateMany({
    where: { id: { in: items.map((i) => i.productId) }, stockQty: { lte: 0 } },
    data: { inStock: false },
  });
}

export type CreateOrderArgs = {
  orderNumber: string;
  paymentMethod: string;
  paymentId?: string;
  installments: number;
  invoiceType: "boleta" | "factura";
  status: string;
  acceptedTermsAt: string;
  customer: OrderInput["customer"];
  items: {
    productId: string;
    productName: string;
    productSku: string;
    price: number;
    quantity: number;
  }[];
  subtotalNet: number;
  igv: number;
  subtotalGross: number;
  shipping: number;
  total: number;
};

/**
 * Creates Customer (upsert by email) + Order + OrderItems in one transaction.
 * Decimal fields are passed as Prisma.Decimal-compatible values.
 */
export async function createOrderWithItems(args: CreateOrderArgs) {
  return prisma.$transaction(async (tx) => {
    const customer = await tx.customer.upsert({
      where: { email: args.customer.email },
      update: {
        firstName: args.customer.firstName,
        lastName: args.customer.lastName,
        phone: args.customer.phone,
        documentType: args.customer.documentType,
        documentNumber: args.customer.documentNumber,
        companyName: args.customer.companyName,
        address: args.customer.address,
        district: args.customer.district,
        city: args.customer.city,
        reference: args.customer.reference,
      },
      create: {
        email: args.customer.email,
        firstName: args.customer.firstName,
        lastName: args.customer.lastName,
        phone: args.customer.phone,
        documentType: args.customer.documentType,
        documentNumber: args.customer.documentNumber,
        companyName: args.customer.companyName,
        address: args.customer.address,
        district: args.customer.district,
        city: args.customer.city,
        reference: args.customer.reference,
      },
    });

    const order = await tx.order.create({
      data: {
        orderNumber: args.orderNumber,
        customerId: customer.id,
        subtotalNet: new Prisma.Decimal(args.subtotalNet),
        igv: new Prisma.Decimal(args.igv),
        subtotalGross: new Prisma.Decimal(args.subtotalGross),
        shipping: new Prisma.Decimal(args.shipping),
        total: new Prisma.Decimal(args.total),
        status: args.status,
        paymentMethod: args.paymentMethod,
        paymentId: args.paymentId,
        installments: args.installments,
        invoiceType: args.invoiceType,
        documentType: args.customer.documentType,
        documentNumber: args.customer.documentNumber,
        acceptedTermsAt: new Date(args.acceptedTermsAt),
        items: {
          create: args.items.map((it) => ({
            productId: it.productId,
            productName: it.productName,
            productSku: it.productSku,
            quantity: it.quantity,
            price: new Prisma.Decimal(it.price),
          })),
        },
      },
      include: { items: true },
    });

    return order;
  });
}
