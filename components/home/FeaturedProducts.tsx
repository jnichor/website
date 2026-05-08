import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/products/ProductCard";

export function FeaturedProducts() {
  const products = getFeaturedProducts(4);

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold md:text-4xl">Productos destacados</h2>
          <p className="mt-2 text-muted-foreground">Lo más buscado por nuestra comunidad</p>
        </div>
        <Link
          href="/productos"
          className="hidden items-center gap-1 text-sm font-medium text-primary hover:text-accent sm:flex"
        >
          Ver todos
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
