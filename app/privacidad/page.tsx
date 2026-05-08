import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Política de privacidad y tratamiento de datos personales conforme a la Ley 29733.",
};

export default function PrivacyPage() {
  return (
    <article className="container mx-auto max-w-3xl space-y-6 px-4 py-12 text-sm leading-relaxed">
      <header>
        <h1 className="font-display text-3xl font-bold md:text-4xl">Política de Privacidad</h1>
        <p className="mt-1 text-muted-foreground">
          Conforme a la Ley 29733 — Ley de Protección de Datos Personales del Perú
        </p>
      </header>

      <section>
        <h2 className="font-display text-xl font-semibold">1. Responsable del tratamiento</h2>
        <p className="mt-2">
          NovaTech Hardware S.A.C., con RUC 20512345678, es responsable del tratamiento de los
          datos personales recolectados a través de este sitio. Email del Oficial de Datos:
          dpo@novatechhardware.pe.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">2. Finalidad del tratamiento</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Procesar pedidos, facturación electrónica y envíos.</li>
          <li>Brindar soporte técnico y postventa.</li>
          <li>Enviar comunicaciones comerciales (solo con consentimiento explícito).</li>
          <li>Cumplir obligaciones legales (SUNAT, INDECOPI).</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">3. Datos que recolectamos</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Datos de identificación: nombre, DNI/RUC, razón social.</li>
          <li>Datos de contacto: email, teléfono, dirección.</li>
          <li>Datos de pedido: items, montos, comprobante.</li>
          <li>Datos de navegación: cookies (con consentimiento).</li>
        </ul>
        <p className="mt-2">
          <strong>NO almacenamos datos de tarjeta de crédito/débito</strong>: el procesamiento
          ocurre dentro del entorno PCI-DSS de Izipay.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">4. Plazo de conservación</h2>
        <p className="mt-2">
          Conservamos los datos durante el plazo necesario para cumplir las obligaciones legales
          (5 años para SUNAT) y para prestar el servicio postventa.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">5. Derechos ARCO</h2>
        <p className="mt-2">
          Tenés derecho a Acceder, Rectificar, Cancelar u Oponerte al tratamiento de tus datos
          personales. Podés ejercerlos enviando un email a{" "}
          <a className="text-primary underline" href="mailto:dpo@novatechhardware.pe">
            dpo@novatechhardware.pe
          </a>{" "}
          adjuntando copia de tu DNI.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">6. Cookies</h2>
        <p className="mt-2">
          Usamos cookies técnicas (necesarias para el carrito), analíticas (con consentimiento) y
          de marketing (con consentimiento). Podés configurar tus preferencias en el banner inicial
          o limpiando las cookies del navegador.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">7. Seguridad</h2>
        <p className="mt-2">
          Implementamos medidas técnicas y organizativas (HTTPS, cifrado de credenciales, control
          de accesos) para proteger tus datos. Ningún sistema es 100% infalible, pero seguimos las
          mejores prácticas vigentes.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">8. Autoridad de control</h2>
        <p className="mt-2">
          Si considerás que tus derechos no fueron respetados, podés presentar reclamo ante la
          Autoridad Nacional de Protección de Datos Personales (Minjus).
        </p>
      </section>
    </article>
  );
}
