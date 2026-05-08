import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Términos y condiciones de uso, política de envíos, cambios y devoluciones.",
};

export default function TermsPage() {
  return (
    <article className="container mx-auto max-w-3xl space-y-6 px-4 py-12 text-sm leading-relaxed">
      <header>
        <h1 className="font-display text-3xl font-bold md:text-4xl">Términos y Condiciones</h1>
        <p className="mt-1 text-muted-foreground">Última actualización: 8 de mayo de 2026</p>
      </header>

      <section>
        <h2 className="font-display text-xl font-semibold">1. Identificación del proveedor</h2>
        <p className="mt-2">
          NovaTech Hardware S.A.C., con RUC 20512345678, domicilio fiscal en Av. Arequipa 1234,
          Lince, Lima, Perú. Email: ventas@novatechhardware.pe.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">2. Aceptación de los términos</h2>
        <p className="mt-2">
          Al usar este sitio o realizar una compra aceptás estos Términos y la Política de
          Privacidad. Si no estás de acuerdo, no utilices el sitio.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">3. Productos y precios</h2>
        <p className="mt-2">
          Los precios incluyen el IGV (18%) según la legislación peruana. Nos reservamos el derecho
          de modificar precios sin previo aviso. El precio aplicable es el vigente al momento de
          confirmar el pedido.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">4. Política de envíos</h2>
        <p className="mt-2">
          Realizamos envíos a todo el Perú. En Lima Metropolitana, plazo de 1-2 días hábiles. A
          provincias, 3-5 días hábiles según zona. El costo se muestra en el carrito antes de
          finalizar la compra.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">5. Cambios y devoluciones</h2>
        <p className="mt-2">
          Conforme a la Ley de Protección al Consumidor (Ley 29571), tenés derecho a desistir de la
          compra dentro de los 7 días calendario siguientes a la recepción del producto. El
          producto debe estar sin uso, en su empaque original y con todos los accesorios.
        </p>
        <p className="mt-2">
          En caso de defectos de fábrica, gestionamos cambio inmediato dentro de los primeros 7
          días. Pasado ese plazo, aplica la garantía oficial del fabricante.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">6. Garantía</h2>
        <p className="mt-2">
          Cada producto cuenta con la garantía oficial de su fabricante (12, 24 o 36 meses según
          modelo). La garantía cubre defectos de fabricación, no daños por mal uso, sobrecargas
          eléctricas, líquidos o modificaciones físicas.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">7. Pagos</h2>
        <p className="mt-2">
          Procesamos pagos a través de Izipay (Yape, Plin, Visa, Mastercard). No almacenamos datos
          de tarjeta — todo el procesamiento ocurre dentro del entorno seguro de Izipay.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">8. Comprobantes electrónicos</h2>
        <p className="mt-2">
          Emitimos boleta de venta electrónica (consumidor final) o factura electrónica (empresas
          con RUC), conforme a SUNAT. El comprobante llega por email automáticamente luego de la
          confirmación del pago.
        </p>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold">9. Jurisdicción</h2>
        <p className="mt-2">
          Cualquier controversia relacionada con estos términos se resolverá conforme a la
          legislación peruana, en los tribunales de Lima. Las quejas pueden presentarse ante
          INDECOPI o por nuestro Libro de Reclamaciones virtual.
        </p>
      </section>
    </article>
  );
}
