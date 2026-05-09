import { Star, Quote } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const TESTIMONIALS = [
  {
    name: "Diego Ramos",
    role: "Gamer competitivo",
    avatar: "DR",
    rating: 5,
    quote:
      "Compré mi RTX 4070 y llegó al día siguiente. La factura electrónica salió al toque y el soporte me ayudó con la instalación por WhatsApp. 10/10.",
  },
  {
    name: "Carolina Mendoza",
    role: "Profesional IT",
    avatar: "CM",
    rating: 5,
    quote:
      "Compramos las laptops para todo el equipo. Excelente atención corporativa, factura RUC y entrega en oficina. Ahora son nuestro proveedor fijo.",
  },
  {
    name: "Mateo Silva",
    role: "Streamer",
    avatar: "MS",
    rating: 5,
    quote:
      "Su PC armada vino impecable, cableado profesional y testeada. Stream sin caídas desde el día uno. Muy recomendados.",
  },
];

export function Testimonials() {
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
              Comunidad
            </p>
            <h2 className="font-display text-4xl font-bold leading-tight md:text-5xl">
              Lo que dicen quienes ya
              <br className="hidden sm:block" /> compraron con nosotros.
            </h2>
            <p className="mt-4 text-base text-white/60">
              Más de 25,000 clientes felices en Perú.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <RevealOnScroll key={t.name} delayMs={i * 100}>
              <article className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-[#0a1424]/60 p-7 backdrop-blur transition-all hover:-translate-y-1 hover:border-accent/40 hover:bg-[#0a1424]/90 hover:shadow-[0_0_40px_rgba(0,168,212,0.15)]">
                <Quote
                  className="absolute right-5 top-5 h-14 w-14 text-accent/20 transition-colors group-hover:text-accent/40"
                  aria-hidden
                />
                <div
                  className="flex gap-1"
                  aria-label={`${t.rating} de 5 estrellas`}
                >
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                      aria-hidden
                    />
                  ))}
                </div>
                <p className="mt-5 text-base leading-relaxed text-white/85">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-7 flex items-center gap-3 border-t border-white/10 pt-5">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-accent to-cyan-500 text-sm font-bold text-accent-foreground"
                    aria-hidden
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/50">{t.role}</p>
                  </div>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
