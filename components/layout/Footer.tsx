import Link from "next/link";
import Image from "next/image";
import { Cpu, Mail, MapPin, MessageCircle } from "lucide-react";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "NovaTech Hardware";
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "51999888777";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#070b14] text-white">
      <div
        aria-hidden
        className="h-px w-full bg-gradient-to-r from-transparent via-accent/60 to-transparent"
      />

      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative border-b border-white/5">
        <div className="container mx-auto grid gap-px bg-white/5 sm:grid-cols-3">
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-[#070b14] p-6 transition-colors hover:bg-[#0a1424]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
              <MessageCircle className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/50">
                WhatsApp
              </p>
              <p className="truncate font-semibold text-white">
                +51 999 888 777
              </p>
            </div>
          </a>

          <a
            href="mailto:ventas@novatechhardware.pe"
            className="flex items-center gap-4 bg-[#070b14] p-6 transition-colors hover:bg-[#0a1424]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
              <Mail className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/50">
                Email
              </p>
              <p className="truncate font-semibold text-white">
                ventas@novatechhardware.pe
              </p>
            </div>
          </a>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Av.+Arequipa+1234,+Lince,+Lima"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-[#070b14] p-6 transition-colors hover:bg-[#0a1424]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
              <MapPin className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/50">
                Tienda
              </p>
              <p className="truncate font-semibold text-white">
                Av. Arequipa 1234, Lince
              </p>
            </div>
          </a>
        </div>
      </div>

      <div className="container relative mx-auto px-4 py-14">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Cpu className="h-6 w-6" aria-hidden />
              </span>
              <span className="font-display text-xl font-bold">{SITE_NAME}</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              Componentes de PC y periféricos gaming en Lima. Tienda oficial con
              garantía, soporte técnico y envío 24h.
            </p>
            <div className="mt-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
                Síguenos
              </p>
              <div className="mt-3 flex items-center gap-2">
                <SocialIcon
                  href="https://facebook.com/novatechhardware"
                  label="Facebook"
                >
                  <FacebookIcon />
                </SocialIcon>
                <SocialIcon
                  href="https://instagram.com/novatechhardware"
                  label="Instagram"
                >
                  <InstagramIcon />
                </SocialIcon>
                <SocialIcon
                  href="https://youtube.com/@novatechhardware"
                  label="YouTube"
                >
                  <YoutubeIcon />
                </SocialIcon>
              </div>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
            <FooterColumn title="Productos">
              <FooterLink href="/productos?category=laptops">Laptops</FooterLink>
              <FooterLink href="/productos?category=componentes">
                Componentes
              </FooterLink>
              <FooterLink href="/productos?category=monitores">
                Monitores
              </FooterLink>
              <FooterLink href="/productos?category=perifericos">
                Periféricos
              </FooterLink>
              <FooterLink href="/productos?category=networking">
                Networking
              </FooterLink>
            </FooterColumn>

            <FooterColumn title="Empresa">
              <FooterLink href="/nosotros">Nosotros</FooterLink>
              <FooterLink href="/garantia-soporte">Garantía y soporte</FooterLink>
              <FooterLink href="/contacto">Contacto</FooterLink>
            </FooterColumn>

            <FooterColumn title="Legal">
              <FooterLink href="/terminos">Términos y condiciones</FooterLink>
              <FooterLink href="/privacidad">Política de privacidad</FooterLink>
              <li>
                <Link
                  href="/libro-de-reclamaciones"
                  className="mt-2 inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-accent"
                >
                  <Image
                    src="/icons/libro-reclamaciones.svg"
                    alt=""
                    width={26}
                    height={26}
                    className="rounded-sm bg-white p-1"
                  />
                  Libro de Reclamaciones
                </Link>
              </li>
            </FooterColumn>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
            Métodos de pago aceptados
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <PaymentChip className="bg-white text-[#1A1F71]">VISA</PaymentChip>
            <PaymentChip className="bg-white text-[#EB001B]">
              Mastercard
            </PaymentChip>
            <PaymentChip className="bg-[#742583] text-white">Yape</PaymentChip>
            <PaymentChip className="bg-[#00BFE7] text-white">Plin</PaymentChip>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-[#04070d]">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-white/50 md:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. Todos los derechos
            reservados.
          </p>
          <div className="flex gap-5">
            <Link
              href="/privacidad"
              className="transition-colors hover:text-accent"
            >
              Privacidad
            </Link>
            <Link
              href="/terminos"
              className="transition-colors hover:text-accent"
            >
              Términos
            </Link>
            <Link
              href="/libro-de-reclamaciones"
              className="transition-colors hover:text-accent"
            >
              Reclamaciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
      aria-label={label}
    >
      {children}
    </a>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="relative pb-3 font-display text-sm font-bold uppercase tracking-[0.18em] text-white">
        {title}
        <span
          aria-hidden
          className="absolute bottom-0 left-0 h-px w-8 bg-accent"
        />
      </h3>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-white/70 transition-colors hover:text-accent"
      >
        {children}
      </Link>
    </li>
  );
}

function PaymentChip({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`rounded-md px-3 py-1.5 text-[11px] font-bold tracking-wider ${className}`}
    >
      {children}
    </span>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M13.5 21v-7.5h2.5l.5-3h-3v-2c0-.9.3-1.5 1.6-1.5H17V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4 1.5-4 4.2v2.3H8v3h2.5V21h3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M21.6 7.2c-.2-.9-.9-1.6-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8c.2.9.9 1.6 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3-5.2 3z" />
    </svg>
  );
}
