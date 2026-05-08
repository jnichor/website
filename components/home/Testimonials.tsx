import { Star } from "lucide-react";

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
    <section className="bg-muted py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Lo que dicen nuestros clientes
          </h2>
          <p className="mt-2 text-muted-foreground">
            Más de 25,000 clientes felices en Perú
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <article key={t.name} className="rounded-xl bg-card p-6 shadow-sm">
              <div className="flex gap-1" aria-label={`${t.rating} de 5 estrellas`}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
                  aria-hidden
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
