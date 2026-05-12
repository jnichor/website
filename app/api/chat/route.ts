import { NextResponse } from "next/server";
import { z } from "zod";
import { gemini, classifyComplexity, modelIdFor } from "@/lib/gemini";
import { SYSTEM_PROMPT } from "@/lib/chatbot/system-prompt";
import { CHATBOT_TOOLS, executeTool } from "@/lib/chatbot/tools";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const messageSchema = z.object({
  role: z.enum(["user", "model"]),
  content: z.string().min(1).max(2000),
});

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1).max(40),
});

const MAX_TOOL_ITERATIONS = 5;

type ReferencedProduct = {
  name: string;
  slug: string;
  price?: number;
  originalPrice?: number;
  inStock?: boolean;
  stockQty?: number;
  shortDescription?: string;
};

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit(`chat:${ip}`, { max: 12, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Demasiados mensajes seguidos. Espera un momento e intenta de nuevo." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)) } },
    );
  }

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Petición inválida" }, { status: 400 });
  }

  const lastMessage = body.messages[body.messages.length - 1];
  if (lastMessage.role !== "user") {
    return NextResponse.json({ error: "El último mensaje debe ser del usuario" }, { status: 400 });
  }

  const tier = classifyComplexity(lastMessage.content);

  const model = gemini.getGenerativeModel({
    model: modelIdFor(tier),
    systemInstruction: SYSTEM_PROMPT,
    tools: [{ functionDeclarations: CHATBOT_TOOLS }],
  });

  const history = body.messages.slice(0, -1).map((m) => ({
    role: m.role,
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({ history });
  const referenced: ReferencedProduct[] = [];

  try {
    let result = await chat.sendMessage(lastMessage.content);
    let response = result.response;
    let calls = response.functionCalls();
    let iterations = 0;

    while (calls && calls.length > 0 && iterations < MAX_TOOL_ITERATIONS) {
      iterations++;

      const functionResponses = calls.map((call) => {
        const output = executeTool(call.name, (call.args ?? {}) as Record<string, unknown>);
        collectProducts(output, referenced);
        return {
          functionResponse: { name: call.name, response: output },
        };
      });

      result = await chat.sendMessage(functionResponses);
      response = result.response;
      calls = response.functionCalls();
    }

    return NextResponse.json({
      message: response.text(),
      products: dedupeBySlug(referenced),
      modelTier: tier,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const isQuota = /quota|rate|429/i.test(message);
    return NextResponse.json(
      {
        error: isQuota
          ? "Estoy ocupado en este momento. Intenta de nuevo en un minuto."
          : "Ocurrió un error procesando tu mensaje. Intenta de nuevo.",
      },
      { status: isQuota ? 429 : 500 },
    );
  }
}

function collectProducts(output: Record<string, unknown>, sink: ReferencedProduct[]): void {
  if (Array.isArray(output.suggestions)) {
    for (const p of output.suggestions as ReferencedProduct[]) sink.push(p);
    return;
  }
  if (output.found && typeof output.slug === "string") {
    sink.push(output as ReferencedProduct);
  }
}

function dedupeBySlug(products: ReferencedProduct[]): ReferencedProduct[] {
  const seen = new Set<string>();
  const out: ReferencedProduct[] = [];
  for (const p of products) {
    if (!p.slug || seen.has(p.slug)) continue;
    seen.add(p.slug);
    out.push(p);
  }
  return out;
}
