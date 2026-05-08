import Link from "next/link";
import Image from "next/image";
import { Cpu, Facebook, Instagram, Youtube } from "lucide-react";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "NovaTech Hardware";

export function Footer() {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <Cpu className="h-5 w-5" aria-hidden />
              </span>
              <span className="font-display text-lg font-bold">{SITE_NAME}</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-primary-foreground/70">
              Componentes de PC y periféricos gaming en Lima. Tienda oficial con garantía,
              soporte técnico y envío 24h.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://facebook.com/novatechhardware"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md p-2 transition-colors hover:bg-white/10"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="https://instagram.com/novatechhardware"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md p-2 transition-colors hover:bg-white/10"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="https://youtube.com/@novatechhardware"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md p-2 transition-colors hover:bg-white/10"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold">Productos</h3>
            <ul className="mt-3 space-y-2 text-sm text-primary-foreground/80">
              <li>
                <Link href="/productos?category=laptops" className="hover:text-accent">
                  Laptops
                </Link>
              </li>
              <li>
                <Link href="/productos?category=componentes" className="hover:text-accent">
                  Componentes
                </Link>
              </li>
              <li>
                <Link href="/productos?category=monitores" className="hover:text-accent">
                  Monitores
                </Link>
              </li>
              <li>
                <Link href="/productos?category=perifericos" className="hover:text-accent">
                  Periféricos
                </Link>
              </li>
              <li>
                <Link href="/productos?category=networking" className="hover:text-accent">
                  Networking
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold">Empresa</h3>
            <ul className="mt-3 space-y-2 text-sm text-primary-foreground/80">
              <li>
                <Link href="/nosotros" className="hover:text-accent">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/garantia-soporte" className="hover:text-accent">
                  Garantía y soporte
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-accent">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="hover:text-accent">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-accent">
                  Política de privacidad
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold">Soporte</h3>
            <ul className="mt-3 space-y-2 text-sm text-primary-foreground/80">
              <li>
                <Link
                  href="/libro-de-reclamaciones"
                  className="inline-flex items-center gap-2 hover:text-accent"
                >
                  <Image
                    src="/icons/libro-reclamaciones.svg"
                    alt="Libro de Reclamaciones"
                    width={28}
                    height={28}
                    className="rounded-sm bg-white p-1"
                  />
                  Libro de Reclamaciones
                </Link>
              </li>
              <li>ventas@novatechhardware.pe</li>
              <li>+51 999 888 777</li>
              <li>Av. Arequipa 1234, Lince, Lima</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/60">
            Métodos de pago aceptados
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="rounded-md bg-white px-3 py-2 text-xs font-bold text-[#1A1F71]">
              VISA
            </span>
            <span className="rounded-md bg-white px-3 py-2 text-xs font-bold text-[#EB001B]">
              Mastercard
            </span>
            <span className="rounded-md bg-[#742583] px-3 py-2 text-xs font-bold text-white">
              Yape
            </span>
            <span className="rounded-md bg-[#00BFE7] px-3 py-2 text-xs font-bold text-white">
              Plin
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 text-xs text-primary-foreground/60 md:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="/privacidad" className="hover:text-accent">
              Privacidad
            </Link>
            <Link href="/terminos" className="hover:text-accent">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
