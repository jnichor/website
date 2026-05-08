import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllProducts } from "@/lib/products";
import { ProductGrid } from "@/components/products/ProductGrid";
import type { Category } from "@/lib/types";

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Catálogo completo de hardware: laptops, componentes, monitores, periféricos y más. Garantía oficial.",
};

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const products = getAllProducts();
  const initialCategory = (params.category as Category | undefined) ?? "all";

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">Productos</h1>
        <p className="mt-2 text-muted-foreground">
          {products.length} productos en stock con garantía oficial.
        </p>
      </header>
      <Suspense>
        <ProductGrid products={products} initialCategory={initialCategory} />
      </Suspense>
    </div>
  );
}
