import crypto from "crypto";

// ==================== CONFIG ====================

export const IZIPAY_TEST_CONFIG = {
  endpoint: "https://api.micuentaweb.pe",
  testCards: {
    visaSuccess: "4970 1000 0000 0014",
    visaRefused: "4970 1000 0000 0055",
    mastercardSuccess: "5018 0099 9990 9990",
  },
} as const;

// ==================== PAYMENT METHODS ====================

export const PAYMENT_METHODS = [
  { id: "yape", label: "Yape", type: "wallet", installments: false, logo: "/payments/yape.svg" },
  { id: "plin", label: "Plin", type: "wallet", installments: false, logo: "/payments/plin.svg" },
  {
    id: "visa-credit",
    label: "Tarjeta de crédito Visa",
    type: "card",
    brand: "visa",
    cardType: "credit",
    installments: true,
    logo: "/payments/visa.svg",
  },
  {
    id: "mc-credit",
    label: "Tarjeta de crédito Mastercard",
    type: "card",
    brand: "mastercard",
    cardType: "credit",
    installments: true,
    logo: "/payments/mastercard.svg",
  },
  {
    id: "visa-debit",
    label: "Tarjeta de débito Visa",
    type: "card",
    brand: "visa",
    cardType: "debit",
    installments: false,
    logo: "/payments/visa.svg",
  },
  {
    id: "mc-debit",
    label: "Tarjeta de débito Mastercard",
    type: "card",
    brand: "mastercard",
    cardType: "debit",
    installments: false,
    logo: "/payments/mastercard.svg",
  },
] as const;

export type PaymentMethodConfig = (typeof PAYMENT_METHODS)[number];

export const TEST_CARDS = [
  { brand: "Visa", number: "4970 1000 0000 0014", cvv: "123", exp: "12/30", result: "Aprobada" },
  {
    brand: "Mastercard",
    number: "5018 0099 9990 9990",
    cvv: "123",
    exp: "12/30",
    result: "Aprobada",
  },
  {
    brand: "Visa",
    number: "4970 1000 0000 0055",
    cvv: "123",
    exp: "12/30",
    result: "Rechazada",
  },
];

// ==================== ORDER ID ====================

/**
 * Order ID format: ${PREFIX}-${base36Timestamp}-${random6}
 * El prefix se lee SIEMPRE del env. Si falta, lanzar error.
 */
export function generateOrderId(): string {
  const prefix = process.env.NEXT_PUBLIC_COMPANY_PREFIX;
  if (!prefix) {
    throw new Error(
      "NEXT_PUBLIC_COMPANY_PREFIX no está configurado. Definirlo en .env.local"
    );
  }
  const base36 = Date.now().toString(36).toUpperCase();
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase().slice(0, 6);
  return `${prefix}-${base36}-${rand}`;
}

export function generateComplaintNumber(seq: number): string {
  const year = new Date().getFullYear();
  return `LR-${year}-${String(seq).padStart(5, "0")}`;
}

// ==================== AMOUNT FORMATTING ====================

/**
 * Izipay espera el monto en céntimos como integer.
 * 199.90 PEN -> 19990
 */
export function formatAmountForGateway(amount: number): number {
  return Math.round(amount * 100);
}

// ==================== CARD BRAND DETECTION (UX only) ====================

export function detectCardBrand(panFirstDigits: string): "visa" | "mastercard" | "unknown" {
  const cleaned = panFirstDigits.replace(/\s/g, "");
  if (cleaned.startsWith("4")) return "visa";
  if (/^5[1-5]/.test(cleaned)) return "mastercard";
  // Mastercard 2-series
  const prefix4 = parseInt(cleaned.slice(0, 4), 10);
  if (!Number.isNaN(prefix4) && prefix4 >= 2221 && prefix4 <= 2720) return "mastercard";
  return "unknown";
}

// ==================== FORM TOKEN (server) ====================

export interface CreateFormTokenInput {
  orderId: string;
  amount: number; // en céntimos
  currency: "PEN";
  customer: { email: string; reference: string };
  paymentMethodCode?: string; // CARDS / YAPE / PLIN
  installments?: number;
}

export interface FormTokenResponse {
  formToken: string;
  publicKey: string;
  environment: "TEST" | "PRODUCTION";
}

/**
 * Llama al endpoint Izipay POST /api-payment/V4/Charge/CreatePayment con HMAC.
 * En dev devuelve un mock signed token para que el flujo se pueda probar end-to-end.
 */
