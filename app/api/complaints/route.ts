import { NextResponse } from "next/server";
import { complaintSchema } from "@/lib/validators";
import { db } from "@/lib/db";
import { generateComplaintNumber } from "@/lib/izipay";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = rateLimit(`complaints:${ip}`, { max: 5, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = complaintSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const seq = db.complaint.nextSeq();
  const complaintNumber = generateComplaintNumber(seq);
  const now = new Date().toISOString();

  const created = db.complaint.create({
    id: `lr_${Date.now().toString(36)}`,
    complaintNumber,
    status: "pendiente",
    type: parsed.data.type,
    fullName: parsed.data.fullName,
    email: parsed.data.email,
    createdAt: now,
  });

  // TODO: enviar email al consumidor con copia del reclamo (integrar con SendGrid / SES).

  return NextResponse.json(
    { complaintNumber: created.complaintNumber, status: created.status },
    { status: 201 }
  );
}
