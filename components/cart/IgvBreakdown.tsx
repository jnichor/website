import { calcIgv } from "@/lib/tax";
import { formatPrice } from "@/lib/utils";

interface Props {
  subtotalGross: number;
  shipping: number;
}

export function IgvBreakdown({ subtotalGross, shipping }: Props) {
  const { net, igv, gross } = calcIgv(subtotalGross);
  const total = gross + shipping;

  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between">
        <dt className="text-muted-foreground">Subtotal (sin IGV)</dt>
        <dd className="font-medium">{formatPrice(net)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted-foreground">IGV (18%)</dt>
        <dd className="font-medium">{formatPrice(igv)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted-foreground">Envío</dt>
        <dd className="font-medium">{shipping === 0 ? "Gratis" : formatPrice(shipping)}</dd>
      </div>
      <div className="flex justify-between border-t pt-2 text-base">
        <dt className="font-semibold">Total</dt>
        <dd className="font-display text-lg font-bold text-primary">{formatPrice(total)}</dd>
      </div>
    </dl>
  );
}
