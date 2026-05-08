export default function Loading() {
  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"
          role="status"
          aria-label="Cargando"
        />
        <p className="text-sm text-muted-foreground">Cargando…</p>
      </div>
    </div>
  );
}
