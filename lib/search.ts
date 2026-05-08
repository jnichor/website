import { PRODUCTS } from "./products";
import type { Product, Category } from "./types";

export interface SearchOptions {
  query?: string;
  category?: Category | string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
}

export function searchProducts(options: SearchOptions = {}): Product[] {
  const { query, category, brand, minPrice, maxPrice } = options;
  const q = query?.trim().toLowerCase() ?? "";

  return PRODUCTS.filter((p) => {
    if (category && p.category !== category) return false;
    if (brand && p.brand.toLowerCase() !== brand.toLowerCase()) return false;
    if (typeof minPrice === "number" && p.price < minPrice) return false;
    if (typeof maxPrice === "number" && p.price > maxPrice) return false;

    if (q.length === 0) return true;

    const haystack = [
      p.name.toLowerCase(),
      p.brand.toLowerCase(),
      p.sku.toLowerCase(),
      p.description.toLowerCase(),
      ...p.tags.map((t) => t.toLowerCase()),
    ];

    // simple AND across whitespace-split tokens
    const tokens = q.split(/\s+/).filter(Boolean);
    return tokens.every((t) => haystack.some((h) => h.includes(t)));
  });
}
