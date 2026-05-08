// IGV (Perú) — 18% incluido en el precio de góndola.
// Convención: Product.price ya incluye IGV.

export const IGV_RATE = 0.18;

export interface IgvBreakdown {
  net: number;
  igv: number;
  gross: number;
}

/**
 * Recibe un precio bruto (con IGV incluido) y devuelve el desglose.
 * net = gross / 1.18
 * igv = gross - net
 */
export function calcIgv(grossPrice: number): IgvBreakdown {
  const net = grossPrice / (1 + IGV_RATE);
  const igv = grossPrice - net;
  return {
    net: round2(net),
    igv: round2(igv),
    gross: round2(grossPrice),
  };
}

/**
 * Para una lista de items con cantidades, devuelve el desglose total.
 */
export function calcCartIgv(items: { price: number; quantity: number }[]): IgvBreakdown {
  const grossTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  return calcIgv(grossTotal);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
