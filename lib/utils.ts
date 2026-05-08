import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const currencyFormatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatPrice(value: number): string {
  return currencyFormatter.format(value);
}

const dateFormatter = new Intl.DateTimeFormat("es-PE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function formatDate(value: Date | string): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return dateFormatter.format(d);
}

const productPlural = new Intl.PluralRules("es-PE");

export function pluralProducts(count: number): string {
  return productPlural.select(count) === "one"
    ? `${count} producto`
    : `${count} productos`;
}

export function pluralCuotas(count: number): string {
  return count === 1 ? `${count} cuota` : `${count} cuotas`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function whatsappLink(phone: string, text?: string): string {
  const t = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${phone}${t}`;
}
