import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/search";
import type { Category } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? undefined;
  const category = (searchParams.get("category") as Category | null) ?? undefined;
  const brand = searchParams.get("brand") ?? undefined;

  const results = searchProducts({ query: q, category, brand });
  return NextResponse.json({ count: results.length, products: results });
}
