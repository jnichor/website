import Link from "next/link";
import Image from "next/image";
import { Award, ShieldCheck, Truck, Headphones, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
      <div
        className="absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-accent/20 blur-3xl motion-reduce:hidden"
        aria-hidden
      />
      <div
        className="absolute -bottom-32 right-1/4 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl motion-reduce:hidden"
        aria-hidden
      />

      <div className="container relative mx-auto grid items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
        <div>
          <Badge variant="accent" className="text-xs uppercase tracking-wider">
            Tienda oficial
          </Badge>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Tu próximo <span className="text-accent">build gamer</span> empieza
            acá
          </h1>
          <p className="mt-4 max-w-lg text-lg text-primary-foreground/80">
            Componentes de PC, laptops gaming, monitores y periféricos con garantía oficial,
            envío 24h en Lima y soporte técnico real.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="accent" size="lg">
              <Link href="/productos">Ver productos</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/40 bg-white/5 text-white hover:bg-white/10">
              <Link
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "51999888777"}?text=${encodeURIComponent(
                  "Hola, quiero armar una PC"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Armar mi PC
              </Link>
            </Button>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <TrustBadge icon={<ShieldCheck className="h-5 w-5" aria-hidden />} label="Garantía oficial" />
            <TrustBadge icon={<Truck className="h-5 w-5" aria-hidden />} label="Envío 24h" />
            <TrustBadge icon={<Award className="h-5 w-5" aria-hidden />} label="Pago seguro" />
            <TrustBadge icon={<Headphones className="h-5 w-5" aria-hidden />} label="Soporte técnico" />
          </ul>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80"
              alt="Setup gaming con PC armada y periféricos RGB"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="absolute -bottom-4 -left-4 hidden rounded-xl bg-card p-4 text-card-foreground shadow-xl sm:block">
            <p className="text-xs text-muted-foreground">Experiencia</p>
            <p className="font-display text-lg font-bold">8+ años</p>
          </div>

          <div className="absolute -right-4 -top-4 hidden rounded-xl bg-accent p-4 text-accent-foreground shadow-xl sm:block">
            <Cpu className="h-6 w-6" aria-hidden />
            <p className="mt-1 text-xs font-bold uppercase">Tienda autorizada</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <li className="flex items-center gap-2 rounded-md bg-white/5 px-3 py-2 text-sm">
      <span className="text-accent">{icon}</span>
      <span className="text-primary-foreground/90">{label}</span>
    </li>
  );
}
