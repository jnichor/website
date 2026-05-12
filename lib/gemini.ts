import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "./env";

const globalForGemini = globalThis as unknown as {
  gemini?: GoogleGenerativeAI;
};

export const gemini =
  globalForGemini.gemini ?? new GoogleGenerativeAI(env.GEMINI_API_KEY);

if (process.env.NODE_ENV !== "production") globalForGemini.gemini = gemini;

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
