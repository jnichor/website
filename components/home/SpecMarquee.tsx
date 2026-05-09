import {
  ShieldCheck,
  Truck,
  FileCheck,
  Headphones,
  BadgeCheck,
  Wrench,
} from "lucide-react";

const ITEMS = [
  { icon: Truck, text: "Envío 24h en Lima" },
  { icon: ShieldCheck, text: "Garantía oficial" },
  { icon: BadgeCheck, text: "Stock real" },
  { icon: Headphones, text: "Soporte técnico" },
  { icon: FileCheck, text: "Factura SUNAT" },
  { icon: Wrench, text: "Armado profesional" },
];

export function SpecMarquee() {
  const all = [...ITEMS, ...ITEMS];
  return (
    <section
      aria-label="Beneficios"
      className="relative overflow-hidden border-y border-white/10 bg-[#050a14] py-4 text-white"
    >
      <div className="marquee-track flex w-max gap-12 whitespace-nowrap will-change-transform motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-6 motion-reduce:gap-y-2">
        {all.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="flex shrink-0 items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-white/80 sm:text-sm"
            >
              <Icon className="h-4 w-4 text-accent" aria-hidden />
              <span>{item.text}</span>
              <span className="text-accent/40">/</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
