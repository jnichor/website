import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { complaintSchema } from "@/lib/validators";
import { prisma } from "@/lib/db";
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
  const data = parsed.data;

  // Sequential complaint number — uses the current row count + 1. For low
  // volume this is fine; if concurrency becomes a real concern, replace with
  // a Postgres sequence keyed to the complaint table.
  const seq = (await prisma.complaint.count()) + 1;
  const complaintNumber = generateComplaintNumber(seq);

  const created = await prisma.complaint.create({
    data: {
      complaintNumber,
      type: data.type,
      fullName: data.fullName,
      documentType: data.documentType,
      documentNumber: data.documentNumber,
      email: data.email,
      phone: data.phone,
      address: data.address,
      isMinor: data.isMinor,
      guardianName: data.guardianName,
      goodType: data.goodType,
      amount: data.amount != null ? new Prisma.Decimal(data.amount) : null,
      description: data.description,
      detail: data.detail,
      request: data.request,
    },
  });

  // TODO: enviar email al consumidor con copia del reclamo (integrar con SendGrid / SES).

  return NextResponse.json(
    { complaintNumber: created.complaintNumber, status: created.status },
    { status: 201 }
  );
}
