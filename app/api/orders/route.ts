import { NextResponse } from "next/server";
import { z } from "zod";
import { createOrderSchema } from "@/lib/validators";
import { calcCartIgv } from "@/lib/tax";
import { calcShipping, getZone } from "@/lib/shipping";
import { generateOrderId } from "@/lib/izipay";
import { prisma, validateStockAtomically, createOrderWithItems } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { getProductById } from "@/lib/products";

export const dynamic = "force-dynamic";

const orderInputSchema = createOrderSchema.extend({
  paymentId: z.string().optional(),
});

export async function POST(request: Request) {
  // Rate limit: 5 req/min/IP
  const ip = getClientIp(request);
  const rl = rateLimit(`orders:${ip}`, { max: 5, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = orderInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;

  if (!data.acceptedTermsAt) {
    return NextResponse.json(
      { error: "Falta confirmación de Términos y Privacidad" },
      { status: 400 }
    );
  }

  const failed = await validateStockAtomically(data.items);
  if (failed.length > 0) {
    return NextResponse.json(
      { error: "OUT_OF_STOCK", items: failed },
      { status: 409 }
    );
  }

  const itemsWithPrice = data.items.map((it) => {
    const product = getProductById(it.productId);
    if (!product) {
      throw new Error(`Producto no existe: ${it.productId}`);
    }
    return {
      productId: it.productId,
      productName: product.name,
      productSku: product.sku,
      price: product.price,
      quantity: it.quantity,
    };
  });

  const igvCalc = calcCartIgv(itemsWithPrice);
  const subtotalGross = igvCalc.gross;
  const shipping = calcShipping(data.shippingZoneId, subtotalGross);
  const total = subtotalGross + shipping;

  if (!getZone(data.shippingZoneId)) {
    return NextResponse.json({ error: "Zona de envío inválida" }, { status: 400 });
  }

  let orderNumber: string;
  try {
    orderNumber = generateOrderId();
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error generando ID" },
      { status: 500 }
    );
  }

  const order = await createOrderWithItems({
    orderNumber,
    status: data.paymentMethod === "transfer" ? "pending_verification" : "pending",
    paymentMethod: data.paymentMethod,
    paymentId: data.paymentId,
    installments: data.installments ?? 1,
    invoiceType: data.invoiceType,
    acceptedTermsAt: data.acceptedTermsAt,
    customer: data.customer,
    items: itemsWithPrice,
    subtotalNet: igvCalc.net,
    igv: igvCalc.igv,
    subtotalGross,
    shipping,
    total,
  });

  // NOTE: stock is NOT decremented here — only after webhook confirms payment.

  return NextResponse.json(
    {
      orderNumber: order.orderNumber,
      orderId: order.id,
      total: Number(order.total),
      status: order.status,
    },
    { status: 201 }
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id requerido" }, { status: 400 });
  }
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, customer: true },
  });
  if (!order) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(order);
}
