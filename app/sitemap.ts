import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/products";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticPaths = [
    "",
    "/productos",
    "/nosotros",
    "/garantia-soporte",
    "/contacto",
    "/libro-de-reclamaciones",
    "/terminos",
    "/privacidad",
  ];

  const productEntries = getAllProducts().map((p) => ({
    url: `${BASE}/productos/${p.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    ...staticPaths.map((path) => ({
      url: `${BASE}${path}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...productEntries,
  ];
}
