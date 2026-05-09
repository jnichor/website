import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  Truck,
  Award,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#050a14] text-white">
      <div aria-hidden className="absolute inset-0 motion-reduce:hidden">
        <div className="blob-cyan" />
        <div className="blob-violet" />
        <div className="blob-pink" />
      </div>

      <div aria-hidden className="absolute inset-0 motion-reduce:hidden">
        <span className="particle" style={{ top: "15%", left: "20%", animationDelay: "0s" }} />
        <span className="particle" style={{ top: "30%", left: "70%", animationDelay: "0.8s" }} />
        <span className="particle" style={{ top: "60%", left: "40%", animationDelay: "1.6s" }} />
        <span className="particle" style={{ top: "75%", left: "85%", animationDelay: "2.4s" }} />
        <span className="particle" style={{ top: "45%", left: "10%", animationDelay: "3.2s" }} />
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

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#050a14]"
      />

      <div className="container relative mx-auto grid items-center gap-10 px-4 py-20 md:grid-cols-12 md:py-28 lg:py-32">
        <div className="md:col-span-6">
          <Badge variant="accent" className="text-[11px] uppercase tracking-[0.22em]">
            Tienda oficial · Lima
          </Badge>

          <h1 className="mt-5 font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Tu próximo{" "}
            <span className="bg-gradient-to-r from-accent via-cyan-300 to-accent bg-clip-text text-transparent">
              build gamer
            </span>
            <span className="block text-white/70">empieza aquí.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            Componentes, laptops gaming y periféricos con garantía oficial,
            envío 24h en Lima y soporte técnico real. Sin atajos, sin sorpresas.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
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
                  "Hola, quiero armar una PC"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Armar mi PC
              </Link>
            </Button>
          </div>

          <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
            <TrustBadge icon={<ShieldCheck className="h-4 w-4" aria-hidden />} label="Garantía oficial" />
            <TrustBadge icon={<Truck className="h-4 w-4" aria-hidden />} label="Envío 24h" />
            <TrustBadge icon={<Award className="h-4 w-4" aria-hidden />} label="Pago seguro" />
            <TrustBadge icon={<Headphones className="h-4 w-4" aria-hidden />} label="Soporte real" />
          </ul>
        </div>

        <div className="relative md:col-span-6">
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-accent/25 via-cyan-500/10 to-violet-500/20 blur-2xl motion-reduce:hidden"
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1400&q=80"
                alt="Setup gaming con PC armada y periféricos RGB"
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-[#050a14]/70 via-transparent to-transparent"
              />
            </div>

            <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-white/10 bg-[#0a1424]/90 p-4 shadow-2xl backdrop-blur sm:block">
              <p className="text-[11px] uppercase tracking-wider text-white/50">Experiencia</p>
              <p className="font-display text-2xl font-bold text-white">8+ años</p>
              <p className="text-xs text-accent">en hardware peruano</p>
            </div>

            <div className="absolute -right-5 -top-5 hidden rounded-xl border border-accent/30 bg-accent/10 p-4 shadow-2xl backdrop-blur sm:block">
              <p className="text-[11px] uppercase tracking-wider text-accent/80">Tienda</p>
              <p className="font-display text-lg font-bold text-white">Autorizada</p>
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-white/40 motion-reduce:hidden md:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </div>
    </section>
  );
}

function TrustBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <li className="flex items-center gap-2 text-white/80">
      <span className="text-accent">{icon}</span>
      <span>{label}</span>
    </li>
  );
}
