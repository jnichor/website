import type { Metadata } from "next";
import Image from "next/image";
import { Award, Users, ShieldCheck, Cpu } from "lucide-react";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce a NovaTech Hardware: 8 años especializándonos en componentes de PC, laptops gaming y soporte técnico en Lima.",
};

const VALUES = [
  { icon: Award, label: "Producto original", description: "Solo trabajamos con distribución autorizada de cada marca." },
  { icon: ShieldCheck, label: "Garantía cumplida", description: "Garantía oficial respaldada al 100% — no tercerizamos." },
  { icon: Users, label: "Soporte humano", description: "Atendemos cada caso con técnicos certificados, no chatbots." },
  { icon: Cpu, label: "Pasión geek", description: "Vivimos del hardware: te asesoramos como si la PC fuera nuestra." },
];

const TIMELINE = [
  { year: "2017", title: "Apertura del local en Lince", text: "Empezamos con una vitrina y mucho amor por el hardware." },
  { year: "2019", title: "Primera tienda online", text: "Lanzamos novatechhardware.pe con cobertura nacional." },
  { year: "2021", title: "Distribuidores oficiales ASUS y MSI", text: "Cerramos los primeros contratos de distribución directa." },
  { year: "2024", title: "Servicio técnico propio", text: "Inauguramos el laboratorio de garantía y armado de PCs." },
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <h1 className="font-display text-4xl font-bold md:text-5xl">Sobre NovaTech</h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            Llevamos 8 años acercando el mejor hardware a gamers, profesionales y empresas en
            todo el Perú. Una tienda hecha por geeks, para geeks.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold">Nuestra historia</h2>
            <p className="mt-4 leading-relaxed">
              Empezamos en 2017 como un local pequeño en Lince. Hoy somos uno de los
              referentes en hardware en Lima, con un equipo de técnicos certificados,
              cobertura nacional y acuerdos de distribución directa con las marcas en las que más
              confías.
            </p>
            <p className="mt-3 leading-relaxed">
              Lo que no cambió: la honestidad de recomendarte lo que necesitas para tu uso real,
              no lo que más nos conviene vender.
            </p>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
            <Image
              src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=1200&q=80"
              alt="Equipo NovaTech en el laboratorio"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-display text-3xl font-bold">Nuestros valores</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <article key={v.label} className="rounded-xl bg-card p-6 shadow-sm">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold">{v.label}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-center font-display text-3xl font-bold">Nuestra línea de tiempo</h2>
        <ol className="mt-10 space-y-6 border-l-2 border-primary/20 pl-6">
          {TIMELINE.map((t) => (
            <li key={t.year} className="relative">
              <span
                className="absolute -left-[33px] flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
                aria-hidden
              >
                ·
              </span>
              <p className="font-display text-sm font-bold text-primary">{t.year}</p>
              <h3 className="font-display text-lg font-semibold">{t.title}</h3>
              <p className="text-sm text-muted-foreground">{t.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
