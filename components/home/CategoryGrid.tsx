import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const CATEGORIES = [
  {
    slug: "laptops",
    label: "Laptops",
    tagline: "Gaming · Workstation",
    image:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "componentes",
    label: "Componentes",
    tagline: "GPU · CPU · Motherboard",
    image:
      "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "perifericos",
    label: "Periféricos",
    tagline: "Mouse · Teclado · Audio",
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "monitores",
    label: "Monitores",
    tagline: "144Hz · 4K · Ultrawide",
    image:
      "https://images.unsplash.com/photo-1616763355548-1b606f439f86?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "networking",
    label: "Networking",
    tagline: "Routers · Wi-Fi 6",
    image: "/products/p070/0.jpg",
  },
  {
    slug: "almacenamiento",
    label: "Almacenamiento",
    tagline: "NVMe · SSD · HDD",
    image:
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80",
  },
];

export function CategoryGrid() {
  return (
    <section className="relative bg-[#0a0f1c] py-20 text-white md:py-24">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container relative mx-auto px-4">
        <RevealOnScroll>
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Catálogo
            </p>
            <h2 className="font-display text-4xl font-bold leading-tight md:text-5xl">
              Explora por categoría
            </h2>
            <p className="mt-3 text-base text-white/60">
              Todo lo que necesitas para tu setup, en un solo lugar.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <RevealOnScroll key={cat.slug} delayMs={i * 70}>
              <Link
                href={`/productos?category=${cat.slug}`}
                className="group relative block aspect-[5/4] overflow-hidden rounded-2xl border border-white/10 bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f1c]"
              >
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-[#050a14] via-[#050a14]/55 to-transparent"
                />
                <div
                  aria-hidden
                  className="absolute bottom-0 left-0 h-1 w-0 bg-accent transition-all duration-500 group-hover:w-full"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-accent/90">
                    {cat.tagline}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <h3 className="font-display text-2xl font-bold text-white md:text-3xl">
                      {cat.label}
                    </h3>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all group-hover:bg-accent group-hover:text-accent-foreground">
                      <ArrowUpRight className="h-5 w-5" aria-hidden />
                    </span>
                  </div>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
