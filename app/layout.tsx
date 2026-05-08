import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TopBar } from "@/components/layout/TopBar";
import { CookieBanner } from "@/components/layout/CookieBanner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "NovaTech Hardware";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Componentes de PC y periféricos gaming en Lima`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Tienda oficial de hardware en Perú. Laptops, componentes, periféricos gaming y más. Garantía oficial, envío 24h en Lima, soporte técnico.",
  keywords: [
    "hardware",
    "componentes pc",
    "laptops gaming",
    "tarjetas gráficas",
    "perú",
    "lima",
    "novatech",
  ],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Componentes de PC y periféricos gaming en Lima`,
    description:
      "Tienda oficial de hardware en Perú. Garantía oficial, envío 24h en Lima.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: "Componentes de PC y periféricos gaming en Lima",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+51 999 888 777",
      contactType: "customer service",
      areaServed: "PE",
      availableLanguage: ["Spanish"],
    },
    sameAs: [
      "https://facebook.com/novatechhardware",
      "https://instagram.com/novatechhardware",
      "https://tiktok.com/@novatechhardware",
      "https://youtube.com/@novatechhardware",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/buscar?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="es-PE" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <a href="#main" className="skip-link">
          Saltar al contenido
        </a>
        <TopBar />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <CookieBanner />
        <Toaster position="top-right" richColors />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}
