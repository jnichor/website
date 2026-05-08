const BRANDS = ["ASUS", "MSI", "Logitech", "Razer", "Corsair", "NVIDIA", "AMD", "Intel", "Samsung", "LG"];

export function BrandStrip() {
  return (
    <section className="border-y bg-muted py-10">
      <div className="container mx-auto px-4">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Marcas oficiales que distribuimos
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {BRANDS.map((brand) => (
            <span
              key={brand}
              className="font-display text-lg font-bold text-muted-foreground/70 transition-colors hover:text-foreground sm:text-xl"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
