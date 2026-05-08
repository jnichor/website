"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABELS, type Category, type Product } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  products: Product[];
  initialCategory?: Category | "all";
}

const ALL_CATEGORIES: (Category | "all")[] = [
  "all",
  "laptops",
  "desktops",
  "componentes",
  "perifericos",
  "monitores",
  "almacenamiento",
  "audio",
  "networking",
  "smart-home",
  "accesorios",
];

type SortKey = "relevance" | "price-asc" | "price-desc" | "newest";

export function ProductGrid({ products, initialCategory = "all" }: Props) {
  const [category, setCategory] = useState<Category | "all">(initialCategory);
  const [sort, setSort] = useState<SortKey>("relevance");

  const visible = useMemo(() => {
    let list = category === "all" ? products : products.filter((p) => p.category === category);
    list = [...list].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "newest":
          return Number(!!b.isNew) - Number(!!a.isNew);
        default:
          return Number(!!b.featured) - Number(!!a.featured);
      }
    });
    return list;
  }, [products, category, sort]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtro de categorías">
          {ALL_CATEGORIES.map((c) => (
            <Button
              key={c}
              role="tab"
              aria-selected={category === c}
              variant={category === c ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory(c)}
            >
              {c === "all" ? "Todos" : CATEGORY_LABELS[c]}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Ordenar:</span>
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="w-44" aria-label="Ordenar productos">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevancia</SelectItem>
              <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
              <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
              <SelectItem value="newest">Más nuevos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-xl border bg-muted p-8 text-center text-muted-foreground">
          No hay productos en esta categoría aún.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
