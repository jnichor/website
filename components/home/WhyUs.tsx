import { Check, X } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const ROWS = [
  "Garantía oficial del fabricante",
  "Producto 100% original",
  "Soporte post-venta especializado",
  "Factura electrónica SUNAT",
  "Envío seguro asegurado",
];

export function WhyUs() {
  return (
    <section className="relative overflow-hidden bg-[#0a0f1c] py-20 text-white md:py-28">
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
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              La diferencia
            </p>
            <h2 className="font-display text-4xl font-bold leading-tight md:text-5xl">
              Tienda oficial{" "}
              <span className="text-white/40">vs. tienda informal</span>
            </h2>
            <p className="mt-4 text-base text-white/60">
              La diferencia entre lo correcto y lo barato cuando algo falla.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid gap-6 lg:grid-cols-2">
          <RevealOnScroll>
            <div className="relative h-full overflow-hidden rounded-2xl border-2 border-accent/40 bg-gradient-to-br from-accent/15 via-[#0a1424] to-[#0a1424] p-8 shadow-[0_0_60px_rgba(0,168,212,0.15)]">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Check className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-accent">
                    Recomendado
                  </p>
                  <h3 className="font-display text-2xl font-bold text-white">
                    Tienda oficial
                  </h3>
                </div>
              </div>
              <ul className="space-y-3">
                {ROWS.map((row) => (
                  <li
                    key={row}
                    className="flex items-start gap-3 text-sm text-white/90"
                  >
                    <Check
                      className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                      aria-hidden
                    />
                    <span>{row}</span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={120}>
            <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-[#0a1424]/40 p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5 text-white/30">
                  <X className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/30">
                    Riesgo
                  </p>
                  <h3 className="font-display text-2xl font-bold text-white/40">
                    Tienda informal
                  </h3>
                </div>
              </div>
              <ul className="space-y-3">
                {ROWS.map((row) => (
                  <li
                    key={row}
                    className="flex items-start gap-3 text-sm text-white/40"
                  >
                    <X
                      className="mt-0.5 h-5 w-5 shrink-0 text-destructive/70"
                      aria-hidden
                    />
                    <span>{row}</span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
