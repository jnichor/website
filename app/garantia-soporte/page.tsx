import type { Metadata } from "next";
import { ShieldCheck, RefreshCw, Wrench, Headphones } from "lucide-react";

export const metadata: Metadata = {
  title: "Garantía y soporte técnico",
  description:
    "Política de garantía oficial, soporte técnico, cambios y devoluciones de NovaTech Hardware.",
};

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Garantía oficial",
    text: "Todos los productos cuentan con garantía directa del fabricante (12, 24 o 36 meses según modelo).",
  },
  {
    icon: RefreshCw,
    title: "Cambios en 7 días",
    text: "Si el producto presenta fallas de fábrica, gestionamos cambio inmediato durante los primeros 7 días.",
  },
  {
    icon: Wrench,
    title: "Servicio técnico propio",
    text: "Laboratorio interno para diagnóstico, garantía y armado profesional de PCs.",
  },
  {
    icon: Headphones,
    title: "Soporte real",
    text: "Atención por WhatsApp, llamada y presencial. Respondemos en menos de 1 hora hábil.",
  },
];

export default function WarrantyPage() {
  return (
    <div>
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl font-bold md:text-5xl">Garantía y soporte</h1>
          <p className="mt-3 max-w-2xl text-primary-foreground/80">
            Tu tranquilidad es parte del producto. Aquí te contamos cómo te respaldamos.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <article key={p.title} className="rounded-xl border bg-card p-6 shadow-sm">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="mt-4 font-display text-lg font-semibold">{p.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y bg-muted py-16">
        <div className="container mx-auto max-w-3xl space-y-6 px-4 text-sm leading-relaxed">
          <h2 className="font-display text-2xl font-bold">Cómo activar la garantía</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>Conserva tu boleta o factura electrónica (nunca caduca).</li>
            <li>
              Escríbenos por WhatsApp o email con número de pedido y descripción del problema.
            </li>
            <li>Te enviamos guía de retorno gratis dentro de Lima Metropolitana.</li>
            <li>Diagnóstico en 24-72h hábiles. Reparación, cambio o reembolso según el caso.</li>
          </ol>

          <h2 className="font-display text-2xl font-bold">Qué cubre la garantía</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Defectos de fabricación validados por el fabricante.</li>
            <li>Fallas eléctricas o de software no causadas por el usuario.</li>
            <li>Componentes con garantía limitada (lifetime para RAM Kingston, etc.).</li>
          </ul>

          <h2 className="font-display text-2xl font-bold">Qué NO cubre</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Daños por mal uso, sobrecargas eléctricas o líquidos.</li>
            <li>Modificaciones físicas (overclock destructivo, sticker removidos).</li>
            <li>Desgaste normal de baterías o componentes consumibles.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
