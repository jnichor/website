"use client";

import { useState } from "react";

interface Brand {
  name: string;
  slug?: string;
  iconSrc?: string;
  invert?: boolean;
}

const BRANDS: Brand[] = [
  { name: "ASUS", slug: "asus" },
  { name: "MSI", slug: "msi" },
  { name: "Lenovo", slug: "lenovo" },
  { name: "HP", slug: "hp" },
  { name: "Acer", slug: "acer" },
  { name: "Gigabyte", slug: "gigabyte" },
  { name: "NVIDIA", slug: "nvidia" },
  { name: "AMD", slug: "amd" },
  { name: "Intel", slug: "intel" },
  { name: "Razer", slug: "razer" },
  { name: "Logitech", slug: "logitech" },
  { name: "Corsair", slug: "corsair" },
  { name: "HyperX", slug: "hyperx" },
  { name: "SteelSeries", slug: "steelseries" },
  {
    name: "Sony",
    iconSrc: "https://www.vectorlogo.zone/logos/sony/sony-ar21.svg",
    invert: true,
  },
  { name: "Samsung", slug: "samsung" },
  { name: "LG", slug: "lg" },
  { name: "Kingston", slug: "kingstontechnology" },
  { name: "Crucial", slug: "crucial" },
  { name: "Western Digital", slug: "westerndigital" },
  { name: "Seagate", slug: "seagate" },
  { name: "TP-Link", slug: "tplink" },
  { name: "Cooler Master", slug: "coolermaster" },
  { name: "EVGA", slug: "evga" },
];

function BrandLogo({ brand }: { brand: Brand }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="shrink-0 font-display text-3xl font-bold uppercase tracking-[0.18em] text-white/55 transition-all duration-300 hover:scale-110 hover:text-white sm:text-4xl">
        {brand.name}
      </span>
    );
  }

  const src =
    brand.iconSrc ?? `https://cdn.simpleicons.org/${brand.slug}/ffffff`;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={brand.name}
      onError={() => setFailed(true)}
      className={`h-14 w-auto shrink-0 opacity-60 transition-all duration-300 hover:scale-110 hover:opacity-100 sm:h-20 ${
        brand.invert ? "brightness-0 invert" : ""
      }`}
      loading="lazy"
    />
  );
}

export function BrandStrip() {
  const all = [...BRANDS, ...BRANDS];
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-[#050a14] py-20 text-white">
      <div className="container mx-auto mb-8 px-4 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50">
          Marcas oficiales que distribuimos
        </p>
      </div>

      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#050a14] to-transparent sm:w-40"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#050a14] to-transparent sm:w-40"
        />

        <div className="marquee-track flex w-max items-center gap-16 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-12 motion-reduce:gap-y-6 motion-reduce:px-6">
          {all.map((b, i) => (
            <BrandLogo key={i} brand={b} />
          ))}
        </div>
      </div>
    </section>
  );
}
