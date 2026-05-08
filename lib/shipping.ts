import type { ShippingZone } from "./types";

export const SHIPPING_ZONES: ShippingZone[] = [
  {
    id: "lima-metropolitana",
    name: "Lima Metropolitana",
    price: 15.0,
    minDeliveryDays: 1,
    maxDeliveryDays: 2,
  },
  {
    id: "provincias-norte",
    name: "Provincias Norte",
    price: 25.0,
    minDeliveryDays: 3,
    maxDeliveryDays: 5,
  },
  {
    id: "provincias-sur",
    name: "Provincias Sur",
    price: 25.0,
    minDeliveryDays: 3,
    maxDeliveryDays: 5,
  },
  {
    id: "provincias-centro",
    name: "Provincias Centro",
    price: 25.0,
    minDeliveryDays: 3,
    maxDeliveryDays: 5,
  },
];

export const FREE_SHIPPING_THRESHOLD = 1500; // S/

export function getZone(id: string): ShippingZone | undefined {
  return SHIPPING_ZONES.find((z) => z.id === id);
}

export function calcShipping(zoneId: string, subtotalGross: number): number {
  const zone = getZone(zoneId);
  if (!zone) return 0;
  if (subtotalGross >= FREE_SHIPPING_THRESHOLD) return 0;
  return zone.price;
}
