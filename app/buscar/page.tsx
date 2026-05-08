import type { Metadata } from "next";
import { searchProducts } from "@/lib/search";
import { ProductCard } from "@/components/products/ProductCard";

export const metadata: Metadata = {
  title: "Resultados de búsqueda",
  robots: { index: false, follow: true },
};

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams;
  const results = q ? searchProducts({ query: q }) : [];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-3xl font-bold md:text-4xl">Resultados de búsqueda</h1>
      <p className="mt-2 text-muted-foreground">
        {q ? (
          <>
            {results.length} resultado{results.length === 1 ? "" : "s"} para
            <span className="ml-1 rounded bg-muted px-2 py-0.5 font-mono">&ldquo;{q}&rdquo;</span>
          </>
        ) : (
          "Ingresá un término de búsqueda."
        )}
      </p>

      {q && results.length === 0 && (
        <div className="mt-12 rounded-xl border bg-muted p-12 text-center">
          <p className="font-display text-xl font-semibold">No encontramos productos</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Intentá con otros términos, una marca o el SKU completo.
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
