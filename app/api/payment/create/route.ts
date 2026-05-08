import { NextResponse } from "next/server";
import { z } from "zod";
import { createFormToken } from "@/lib/izipay";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const inputSchema = z.object({
  orderId: z.string().min(1),
  amount: z.number().positive(),
  currency: z.literal("PEN"),
  paymentMethodCode: z.string().optional(),
  installments: z.number().int().min(1).max(12).optional(),
  customer: z.object({
    email: z.string().email(),
    reference: z.string().min(1),
  }),
});

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = rateLimit(`payment-create:${ip}`, { max: 10, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // CRITICAL: never accept card data here. Only metadata.
  // The KR-Embedded iframe collects PAN/CVV inside Izipay's hosted environment.

  try {
    const result = await createFormToken({
      orderId: parsed.data.orderId,
      amount: Math.round(parsed.data.amount * 100),
      currency: "PEN",
      customer: parsed.data.customer,
      paymentMethodCode: parsed.data.paymentMethodCode,
      installments: parsed.data.installments,
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gateway error" },
      { status: 502 }
    );
  }
}