export async function createFormToken(input: CreateFormTokenInput): Promise<FormTokenResponse> {
  const apiKey = process.env.IZIPAY_API_KEY;
  const merchantCode = process.env.IZIPAY_MERCHANT_CODE;
  const env = (process.env.IZIPAY_ENVIRONMENT as "TEST" | "PRODUCTION") ?? "TEST";
  const publicKey = process.env.NEXT_PUBLIC_IZIPAY_PUBLIC_KEY ?? "";
  const endpoint = process.env.NEXT_PUBLIC_IZIPAY_ENDPOINT ?? IZIPAY_TEST_CONFIG.endpoint;

  if (!apiKey || !merchantCode) {
    throw new Error("Izipay credentials missing");
  }

  // En dev sin credenciales reales, devolvemos un mock token firmado.
  // En producción se reemplaza por fetch real a `${endpoint}/api-payment/V4/Charge/CreatePayment`.
  if (env === "TEST" && (apiKey.startsWith("dev_") || merchantCode.startsWith("dev_"))) {
    const mockToken = `mock_${input.orderId}_${Date.now().toString(36)}`;
    return { formToken: mockToken, publicKey, environment: env };
  }

  // Real call (producción / sandbox real)
  const auth = Buffer.from(`${merchantCode}:${apiKey}`).toString("base64");
  const body = {
    amount: input.amount,
    currency: input.currency,
    orderId: input.orderId,
    customer: { email: input.customer.email, reference: input.customer.reference },
    paymentMethodCode: input.paymentMethodCode,
    metadata: { installments: String(input.installments ?? 1) },
  };

  const res = await fetch(`${endpoint}/api-payment/V4/Charge/CreatePayment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Izipay createFormToken failed: ${res.status} ${text}`);
  }

  const data = (await res.json()) as { answer: { formToken: string } };
  return { formToken: data.answer.formToken, publicKey, environment: env };
}

// ==================== WEBHOOK VERIFICATION ====================

export interface WebhookValidationResult {
  valid: boolean;
  reason?: string;
  payload?: WebhookPayload;
}

export interface WebhookPayload {
  paymentId: string;
  orderId: string;
  status: "PAID" | "AUTHORISED" | "REFUSED" | "CANCELLED" | string;
  amount: number;
  timestamp: number; // unix seconds
}

/**
 * Valida HMAC, hash key y timestamp.
 * - HMAC SHA256 con timingSafeEqual
 * - kr-hash-key === 'sha256_hmac'
 * - timestamp dentro de 5 minutos
 */
export function validateWebhook(
  rawBody: string,
  headers: { krHash: string | null; krHashKey: string | null }
): WebhookValidationResult {
  const secret = process.env.IZIPAY_WEBHOOK_SECRET;
  if (!secret) return { valid: false, reason: "WEBHOOK_SECRET_MISSING" };
  if (!headers.krHash) return { valid: false, reason: "MISSING_KR_HASH" };
  if (headers.krHashKey !== "sha256_hmac") {
    return { valid: false, reason: "INVALID_HASH_KEY" };
  }

  const expected = crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  const provided = headers.krHash;

  // timingSafeEqual requiere buffers del mismo tamaño
  if (expected.length !== provided.length) {
    return { valid: false, reason: "HASH_LENGTH_MISMATCH" };
  }
  const expectedBuf = Buffer.from(expected, "hex");
  const providedBuf = Buffer.from(provided, "hex");
  if (expectedBuf.length !== providedBuf.length) {
    return { valid: false, reason: "HASH_BUFFER_LENGTH_MISMATCH" };
  }
  if (!crypto.timingSafeEqual(expectedBuf, providedBuf)) {
    return { valid: false, reason: "HASH_MISMATCH" };
  }

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(rawBody) as WebhookPayload;
  } catch {
    return { valid: false, reason: "INVALID_JSON" };
  }

  // Replay protection: timestamp no debe ser mayor a 5 min
  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.timestamp !== "number") {
    return { valid: false, reason: "MISSING_TIMESTAMP" };
  }
  if (Math.abs(now - payload.timestamp) > 300) {
    return { valid: false, reason: "TIMESTAMP_OUT_OF_WINDOW" };
  }

  return { valid: true, payload };
}

/**
 * Para simular webhooks en dev (cuando se hace "Pagar sandbox")
 * computa el HMAC con el WEBHOOK_SECRET local.
 */
export function computeDevWebhookSignature(rawBody: string): string {
  const secret = process.env.IZIPAY_WEBHOOK_SECRET ?? "";
  return crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
}

export type WebhookOrderStatus = "paid" | "failed" | "cancelled";

export function mapPaymentStatus(status: string): WebhookOrderStatus | null {
  switch (status) {
    case "PAID":
    case "AUTHORISED":
      return "paid";
    case "REFUSED":
      return "failed";
    case "CANCELLED":
      return "cancelled";
    default:
      return null;
  }
}
