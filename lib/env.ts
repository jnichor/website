import { z } from "zod";

// Validates process.env at boot. Throws if any required var is missing.
const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL es requerida"),

  IZIPAY_MERCHANT_CODE: z.string().min(1),
  IZIPAY_API_KEY: z.string().min(1),
  IZIPAY_WEBHOOK_SECRET: z.string().min(1),
  IZIPAY_ENVIRONMENT: z.enum(["TEST", "PRODUCTION"]).default("TEST"),

  NEXT_PUBLIC_IZIPAY_PUBLIC_KEY: z.string().min(1),
  NEXT_PUBLIC_IZIPAY_ENDPOINT: z.string().url(),

  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_SITE_NAME: z.string().min(1),
  NEXT_PUBLIC_COMPANY_PREFIX: z
    .string()
    .min(2)
    .max(4)
    .regex(/^[A-Z]+$/, "COMPANY_PREFIX debe ser 2-4 letras mayúsculas"),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().regex(/^\d{11,12}$/, "WhatsApp number debe ser solo dígitos"),

  COMPANY_LEGAL_NAME: z.string().min(1),
  COMPANY_RUC: z.string().regex(/^\d{11}$/, "RUC debe ser de 11 dígitos"),
  COMPANY_FISCAL_ADDRESS: z.string().min(1),

  GEMINI_API_KEY: z
    .string()
    .regex(/^AIza[\w-]{35}$/, "GEMINI_API_KEY debe tener formato AIza... (39 chars)"),
});

// On the client we only see NEXT_PUBLIC_* vars — keep validation server-side
function parseEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const formatted = parsed.error.format();
    console.error("[env] Error de validación:", formatted);
    throw new Error(
      "Faltan variables de entorno requeridas. Revisá .env.local. Detalle: " +
        JSON.stringify(parsed.error.flatten().fieldErrors)
    );
  }
  return parsed.data;
}

export const env =
  typeof window === "undefined"
    ? parseEnv()
    : (process.env as unknown as z.infer<typeof envSchema>);

export type Env = z.infer<typeof envSchema>;
