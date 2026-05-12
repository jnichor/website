"use client";

import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";

export interface ChatProductRef {
  name: string;
  slug: string;
  brand?: string;
  price?: number;
  originalPrice?: number;
  shortDescription?: string;
  inStock?: boolean;
  stockQty?: number;
}

export interface ChatMessageData {
  id: string;
  role: "user" | "model";
  content: string;
  products?: ChatProductRef[];
}

interface ChatMessageProps {
  message: ChatMessageData;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex max-w-[85%] flex-col gap-2", isUser && "items-end")}>
        <div
          className={cn(
            "whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
            isUser
              ? "rounded-br-sm bg-primary text-primary-foreground"
              : "rounded-bl-sm bg-muted text-foreground",
          )}
        >
          {message.content}
        </div>

        {!isUser && message.products && message.products.length > 0 && (
          <div className="flex flex-col gap-2">
            {message.products.slice(0, 3).map((p) => (
              <ProductChip key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductChip({ product }: { product: ChatProductRef }) {
  const onSale =
    typeof product.originalPrice === "number" &&
    typeof product.price === "number" &&
    product.originalPrice > product.price;

  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group flex flex-col gap-1 rounded-lg border bg-card p-3 text-xs transition-colors hover:border-primary hover:bg-accent/5"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="line-clamp-2 font-medium text-foreground group-hover:text-primary">
          {product.name}
        </span>
        {typeof product.price === "number" && (
          <div className="shrink-0 text-right">
            <div className="font-semibold text-foreground">{formatPrice(product.price)}</div>
            {onSale && product.originalPrice && (
              <div className="text-[10px] text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>
        )}
      </div>

      {product.shortDescription && (
        <p className="line-clamp-2 text-muted-foreground">{product.shortDescription}</p>
      )}

      <div className="flex items-center justify-between text-[11px]">
        <StockBadge inStock={product.inStock} stockQty={product.stockQty} />
        <span className="text-primary group-hover:underline">Ver producto →</span>
      </div>
    </Link>
  );
}

function StockBadge({ inStock, stockQty }: { inStock?: boolean; stockQty?: number }) {
  if (inStock && (stockQty ?? 0) > 0) {
    return (
      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-600 dark:text-emerald-400">
        En stock {stockQty && stockQty < 10 ? `(${stockQty})` : ""}
      </span>
    );
  }
  return (
    <span className="rounded-full bg-destructive/10 px-2 py-0.5 font-medium text-destructive">
      Agotado
    </span>
  );
}
