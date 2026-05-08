import { z } from "zod";

// Documento peruano: DNI = 8 dígitos, RUC = 11 dígitos empezando en 10/15/17/20
export const dniSchema = z
  .string()
  .regex(/^\d{8}$/, "El DNI debe tener 8 dígitos numéricos");

export const rucSchema = z
  .string()
  .regex(/^(10|15|17|20)\d{9}$/, "El RUC debe tener 11 dígitos y empezar en 10, 15, 17 o 20");

export const phonePeSchema = z
  .string()
  .regex(/^\+?51?\s?9\d{2}\s?\d{3}\s?\d{3}$/, "Formato inválido. Use +51 9XX XXX XXX");

export const emailSchema = z.string().email("Email inválido");

// Operación Yape/Plin
export const operationNumberSchema = z
  .string()
  .regex(/^\d{8,10}$/, "El número de operación debe tener entre 8 y 10 dígitos");

export const shippingFormSchema = z
  .object({
    firstName: z.string().min(2, "Nombre muy corto"),
    lastName: z.string().min(2, "Apellido muy corto"),
    email: emailSchema,
    phone: phonePeSchema,
    address: z.string().min(5, "Dirección requerida"),
    district: z.string().min(2, "Distrito requerido"),
    city: z.string().min(2, "Ciudad requerida"),
    reference: z.string().optional(),
    shippingZoneId: z.string().min(1, "Seleccione zona de envío"),
    invoiceType: z.enum(["boleta", "factura"]),
    documentType: z.enum(["DNI", "RUC"]),
    documentNumber: z.string().min(8, "Documento requerido"),
    companyName: z.string().optional(),
    fiscalAddress: z.string().optional(),
    acceptedTerms: z.literal(true, {
      errorMap: () => ({ message: "Debe aceptar los Términos y la Política de Privacidad" }),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.invoiceType === "boleta") {
      if (data.documentType !== "DNI") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["documentType"],
          message: "Boleta requiere DNI",
        });
      }
      if (!/^\d{8}$/.test(data.documentNumber)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["documentNumber"],
          message: "DNI debe tener 8 dígitos",
        });
      }
    } else {
      if (data.documentType !== "RUC") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["documentType"],
          message: "Factura requiere RUC",
        });
      }
      if (!/^(10|15|17|20)\d{9}$/.test(data.documentNumber)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["documentNumber"],
          message: "RUC inválido (11 dígitos, empieza en 10/15/17/20)",
        });
      }
      if (!data.companyName || data.companyName.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["companyName"],
          message: "Razón social requerida para factura",
        });
      }
      if (!data.fiscalAddress || data.fiscalAddress.trim().length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["fiscalAddress"],
          message: "Dirección fiscal requerida para factura",
        });
      }
    }
  });

export const createOrderSchema = z.object({
  customer: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: emailSchema,
    phone: phonePeSchema,
    address: z.string().min(5),
    district: z.string().min(2),
    city: z.string().min(2),
    reference: z.string().optional(),
    documentType: z.enum(["DNI", "RUC"]),
    documentNumber: z.string().min(8),
    companyName: z.string().optional(),
    fiscalAddress: z.string().optional(),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
      })
    )
    .min(1, "El pedido debe tener al menos 1 item"),
  shippingZoneId: z.string().min(1),
  invoiceType: z.enum(["boleta", "factura"]),
  paymentMethod: z.enum([
    "yape",
    "plin",
    "visa-credit",
    "mc-credit",
    "visa-debit",
    "mc-debit",
    "transfer",
  ]),
  installments: z.number().int().min(1).max(12).optional(),
  acceptedTermsAt: z.string().datetime("acceptedTermsAt debe ser ISO date"),
});

export const complaintSchema = z.object({
  type: z.enum(["reclamo", "queja"]),
  fullName: z.string().min(3),
  documentType: z.enum(["DNI", "CE", "Pasaporte", "RUC"]),
  documentNumber: z.string().min(6),
  email: emailSchema,
  phone: phonePeSchema,
  address: z.string().min(5),
  isMinor: z.boolean(),
  guardianName: z.string().optional(),
  goodType: z.enum(["producto", "servicio"]),
  amount: z.number().nonnegative().optional(),
  description: z.string().min(10, "Descripción debe tener al menos 10 caracteres"),
  detail: z.string().min(20, "Detalle debe tener al menos 20 caracteres"),
  request: z.string().min(10, "Pedido del consumidor requerido"),
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: emailSchema,
  phone: phonePeSchema.optional(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

export type ShippingFormValues = z.infer<typeof shippingFormSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type ComplaintInput = z.infer<typeof complaintSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
