import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/productos/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.image}
            alt={`${product.brand} ${product.name}`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {discount > 0 && <Badge variant="destructive">-{discount}% OFF</Badge>}
            {product.isNew && <Badge variant="accent">Nuevo</Badge>}
            {product.isBestseller && <Badge variant="success">Más vendido</Badge>}
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{product.brand}</p>
        <Link href={`/productos/${product.slug}`} className="mt-1 line-clamp-2 font-medium hover:text-primary">
          {product.name}
        </Link>

        {typeof product.rating === "number" && (
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
            <span>{product.rating.toFixed(1)}</span>
            <span>({product.reviewCount ?? 0})</span>
          </div>
        )}

        <div className="mt-auto pt-4">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          {product.installments?.length ? (
            <p className="mt-1 text-xs text-muted-foreground">
              o 12 cuotas de{" "}
              {formatPrice(
                product.installments.find((i) => i.months === 12)?.monthly ?? product.price / 12
              )}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
