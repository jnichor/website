const STATS = [
  { value: "10,000+", label: "Productos en stock" },
  { value: "50+", label: "Marcas oficiales" },
  { value: "25,000+", label: "Clientes satisfechos" },
  { value: "8 años", label: "En el mercado" },
];

export function TrustStats() {
  return (
    <section className="border-y bg-muted">
      <div className="container mx-auto grid grid-cols-2 gap-8 px-4 py-12 md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-3xl font-bold text-primary md:text-4xl">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
