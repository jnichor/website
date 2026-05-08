import Link from "next/link";
import { Cpu } from "lucide-react";
import { SearchInput } from "./SearchInput";
import { CartIcon } from "./CartIcon";
import { MobileNav } from "./MobileNav";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/garantia-soporte", label: "Garantía" },
  { href: "/contacto", label: "Contacto" },
];

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "NovaTech Hardware";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 items-center gap-4 px-4">
        <MobileNav />

        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-bold text-primary"
          aria-label={`${SITE_NAME} — Inicio`}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Cpu className="h-5 w-5" aria-hidden />
          </span>
          <span className="hidden sm:inline">{SITE_NAME}</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex" aria-label="Principal">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden flex-1 max-w-md md:block">
          <SearchInput />
        </div>

        <CartIcon />
      </div>
    </header>
  );
}
