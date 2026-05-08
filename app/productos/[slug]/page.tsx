import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  ShieldCheck,
  Truck,
  RefreshCw,
  CreditCard,
  MessageCircle,
  Star,
} from "lucide-react";
import { getProductBySlug, getAllProducts, getRelatedProducts } from "@/lib/products";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductCard } from "@/components/products/ProductCard";
import { SpecsTable } from "@/components/products/SpecsTable";
import { InstallmentBadge } from "@/components/products/InstallmentBadge";
import { AddToCartControls } from "@/components/products/AddToCartControls";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORY_LABELS } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };

  return {
    title: `${product.name} — ${product.brand}`,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.image, alt: product.name }],
    },
  };
}

export default async function ProductDetailPage({ params }: Params) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product.id, 4);
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    brand: { "@type": "Brand", name: product.brand },
    sku: product.sku,
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "PEN",
      availability:
        product.inStock && (product.stockQty ?? 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    ...(product.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewCount ?? 0,
      },
    }),
  };

  const whatsappLinkText = encodeURIComponent(
    `Hola, tengo una consulta sobre ${product.name} (SKU ${product.sku})`
  );
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "51999888777";

  return (
    <div className="container mx-auto px-4 py-8">
      <nav aria-label="Migas" className="mb-6">
        <Link
          href="/productos"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden /> Volver a productos
        </Link>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        <ProductGallery images={product.images} alt={`${product.brand} ${product.name}`} />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            {discount > 0 && <Badge variant="destructive">-{discount}% OFF</Badge>}
            {product.isNew && <Badge variant="accent">Nuevo</Badge>}
            {product.isBestseller && <Badge variant="success">Más vendido</Badge>}
            <Badge variant="outline">{CATEGORY_LABELS[product.category]}</Badge>
          </div>

          <p className="mt-3 text-sm uppercase tracking-wider text-muted-foreground">
            {product.brand}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">{product.name}</h1>

          {typeof product.rating === "number" && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <div className="flex" aria-label={`${product.rating} de 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(product.rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                    aria-hidden
                  />
                ))}
              </div>
              <span className="text-muted-foreground">
                ({product.reviewCount ?? 0} reseñas)
              </span>
            </div>
          )}

          <div className="mt-6 flex items-end gap-3">
            <p className="font-display text-4xl font-bold text-primary">
              {formatPrice(product.price)}
            </p>
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="pb-1 text-lg text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </p>
            )}
          </div>
          {product.installments && (
            <div className="mt-3">
              <InstallmentBadge plans={product.installments} />
            </div>
          )}

          <div className="mt-4">
            {product.inStock && (product.stockQty ?? 0) > 0 ? (
              <Badge variant="success">En stock — listo para enviar</Badge>
            ) : (
              <Badge variant="destructive">Agotado</Badge>
            )}
          </div>

          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">SKU:</span> {product.sku}
            </li>
            <li>
              <span className="font-medium text-foreground">Marca:</span> {product.brand}
            </li>
            <li>
              <span className="font-medium text-foreground">Garantía:</span>{" "}
              {product.warrantyMonths} meses
            </li>
          </ul>

          <ul className="mt-6 space-y-2 text-sm">
            {product.highlights.map((h) => (
              <li key={h} className="flex gap-2">
                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <AddToCartControls product={product} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
            <TrustItem icon={<Truck className="h-4 w-4" aria-hidden />} label="Envío 24h" />
            <TrustItem
              icon={<ShieldCheck className="h-4 w-4" aria-hidden />}
              label={`Garantía ${product.warrantyMonths} meses`}
            />
            <TrustItem icon={<CreditCard className="h-4 w-4" aria-hidden />} label="Pago seguro" />
            <TrustItem icon={<RefreshCw className="h-4 w-4" aria-hidden />} label="Cambio en 7 días" />
          </div>

          <a
            href={`https://wa.me/${phone}?text=${whatsappLinkText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:text-accent"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Pregunta sobre este producto por WhatsApp
          </a>
        </div>
      </div>

      <Tabs defaultValue="description" className="mt-16">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="description">Descripción</TabsTrigger>
          <TabsTrigger value="specs">Especificaciones</TabsTrigger>
          <TabsTrigger value="inbox">Qué incluye</TabsTrigger>
          <TabsTrigger value="warranty">Garantía</TabsTrigger>
        </TabsList>
        <TabsContent value="description">
          <div className="rounded-lg border bg-card p-6">
            <p className="leading-relaxed">{product.description}</p>
          </div>
        </TabsContent>
        <TabsContent value="specs">
          <SpecsTable specs={product.specs} />
        </TabsContent>
        <TabsContent value="inbox">
          <div className="rounded-lg border bg-card p-6">
            {product.inBox && product.inBox.length > 0 ? (
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {product.inBox.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Empaque original sellado con todos los accesorios del fabricante.
              </p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="warranty">
          <div className="rounded-lg border bg-card p-6 text-sm leading-relaxed">
            <p>
              Este producto cuenta con <span className="font-semibold">{product.warrantyMonths} meses</span> de
              garantía oficial del fabricante. La garantía cubre defectos de fabricación, no daños
              por mal uso o desgaste normal. Para hacer válida la garantía, conservá la boleta o
              factura electrónica y contactá nuestro soporte técnico.
            </p>
            <p className="mt-3">
              Más detalles en nuestra página de{" "}
              <Link href="/garantia-soporte" className="text-primary underline">
                garantía y soporte
              </Link>
              .
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-bold">Productos relacionados</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
    </div>
  );
}

function TrustItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border bg-card p-2">
      <span className="text-primary">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
