import Image from "next/image";
import { Check, X } from "lucide-react";

const ROWS = [
  "Garantía oficial del fabricante",
  "Producto 100% original",
  "Soporte post-venta especializado",
  "Factura electrónica SUNAT",
  "Envío seguro asegurado",
];

export function WhyUs() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-square overflow-hidden rounded-xl bg-muted">
            <Image
              src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80"
              alt="Técnico armando una PC"
              width={600}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="aspect-square translate-y-8 overflow-hidden rounded-xl bg-muted">
            <Image
              src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=600&q=80"
              alt="Empaque de envío seguro"
              width={600}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div>
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            ¿Por qué comprar en una <span className="text-primary">tienda oficial</span>?
          </h2>
          <p className="mt-3 text-muted-foreground">
            La diferencia entre lo correcto y lo barato cuando algo falla.
          </p>

          <div className="mt-8 overflow-hidden rounded-xl border">
            <div className="grid grid-cols-3 bg-muted text-sm font-semibold">
              <div className="p-3">Beneficio</div>
              <div className="p-3 text-center text-primary">Tienda oficial</div>
              <div className="p-3 text-center text-muted-foreground">Tiendas informales</div>
            </div>
            {ROWS.map((row, i) => (
              <div
                key={row}
                className={`grid grid-cols-3 items-center text-sm ${i % 2 === 0 ? "bg-background" : "bg-muted/40"}`}
              >
                <div className="p-3">{row}</div>
                <div className="flex justify-center p-3">
                  <Check className="h-5 w-5 text-green-500" aria-label="Sí" />
                </div>
                <div className="flex justify-center p-3">
                  <X className="h-5 w-5 text-destructive" aria-label="No" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
