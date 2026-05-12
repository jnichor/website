import { SchemaType, type FunctionDeclaration } from "@google/generative-ai";
import { PRODUCTS } from "../products";
import { searchProducts } from "../search";
import { CATEGORY_LABELS, type Category, type Product } from "../types";

export const CHATBOT_TOOLS: FunctionDeclaration[] = [
  {
    name: "recommendProduct",
    description:
      "Recomienda hasta 3 productos del catálogo de NovaTech según una descripción de necesidad. Úsala cuando el cliente describe lo que busca pero no menciona un producto específico (ej: 'una laptop para edición de video bajo S/ 5000').",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        query: {
          type: SchemaType.STRING,
          description:
            "Descripción libre de lo que el cliente busca: caso de uso, marca, características técnicas. Ej: 'mouse gaming inalámbrico ligero'.",
        },
        category: {
          type: SchemaType.STRING,
          description: `Categoría del producto. Valores válidos: ${Object.keys(CATEGORY_LABELS).join(", ")}.`,
          nullable: true,
        },
        maxPrice: {
          type: SchemaType.NUMBER,
          description: "Presupuesto máximo en soles (S/). Omite si el cliente no lo mencionó.",
          nullable: true,
        },
        brand: {
          type: SchemaType.STRING,
          description: "Marca específica (ej: 'ASUS', 'Logitech'). Omite si el cliente no lo mencionó.",
          nullable: true,
        },
      },
      required: ["query"],
    },
  },
  {
    name: "checkStock",
    description:
      "Consulta si hay stock disponible de un producto específico. Úsala antes de recomendar un producto o cuando el cliente pregunta '¿tienen X?', '¿hay disponible?'.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        productIdentifier: {
          type: SchemaType.STRING,
          description:
            "Slug, SKU o nombre exacto del producto. Si tienes el slug (ej: 'asus-rog-strix-g16-i9-rtx4070'), úsalo — es más confiable que el nombre.",
        },
      },
      required: ["productIdentifier"],
    },
  },
  {
    name: "getPrice",
    description:
      "Obtiene el precio actual, precio original (si está en oferta) y planes de cuotas de un producto específico. Úsala cuando el cliente pregunta '¿cuánto cuesta?', '¿precio de…?', '¿está en oferta?'.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        productIdentifier: {
          type: SchemaType.STRING,
          description:
            "Slug, SKU o nombre exacto del producto. Si tienes el slug, úsalo — es más confiable.",
        },
      },
      required: ["productIdentifier"],
    },
  },
];

function findProduct(identifier: string): Product | undefined {
  const id = identifier.trim().toLowerCase();
  if (!id) return undefined;

  let match = PRODUCTS.find((p) => p.slug.toLowerCase() === id);
  if (match) return match;

  match = PRODUCTS.find((p) => p.sku.toLowerCase() === id);
  if (match) return match;

  match = PRODUCTS.find((p) => p.name.toLowerCase() === id);
  if (match) return match;

  const tokens = id.split(/\s+/).filter((t) => t.length > 2);
  if (tokens.length === 0) return undefined;

  return PRODUCTS.find((p) => {
    const haystack = `${p.name} ${p.brand} ${p.sku}`.toLowerCase();
    return tokens.every((t) => haystack.includes(t));
  });
}

function scoreProduct(p: Product, query: string): number {
  const q = query.toLowerCase();
  const tokens = q.split(/\s+/).filter(Boolean);
  let score = 0;

  for (const t of tokens) {
    if (p.tags.some((tag) => tag.toLowerCase().includes(t))) score += 8;
    if (p.brand.toLowerCase().includes(t)) score += 6;
    if (p.name.toLowerCase().includes(t)) score += 4;
    if (p.description.toLowerCase().includes(t)) score += 1;
  }

  if (p.featured) score += 5;
  if (p.isBestseller) score += 3;
  if (p.isNew) score += 2;
  if (typeof p.rating === "number") score += p.rating * 2;
  if (p.inStock && (p.stockQty ?? 0) > 0) score += 10;
  else score -= 25;

  return score;
}

export type ToolResult = Record<string, unknown>;

export function executeTool(name: string, args: Record<string, unknown>): ToolResult {
  if (name === "recommendProduct") {
    const query = String(args.query ?? "").trim();
    const category = args.category ? String(args.category) : undefined;
    const maxPrice = typeof args.maxPrice === "number" ? args.maxPrice : undefined;
    const brand = args.brand ? String(args.brand) : undefined;

    const filtered = searchProducts({
      query,
      category: category as Category | undefined,
      brand,
      maxPrice,
    });

    if (filtered.length === 0) {
      return {
        found: false,
        message: `No encontré productos que coincidan con "${query}"${maxPrice ? ` bajo S/ ${maxPrice}` : ""}.`,
        suggestions: [],
      };
    }

    const ranked = [...filtered]
      .map((p) => ({ p, score: scoreProduct(p, query) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(({ p }) => ({
        name: p.name,
        slug: p.slug,
        brand: p.brand,
        price: p.price,
        originalPrice: p.originalPrice,
        category: CATEGORY_LABELS[p.category as Category] ?? p.category,
        shortDescription: p.shortDescription,
        highlights: p.highlights.slice(0, 3),
        inStock: p.inStock && (p.stockQty ?? 0) > 0,
        stockQty: p.stockQty ?? 0,
        rating: p.rating,
        warrantyMonths: p.warrantyMonths,
      }));

    return { found: true, count: filtered.length, suggestions: ranked };
  }

  if (name === "checkStock") {
    const id = String(args.productIdentifier ?? "");
    const product = findProduct(id);

    if (!product) {
      return {
        found: false,
        message: `No encontré "${id}" en el catálogo de NovaTech.`,
      };
    }

    return {
      found: true,
      name: product.name,
      slug: product.slug,
      inStock: product.inStock && (product.stockQty ?? 0) > 0,
      stockQty: product.stockQty ?? 0,
    };
  }

  if (name === "getPrice") {
    const id = String(args.productIdentifier ?? "");
    const product = findProduct(id);

    if (!product) {
      return {
        found: false,
        message: `No encontré "${id}" en el catálogo de NovaTech.`,
      };
    }

    return {
      found: true,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      onSale: typeof product.originalPrice === "number" && product.originalPrice > product.price,
      discountPercent:
        typeof product.originalPrice === "number"
          ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
          : 0,
      installments: product.installments,
    };
  }

  return { error: `Tool desconocida: ${name}` };
}
