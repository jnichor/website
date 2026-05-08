import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="font-display text-7xl font-bold text-primary">404</p>
      <div>
        <h1 className="font-display text-3xl font-bold">Página no encontrada</h1>
        <p className="mt-2 text-muted-foreground">
          La página que buscás no existe o fue movida.
        </p>
      </div>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">Volver al inicio</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/productos">Ver productos</Link>
        </Button>
      </div>
    </div>
  );
}
