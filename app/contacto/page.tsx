import type { Metadata } from "next";
import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Atención al cliente, soporte técnico y ventas corporativas. Lince, Lima.",
};

const PHONE = "+51 917 056 909";
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "51917056909";
const EMAIL = "ventas@novatechhardware.pe";
const ADDRESS = "Av. Arequipa 1234, Lince, Lima, Perú";

const FAQS = [
  {
    q: "¿Cuánto demora el envío?",
    a: "En Lima Metropolitana entregamos en 24-48 horas. A provincias, entre 3 y 5 días hábiles según zona.",
  },
  {
    q: "¿Emiten factura para empresas?",
    a: "Sí. En el checkout puedes elegir Boleta (DNI) o Factura (RUC). La factura electrónica llega por email.",
  },
  {
    q: "¿Aceptan Yape y Plin?",
    a: "Sí. También Visa y Mastercard (crédito y débito) con cuotas sin interés en compras con tarjeta de crédito.",
  },
  {
    q: "¿Tienen tienda física?",
    a: "Sí, en Av. Arequipa 1234, Lince, Lima. De Lunes a Sábado de 10:00 a 20:00.",
  },
];

export default function ContactPage() {
  return (
    <div>
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl font-bold md:text-5xl">Contacto</h1>
          <p className="mt-3 max-w-2xl text-primary-foreground/80">
            Estamos para ayudarte. Elige el canal que prefieras.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ContactCard
            icon={<MapPin className="h-5 w-5" aria-hidden />}
            title="Tienda"
            value={ADDRESS}
          />
          <ContactCard
            icon={<Phone className="h-5 w-5" aria-hidden />}
            title="Teléfono"
            value={PHONE}
            href={`tel:${PHONE.replace(/\s/g, "")}`}
          />
          <ContactCard
            icon={<MessageCircle className="h-5 w-5" aria-hidden />}
            title="WhatsApp"
            value="Chatear ahora"
            href={`https://wa.me/${WHATSAPP}`}
          />
          <ContactCard
            icon={<Mail className="h-5 w-5" aria-hidden />}
            title="Email"
            value={EMAIL}
            href={`mailto:${EMAIL}`}
          />
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold">Escríbenos</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Te respondemos en menos de 1 hora hábil.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold">Preguntas frecuentes</h2>
            <ul className="mt-6 space-y-4">
              {FAQS.map((f) => (
                <li key={f.q} className="rounded-lg border bg-card p-4">
                  <h3 className="font-semibold">{f.q}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.a}</p>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-xl border bg-muted p-6">
              <h3 className="flex items-center gap-2 font-display text-base font-semibold">
                <Clock className="h-5 w-5 text-primary" aria-hidden />
                Horario de atención
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Lunes a Sábado: 10:00 — 20:00
                <br />
                Domingos y feriados: 11:00 — 18:00
              </p>
            </div>

            <div className="mt-6 flex aspect-video items-center justify-center rounded-xl border bg-muted text-sm text-muted-foreground">
              [ Mapa de la tienda — embed de Google Maps en producción ]
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactCard({
  icon,
  title,
  value,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="flex h-full flex-col gap-2 rounded-xl border bg-card p-5 transition-colors hover:border-primary">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </span>
      <p className="font-display text-base font-semibold">{title}</p>
      <p className="text-sm text-muted-foreground">{value}</p>
    </div>
  );
  return href ? (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    inner
  );
}
