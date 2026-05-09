import type { Metadata } from "next";
import { ComplaintForm } from "@/components/complaint/ComplaintForm";

export const metadata: Metadata = {
  title: "Libro de Reclamaciones",
  description:
    "Libro de Reclamaciones virtual conforme al D.S. 011-2011-PCM. Registra tu reclamo o queja.",
};

const COMPANY_LEGAL = process.env.COMPANY_LEGAL_NAME ?? "NovaTech Hardware S.A.C.";
const COMPANY_RUC = process.env.COMPANY_RUC ?? "20512345678";
const COMPANY_ADDRESS = process.env.COMPANY_FISCAL_ADDRESS ?? "Av. Arequipa 1234, Lince, Lima, Perú";

export default function ComplaintPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold md:text-4xl">Libro de Reclamaciones</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Conforme al Decreto Supremo N° 011-2011-PCM
      </p>

      <section className="mt-6 rounded-xl border bg-muted p-5 text-sm">
        <h2 className="font-display text-base font-semibold">Datos de la empresa</h2>
        <dl className="mt-2 grid grid-cols-[120px_1fr] gap-y-1">
          <dt className="text-muted-foreground">Razón social</dt>
          <dd>{COMPANY_LEGAL}</dd>
          <dt className="text-muted-foreground">RUC</dt>
          <dd className="font-mono">{COMPANY_RUC}</dd>
          <dt className="text-muted-foreground">Dirección fiscal</dt>
          <dd>{COMPANY_ADDRESS}</dd>
        </dl>
      </section>

      <p className="mt-6 rounded-md border-l-4 border-amber-400 bg-amber-50 p-3 text-sm text-amber-900">
        El proveedor debe dar respuesta al reclamo en un plazo no mayor a 15 días hábiles, plazo
        que puede ser extendido hasta por 15 días adicionales, previa comunicación al consumidor.
      </p>

      <div className="mt-8">
        <ComplaintForm />
      </div>
    </div>
  );
}
