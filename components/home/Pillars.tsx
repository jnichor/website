import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cpu, ShieldCheck, Headphones } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Button } from "@/components/ui/button";

interface Pillar {
  eyebrow: string;
  title: string;
  highlight: string;
  body: string;
  image: string;
  imageAlt: string;
  icon: typeof Cpu;
  stats: { value: string; label: string }[];
  ctaLabel: string;
  ctaHref: string;
  reverse?: boolean;
}

const PILLARS: Pillar[] = [
  {
    eyebrow: "Performance",
    title: "Hardware que no",
    highlight: "te frena",
    body: "Componentes seleccionados con criterio: chipsets actuales, refrigeración real, fuentes certificadas. Sin compromisos en lo que importa.",
    image:
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Componentes de PC iluminados con RGB",
    icon: Cpu,
    stats: [
      { value: "10K+", label: "Productos en stock" },
      { value: "50+", label: "Marcas oficiales" },
    ],
    ctaLabel: "Ver componentes",
    ctaHref: "/productos?category=componentes",
  },
  {
    eyebrow: "Garantía",
    title: "Respaldo del",
    highlight: "fabricante",
    body: "Cada producto sale con factura SUNAT, garantía oficial de la marca y procedimiento claro de RMA. Si falla, lo resolvemos.",
    image:
      "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Empaque de envío seguro",
    icon: ShieldCheck,
    stats: [
      { value: "100%", label: "Productos originales" },
      { value: "SUNAT", label: "Factura electrónica" },
    ],
    ctaLabel: "Conocer garantía",
    ctaHref: "/garantia-soporte",
    reverse: true,
  },
  {
    eyebrow: "Soporte",
    title: "Soporte técnico",
    highlight: "que responde",
    body: "Asesoría real para armar tu PC, ayuda con drivers, escalamiento de RMA y atención por WhatsApp. Sin bots, sin tickets que se pierden.",
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Técnico armando una PC",
    icon: Headphones,
    stats: [
      { value: "<24h", label: "Tiempo de respuesta" },
      { value: "8+", label: "Años de experiencia" },
    ],
    ctaLabel: "Hablar con un asesor",
    ctaHref: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "51999888777"}?text=${encodeURIComponent(
      "Hola, necesito asesoría"
    )}`,
  },
];

export function Pillars() {
  return (
    <section className="relative overflow-hidden bg-[#050a14] py-20 text-white md:py-28">
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
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Por qué NovaTech
            </p>
            <h2 className="font-display text-4xl font-bold leading-tight md:text-5xl">
              Tres cosas que hacemos en serio.
            </h2>
          </div>
        </RevealOnScroll>

        <div className="space-y-24 md:space-y-32">
          {PILLARS.map((p, idx) => (
            <PillarRow key={p.eyebrow} pillar={p} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PillarRow({ pillar, index }: { pillar: Pillar; index: number }) {
  const Icon = pillar.icon;
  const isExternal = pillar.ctaHref.startsWith("http");

  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <RevealOnScroll className={pillar.reverse ? "lg:order-2" : ""}>
        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-accent/25 via-cyan-500/10 to-transparent blur-2xl motion-reduce:hidden"
          />
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-[#0a1424] shadow-2xl">
            <Image
              src={pillar.image}
              alt={pillar.imageAlt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-[#050a14]/40 via-transparent to-transparent"
            />
            <div className="absolute right-4 top-4 rounded-lg border border-white/20 bg-black/50 px-3 py-1 font-display text-sm font-bold tracking-wider text-white backdrop-blur">
              0{index + 1}
            </div>
          </div>
        </div>
      </RevealOnScroll>

      <RevealOnScroll
        className={pillar.reverse ? "lg:order-1" : ""}
        delayMs={120}
      >
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              {pillar.eyebrow}
            </p>
          </div>

          <h3 className="mt-5 font-display text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
            {pillar.title}{" "}
            <span className="bg-gradient-to-r from-accent via-cyan-300 to-accent bg-clip-text text-transparent">
              {pillar.highlight}
            </span>
            .
          </h3>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65">
            {pillar.body}
          </p>

          <div className="mt-8 grid max-w-md grid-cols-2 gap-6 border-y border-white/10 py-5">
            {pillar.stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-bold text-white md:text-3xl">
                  {s.value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-white/50">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-7">
            <Button asChild variant="accent" size="lg" className="group">
              {isExternal ? (
                <a href={pillar.ctaHref} target="_blank" rel="noopener noreferrer">
                  {pillar.ctaLabel}
                  <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </a>
              ) : (
                <Link href={pillar.ctaHref}>
                  {pillar.ctaLabel}
                  <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </Button>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  );
}
