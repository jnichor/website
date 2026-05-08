import Link from "next/link";
import { Phone, Truck, MessageCircle } from "lucide-react";

const PHONE = "+51 999 888 777";
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "51999888777";

export function TopBar() {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-2 text-xs sm:flex-row">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4" aria-hidden />
          <span>Envío gratis en Lima por compras superiores a S/1,500</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={`tel:${PHONE.replace(/\s/g, "")}`}
            className="flex items-center gap-1.5 hover:text-accent"
            aria-label="Llamar al teléfono"
          >
            <Phone className="h-4 w-4" aria-hidden />
            <span>{PHONE}</span>
          </a>
          <Link
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-accent"
            aria-label="Contactar por WhatsApp"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            <span>WhatsApp</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
