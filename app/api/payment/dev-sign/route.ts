import { NextResponse } from "next/server";
import { computeDevWebhookSignature } from "@/lib/izipay";

export const dynamic = "force-dynamic";

/**
 * Dev-only helper. Computes the HMAC-SHA256 signature of the request body using
 * IZIPAY_WEBHOOK_SECRET so the sandbox "Pagar" button can POST a valid webhook
 * call to /api/payment/webhook. Disabled in production.
 */
export async function POST(request: Request) {
  if (process.env.IZIPAY_ENVIRONMENT === "PRODUCTION") {
    return NextResponse.json({ error: "Disabled in production" }, { status: 404 });
  }
  const raw = await request.text();
  const signature = computeDevWebhookSignature(raw);
  return NextResponse.json({ signature });
}
