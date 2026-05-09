/**
 * Emits a CSV-like table of every product with its current image source so we
 * can decide what to keep, replace, or delete.
 *
 * Run: npx tsx scripts/audit-product-images.ts
 */
import { PRODUCTS } from "../lib/products";

type Row = {
  id: string;
  name: string;
  brand: string;
  category: string;
  source: "local" | "unsplash" | "other";
  imageCount: number;
};

const rows: Row[] = PRODUCTS.map((p) => {
  const first = p.image ?? p.images?.[0] ?? "";
  let source: Row["source"] = "other";
  if (first.startsWith("/products/")) source = "local";
  else if (first.includes("unsplash.com")) source = "unsplash";
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    source,
    imageCount: p.images?.length ?? (p.image ? 1 : 0),
  };
});

console.log(`TOTAL: ${rows.length} products`);
console.log(`  local images: ${rows.filter((r) => r.source === "local").length}`);
console.log(`  unsplash:     ${rows.filter((r) => r.source === "unsplash").length}`);
console.log(`  other:        ${rows.filter((r) => r.source === "other").length}`);
console.log("");

const byCategory = new Map<string, Row[]>();
for (const r of rows) {
  if (!byCategory.has(r.category)) byCategory.set(r.category, []);
  byCategory.get(r.category)!.push(r);
}

for (const [cat, list] of byCategory) {
  console.log(`\n=== ${cat.toUpperCase()} (${list.length}) ===`);
  for (const r of list) {
    const tag = r.source === "local" ? "[LOCAL]" : r.source === "unsplash" ? "[UNSPL]" : "[OTHER]";
    console.log(`  ${r.id}  ${tag}  ${r.brand} — ${r.name}`);
  }
}
