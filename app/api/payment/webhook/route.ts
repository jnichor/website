import { NextResponse } from "next/server";
import { validateWebhook, mapPaymentStatus } from "@/lib/izipay";
import { db, decrementStock } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // Read raw body — HMAC requires exact bytes (JSON.parse changes whitespace).
  const rawBody = await request.text();
  const krHash = request.headers.get("kr-hash");
  const krHashKey = request.headers.get("kr-hash-key");

  const validation = validateWebhook(rawBody, { krHash, krHashKey });
  if (!validation.valid || !validation.payload) {
    return NextResponse.json(
      { error: "INVALID_WEBHOOK", reason: validation.reason },
      { status: 400 }
    );
  }

  const payload = validation.payload;

  // Idempotency: if we already processed this paymentId successfully, ack and skip.
  const existing = db.order.findByPaymentId(payload.paymentId);
  if (existing && existing.paymentStatus === "completed" && existing.status === "paid") {
    return NextResponse.json({ ok: true, status: "already_processed" });
  }

  const mapped = mapPaymentStatus(payload.status);
  if (mapped === null) {
    // Unknown status — ack 200 so Izipay doesn't retry, but don't change order.
    return NextResponse.json({ ok: true, status: "ignored" });
  }

  // Find order: prefer paymentId match, then orderNumber.
  const order = existing ?? db.order.findByOrderNumber(payload.orderId);
  if (!order) {
    // Order may not exist yet (race). Ack 200 — Izipay reconciliation will retry.
    return NextResponse.json({ ok: true, status: "no_matching_order" });
  }

  if (mapped === "paid") {
    db.order.update(order.id, {
      status: "paid",
      paymentStatus: "completed",
      paymentId: payload.paymentId,
    });
    // Stock decrements ONLY on confirmed payment — not at order creation.
    decrementStock(order.items.map((i) => ({ productId: i.productId, quantity: i.quantity })));
  } else {
    db.order.update(order.id, {
      status: "cancelled",
      paymentStatus: "failed",
      paymentId: payload.paymentId,
    });
  }

  return NextResponse.json({ ok: true, status: mapped });
}
