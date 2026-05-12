import { GoogleGenerativeAI } from "@google/generative-ai";

const globalForGemini = globalThis as unknown as {
  geminiClient?: GoogleGenerativeAI;
};

// Lazy init: avoid touching process.env at module-evaluation time so that
// /api/chat doesn't drag a hard env dependency into Next's build-time
// "Collecting page data" phase. The check runs on the first runtime request.
export function getGeminiClient(): GoogleGenerativeAI {
  if (globalForGemini.geminiClient) return globalForGemini.geminiClient;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY no está configurada. Agrégala en Vercel → Settings → Environment Variables.",
    );
  }
  if (!/^AIza[\w-]{35}$/.test(apiKey)) {
    throw new Error("GEMINI_API_KEY tiene un formato inválido. Debe empezar con AIza y tener 39 caracteres.");
  }

  const client = new GoogleGenerativeAI(apiKey);
  if (process.env.NODE_ENV !== "production") globalForGemini.geminiClient = client;
  return client;
}

export type ModelTier = "flash" | "pro";

const PRO_TRIGGERS = [
  /\bcompara\b/i,
  /\bcomparar\b/i,
  /\bdiferenci/i,
  /cu[áa]l es mejor/i,
  /qu[ée] conviene m[aá]s/i,
  /pros y contras/i,
  /recomienda.*entre/i,
];

export function classifyComplexity(message: string): ModelTier {
  if (message.length > 300) return "pro";
  if (PRO_TRIGGERS.some((rx) => rx.test(message))) return "pro";
  return "flash";
}

export function modelIdFor(tier: ModelTier): string {
  return tier === "pro" ? "gemini-2.5-pro" : "gemini-2.5-flash";
}
