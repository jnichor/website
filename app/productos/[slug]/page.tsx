import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Activity,
  Award,
  Battery,
  Cable,
  ChevronLeft,
  Cpu,
  CreditCard,
  HardDrive,
  Headphones,
  Keyboard,
  Lightbulb,
  MemoryStick,
  MessageCircle,
  Mic,
  Monitor,
  Package,
  RefreshCw,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Tag,
  Truck,
  Wifi,
  Zap,
} from "lucide-react";
import { getProductBySlug, getAllProducts, getRelatedProducts } from "@/lib/products";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductCard } from "@/components/products/ProductCard";
import { InstallmentBadge } from "@/components/products/InstallmentBadge";
import { AddToCartControls } from "@/components/products/AddToCartControls";
import { StickyPurchaseBar } from "@/components/products/StickyPurchaseBar";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { CATEGORY_LABELS } from "@/lib/types";
import type { Spec } from "@/lib/types";
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
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "51917056909";
  const inStock = product.inStock && (product.stockQty ?? 0) > 0;

  // Pair highlights with UNIQUE secondary images. No cycling, no repeats —
  // we'd rather show fewer spotlights than fake variety. Each spotlight gets
  // its own real product photo or the section is hidden entirely.
  const spotlightImages = product.images.slice(1);
  const spotlightCount = Math.min(product.highlights.length, spotlightImages.length, 4);
  const spotlights = Array.from({ length: spotlightCount }, (_, i) => ({
    headline: product.highlights[i],
    image: spotlightImages[i],
  }));

  // Color schemes cycled per spotlight for visual variety while keeping the
  // real product image as the focal point. Each scheme tints the eyebrow,
  // accent line, and a subtle gradient overlay.
  const SPOTLIGHT_THEMES = [
    {
      eyebrow: "text-cyan-500",
      accent: "from-cyan-400 to-blue-500",
      overlay:
        "linear-gradient(135deg, rgba(0,210,255,0.0) 40%, rgba(0,210,255,0.18) 100%)",
    },
    {
      eyebrow: "text-rose-500",
      accent: "from-rose-400 to-orange-500",
      overlay:
        "linear-gradient(135deg, rgba(244,63,94,0.0) 40%, rgba(244,63,94,0.18) 100%)",
    },
    {
      eyebrow: "text-fuchsia-500",
      accent: "from-fuchsia-400 to-violet-500",
      overlay:
        "linear-gradient(135deg, rgba(217,70,239,0.0) 40%, rgba(217,70,239,0.18) 100%)",
    },
    {
      eyebrow: "text-emerald-500",
      accent: "from-emerald-400 to-teal-500",
      overlay:
        "linear-gradient(135deg, rgba(16,185,129,0.0) 40%, rgba(16,185,129,0.18) 100%)",
    },
  ];

  return (
    <>
      {/* ============================ HERO (dark cinematic) ============================ */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        {/* Animated mesh gradient — three drifting blobs */}
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          <div className="blob-cyan" />
          <div className="blob-violet" />
          <div className="blob-pink" />
        </div>

        {/* Floating particles — staggered timing for organic feel */}
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          <span className="particle" style={{ top: "12%", left: "8%", animationDelay: "0s" }} />
          <span className="particle" style={{ top: "22%", left: "85%", animationDelay: "1s" }} />
          <span className="particle" style={{ top: "68%", left: "15%", animationDelay: "2s" }} />
          <span className="particle" style={{ top: "45%", left: "92%", animationDelay: "3s" }} />
          <span className="particle" style={{ top: "78%", left: "60%", animationDelay: "0.5s" }} />
          <span className="particle" style={{ top: "33%", left: "45%", animationDelay: "2.5s" }} />
          <span className="particle" style={{ top: "85%", left: "30%", animationDelay: "1.5s" }} />
        </div>

        {/* Soft dark vignette to keep content readable above the mesh */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-slate-950/40"
        />

        <div className="container relative mx-auto px-4 pb-16 pt-6 lg:pb-24 lg:pt-10">
          <nav aria-label="Migas" className="mb-8">
            <Link
              href="/productos"
              className="inline-flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-cyan-400"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden /> Volver a productos
            </Link>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <ProductGallery
                images={product.images}
                alt={`${product.brand} ${product.name}`}
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                {discount > 0 && (
                  <span className="inline-flex items-center rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-300 ring-1 ring-inset ring-rose-500/40">
                    -{discount}% OFF
                  </span>
                )}
                {product.isNew && (
                  <span className="inline-flex items-center rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300 ring-1 ring-inset ring-cyan-500/40">
                    Nuevo
                  </span>
                )}
                {product.isBestseller && (
                  <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300 ring-1 ring-inset ring-emerald-500/40">
                    Más vendido
                  </span>
                )}
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider text-slate-300 ring-1 ring-inset ring-slate-600">
                  {CATEGORY_LABELS[product.category]}
                </span>
              </div>

              <p className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">
                {product.brand}
              </p>
              <h1 className="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl xl:text-7xl">
                <span className="bg-gradient-to-br from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  {product.name}
                </span>
              </h1>

              {typeof product.rating === "number" && (
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-300">
                  <div className="flex" aria-label={`${product.rating} de 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(product.rating ?? 0)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-600"
                        }`}
                        aria-hidden
                      />
                    ))}
                  </div>
                  <span className="text-slate-400">
                    {product.rating} · {product.reviewCount ?? 0} reseñas
                  </span>
                </div>
              )}

              <p className="mt-6 text-base leading-relaxed text-slate-300">
                {product.shortDescription}
              </p>

              <ul className="mt-6 space-y-2.5 text-sm">
                {product.highlights.slice(0, 4).map((h) => (
                  <li key={h} className="flex gap-3 text-slate-200">
                    <Sparkles
                      className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400"
                      aria-hidden
                    />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur">
                <div className="flex items-end gap-3">
                  <p className="font-display text-4xl font-bold text-cyan-400 lg:text-5xl">
                    {formatPrice(product.price)}
                  </p>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <p className="pb-2 text-lg text-slate-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </p>
                  )}
                </div>
                {product.installments && (
                  <div className="mt-3">
                    <InstallmentBadge plans={product.installments} />
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2 text-sm">
                  {inStock ? (
                    <>
                      <span
                        className="inline-block h-2 w-2 rounded-full bg-emerald-400"
                        aria-hidden
                      />
                      <span className="text-emerald-300">
                        En stock — listo para enviar en 24 hs
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        className="inline-block h-2 w-2 rounded-full bg-rose-500"
                        aria-hidden
                      />
                      <span className="text-rose-300">Agotado</span>
                    </>
                  )}
                </div>

                <div className="mt-6">
                  <AddToCartControls product={product} />
                </div>
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-xs text-slate-400 sm:grid-cols-3">
                <div>
                  <dt className="uppercase tracking-wider text-slate-500">SKU</dt>
                  <dd className="mt-0.5">
                    <span className="boot-text font-mono text-cyan-300">{product.sku}</span>
                  </dd>
                </div>
                <div>
                  <dt className="uppercase tracking-wider text-slate-500">Marca</dt>
                  <dd className="mt-0.5 font-medium text-slate-200">{product.brand}</dd>
                </div>
                <div>
                  <dt className="uppercase tracking-wider text-slate-500">Garantía</dt>
                  <dd className="mt-0.5 font-medium text-slate-200">
                    {product.warrantyMonths} meses
                  </dd>
                </div>
              </dl>

              <a
                href={`https://wa.me/${phone}?text=${whatsappLinkText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm text-cyan-400 transition-colors hover:text-cyan-300"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                Pregunta sobre este producto por WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Marquee strip — key specs scrolling infinitely */}
        <div
          aria-hidden
          className="relative overflow-hidden border-y border-cyan-400/20 bg-gradient-to-r from-slate-950 via-cyan-950/40 to-slate-950 py-3"
        >
          <div className="marquee-track flex w-max gap-12 whitespace-nowrap text-sm font-medium uppercase tracking-[0.25em] text-cyan-300/80">
            {[...product.specs.slice(0, 5), ...product.specs.slice(0, 5)].map((s, i) => (
              <span key={i} className="flex items-center gap-3">
                <span className="text-cyan-400/50">◆</span>
                <span className="text-slate-400">{s.label}:</span>
                <span className="text-cyan-300">{s.value}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Trust strip across full hero width */}
        <div className="relative border-t border-slate-800 bg-slate-950/80">
          <div className="container mx-auto grid grid-cols-2 gap-px bg-slate-800 px-0 sm:grid-cols-4">
            <TrustItem icon={<Truck className="h-4 w-4" />} label="Envío 24h en Lima" />
            <TrustItem
              icon={<ShieldCheck className="h-4 w-4" />}
              label={`Garantía ${product.warrantyMonths} meses`}
            />
            <TrustItem icon={<CreditCard className="h-4 w-4" />} label="Pago 100% seguro" />
            <TrustItem icon={<RefreshCw className="h-4 w-4" />} label="Cambio en 7 días" />
          </div>
        </div>
      </section>

      {/* ============================ FEATURE SPOTLIGHTS ============================ */}
      {spotlights.length > 0 && (
        <section className="bg-background py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                Características
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
                Lo que hace a este producto único
              </h2>
            </div>

            <div className="space-y-16 lg:space-y-24">
              {spotlights.map((s, i) => {
                const theme = SPOTLIGHT_THEMES[i % SPOTLIGHT_THEMES.length];
                return (
                  <RevealOnScroll
                    key={s.headline}
                    delayMs={i * 100}
                    className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${
                      i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-white to-slate-100 shadow-2xl ring-1 ring-slate-200">
                      <Image
                        src={s.image}
                        alt={s.headline}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Color-themed gradient overlay — tints the image to match the spotlight's accent */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0"
                        style={{ background: theme.overlay }}
                      />
                      {/* Soft dark gradient bottom-up for any caption legibility */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
                      />
                    </div>
                    <div>
                      <p
                        className={`text-xs font-bold uppercase tracking-[0.3em] ${theme.eyebrow}`}
                      >
                        {String(i + 1).padStart(2, "0")} /{" "}
                        {String(spotlights.length).padStart(2, "0")}
                      </p>
                      <h3 className="mt-4 font-display text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl lg:text-5xl">
                        {s.headline}
                      </h3>
                      <div
                        className={`mt-6 h-1 w-16 rounded-full bg-gradient-to-r ${theme.accent}`}
                        aria-hidden
                      />
                    </div>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============================ DESCRIPTION (only when no spotlights) ============================ */}
      {spotlights.length === 0 && (
        <section className="bg-background py-16">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="mb-6 font-display text-2xl font-bold md:text-3xl">
              Sobre este producto
            </h2>
            <p className="leading-relaxed text-muted-foreground">{product.description}</p>
            <ul className="mt-8 space-y-3">
              {product.highlights.map((h) => (
                <li key={h} className="flex gap-3">
                  <Sparkles
                    className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                    aria-hidden
                  />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ============================ SPECS GRID ============================ */}
      <section className="border-y bg-muted/30 py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Especificaciones
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Ficha técnica completa
            </h2>
          </div>
          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.specs.map((spec, i) => (
              <RevealOnScroll key={spec.label} delayMs={i * 60}>
                <SpecCard spec={spec} />
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ IN BOX + WARRANTY ============================ */}
      <section className="bg-background py-16">
        <div className="container mx-auto grid gap-6 px-4 lg:grid-cols-2 lg:gap-8">
          <div className="rounded-2xl border bg-card p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Package className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="font-display text-xl font-bold">Qué viene en la caja</h2>
            </div>
            {product.inBox && product.inBox.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {product.inBox.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span
                      className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Empaque original sellado con todos los accesorios del fabricante.
              </p>
            )}
          </div>

          <div className="rounded-2xl border bg-card p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Award className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="font-display text-xl font-bold">
                Garantía {product.warrantyMonths} meses
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Garantía oficial del fabricante. Cubre defectos de fabricación, no daños por mal
              uso o desgaste normal. Conserva la boleta o factura electrónica para hacerla
              válida.
            </p>
            <Link
              href="/garantia-soporte"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              Ver políticas completas <ChevronLeft className="h-4 w-4 rotate-180" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================ RELATED ============================ */}
      {related.length > 0 && (
        <section className="border-t bg-background py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  Te puede interesar
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">
                  Productos relacionados
                </h2>
              </div>
              <Link
                href={`/productos?categoria=${product.category}`}
                className="hidden text-sm font-medium text-accent hover:underline sm:inline"
              >
                Ver toda la categoría →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => (
                <RevealOnScroll key={p.id} delayMs={i * 80}>
                  <ProductCard product={p} />
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      <StickyPurchaseBar product={product} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
    </>
  );
}

function TrustItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 bg-slate-950 px-4 py-4 text-xs text-slate-300 sm:text-sm">
      <span className="text-cyan-400">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

/**
 * Maps common spec labels (Spanish, hardware-store domain) to lucide icons.
 * Falls back to Settings for unmatched labels — never throws.
 */
function getSpecIcon(label: string) {
  const l = label.toLowerCase();
  if (l.includes("procesador") || l.includes("cpu") || l.includes("chip")) return Cpu;
  if (l.includes("gpu") || l.includes("gráfica") || l.includes("grafica") || l.includes("video"))
    return Zap;
  if (l.includes("ram") || l.includes("memoria")) return MemoryStick;
  if (
    l.includes("almacenamiento") ||
    l.includes("disco") ||
    l.includes("ssd") ||
    l.includes("hdd")
  )
    return HardDrive;
  if (l.includes("pantalla") || l.includes("display") || l.includes("monitor") || l.includes("tamaño") || l.includes("resolución") || l.includes("panel"))
    return Monitor;
  if (l.includes("refresh") || l.includes("frecuencia") || l.includes("polling") || l.includes("hz"))
    return Activity;
  if (l.includes("hdr") || l.includes("brillo")) return Sun;
  if (
    l.includes("conectividad") ||
    l.includes("conexión") ||
    l.includes("conexion") ||
    l.includes("puertos")
  )
    return Cable;
  if (l.includes("wifi") || l.includes("wireless") || l.includes("inalámbrico") || l.includes("inalambrico"))
    return Wifi;
  if (l.includes("batería") || l.includes("bateria")) return Battery;
  if (l.includes("switch") || l.includes("teclado") || l.includes("layout")) return Keyboard;
  if (l.includes("iluminación") || l.includes("iluminacion") || l.includes("rgb"))
    return Lightbulb;
  if (l.includes("micrófono") || l.includes("microfono") || l.includes("mic")) return Mic;
  if (l.includes("driver") || l.includes("audio") || l.includes("auricular")) return Headphones;
  if (l.includes("sistema") || l.includes("os")) return Settings;
  if (l.includes("tipo")) return Tag;
  return Settings;
}

function SpecCard({ spec }: { spec: Spec }) {
  const Icon = getSpecIcon(spec.label);
  return (
    <div className="glow-border group flex gap-4 rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-lg hover:shadow-accent/10">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent transition-all group-hover:scale-110 group-hover:bg-accent group-hover:text-accent-foreground">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {spec.label}
        </p>
        <p className="mt-1 font-medium leading-snug">{spec.value}</p>
      </div>
    </div>
  );
}
