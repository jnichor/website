import Link from "next/link";
import { Laptop, Cpu, Mouse, Monitor, Wifi, HardDrive } from "lucide-react";

const CATEGORIES = [
  { slug: "laptops", label: "Laptops", icon: Laptop },
  { slug: "componentes", label: "Componentes", icon: Cpu },
  { slug: "perifericos", label: "Periféricos", icon: Mouse },
  { slug: "monitores", label: "Monitores", icon: Monitor },
  { slug: "networking", label: "Networking", icon: Wifi },
  { slug: "almacenamiento", label: "Almacenamiento", icon: HardDrive },
];

export function CategoryGrid() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-8 text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Explorá por categoría</h2>
        <p className="mt-2 text-muted-foreground">
          Todo lo que necesitás para tu setup, en un solo lugar
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.slug}
              href={`/productos?category=${cat.slug}`}
              className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <span className="text-center text-sm font-medium">{cat.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
