import Link from "next/link";
import { Truck, ShieldCheck, RefreshCw, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

const BENEFITS = [
  { icon: Truck, label: "Envío 24h en Lima" },
  { icon: ShieldCheck, label: "Garantía oficial" },
  { icon: RefreshCw, label: "Cambios en 7 días" },
  { icon: Headphones, label: "Soporte técnico real" },
];

export function CTA() {
  return (
    <section className="bg-primary py-20 text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.label} className="flex flex-col items-center gap-2 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 text-accent">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <p className="text-sm font-semibold">{b.label}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Empezá tu próximo build hoy
          </h2>
          <p className="mt-3 text-primary-foreground/80">
            Mirá el catálogo o pedinos un asesor para armar la PC ideal según tu uso y presupuesto.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="accent" size="lg">
              <Link href="/productos">Ver catálogo</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 bg-white/5 text-white hover:bg-white/10">
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
      </div>
    </section>
  );
}
