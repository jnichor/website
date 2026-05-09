import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  RefreshCw,
  Headphones,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const BENEFITS = [
  { icon: Truck, label: "Envío 24h", sub: "en Lima" },
  { icon: ShieldCheck, label: "Garantía oficial", sub: "del fabricante" },
  { icon: RefreshCw, label: "Cambios", sub: "hasta 7 días" },
  { icon: Headphones, label: "Soporte real", sub: "por WhatsApp" },
];

export function CTA() {
  return (
    <section className="relative isolate overflow-hidden bg-[#050a14] py-20 text-white md:py-28">
      <div aria-hidden className="absolute inset-0 motion-reduce:hidden">
        <div className="blob-cyan" />
        <div className="blob-violet" />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="container relative mx-auto px-4">
        <RevealOnScroll>
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Listo para empezar
            </p>
            <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Empieza tu próximo{" "}
              <span className="bg-gradient-to-r from-accent via-cyan-300 to-accent bg-clip-text text-transparent">
                build hoy.
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
              Mira el catálogo o pídenos un asesor para armar la PC ideal según
              tu uso y presupuesto.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild variant="accent" size="lg" className="group">
                <Link href="/productos">
                  Ver catálogo
                  <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/20 bg-white/5 text-white backdrop-blur hover:bg-white/10 hover:text-white"
              >
                <Link
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "51999888777"}?text=${encodeURIComponent(
                    "Hola, necesito asesoría"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pedir asesoría
                </Link>
              </Button>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={180}>
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-6 border-t border-white/10 pt-10 md:grid-cols-4">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.label}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-accent">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <p className="font-semibold text-white">{b.label}</p>
                  <p className="text-xs text-white/50">{b.sub}</p>
                </div>
              );
            })}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
