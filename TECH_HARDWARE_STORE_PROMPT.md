# Prompt — Build a Tech Hardware E-Commerce Site (Next.js)

> Copy everything below the `---` line into Claude Code, Cursor, or any AI coding agent.
> Replace the placeholders in `BRIEF` (lines marked `<<...>>`) with your real business data before sending.
> Everything else can be sent verbatim.

---

You are a senior full-stack engineer. Build a complete, production-ready e-commerce website for a **technology hardware company** using the stack and patterns described below. Mirror the architecture of a reference Peruvian e-commerce site (Next.js 16 + Prisma + Izipay), but adapt every page, copy, color, category, and product schema to a tech hardware store.

The result must be a single Next.js app the user can run with `npm install && npm run dev` and immediately have a working storefront with mock products, a persistent cart, a multi-step checkout, sandbox payment, transactional API routes, SEO metadata, sitemap, and full responsive design.

---

## 1. BRIEF — fill these in before running the prompt

> **HARD REQUIREMENTS (no se pueden sobrescribir):**
> - **Idioma de TODA la interfaz, copys, metadatos, mensajes de error, emails y formularios: ESPAÑOL PERUANO NEUTRO (es-PE) con formas TÚ.** No se admite mezcla con inglés en texto visible (los identificadores de código siguen en inglés). **NO usar voseo argentino** (vos / mirá / pedinos / acá / tenés / podés / fierros). Ver Sección 11 para la tabla completa de sustituciones.
> - **Medios de pago obligatorios:** **Yape**, **Plin**, **Tarjeta de crédito Visa**, **Tarjeta de crédito Mastercard**, **Tarjeta de débito Visa**, **Tarjeta de débito Mastercard**. Estos cuatro tipos de tarjeta se exponen como opciones explícitas (no agrupadas como un único "tarjeta").
> - **Estética visual:** la home debe tener **estética MSI dark cinematic** (inspirada en páginas de producto de MSI Katana 15, Cyborg 15). NO usar el split layout corporativo "imagen a la derecha / texto a la izquierda" tradicional. Ver Sección 5.
> - **Imágenes de producto:** REALES, no Unsplash genérico. Ver Sección 4.5 (pipeline con Puppeteer + Stealth para Amazon, ASUS CDN abierto, normalización a JPEG real).

```
Company name:           <<e.g., "NovaTech Hardware">>
Tagline:                <<e.g., "Componentes de PC y periféricos gaming en Lima">>
Domain:                 <<e.g., "novatechhardware.pe">>
Country / locale:       Peru, es-PE, currency PEN  (FIJO — no cambiar)
City / HQ address:      <<e.g., "Av. Arequipa 1234, Lince, Lima, Perú">>
Phone / WhatsApp:       <<e.g., "+51 999 888 777">>
Email:                  <<e.g., "ventas@novatechhardware.pe">>
Brand primary color:    <<e.g., #0A2540 (deep navy) — used for headers, primary buttons>>
Brand accent color:     <<e.g., #00D2FF (cyber cyan) — used for highlights, CTAs, prices>>
Brand dark / text:      <<e.g., #0F172A>>
Brand light / bg:       <<e.g., #F8FAFC>>
Heading font:           <<e.g., Space Grotesk>>
Body font:              <<e.g., Inter>>
Years in business:      <<e.g., 8>>
Hero stat #1:           <<e.g., "10,000+ productos en stock">>
Hero stat #2:           <<e.g., "24h envío en Lima">>
Hero stat #3:           <<e.g., "Garantía oficial">>
Hero stat #4:           <<e.g., "Soporte técnico">>
Social handles:         <<facebook=..., instagram=..., tiktok=..., youtube=...>>
Payment gateway:        Izipay (FIJO — soporta Yape, Plin, Visa y Mastercard en Perú)
Wallet payments:        Yape, Plin (FIJO)
Card payments:          Visa crédito, Visa débito, Mastercard crédito, Mastercard débito (FIJO — 4 opciones explícitas)
Bank transfer enabled:  <<yes/no>>
Installments enabled:   yes (3, 6, 12 cuotas) — solo aplica a tarjetas de crédito
B2B / RUC invoicing:    <<yes/no>>
Shipping zones:         <<list with name + price + delivery days>>
```

---

## 2. Tech stack (do not deviate)

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript** strict
- **Tailwind CSS v4** with `@theme inline` custom tokens + `tw-animate-css`
- **shadcn/ui** components (button, card, badge, input, label, dialog, sheet, separator, select, radio-group, tabs, checkbox, avatar, skeleton, sonner)
- **lucide-react** for icons
- **Zustand** with `persist` middleware for cart state (localStorage)
- **react-hook-form** + **zod** for form validation
- **Prisma 7** + **PostgreSQL** (schema + migrations; runtime can stay mocked with in-file data for local dev)
- **next/font** (Google Fonts) — one serif/display + one sans
- **sonner** for toast notifications
- Payment gateway SDK as specified in BRIEF
- ESLint with `eslint-config-next`

---

## 3. Information architecture — pages to build

Build these routes under `app/` using the App Router. All copy in the locale from BRIEF.

| Route | Purpose |
|---|---|
| `/` | Homepage (Hero, Trust stats, Featured products, Brand carousel, Comparison/Why-us, Testimonials, Benefits + CTA) |
| `/productos` | Catalog with category tabs filter, sorting, grid |
| `/productos/[slug]` | Product detail: gallery, specs, price/installments, stock, related products |
| `/categorias/[slug]` | Optional landing per main category (laptops, componentes, etc.) |
| `/marcas/[slug]` | Optional landing per brand (Asus, MSI, Logitech, NVIDIA, etc.) |
| `/carrito` | Cart with quantity controls, shipping zone picker, summary |
| `/checkout` | Multi-step checkout (shipping → payment → processing → success) |
| `/nosotros` | About: story, values, timeline, certifications, team |
| `/garantia-soporte` | Warranty & technical support policy (replaces "sustainability" page) |
| `/contacto` | Contact info cards, WhatsApp CTA, contact form, FAQ, store map placeholder |
| `/buscar` | Resultados de búsqueda (query param `?q=`), filtra por nombre + brand + tags |
| `/libro-de-reclamaciones` | **OBLIGATORIO POR LEY (INDECOPI)** — formulario + página estática con datos de la empresa |
| `/terminos` | Términos y Condiciones |
| `/privacidad` | Política de Privacidad (Ley 29733 de Datos Personales — Perú) |
| `/api/products` | GET all products (soporta `?q=` y `?category=` query params) |
| `/api/orders` | POST crear pedido (valida stock antes de crear; 409 si no alcanza), GET por id |
| `/api/payment/create` | POST crear form token de Izipay |
| `/api/payment/webhook` | POST handler de webhook (HMAC + idempotencia + replay protection) |
| `/api/complaints` | POST registrar reclamo en Libro de Reclamaciones |
| `app/loading.tsx`, `app/error.tsx`, `app/not-found.tsx` | **OBLIGATORIOS** — globales + por ruta donde haya fetch |
| `app/sitemap.ts` | Sitemap dinámico con todos los slugs de productos |
| `app/robots.ts` | Allow `/`, disallow `/api`, `/checkout`, `/carrito` |

---

## 4. Product taxonomy (tech hardware specific)

Replace the reference site's egg categories with **these tech categories**. Use them in `Product.category` enum, `ProductGrid` filter tabs, and the footer "Productos" links.

```ts
type Category =
  | 'laptops'         // Notebooks, ultrabooks, gaming laptops
  | 'desktops'        // PCs prearmadas, all-in-ones, mini-PCs
  | 'componentes'     // CPU, GPU, RAM, motherboard, PSU, case, cooling, SSD, HDD
  | 'perifericos'     // Teclado, mouse, headset, mousepad, controllers
  | 'monitores'       // Monitores gaming, profesionales, ultrawide, 4K
  | 'networking'      // Routers, switches, mesh, wifi adapters
  | 'almacenamiento'  // SSDs, NVMe, HDDs externos, NAS
  | 'audio'           // Parlantes, audífonos, micrófonos, interfaces
  | 'smart-home'      // Cámaras, focos, asistentes, smart plugs
  | 'accesorios';     // Cables, adaptadores, hubs, fundas, soportes
```

For each product include the following extended fields (extend the reference `Product` type):

```ts
interface Product {
  id: string;
  sku: string;                 // e.g., "ASUS-ROG-G16-001"
  name: string;
  slug: string;
  brand: string;               // e.g., "ASUS", "Logitech"
  description: string;         // marketing copy
  shortDescription: string;    // for cards
  price: number;               // in your currency
  originalPrice?: number;
  installments?: { months: number; monthly: number }[]; // e.g., [{months:12, monthly:299.90}]
  image: string;
  images: string[];            // gallery, 3-6 images
  category: Category;
  tags: string[];              // e.g., ["gaming", "RGB", "wireless"]
  specs: { label: string; value: string }[]; // key spec sheet
  highlights: string[];        // 3-5 selling bullets
  inBox?: string[];            // what's included
  warrantyMonths: number;      // 12, 24, 36
  inStock: boolean;
  stockQty?: number;
  featured?: boolean;
  isNew?: boolean;             // "Nuevo" badge
  isBestseller?: boolean;      // "Más vendido" badge
  rating?: number;             // 0-5
  reviewCount?: number;
}
```

Seed `lib/products.ts` with **at least 50 realistic products** distributed across categories. Use representative brands (ASUS, MSI, Gigabyte, Lenovo, HP, Acer, Razer, Logitech, Corsair, Kingston, Crucial, Samsung, WD, Seagate, NVIDIA, AMD, Intel, Sony, JBL, Apple, Dell, TP-Link, etc.) and realistic prices in the BRIEF's currency.

> **Product photos must be real**, sourced from manufacturer CDNs or Amazon (see Section 4.5 — Image pipeline). Generic Unsplash stock photos are NOT acceptable for production: they don't match specific product names. The original prompt's instruction to "use Unsplash URLs" is replaced by the autonomous image pipeline.

---

## 4.5 Product image pipeline (real images, not stock)

Real product photos come from manufacturer CDNs or Amazon listings. Build an autonomous pipeline so the catalog has zero dependency on Unsplash placeholders.

### Sources by reliability

| Source | Behavior | Use when |
|---|---|---|
| **ASUS CDN** (`dlcdnwebimgs.asus.com/gain/<UUID>/w1000/h732`) | Open, no anti-bot | ANY ASUS product (laptops, motherboards, monitors, routers, peripherals) |
| **Amazon `m.media-amazon.com`** | Hi-res via Amazon scraping | Brands that block their own CDN (MSI, Lenovo, Apple, Razer, Dell, HP, Acer, Gigabyte) |
| **vectorlogo.zone / Simple Icons** | Logos only | BrandStrip section (not products) |
| **Manufacturer pages directly** | Often 403 / timeout for bots | Last resort, only for ASUS-class open CDNs |

### Tools (install as devDependencies)

```bash
npm install --save-dev puppeteer-extra puppeteer-extra-plugin-stealth puppeteer
# sharp is already a transitive dep via Next.js 15+ (used internally for image optimization)
```

### Scripts to build

#### `scripts/fetch-amazon-puppeteer.ts`

Headless Chromium with stealth plugin to bypass Amazon's anti-bot detection. Bare `fetch()` from Node returns CAPTCHA pages — only Puppeteer + stealth gets through. **Full implementation** (copy verbatim):

```ts
/**
 * Run: npx tsx scripts/fetch-amazon-puppeteer.ts <ASIN> [<ASIN> ...]
 */
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import type { Browser } from "puppeteer";

puppeteer.use(StealthPlugin());

interface ProductData {
  asin: string;
  title: string | null;
  brand: string | null;
  priceUSD: number | null;
  images: string[];
  bullets: string[];
  status: "ok" | "blocked" | "error";
  note?: string;
}

async function fetchProduct(browser: Browser, asin: string): Promise<ProductData> {
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
  );
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });

  try {
    await page.goto(`https://www.amazon.com/dp/${asin}`, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });

    const isCaptcha = await page.evaluate(() =>
      document.body.innerText.includes("we just need to make sure you're not a robot")
    );
    if (isCaptcha) {
      return { asin, title: null, brand: null, priceUSD: null, images: [], bullets: [], status: "blocked", note: "CAPTCHA" };
    }

    await page.waitForSelector("#productTitle", { timeout: 15000 }).catch(() => {});

    const data = await page.evaluate(() => {
      const titleEl = document.querySelector("#productTitle");
      const title = titleEl?.textContent?.trim() ?? null;

      const brandEl = document.querySelector("#bylineInfo");
      let brand: string | null = null;
      if (brandEl) {
        const text = brandEl.textContent?.trim() ?? "";
        const m = text.match(/^(?:Visit the |Marca:\s*|Brand:\s*)?(.+?)(?:\s+Store)?$/i);
        brand = m ? m[1].trim() : text;
      }

      let priceUSD: number | null = null;
      const priceEl = document.querySelector(
        ".a-price.aok-align-center .a-offscreen, #corePrice_feature_div .a-offscreen, .a-price .a-offscreen"
      );
      if (priceEl) {
        const m = priceEl.textContent?.match(/\$([\d,]+\.\d{2})/);
        if (m) priceUSD = parseFloat(m[1].replace(/,/g, ""));
      }

      const images = new Set<string>();
      const mainImg = document.querySelector("#landingImage") as HTMLImageElement | null;
      if (mainImg) {
        const hires = mainImg.getAttribute("data-old-hires") || mainImg.src;
        if (hires && hires.startsWith("http")) images.add(hires);
      }
      // Pull every "hiRes":"<url>" from the colorImages JS blob via regex
      for (const s of document.querySelectorAll("script")) {
        const text = s.textContent || "";
        const re = /"hiRes":"(https:\/\/[^"]+\.(?:jpg|png|webp))"/g;
        let m: RegExpExecArray | null;
        while ((m = re.exec(text)) !== null) {
          if (m[1].includes("m.media-amazon.com")) images.add(m[1]);
        }
      }

      const bulletEls = document.querySelectorAll("#feature-bullets ul li span.a-list-item");
      const bullets = Array.from(bulletEls)
        .map((el) => (el.textContent ?? "").trim())
        .filter((t) => t.length > 0 && t.length < 500);

      return { title, brand, priceUSD, images: Array.from(images), bullets };
    });

    return { asin, ...data, status: "ok" };
  } catch (err) {
    return { asin, title: null, brand: null, priceUSD: null, images: [], bullets: [], status: "error", note: err instanceof Error ? err.message : String(err) };
  } finally {
    await page.close();
  }
}

async function main() {
  const asins = process.argv.slice(2);
  if (asins.length === 0) {
    console.error("Usage: npx tsx scripts/fetch-amazon-puppeteer.ts <ASIN> [<ASIN> ...]");
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-blink-features=AutomationControlled"],
  });

  const results: ProductData[] = [];
  for (const asin of asins) {
    process.stderr.write(`[${asin}] fetching... `);
    const d = await fetchProduct(browser, asin);
    process.stderr.write(`${d.status} (${d.images.length} imgs)\n`);
    results.push(d);
    await new Promise((r) => setTimeout(r, 2000 + Math.random() * 1500)); // polite jitter
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => { console.error(err); process.exit(1); });
```

**Filtrado de imágenes que devuelve este script** — al copiarlas a `product-images.json`, prefiere las que tienen prefijo `71*`, `81*`, `61*` (suelen ser fotos del producto) y descarta las que empiezan con `41*` o `51*` (variantes / thumbnails). Acepta solo URLs con `_AC_SL1000_` o superior. Si una imagen es marketing infographic ("Blazing Speed", overlays de specs), descártala visualmente después de descargar.

#### `scripts/product-images.json`

Map each product ID to source URLs:

```json
{
  "p001": {
    "_name": "ASUS ROG Strix G16 RTX 4070",
    "sourceUrls": [
      "https://dlcdnwebimgs.asus.com/gain/CFE9CB59-216D-4AC9-AEAE-10054506055C/w1000/h732",
      "https://dlcdnwebimgs.asus.com/gain/2EC328E4-7529-4CB5-A797-3B13E84D4664/w1000/h732"
    ]
  },
  "p043": {
    "_name": "Razer Blade 14 — 4 infographic URLs filtered out",
    "sourceUrls": [
      "https://m.media-amazon.com/images/I/71wk6LgSmoL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/81yLVBQfkTL._SL1500_.jpg"
    ]
  }
}
```

#### `scripts/download-product-images.ts`

Lee `product-images.json` y descarga cada URL a `public/products/<id>/N.jpg`. Idempotente (skipea archivos existentes). Sin dependencias externas — usa `fetch` nativo de Node. **Full implementation**:

```ts
/**
 * Reads scripts/product-images.json with shape:
 *   { "p001": { "sourceUrls": ["https://...jpg", "https://...jpg"] }, ... }
 * Saves to public/products/<id>/0.<ext>, 1.<ext>, ...
 *
 * Usage:  npm run images:download
 */
import { writeFile, mkdir, access, readFile } from "node:fs/promises";
import { resolve, extname } from "node:path";

interface ProductConfig { sourceUrls: string[]; }
type Config = Record<string, ProductConfig>;

const ROOT = resolve(process.cwd());
const CONFIG_PATH = resolve(ROOT, "scripts", "product-images.json");
const PUBLIC_DIR = resolve(ROOT, "public", "products");
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function fileExists(path: string): Promise<boolean> {
  try { await access(path); return true; } catch { return false; }
}

function extFromUrl(url: string): string {
  const clean = url.split("?")[0].split("#")[0];
  const ext = extname(clean).toLowerCase();
  if (ext && [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"].includes(ext)) return ext;
  return ".jpg";
}

async function downloadOne(url: string, dest: string): Promise<"saved" | "skipped" | "failed"> {
  if (await fileExists(dest)) return "skipped";
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,es;q=0.8",
      },
      redirect: "follow",
    });
    if (!res.ok) { console.error(`  ✗ ${url} → HTTP ${res.status}`); return "failed"; }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength < 1024) { console.error(`  ✗ ${url} → suspiciously small (${buf.byteLength} bytes)`); return "failed"; }
    await writeFile(dest, buf);
    return "saved";
  } catch (err) {
    console.error(`  ✗ ${url} → ${err instanceof Error ? err.message : String(err)}`);
    return "failed";
  }
}

async function main() {
  let raw: string;
  try { raw = await readFile(CONFIG_PATH, "utf8"); }
  catch { console.error(`No config at ${CONFIG_PATH}`); process.exit(1); }

  const config: Config = JSON.parse(raw);
  await mkdir(PUBLIC_DIR, { recursive: true });

  const totals = { saved: 0, skipped: 0, failed: 0 };
  for (const [productId, { sourceUrls }] of Object.entries(config)) {
    if (!sourceUrls?.length) { console.log(`[${productId}] no URLs — skipping`); continue; }
    console.log(`[${productId}] ${sourceUrls.length} image(s)`);
    const productDir = resolve(PUBLIC_DIR, productId);
    await mkdir(productDir, { recursive: true });
    for (let i = 0; i < sourceUrls.length; i++) {
      const url = sourceUrls[i];
      const dest = resolve(productDir, `${i}${extFromUrl(url)}`);
      const result = await downloadOne(url, dest);
      totals[result]++;
      if (result === "saved") console.log(`  ✓ ${i}${extFromUrl(url)}`);
      else if (result === "skipped") console.log(`  · ${i}${extFromUrl(url)} (already exists)`);
    }
  }
  console.log(`\nDone. saved=${totals.saved}  skipped=${totals.skipped}  failed=${totals.failed}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
```

Add to `package.json` scripts: `"images:download": "tsx scripts/download-product-images.ts"`

#### `scripts/normalize-product-images.ts`

Muchos archivos `.jpg` que descargan de CDNs de fabricantes son en realidad PNG/WEBP/HEIF/AVIF con extensión mentirosa. Los browsers toleran (MIME sniffing) pero la API de Anthropic rechaza AVIF y la optimización de Next puede fallar. Este script normaliza todo a JPEG real q90 mozjpeg, in-place, manteniendo el nombre `.jpg`. **Full implementation**:

```ts
/**
 * Run with: npx tsx scripts/normalize-product-images.ts
 */
import sharp from "sharp";
import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";

const ROOT = join(process.cwd(), "public", "products");

async function main() {
  const folders = await readdir(ROOT);
  let converted = 0, skipped = 0, failed = 0;

  for (const folder of folders) {
    const folderPath = join(ROOT, folder);
    const folderStat = await stat(folderPath);
    if (!folderStat.isDirectory()) continue;

    const files = await readdir(folderPath);
    for (const file of files) {
      if (!file.endsWith(".jpg")) continue;
      const filePath = join(folderPath, file);
      const rel = `${folder}/${file}`;

      try {
        const buffer = await readFile(filePath);
        const meta = await sharp(buffer).metadata();
        if (meta.format === "jpeg") {
          console.log(`  ${rel}  already JPEG`);
          skipped++; continue;
        }
        const out = await sharp(buffer).jpeg({ quality: 90, mozjpeg: true }).toBuffer();
        await writeFile(filePath, out);
        console.log(`✓ ${rel}  ${meta.format} → JPEG`);
        converted++;
      } catch (err) {
        console.error(`✗ ${rel}  FAILED: ${err instanceof Error ? err.message : String(err)}`);
        failed++;
      }
    }
  }

  console.log(`\nConverted: ${converted}\nSkipped (already JPEG): ${skipped}\nFailed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => { console.error(err); process.exit(1); });
```

Add to `package.json` scripts: `"images:normalize": "tsx scripts/normalize-product-images.ts"`

> Nota: `sharp` ya viene como dependencia transitiva de Next.js 15+ (lo usa internamente para optimización de imágenes), no hay que instalar nada extra.

#### `scripts/audit-product-images.ts`

Importa `lib/products.ts` y emite una tabla agrupada por categoría con la fuente de imagen de cada producto (`local` / `unsplash` / `other`). Útil para verificar antes del deploy que TODOS los productos tienen imágenes locales. **Full implementation**:

```ts
/**
 * Run: npx tsx scripts/audit-product-images.ts
 */
import { PRODUCTS } from "../lib/products";

type Row = {
  id: string;
  name: string;
  brand: string;
  category: string;
  source: "local" | "unsplash" | "other";
  imageCount: number;
};

const rows: Row[] = PRODUCTS.map((p) => {
  const first = p.image ?? p.images?.[0] ?? "";
  let source: Row["source"] = "other";
  if (first.startsWith("/products/")) source = "local";
  else if (first.includes("unsplash.com")) source = "unsplash";
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    source,
    imageCount: p.images?.length ?? (p.image ? 1 : 0),
  };
});

console.log(`TOTAL: ${rows.length} products`);
console.log(`  local images: ${rows.filter((r) => r.source === "local").length}`);
console.log(`  unsplash:     ${rows.filter((r) => r.source === "unsplash").length}`);
console.log(`  other:        ${rows.filter((r) => r.source === "other").length}`);
console.log("");

const byCategory = new Map<string, Row[]>();
for (const r of rows) {
  if (!byCategory.has(r.category)) byCategory.set(r.category, []);
  byCategory.get(r.category)!.push(r);
}

for (const [cat, list] of byCategory) {
  console.log(`\n=== ${cat.toUpperCase()} (${list.length}) ===`);
  for (const r of list) {
    const tag = r.source === "local" ? "[LOCAL]" : r.source === "unsplash" ? "[UNSPL]" : "[OTHER]";
    console.log(`  ${r.id}  ${tag}  ${r.brand} — ${r.name}`);
  }
}
```

> **Quality gate**: antes de deploy, este script debe reportar `unsplash: 0` y `other: 0`. Cualquier producto con source distinto a `local` indica que falta corregir su entry en `lib/products.ts`.

#### `scripts/delete-products.ts`

Utilidad para eliminar productos en bloque del catálogo. Recorre `lib/products.ts` línea por línea; cada producto top-level abre con `  {` (indent de 2 espacios) y cierra con `  },`. Match contra `TO_DELETE` por ID extraído del campo `id: "pXXX"`. **Full implementation**:

```ts
/**
 * Run: npx tsx scripts/delete-products.ts
 *
 * Edit the TO_DELETE Set below with the IDs you want removed, then run.
 * Mantiene comentarios de sección y el resto de productos intactos.
 */
import { readFile, writeFile } from "node:fs/promises";

const TO_DELETE = new Set<string>([
  // "p002", "p004", ...
]);

interface Block { start: number; end: number; id: string; }

async function main() {
  const path = "lib/products.ts";
  const text = await readFile(path, "utf-8");
  const lines = text.split("\n");

  const blocks: Block[] = [];
  let blockStart = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^  \{\s*$/.test(line)) blockStart = i;
    const idMatch = line.match(/^\s+id:\s*"(p\d+)"/);
    if (idMatch && blockStart >= 0) {
      let endLine = -1;
      for (let j = i + 1; j < lines.length; j++) {
        if (/^  \},?\s*$/.test(lines[j])) { endLine = j; break; }
      }
      if (endLine === -1) throw new Error(`Could not find end of block starting at line ${blockStart}`);
      blocks.push({ start: blockStart, end: endLine, id: idMatch[1] });
      blockStart = -1;
    }
  }

  const toRemoveLines = new Set<number>();
  const removedIds: string[] = [];
  const keptIds: string[] = [];
  for (const block of blocks) {
    if (TO_DELETE.has(block.id)) {
      for (let i = block.start; i <= block.end; i++) toRemoveLines.add(i);
      removedIds.push(block.id);
    } else {
      keptIds.push(block.id);
    }
  }

  const newLines = lines.filter((_, i) => !toRemoveLines.has(i));
  const newText = newLines.join("\n").replace(/\n{3,}/g, "\n\n"); // collapse triple blank lines
  await writeFile(path, newText);

  console.log(`Removed ${removedIds.length}: ${removedIds.join(", ")}`);
  console.log(`Kept    ${keptIds.length}: ${keptIds.join(", ")}`);

  const missing = [...TO_DELETE].filter((id) => !removedIds.includes(id));
  if (missing.length > 0) {
    console.warn(`\nWARNING: did not find these IDs to delete: ${missing.join(", ")}`);
    process.exit(1);
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
```

> Después de correr, también borra manualmente `public/products/<id>/` y la entry correspondiente en `scripts/product-images.json` para los IDs eliminados.

#### `scripts/check-image-magic.ps1`

Script PowerShell de validación: lee los primeros 4 bytes de cada `.jpg` en `public/products/` y reporta el formato real según magic bytes. Útil para detectar PNG/WEBP/HEIF disfrazados antes de deploy. **Full implementation**:

```powershell
Get-ChildItem -Path '<path-to-project>\public\products' -Recurse -File -Filter '*.jpg' | ForEach-Object {
  $bytes = [System.IO.File]::ReadAllBytes($_.FullName) | Select-Object -First 4
  $hex = ($bytes | ForEach-Object { $_.ToString('X2') }) -join ' '
  $type = switch -Wildcard ($hex) {
    '89 50 4E 47*' { 'PNG (mislabeled!)' }
    'FF D8 FF*'    { 'JPEG' }
    '52 49 46 46*' { 'WEBP/RIFF' }
    '47 49 46 38*' { 'GIF' }
    default        { 'UNKNOWN: ' + $hex }
  }
  $rel = $_.FullName.Substring($_.FullName.IndexOf('products'))
  [PSCustomObject]@{ File = $rel; Type = $type }
} | Format-Table -AutoSize | Out-String -Width 200
```

Reemplazá `<path-to-project>` con la ruta absoluta. Run: `powershell -ExecutionPolicy Bypass -File scripts/check-image-magic.ps1`. Para que pase el quality gate, TODOS los archivos deben reportar `JPEG`. Si aparece alguna fila `PNG (mislabeled!)` o `WEBP/RIFF` o `UNKNOWN`, correr `npm run images:normalize` y volver a verificar.

> Magic bytes de referencia:
> - JPEG: `FF D8 FF`
> - PNG: `89 50 4E 47` (`.PNG`)
> - WEBP: `52 49 46 46` (`RIFF`) seguido de `WEBP`
> - HEIF/AVIF: `00 00 00 1C ftyp` (offset 4)
> - GIF: `47 49 46 38`

### Workflow per new product

1. User pastes Amazon URL(s) (multiple in a single message OK)
2. Extract ASINs (`/dp/<10 chars>`)
3. Run `npx tsx scripts/fetch-amazon-puppeteer.ts <ASIN1> <ASIN2> ...` to get JSON with title/bullets/images
4. Filter top 5 hi-res images (prefer `71*`, `81*`, `61*` prefixes)
5. Add entry to `scripts/product-images.json`
6. Run `npm run images:download`
7. Run `npm run images:normalize`
8. Visually verify hero image (read with vision) — ensure it's a clean product photo, not a marketing infographic ("Blazing Speed", "50% UP Power Efficiency", etc.) or lifestyle shot. Delete bad files and update JSON to remove their URLs.
9. Add product entry to `lib/products.ts` with `image: "/products/<id>/0.jpg"` and `images: [...]` array
10. Type-check: `npx tsc --noEmit`

### Brand logos for BrandStrip

Use Simple Icons CDN with `onError` fallback to wordmark — see Section 9 "Brand strip strategy". `next.config.ts` does NOT need to whitelist `cdn.simpleicons.org` because the BrandStrip uses plain `<img>` (not `<Image>`).

### Quality gates

- Every `Product.image` and `Product.images[]` resolves to `/products/<id>/<i>.jpg` (no Unsplash, no external CDNs)
- All files in `public/products/` are real JPEG (verified via the `check-image-magic.ps1` magic byte script)
- Hero image (0.jpg) of each product passes a vision check: shows the actual product, not an infographic
- Image filenames stay `.jpg` even if original was PNG/WEBP/HEIF — normalize converts in place

---

## 5. Homepage sections (in order)

> **Aesthetic direction:** MSI-style dark cinematic, inspired by MSI laptop product pages (Katana 15, Cyborg 15). The page is dark from top to bottom (the only light moment is the FeaturedProducts section, where white product cards need contrast). Use animated background blobs, particle dots, oversized bold typography, gradient text on key words, marquee scrolls, and reveal-on-scroll for storytelling. NEVER use the generic "split hero with image right" layout — this is a gaming/tech retailer, not a corporate landing.

1. **TopBar** — thin promo strip, free-shipping left, phone + WhatsApp right.
2. **Header** — sticky, blurred white, logo, nav (Inicio, Productos, Categorías, Nosotros, Contacto), centered search input (lucide `Search` icon, placeholder "Buscar productos, marcas, SKU…", Enter redirects to `/buscar?q=…`; mobile collapses to icon → sheet), cart icon with badge from Zustand, sheet mobile menu. Full keyboard nav, `role="search"`, `aria-label` on icons.

3. **Hero (cinematic dark)** — full-bleed `bg-[#050a14]` with `relative isolate overflow-hidden`. Layered:
   - **3 animated blob backgrounds** (`.blob-cyan`, `.blob-violet`, `.blob-pink`) at low opacity drifting independently
   - **Floating particles** (5 small dots that twinkle on staggered delays)
   - **5% opacity grid pattern** overlay (`background-size: 44px 44px`, white lines)
   - **Bottom vignette** (gradient fading to `#050a14`)
   - 12-column grid: left col-span-6 with badge `tracking-[0.22em]` ("Tienda oficial · Lima"), oversized H1 (`text-5xl sm:text-6xl lg:text-7xl leading-[1.02]`) where ONE keyword uses `bg-gradient-to-r from-accent via-cyan-300 to-accent bg-clip-text text-transparent`, subhead in `text-white/70`, two CTAs (primary accent + outline glass `border-white/20 bg-white/5 backdrop-blur`), 4-icon trust row in compact list
   - Right col-span-6: product hero image with absolutely-positioned glow ring behind (`-inset-4 rounded-[2rem] bg-gradient-to-tr from-accent/25 via-cyan-500/10 to-violet-500/20 blur-2xl`), floating spec cards at `-bottom-5 -left-5` and `-right-5 -top-5` with `bg-[#0a1424]/90 backdrop-blur`
   - Scroll indicator at bottom-center with `animate-bounce` ChevronDown + uppercase "Scroll" label
   - All decorative animations gated by `motion-reduce:hidden`

4. **SpecMarquee** — NEW component. Thin dark band (`py-4 bg-[#050a14] border-y border-white/10`) with infinite horizontal marquee of trust promises (Envío 24h, Garantía oficial, Stock real, Soporte técnico, Factura SUNAT, Armado profesional). Each item: lucide icon in accent + uppercase text + accent slash separator. Items duplicated `[...ITEMS, ...ITEMS]` for seamless loop via `.marquee-track` CSS animation. With `prefers-reduced-motion`, falls back to `motion-reduce:flex-wrap motion-reduce:justify-center` so all items remain visible.

5. **CategoryGrid (dark image-driven)** — `bg-[#0a0f1c] py-20 md:py-24` with subtle grid pattern. **NO iconitos centered in cards** — use real product photos. 6 cards in `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` with `aspect-[5/4]`:
   - Full-bleed product image (laptop, GPU close-up, RGB keyboard, ultrawide monitor, router, NVMe SSD)
   - Dark gradient overlay bottom (`bg-gradient-to-t from-[#050a14] via-[#050a14]/55 to-transparent`)
   - Bottom-left text: tagline in accent uppercase `tracking-[0.2em]` + label in `font-display text-2xl md:text-3xl font-bold`
   - Bottom-right: arrow button (`ArrowUpRight` in `bg-white/10 → bg-accent on group-hover`)
   - Hover: image `scale-110` (500ms transition), accent line (`absolute bottom-0 h-1 w-0`) slides to `w-full`
   - Each card wrapped in `RevealOnScroll` with staggered `delayMs={i * 70}`

6. **Pillars (storytelling)** — NEW component. `bg-[#050a14] py-20 md:py-28` with grid pattern. Centered intro: eyebrow "Por qué <Company>" in accent caps + H2 "Tres cosas que hacemos en serio." Then 3 alternating left/right rows (`reverse?: true` toggles `lg:order-2` on the image col):
   - **Performance**, **Garantía**, **Soporte** — each with eyebrow + H3 (keyword in cyan gradient `bg-clip-text`) + body + 2-stat grid `border-y border-white/10` + accent CTA button with arrow
   - Image side: aspect-[4/3] with abs-positioned blur glow (`-inset-2 from-accent/25 via-cyan-500/10 blur-2xl`), "01" / "02" / "03" badge floating top-right in `bg-black/50 backdrop-blur`
   - Both image and content use `RevealOnScroll`, content with `delayMs={120}` for slight stagger

7. **FeaturedProducts** — KEPT in light theme (`bg-background`). The light section is a deliberate breathing moment after 5 dark sections — product cards are white internally and need contrast. 4-card grid via `getFeaturedProducts()`, "Ver todos" link top-right.

8. **BrandStrip (dark marquee with real logos)** — `bg-[#050a14] py-20 border-y border-white/10`. Title small caps tracking-wide centered. Then horizontal marquee with **20-24 real brand logos**:
   - Source: Simple Icons CDN at `https://cdn.simpleicons.org/<slug>/ffffff` — forces logos to pure white
   - Logo size: `h-14 sm:h-20` (substantial, not thumbnail)
   - Default opacity 60%, hover `opacity-100 scale-110`
   - **Edge fade gradients** (left/right `pointer-events-none w-20 sm:w-40 bg-gradient-to-r from-[#050a14] to-transparent`) so logos appear to emerge from the dark — Apple/MSI carousel style. NEVER let logos collide with the section edge.
   - **`onError` fallback** to styled wordmark when Simple Icons doesn't have the brand. Brands frequently removed for trademark: Logitech, Western Digital, EVGA, HyperX, Cooler Master, Sony. Component is `"use client"` because it tracks fail state per logo via `useState`.
   - Optional per-brand `iconSrc` override (interface `Brand { name; slug?; iconSrc?; invert? }`). For brands with public SVG elsewhere (Sony at `vectorlogo.zone`), set `iconSrc` + `invert: true`. The `invert` flag applies `brightness-0 invert` to force any colored SVG to white silhouette.
   - Brand list spans every category present in catalog: ASUS, MSI, Lenovo, HP, Acer, Gigabyte, NVIDIA, AMD, Intel, Razer, Logitech, Corsair, HyperX, SteelSeries, Sony, Samsung, LG, Kingston, Crucial, Western Digital, Seagate, TP-Link, Cooler Master, EVGA.

9. **WhyUs (dark two-card comparison)** — DROP the 5-row table layout. Use 2 large cards side-by-side on `bg-[#0a0f1c] py-20 md:py-28` with grid pattern:
   - Header: eyebrow "La diferencia" in accent + H2 "Tienda oficial vs. tienda informal" (second half in `text-white/40`) + subhead
   - **Left card "Tienda oficial"** (recommended): `border-2 border-accent/40`, `bg-gradient-to-br from-accent/15 via-[#0a1424] to-[#0a1424]`, `shadow-[0_0_60px_rgba(0,168,212,0.15)]`. Header: cyan check icon-tile + "Recomendado" eyebrow + H3 "Tienda oficial". 5 benefits with cyan checks.
   - **Right card "Tienda informal"** (risk): `border border-white/10 bg-[#0a1424]/40`. Header: muted X icon-tile + "Riesgo" eyebrow in white/30 + H3 "Tienda informal" in white/40. Same 5 items with red destructive X icons in muted text.
   - Both use `RevealOnScroll` with second delayed by 120ms.

10. **Testimonials (dark)** — `bg-[#0a0f1c] py-20 md:py-28` with grid pattern. Eyebrow "Comunidad" + H2 + subhead. 3 testimonial cards in `md:grid-cols-3`:
    - Card: `bg-[#0a1424]/60 backdrop-blur border-white/10`, hover `border-accent/40 + shadow-[0_0_40px_rgba(0,168,212,0.15)]`
    - Big absolute Quote icon `top-5 right-5 h-14 w-14 text-accent/20` (40% on hover)
    - Stars + quote text in `text-white/85`
    - Author with gradient avatar (`from-accent to-cyan-500`) + name in white + role in white/50
    - Each in `RevealOnScroll` with `delayMs={i * 100}`

11. **CTA (dark cinematic close)** — `bg-[#050a14] py-20 md:py-28` with blobs (cyan + violet) + 5% grid pattern:
    - Centered: eyebrow "Listo para empezar" in accent caps + huge H2 (`text-4xl md:text-6xl leading-[1.05]`) with "build hoy" keyword in cyan gradient + subhead in white/60
    - Two CTAs: accent primary with arrow + outline glass
    - Below, separated by `border-t border-white/10`: 4-benefit row (`Truck`, `ShieldCheck`, `RefreshCw`, `Headphones`) each as icon-tile in `bg-white/5 border-white/10` + bold label + sub label in white/50
    - Both blocks use `RevealOnScroll`, second delayed 180ms

12. **Footer (dark, restructured)** — major redesign:
    - **Top accent gradient line** (`h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent`)
    - **Top contact strip**: 3-column grid using the `gap-px bg-white/5` divider trick (each cell `bg-[#070b14]`). WhatsApp / Email / Address. Each with icon-tile in `bg-accent/15 text-accent` + uppercase label + value. All clickable: `wa.me/<num>`, `mailto:`, Google Maps search URL.
    - **Main grid** (`lg:grid-cols-12`): brand col `lg:col-span-5` with logo + description + "Seguinos" + 3 social icons in circles (`border-white/10 bg-white/5 → border-accent/40 bg-accent/10 on hover`, plus `-translate-y-0.5` lift).
    - **Right col `lg:col-span-7`**: 3 link columns each with H3 having `tracking-[0.18em]` uppercase + accent underline (`absolute bottom-0 left-0 h-px w-8 bg-accent`). Columns: Productos / Empresa / Legal.
    - **Social icons**: inline SVG components (lucide deprecated `Facebook`/`Instagram`/`Youtube` icons due to trademark in 2024-2025 — use local SVG paths). Define `FacebookIcon`, `InstagramIcon`, `YoutubeIcon` as named React components inside the file.
    - **Payment chips strip** with 4 chips (VISA, Mastercard, Yape, Plin) at `text-[11px] tracking-wider`, separated by `border-t border-white/10 pt-8`.
    - **Bottom bar darker** (`bg-[#04070d] border-t border-white/10`) with copyright + 3 inline links (Privacidad / Términos / Reclamaciones).

---

## 6. Product detail page — required elements

- Breadcrumb / "Volver a productos" link
- Image gallery: main image + thumbnail strip (clickable)
- Discount badge (`-X% OFF`) if `originalPrice`
- "Nuevo" / "Más vendido" badges
- Brand line + category badge
- H1 product name
- **Star rating** (lucide `Star`) + review count link
- Price block: current price big, strike-through original price, **installments line** ("o 12 cuotas de S/199.90 sin interés"). Compute from `installments[]`.
- Stock state badge ("En stock — listo para enviar" / "Bajo pedido" / "Agotado")
- SKU + Brand + Warranty months
- **Tabs** (shadcn Tabs): "Descripción" | "Especificaciones" (key/value table from `specs[]`) | "Qué incluye" (`inBox[]` list) | "Garantía" (warranty policy text)
- Highlights bullet list (`highlights[]`)
- Quantity stepper + Add-to-cart button (orange/accent)
- "Comprar ahora" (skips cart, goes to /checkout) — optional
- Trust row: Envío 24h, Garantía X meses, Pago seguro, Cambio en 7 días
- WhatsApp "Pregunta sobre este producto" button with deep link
- Related products grid (same category, exclude current, 4 cards)

---

## 7. Cart, Checkout, Payment

### Cart (`/carrito`)
- Persistente vía Zustand `persist` (key: `<<company-slug>>-cart`)
- Empty state con ilustración + CTA "Ver productos"
- Line items: imagen, nombre (link), brand, qty stepper, line total, remove (Trash icon)
- **Validación de stock al modificar cantidad**: el stepper no permite superar `stockQty`. Si el producto se quedó sin stock (sincronizado al montar la página), mostrar badge "Agotado" y bloquear el botón de checkout.
- Shipping zone selector (desde BRIEF) — recalcula total en vivo
- **Resumen con desglose de IGV** (impuesto 18% — obligatorio en Perú):
  ```
  Subtotal (sin IGV):  S/ XXX.XX
  IGV (18%):           S/ XXX.XX
  Envío:               S/ XX.XX   (o "Gratis")
  ─────────────────────────────
  Total:               S/ XXX.XX
  ```
  El IGV se calcula como `precio_total / 1.18 * 0.18` (los precios en `Product.price` SON con IGV incluido — convención peruana).
- Hint de envío gratis ("Agregá S/X más para envío gratis")
- CTA "Proceder al pago" → `/checkout` (deshabilitado si hay items sin stock)

### Checkout (`/checkout`) — multi-step state machine
States: `'shipping' | 'payment' | 'processing' | 'success'`. Steps indicator at top.

**Step 1 — Shipping form** (zod-validated, todos los mensajes en español):
- firstName, lastName, email, phone (validar formato peruano `+51 9XX XXX XXX`), address, district, city, reference (opcional)
- shippingZone select
- **Tipo de comprobante**: radio `boleta | factura`.
  - Boleta → pide DNI (8 dígitos numéricos)
  - Factura → pide RUC (11 dígitos, debe empezar en `10`, `15`, `17` o `20`) + razón social + dirección fiscal
- **Checkbox obligatorio** al final del formulario: `He leído y acepto los [Términos](/terminos) y la [Política de Privacidad](/privacidad)`. El botón "Continuar al pago" queda `disabled` mientras no esté tildado. Validar también del lado del servidor en `/api/orders` (campo `acceptedTermsAt: ISODate`).

**Step 2 — Payment form** (todo el copy en español):

> **CRÍTICO — PCI-DSS:** los datos de tarjeta (número, CVV, vencimiento) **NO** pueden tocar tu backend. Hay que usar el **iframe oficial de Izipay (KR-Embedded / Form-Token)**. El sitio NO renderiza inputs propios para `card number` ni `CVV`. Cualquier intento de almacenar o loguear estos campos es violación de PCI-DSS y exposición legal.

Flujo:
1. El cliente selecciona método de pago en un radio con **6 opciones** (logo + label):
   - **Yape**, **Plin** (billeteras)
   - **Tarjeta de crédito Visa**, **Tarjeta de crédito Mastercard**
   - **Tarjeta de débito Visa**, **Tarjeta de débito Mastercard**
   - (opcional, si BRIEF activa transferencia) **Transferencia bancaria**
2. Si selecciona **tarjeta**: el frontend llama a `POST /api/payment/create` enviando `{ orderId, amount, currency: 'PEN', paymentMethod, installments, customer }`. El backend pide un `formToken` a Izipay y lo devuelve. El frontend monta el iframe `<KR-Embedded>` con ese token vía `@lyracom/embedded-form-glue`. Izipay procesa la tarjeta dentro del iframe y dispara un callback al frontend cuando termina; el backend confirma vía webhook.
3. Cuotas: el `formToken` ya incluye los planes disponibles (1, 3, 6, 12) **solo cuando** `paymentMethod` es de crédito. En débito el `formToken` se genera con `installments=1` y la UI no muestra el selector.
4. Validación de marca **solo para UX antes de abrir el iframe** (el iframe valida de nuevo): Visa empieza en `4`, Mastercard en `5` o rango `2221-2720`. No se exponen datos al backend.
5. Si **Yape / Plin**: muestra QR + pasos numerados ("1. Abrí la app de Yape/Plin", "2. Escaneá el QR", "3. Ingresá el monto S/X.XX", "4. Copiá el N° de operación") + input requerido "N° de operación" (8–10 dígitos numéricos). El backend valida el monto y el N° vía webhook de Izipay (que también soporta Yape/Plin en Perú).
6. Si **transferencia**: datos de cuenta (BCP, Interbank, BBVA según BRIEF) + uploader "Subir comprobante" (acepta jpg/png/pdf, máx 5MB). El pedido queda en estado `pending_verification` hasta validación manual.
7. Card de hint con tarjetas de prueba sandbox visible **solo** si `GATEWAY_ENVIRONMENT === 'TEST'`.
8. **Doble submit guard**: el botón "Pagar" pasa a `loading` y se deshabilita inmediatamente; bloquear nuevos clicks hasta resolver.

**Step 3 — Processing**: full-screen spinner, 2–3 second simulated delay, then call `/api/payment/create` → `/api/orders` → succeed.

**Step 4 — Success**: green checkmark, big order ID (e.g., `NT-XXXX-XXXX`), 3-step "Próximos pasos" list (email confirmation, prep, shipped), buttons to home + keep shopping. Clear cart on success.

### Payment integration
- Módulo en `lib/izipay.ts` exportando: `IZIPAY_TEST_CONFIG`, `generateOrderId()`, `formatAmountForGateway()`, `createFormToken()`, `validatePayment()`, `PAYMENT_METHODS`, `TEST_CARDS`.
- `PAYMENT_METHODS` debe ser exactamente:

```ts
export const PAYMENT_METHODS = [
  { id: 'yape',           label: 'Yape',                       type: 'wallet',  installments: false, logo: '/payments/yape.svg' },
  { id: 'plin',           label: 'Plin',                       type: 'wallet',  installments: false, logo: '/payments/plin.svg' },
  { id: 'visa-credit',    label: 'Tarjeta de crédito Visa',    type: 'card',    brand: 'visa',       cardType: 'credit', installments: true,  logo: '/payments/visa.svg' },
  { id: 'mc-credit',      label: 'Tarjeta de crédito Mastercard', type: 'card', brand: 'mastercard', cardType: 'credit', installments: true,  logo: '/payments/mastercard.svg' },
  { id: 'visa-debit',     label: 'Tarjeta de débito Visa',     type: 'card',    brand: 'visa',       cardType: 'debit',  installments: false, logo: '/payments/visa.svg' },
  { id: 'mc-debit',       label: 'Tarjeta de débito Mastercard',  type: 'card', brand: 'mastercard', cardType: 'debit',  installments: false, logo: '/payments/mastercard.svg' },
] as const;
```

- Coloca los SVG/PNG de logos en `public/payments/` (`yape.svg`, `plin.svg`, `visa.svg`, `mastercard.svg`).
- **Order ID format**: `${process.env.NEXT_PUBLIC_COMPANY_PREFIX}-${base36Timestamp}-${random6}` en mayúsculas. El prefix se lee SIEMPRE del env, nunca hardcodeado. Ejemplos: `NT-LXKP9A-7HQ4F2`, `NV-LXKP9B-K2M9X1`. Si la env var falta, lanzar error en boot.
- **API `/api/payment/create`** — valida body con zod, llama al endpoint real de Izipay `POST /api-payment/V4/Charge/CreatePayment` con HMAC-SHA256 firmado con `IZIPAY_API_KEY`, devuelve `{ formToken, publicKey, environment }`. Nunca acepta datos de tarjeta.
- **API `/api/payment/webhook`** — endpoint POST con seguridad real (no stub):
  1. Lee header `kr-hash` (firma HMAC enviada por Izipay).
  2. Recalcula HMAC-SHA256 con `IZIPAY_WEBHOOK_SECRET` sobre el raw body.
  3. Compara con `crypto.timingSafeEqual` — comparación de tiempo constante.
  4. Valida `kr-hash-key === 'sha256_hmac'` y que el timestamp del payload no sea mayor a 5 minutos (replay protection).
  5. **Idempotencia**: antes de procesar, busca `paymentId` en la DB. Si ya está en `paid`, devuelve 200 sin re-procesar.
  6. Switch sobre estado: `PAID | AUTHORISED → status='paid'`, `REFUSED → status='failed'`, `CANCELLED → status='cancelled'`. Solo entonces actualiza el pedido y descuenta `stockQty`.
  7. Devuelve 200 rápido (Izipay reintenta si recibe timeout o 5xx).
- **`/api/orders` con validación de stock atómica**: dentro de una transacción Prisma (`prisma.$transaction`), valida `item.quantity <= product.stockQty` para todos los items. Si alguno falla, retorna `409 Conflict` con `{ error: 'OUT_OF_STOCK', items: [...] }`. El frontend muestra qué items se quedaron sin stock y bloquea el checkout. El stock se decrementa SOLO en el webhook cuando el pago se confirma (no al crear el pedido — eso evita reservar stock por carritos abandonados).
- **Rate limiting** en `/api/orders`, `/api/complaints`, `/api/contact`: máx 5 requests/min por IP (usar `@upstash/ratelimit` o un Map en memoria para dev).

---

## 8. Database — Prisma schema

Create `prisma/schema.prisma` with these models. Add the tech-specific fields to Product. Keep relations consistent.

```prisma
generator client { provider = "prisma-client-js" }
datasource db    { provider = "postgresql"; url = env("DATABASE_URL") }

model Product {
  id              String   @id @default(cuid())
  sku             String   @unique
  name            String
  slug            String   @unique
  brand           String
  description     String
  shortDescription String?
  price           Decimal  @db.Decimal(10,2)
  originalPrice   Decimal? @db.Decimal(10,2)
  image           String
  images          String[]
  category        String
  tags            String[]
  specs           Json     // [{label,value}]
  highlights      String[]
  inBox           String[]
  warrantyMonths  Int      @default(12)
  inStock         Boolean  @default(true)
  stockQty        Int      @default(0)
  featured        Boolean  @default(false)
  isNew           Boolean  @default(false)
  isBestseller   Boolean  @default(false)
  rating          Float?
  reviewCount     Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  orderItems      OrderItem[]
}

model Customer {
  id        String   @id @default(cuid())
  email     String   @unique
  firstName String
  lastName  String
  phone     String
  documentType String? // DNI | RUC | Passport
  documentNumber String?
  companyName String?
  address   String
  district  String
  city      String
  reference String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  orders    Order[]
}

model Order {
  id             String   @id @default(cuid())
  orderNumber    String   @unique               // formato <PREFIX>-<base36>-<rand6>
  customerId     String
  customer       Customer @relation(fields: [customerId], references: [id])
  items          OrderItem[]
  subtotalNet    Decimal  @db.Decimal(10,2)     // sin IGV
  igv            Decimal  @db.Decimal(10,2)     // 18% (Perú)
  subtotalGross  Decimal  @db.Decimal(10,2)     // subtotalNet + igv
  shipping       Decimal  @db.Decimal(10,2)
  total          Decimal  @db.Decimal(10,2)     // subtotalGross + shipping
  status         String   @default("pending")   // pending|paid|preparing|shipped|delivered|cancelled|pending_verification
  paymentMethod  String                         // yape|plin|visa-credit|mc-credit|visa-debit|mc-debit|transfer
  paymentStatus  String   @default("pending")   // pending|completed|failed
  paymentId      String?  @unique               // transactionId de Izipay (idempotencia)
  installments   Int      @default(1)
  invoiceType    String   @default("boleta")    // boleta|factura
  documentType   String                         // DNI|RUC
  documentNumber String
  acceptedTermsAt DateTime                      // timestamp del checkbox de términos
  ipAddress      String?
  userAgent      String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

model Complaint {
  // Libro de Reclamaciones — INDECOPI (Decreto Supremo 011-2011-PCM)
  id              String   @id @default(cuid())
  complaintNumber String   @unique              // formato LR-<año>-<seq>
  type            String                        // reclamo|queja
  // Identificación del consumidor
  fullName        String
  documentType    String                        // DNI|CE|Pasaporte|RUC
  documentNumber  String
  email           String
  phone           String
  address         String
  isMinor         Boolean  @default(false)
  guardianName    String?
  // Bien contratado
  goodType        String                        // producto|servicio
  amount          Decimal? @db.Decimal(10,2)
  description     String                        // descripción del bien
  // Detalle del reclamo
  detail          String                        // hechos
  request         String                        // pedido del consumidor
  // Respuesta de la empresa (se llena después)
  response        String?
  responseDate    DateTime?
  status          String   @default("pendiente") // pendiente|en_revision|resuelto
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model OrderItem {
  id          String  @id @default(cuid())
  orderId     String
  order       Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId   String
  product     Product @relation(fields: [productId], references: [id])
  productName String
  productSku  String
  quantity    Int
  price       Decimal @db.Decimal(10,2)
}

model ShippingZone {
  id              String  @id @default(cuid())
  name            String
  price           Decimal @db.Decimal(10,2)
  minDeliveryDays Int
  maxDeliveryDays Int
}
```

Provide a stub `lib/db.ts` that, in dev, returns mock data from `lib/products.ts` (so the app runs without a real DB). Comment in the production wiring (`new PrismaClient()` singleton on `globalThis`).

---

## 9. Design system

### Tailwind tokens (set in `app/globals.css` under `@theme inline` and `:root`)
Use BRIEF colors. Suggested mapping for a tech brand:

```css
--color-primary:   <<brand primary>>;     /* navigation, primary CTAs */
--color-accent:    <<brand accent>>;      /* prices, highlights, "buy" buttons */
--color-dark:      <<brand dark>>;        /* headings, body text */
--color-light:     <<brand light>>;       /* page background */
--color-card:      #FFFFFF;
--color-muted:     #F1F5F9;
--color-success:   #10B981;
--color-warning:   #F59E0B;
--color-danger:    #DC2626;
--font-sans:       var(--font-inter);
--font-display:    var(--font-space-grotesk);
--radius:          0.625rem;
```

### Visual rules
- Headings use display font, body uses sans; H1 is 4xl/5xl/6xl/7xl responsive (cinematic scale)
- Sticky blurred header (`bg-white/95 backdrop-blur`)
- Cards: `rounded-xl/2xl`, `shadow-lg`, hover `shadow-xl`, image hover `scale-105` (or `scale-110` for category cards)
- Buttons: primary = brand-primary bg, accent = brand-accent bg; size lg has `px-8`
- Section padding: `py-20 md:py-28` (cinematic)
- Custom hex colors for the dark sections: `#050a14` (deepest, hero/CTA/marquees), `#0a0f1c` (sections like CategoryGrid/WhyUs/Testimonials), `#0a1424` (cards on dark sections)
- Subtle 5% opacity grid pattern (44px or 60px squares) layered on dark sections via inline-style background-image
- Dark mode tokens: `:root` has light, `.dark` has dark — but the homepage sections override to fixed dark hex regardless of theme (these are part of the brand aesthetic, not theme-dependent)

### MSI motion library (in `app/globals.css`)

The dark cinematic aesthetic depends on a small CSS animation library. Add these classes/keyframes (all gated behind `prefers-reduced-motion: reduce`):

```css
/* Drifting blobs that compose a "mesh gradient" background.
   Each blob has its own period so they never repeat the same composition. */
@keyframes drift-a { 0%,100% { transform: translate3d(-10%,-5%,0) scale(1); } 50% { transform: translate3d(15%,10%,0) scale(1.1); } }
@keyframes drift-b { 0%,100% { transform: translate3d(5%,0%,0) scale(1.05); } 50% { transform: translate3d(-15%,12%,0) scale(1); } }
@keyframes drift-c { 0%,100% { transform: translate3d(0%,5%,0) scale(1); } 50% { transform: translate3d(20%,-10%,0) scale(1.15); } }
.blob-cyan, .blob-violet, .blob-pink {
  position: absolute; border-radius: 9999px; filter: blur(80px);
  pointer-events: none; will-change: transform;
}
.blob-cyan   { width: 40rem; height: 40rem; background: rgba(0,210,255,0.35);  top: -10rem; left: -10rem; animation: drift-a 18s ease-in-out infinite; }
.blob-violet { width: 36rem; height: 36rem; background: rgba(139,92,246,0.30); bottom: -8rem; right: -8rem; animation: drift-b 22s ease-in-out infinite; }
.blob-pink   { width: 28rem; height: 28rem; background: rgba(236,72,153,0.18); top: 30%;     left: 40%;   animation: drift-c 26s ease-in-out infinite; }

/* Twinkling particles */
@keyframes twinkle { 0%,100% { opacity: 0.2; transform: translateY(0); } 50% { opacity: 0.8; transform: translateY(-8px); } }
.particle {
  position: absolute; width: 3px; height: 3px; border-radius: 9999px;
  background: rgba(0,210,255,0.6); box-shadow: 0 0 12px rgba(0,210,255,0.8);
  animation: twinkle 4s ease-in-out infinite; pointer-events: none;
}

/* Conic-gradient sweeping border for focused/active cards */
@keyframes spin-border { to { transform: rotate(360deg); } }
.glow-border { position: relative; isolation: isolate; }
.glow-border::before {
  content: ""; position: absolute; inset: -1px; border-radius: inherit; padding: 1px;
  background: conic-gradient(from 0deg, transparent, rgba(0,210,255,0.6), transparent 60%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  opacity: 0; transition: opacity 0.3s; z-index: -1;
}
.glow-border:hover::before { opacity: 1; animation: spin-border 4s linear infinite; }

/* Reveal on scroll — base hidden state, JS adds .is-visible via IntersectionObserver */
.reveal { opacity: 0; transform: translateY(24px);
  transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
  will-change: opacity, transform; }
.reveal.is-visible { opacity: 1; transform: translateY(0); }

/* Marquee scroll for spec strip + brand strip */
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.marquee-track { animation: marquee 30s linear infinite; }

/* Typewriter / boot-sequence reveal for product detail SKU */
@keyframes type-reveal { from { width: 0; } to { width: 100%; } }
@keyframes blink-caret { 50% { border-color: transparent; } }
.boot-text { display: inline-block; overflow: hidden; white-space: nowrap;
  border-right: 2px solid currentColor;
  animation: type-reveal 1.4s steps(20,end) 0.4s both, blink-caret 0.7s step-end 6; }

/* 3D tilt — children set --rx and --ry via pointermove handler */
.tilt-3d { transform: perspective(1000px) rotateY(var(--ry,0deg)) rotateX(var(--rx,0deg)) translateZ(0);
  transition: transform 0.15s ease-out; transform-style: preserve-3d; }

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Reveal-on-scroll component

Provide `components/ui/RevealOnScroll.tsx` — `"use client"` wrapper that uses `IntersectionObserver` with `threshold: 0.15, rootMargin: "0px 0px -10% 0px"` to add `.is-visible` once. Supports `delayMs` and `className` props. Unobserves after first reveal. Used throughout home sections for staggered entry.

### Brand strip strategy (dark marquee with real logos)

For the BrandStrip section, use real brand logos (no text wordmarks as the only solution).

1. **Primary source**: Simple Icons CDN at `https://cdn.simpleicons.org/<slug>/ffffff` — returns SVG forced to white. Slugs are lowercase, no spaces, no hyphens.
2. **Per-brand override**: each `Brand` entry can have an optional `iconSrc` URL (vectorlogo.zone, manufacturer CDN, etc.) and `invert: true` flag that applies `brightness-0 invert` to force colored SVGs to white silhouette.
3. **`onError` fallback**: Simple Icons periodically removes brands when trademark holders complain. When the SVG fails to load, swap to a styled wordmark (`font-display text-3xl sm:text-4xl font-bold uppercase tracking-[0.18em]`) so the strip never shows broken icons. The component must be `"use client"` to track per-instance fail state via `useState`.
4. **Use `<img>` not `<Image>`**: SVGs don't benefit from Next image optimization, and each logo has different aspect ratio so fixed `width`/`height` would distort. Suppress eslint with `// eslint-disable-next-line @next/next/no-img-element`.

### Iconography (lucide-react)

Map each concept to a specific icon: `Cpu`, `Laptop`, `Monitor`, `Mouse`, `Keyboard`, `HardDrive`, `Wifi`, `Headphones`, `Cable`, `Zap` (gaming/RGB), `Shield`, `ShieldCheck`, `Truck`, `RefreshCw`, `Award`, `Star`, `Phone`, `MessageSquare`, `Search`, `AlertTriangle`, `Quote`, `ArrowRight`, `ArrowUpRight`, `ChevronDown`, `MapPin`, `Mail`, `MessageCircle`.

> **Note on lucide brand icons**: `Facebook`, `Instagram`, `Youtube`, `Twitter` icons are deprecated in lucide-react (trademark concerns). Define inline SVG components in the file that uses them (e.g., `Footer.tsx` defines `FacebookIcon`, `InstagramIcon`, `YoutubeIcon` at the bottom of the file).

### Iconography (lucide-react)
Map each concept to a specific icon: `Cpu`, `Laptop`, `Monitor`, `Mouse`, `Keyboard`, `HardDrive`, `Wifi`, `Headphones`, `Cable`, `Zap` (gaming/RGB), `Shield`, `ShieldCheck`, `Truck`, `RefreshCw`, `Award`, `Star`, `Phone`, `MessageSquare`, `Search`, `AlertTriangle`.

### Accesibilidad — WCAG 2.1 nivel AA (NO opcional)
- Semántica: `<header>`, `<nav>`, `<main>`, `<footer>`, `<article>` para productos. Nada de `<div>` para todo.
- Heading order correcto (un solo `<h1>` por página, jerarquía sin saltos).
- Todas las imágenes con `alt` descriptivo (no `alt=""` salvo decorativas; los logos usan el nombre de la marca).
- Contraste mínimo 4.5:1 en texto normal, 3:1 en texto grande. **Verificar la combinación brand-accent sobre fondo blanco** — si no pasa, oscurecer el accent para texto.
- Focus visible en todos los interactivos: `focus-visible:ring-2 ring-offset-2 ring-primary`. No remover outlines sin reemplazo.
- Navegación por teclado completa: Tab, Shift+Tab, Enter/Space, Esc cierra dialogs y sheets. Trap focus dentro de Dialog/Sheet abierto.
- ARIA: `aria-label` en iconos sin texto, `aria-current="page"` en nav, `aria-live="polite"` para toasts del carrito ("Producto agregado"), `aria-expanded` en dropdowns.
- Skip link al inicio: `<a href="#main">Saltar al contenido</a>` (visible en focus).
- Formularios: cada `<input>` con su `<label>` asociado (`htmlFor`/`id`), errores enlazados con `aria-describedby`, `aria-invalid` cuando falla validación.
- `prefers-reduced-motion`: deshabilita las animaciones decorativas y transiciones largas.
- Idioma: `<html lang="es-PE">` y `lang` en cualquier bloque que cambie de idioma (ej. nombres de marca extranjeros NO necesitan cambio).

---

## 10. SEO, metadata, structured data

- `app/layout.tsx` `metadata` with `metadataBase`, title template `'%s | <<Company>>'`, description, keywords, OpenGraph (`type:'website'`, locale, siteName, image `/og-image.jpg` 1200×630), Twitter card, robots, icons (`/icon.svg`).
- Per-page `metadata` exports on every server page (`/productos`, `/nosotros`, `/garantia-soporte`, `/contacto`).
- Product detail page: dynamic `generateMetadata` using product name, brand, price.
- `app/sitemap.ts` — all static pages + every product slug.
- `app/robots.ts` — allow `/`, disallow `/api/`, `/checkout/`, `/carrito/`.
- Add **JSON-LD** to product pages: `Product` schema with `name`, `image`, `description`, `brand`, `sku`, `offers.price`, `offers.priceCurrency`, `offers.availability`, `aggregateRating` if rating present.
- Add **Organization** + **WebSite** JSON-LD to root layout.
- All images use `next/image` with `sizes` and `priority` on above-the-fold.

---

## 11. Internationalization & formatting

- `<html lang="es-PE">` (FIJO).
- Moneda: `Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' })` envuelto en `formatPrice()` en `lib/utils.ts`. Output esperado: `S/ 1,299.00`.
- Fecha: `Intl.DateTimeFormat('es-PE')` → `dd/mm/yyyy`.
- Teléfono peruano: validar con regex `/^\+?51?\s?9\d{2}\s?\d{3}\s?\d{3}$/`. Mostrar formato `+51 9XX XXX XXX`.
- WhatsApp deep links: `https://wa.me/51<9 digitos>?text=...` (sin `+` ni espacios).
- Pluralización (`Intl.PluralRules`): "1 producto" / "2 productos", "1 cuota" / "12 cuotas".

### Dialecto: español neutro peruano (NO voseo argentino)

**TODO el copy visible debe estar en español peruano neutro con formas tú.** NO usar voseo argentino (vos / mirá / pedinos / acá). Esta restricción aplica a: nav, botones, formularios, mensajes de error, validación zod, toasts, metadatos OG/Twitter, emails, página 404, descripciones de productos, FAQ, T&C, privacidad, libro de reclamaciones.

Tabla de sustituciones (NUNCA usar la columna izquierda):

| ❌ Voseo (argentino)   | ✅ Tú (peruano neutro) |
|---|---|
| acá                   | aquí                  |
| mirá                  | mira                  |
| empezá                | empieza               |
| pedí / pedinos        | pide / pídenos        |
| elegí                 | elige                 |
| explorá               | explora               |
| armá                  | arma                  |
| escribí / escribinos  | escribe / escríbenos  |
| seguinos              | síguenos              |
| llevate               | llévate               |
| fijate                | fíjate                |
| mandá / mandanos      | envía / envíanos      |
| abrí                  | abre                  |
| escaneá               | escanea               |
| ingresá               | ingresa               |
| copiá                 | copia                 |
| verificá              | verifica              |
| conservá              | conserva              |
| volvé                 | vuelve                |
| intentá               | intenta               |
| registrá              | registra              |
| agregá                | agrega                |
| conocé                | conoce                |
| tenés                 | tienes                |
| podés                 | puedes                |
| querés                | quieres               |
| necesitás             | necesitas             |
| considerás            | consideras            |
| sabés                 | sabes                 |
| confiás               | confías               |
| aceptás               | aceptas               |
| buscás                | buscas                |
| fierros               | hardware / componentes|

Marcadores argentinos prohibidos: `dale`, `che`, `posta`, `re-X`, `boludo`. Permitidos en contextos casuales por audiencia peruana: `al toque`, `chévere` (pero para tono retail premium prefiere neutro).

Antes de hacer commit, correr esta validación:

```bash
grep -rEn "\b(podés|hacés|sabés|tenés|querés|necesitás|comprás|empezás|mirá|empezá|pedí|pedinos|elegí|escribí|escribinos|abrí|escaneá|ingresá|copiá|verificá|conservá|seguinos|aceptás|considerás|confiás|conocé|explorá|armá|intentá|registrá|agregá|buscás|volvé|fierros|acá)\b" app components lib
```

Cualquier match en archivos user-facing es un bug y debe corregirse.

---

## 11.5 Cumplimiento legal Perú (NO opcional)

Estas piezas son obligatorias por ley peruana — sin ellas el sitio se expone a multas de INDECOPI.

### Libro de Reclamaciones (D.S. 011-2011-PCM)
- Página `/libro-de-reclamaciones` con:
  - Datos de la empresa: razón social, RUC, dirección fiscal (de env vars).
  - Formulario completo del Libro Virtual (campos obligatorios listados en el modelo `Complaint` de la sección 8).
  - Diferenciación entre **Reclamo** (disconformidad con producto/servicio) y **Queja** (malestar respecto a la atención).
  - Aviso: "El proveedor debe dar respuesta al reclamo en un plazo no mayor a 15 días hábiles."
  - Generación automática de número de reclamo `LR-<año>-<seq>` y envío de copia por email al consumidor.
- **Link al footer** con el sticker oficial de "Libro de Reclamaciones" (descargar en `public/icons/libro-reclamaciones.svg`).

### IGV (Impuesto General a las Ventas)
- Tasa **18%** aplicable a todos los productos.
- Convención: precios en `Product.price` SON con IGV incluido (cómo se ven en la góndola en Perú).
- En cualquier resumen (carrito, checkout, página de éxito, email): mostrar `subtotal sin IGV` + `IGV 18%` + `total`.
- En la `Order` se persisten los tres campos (`subtotalNet`, `igv`, `subtotalGross`).

### Comprobantes electrónicos (SUNAT)
- **Boleta de venta** (default) — para consumidor final, requiere DNI.
- **Factura electrónica** — para empresas, requiere RUC + razón social. El selector aparece en checkout step 1.
- En la versión inicial, generar PDF mock en el backend con los datos del pedido. Comentar dónde integrar el PSE (Nubefact, Facturador SUNAT, etc.) en producción.

### Privacidad (Ley 29733)
- Página `/privacidad` con: finalidad del tratamiento, datos recolectados, plazo de conservación, derechos ARCO (Acceso, Rectificación, Cancelación, Oposición), email de contacto del DPO.
- Banner de cookies con opciones `Aceptar todas | Solo necesarias | Personalizar` (no ocultable hasta elegir).
- En el checkbox de términos de checkout: link separado a Términos y a Privacidad.

### Términos y Condiciones
- Página `/terminos` con: condiciones de venta, política de envíos, política de cambios y devoluciones (mínimo 7 días por ley para venta a distancia), garantía, jurisdicción (INDECOPI / Lima).

---

## 12. Components to scaffold (file map)

```
app/
  layout.tsx            globals.css     page.tsx
  loading.tsx           error.tsx       not-found.tsx
  productos/page.tsx    productos/[slug]/page.tsx     productos/loading.tsx
  buscar/page.tsx
  carrito/page.tsx      checkout/page.tsx
  nosotros/page.tsx     garantia-soporte/page.tsx     contacto/page.tsx
  libro-de-reclamaciones/page.tsx
  terminos/page.tsx     privacidad/page.tsx
  api/products/route.ts
  api/orders/route.ts
  api/complaints/route.ts
  api/contact/route.ts
  api/payment/create/route.ts
  api/payment/webhook/route.ts
  sitemap.ts            robots.ts

components/
  layout/Header.tsx       layout/Footer.tsx       layout/TopBar.tsx
  layout/SearchInput.tsx  layout/MobileNav.tsx    layout/CookieBanner.tsx
  home/Hero.tsx           home/SpecMarquee.tsx    home/CategoryGrid.tsx
  home/Pillars.tsx        home/FeaturedProducts.tsx
  home/BrandStrip.tsx     home/WhyUs.tsx
  home/Testimonials.tsx   home/CTA.tsx
  products/ProductCard.tsx     products/ProductGrid.tsx
  products/ProductGallery.tsx  products/StickyPurchaseBar.tsx
  products/SpecsTable.tsx      products/InstallmentBadge.tsx
  products/AddToCartControls.tsx
  cart/CartItem.tsx       cart/CartSummary.tsx       cart/IgvBreakdown.tsx
  checkout/ShippingForm.tsx checkout/PaymentForm.tsx checkout/OrderSummary.tsx
  checkout/IzipayEmbedded.tsx                          // wrapper del iframe oficial
  checkout/TermsCheckbox.tsx
  contact/ContactForm.tsx
  complaint/ComplaintForm.tsx
  ui/RevealOnScroll.tsx                                // IntersectionObserver wrapper
  ui/* (shadcn primitives)

lib/
  types.ts        products.ts (seed data)
  store.ts        (Zustand cart)
  izipay.ts       (PAYMENT_METHODS, formToken, HMAC, verify webhook)
  tax.ts          (calcIgv, splitNetGross — IGV 18% Perú)
  search.ts       (filtro por name + brand + tags + sku)
  rate-limit.ts   (limiter para endpoints públicos)
  validators.ts   (zod schemas: dni, ruc, phone PE, etc.)
  db.ts           (Prisma stub)
  utils.ts        (cn, formatPrice, etc.)
  env.ts          (validación zod de process.env al boot)

prisma/
  schema.prisma

scripts/
  fetch-amazon-puppeteer.ts       // puppeteer-extra + stealth — extrae title/price/imgs/bullets de ASINs Amazon
  download-product-images.ts      // descarga URLs de product-images.json a public/products/<id>/
  normalize-product-images.ts     // sharp-based: PNG/WEBP/HEIF/AVIF → real JPEG q90 mozjpeg in-place
  audit-product-images.ts         // emite tabla con todos los productos y origen de su imagen
  delete-products.ts              // utilidad: elimina productos de products.ts por array de IDs
  product-images.json             // map productId → sourceUrls[]
  check-image-magic.ps1           // PowerShell util: verifica magic bytes de los archivos en public/products/

public/
  logo.svg  icon.svg  og-image.jpg
  payments/yape.svg  payments/plin.svg  payments/visa.svg  payments/mastercard.svg
  icons/libro-reclamaciones.svg
  products/<id>/0.jpg             // imágenes locales reales descargadas vía pipeline (sección 17)

.env.example
```

---

## 13. `.env.example`

```
DATABASE_URL="postgresql://user:password@host:5432/db?schema=public"

# Izipay (Perú) — soporta Yape, Plin, Visa y Mastercard
IZIPAY_MERCHANT_CODE="your_merchant_code"
IZIPAY_API_KEY="your_api_key"             # backend — firma HMAC
IZIPAY_WEBHOOK_SECRET="your_webhook_secret"
IZIPAY_ENVIRONMENT="TEST"                 # TEST | PRODUCTION
NEXT_PUBLIC_IZIPAY_PUBLIC_KEY="your_public_key"  # frontend — solo para iframe
NEXT_PUBLIC_IZIPAY_ENDPOINT="https://api.micuentaweb.pe"

# App
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="<<Company>>"
NEXT_PUBLIC_COMPANY_PREFIX="<<2-3 letras MAYÚS>>"   # usado en order IDs y nº de reclamo
NEXT_PUBLIC_WHATSAPP_NUMBER="<<digits only>>"

# Empresa (datos legales para Libro de Reclamaciones y facturación)
COMPANY_LEGAL_NAME="<<Razón social SAC/EIRL>>"
COMPANY_RUC="<<11 digitos>>"
COMPANY_FISCAL_ADDRESS="<<dirección fiscal>>"

# Validación: lib/env.ts hace zod.parse(process.env) al boot.
# Si falta una de estas, el servidor NO arranca.
```

---

## 14. Acceptance checklist (the agent should self-verify)

Before declaring the task done, verify each box:

- [ ] `npm install && npm run dev` starts on `localhost:3000` with no errors
- [ ] Every route in section 3 renders without runtime errors
- [ ] Adding a product to cart updates the header badge and persists across reloads
- [ ] Cart page total updates when shipping zone changes
- [ ] Checkout flow: shipping → payment → processing (≈3s) → success with order ID
- [ ] All 50+ seed products visible on `/productos`, filterable by category, distribuidos en al menos 7 de las 10 categorías
- [ ] Product detail shows tabs (Descripción / Specs / Caja / Garantía), gallery thumbnails switch image, related products render
- [ ] Footer muestra los 4 badges de pago: Visa, Mastercard, Yape, Plin
- [ ] Checkout muestra las 6 opciones de pago explícitas (Yape, Plin, Visa crédito, Mastercard crédito, Visa débito, Mastercard débito)
- [ ] Las cuotas (3, 6, 12) solo aparecen cuando se selecciona una tarjeta de **crédito**; en débito quedan ocultas
- [ ] Yape y Plin muestran QR + pasos numerados + campo "N° de operación" requerido
- [ ] Validación de marca de tarjeta: Visa empieza en `4`, Mastercard en `5` o `2221-2720`
- [ ] Sitemap includes every product slug at `/sitemap.xml`
- [ ] OpenGraph tags present in `<head>` on home and product pages
- [ ] Mobile (≤375px), tablet (768px), and desktop (≥1280px) layouts all responsive
- [ ] Dark mode tokens defined in `:root` and `.dark`
- [ ] No `any` types except where explicitly justified; ESLint passes
- [ ] **TODO el copy visible está en español (es-PE)**: navegación, botones, formularios, mensajes de error, toasts, metadatos OG/Twitter, emails y página 404. Cero texto en inglés visible al usuario.

### Pagos y seguridad
- [ ] **NO existe ningún `<input>` propio para número de tarjeta o CVV** — todo va por iframe oficial de Izipay
- [ ] `/api/payment/webhook` valida HMAC con `crypto.timingSafeEqual`, rechaza payloads con timestamp > 5 min, e implementa idempotencia por `paymentId`
- [ ] `/api/orders` valida stock dentro de `prisma.$transaction` y devuelve 409 con detalle si falta stock
- [ ] El stock se decrementa SOLO cuando el webhook confirma el pago (no al crear el pedido)
- [ ] Rate limiting activo en `/api/orders`, `/api/complaints`, `/api/contact` (5 req/min/IP)
- [ ] `lib/env.ts` valida con zod las env vars al boot — el server no arranca si falta una requerida

### IGV y comprobantes
- [ ] Carrito y resumen de checkout muestran desglose: `Subtotal sin IGV` + `IGV 18%` + `Envío` + `Total`
- [ ] Selector boleta/factura funciona: boleta pide DNI (8 dígitos), factura pide RUC (11 dígitos, empieza en 10/15/17/20) + razón social
- [ ] El cálculo de IGV usa `precio / 1.18 * 0.18` y se persiste en `Order.igv`

### Cumplimiento legal Perú
- [ ] Página `/libro-de-reclamaciones` accesible desde el footer con link sticker oficial
- [ ] Formulario de reclamo crea registro en DB con número `LR-<año>-<seq>` y envía copia por email
- [ ] Páginas `/terminos` y `/privacidad` existen y están enlazadas desde el footer
- [ ] Checkbox de aceptación de Términos + Privacidad en el step 1 del checkout, validado también en el server
- [ ] Banner de cookies con opciones (Aceptar todas / Solo necesarias / Personalizar)

### Búsqueda y estados
- [ ] Header tiene buscador funcional que redirige a `/buscar?q=`
- [ ] `/buscar` muestra resultados filtrados por nombre + brand + tags + sku, con estado vacío
- [ ] Existen `loading.tsx`, `error.tsx`, `not-found.tsx` globales que renderizan correctamente
- [ ] `/productos/[slug]` con slug inválido renderiza la página `not-found`, no 500

### Accesibilidad (WCAG 2.1 AA)
- [ ] Skip link visible al primer Tab
- [ ] Todas las imágenes con `alt` descriptivo (decorativas con `alt=""`)
- [ ] Focus visible (ring) en TODOS los interactivos — verificar con navegación por Tab
- [ ] Lighthouse a11y score ≥ 95 en home, productos, producto detalle, carrito, checkout
- [ ] Dialogs y Sheets atrapan focus y se cierran con Esc
- [ ] Toast del carrito anuncia el cambio con `aria-live="polite"`
- [ ] Contraste de texto sobre brand-accent verificado ≥ 4.5:1

### Order ID y configuración
- [ ] Order ID format: `${COMPANY_PREFIX}-<base36>-<rand6>` derivado de env, no hardcodeado
- [ ] Si falta `NEXT_PUBLIC_COMPANY_PREFIX`, el server lanza error en boot

### Estética MSI (homepage dark cinematic)
- [ ] La home tiene 12 secciones en el orden de Sección 5 (Hero → SpecMarquee → CategoryGrid → Pillars → FeaturedProducts → BrandStrip → WhyUs → Testimonials → CTA + Footer)
- [ ] El Hero tiene fondo `#050a14` con blobs animados (cyan/violet/pink), partículas, grid pattern al 5%, y H1 con keyword en gradiente cyan
- [ ] El SpecMarquee es un infinite scroll horizontal usando `.marquee-track`, con fallback `flex-wrap` para `prefers-reduced-motion`
- [ ] El CategoryGrid usa fotos reales de producto por categoría (no iconitos), con hover scale + accent line
- [ ] El componente `Pillars` tiene 3 secciones storytelling alternadas (left/right) con `RevealOnScroll` y stats grid
- [ ] El BrandStrip tiene logos reales vía Simple Icons CDN con `onError` fallback a wordmark, edge fade gradients en izq/der
- [ ] WhyUs es un comparador de 2 cards (oficial accent / informal muted), NO una tabla 5x3
- [ ] Testimonials usa cards traslúcidas dark con Quote icon de fondo y avatar gradient
- [ ] CTA tiene blobs + grid + H2 con gradient text + 4-benefit row separado por `border-t white/10`
- [ ] Footer tiene top contact strip de 3 cells (WhatsApp/Email/Address), columnas con underline accent (`h-px w-8 bg-accent`), social icons en círculos custom (no lucide deprecated icons)
- [ ] Todas las animaciones decorativas se desactivan con `prefers-reduced-motion`
- [ ] `RevealOnScroll` component existe en `components/ui/RevealOnScroll.tsx` y se usa en Pillars, CategoryGrid, WhyUs, Testimonials, CTA

### Lenguaje peruano (NO voseo)
- [ ] Cero matches del grep de voseo en `app/`, `components/`, `lib/` (ver tabla en Sección 11)
- [ ] Imperativos en tú: `mira`, `empieza`, `pídenos`, `escribe`, `escanea`, `ingresa`, `verifica` — NUNCA `mirá`, `empezá`, `pedinos`, etc.
- [ ] Adverbios: `aquí` (no `acá`), `aquí te contamos`, `empieza aquí`
- [ ] Cero markers argentinos (`dale`, `che`, `posta`, `re-X`, `boludo`, `fierros`)

### Pipeline de imágenes (Sección 4.5)
- [ ] `scripts/fetch-amazon-puppeteer.ts` existe y usa `puppeteer-extra-plugin-stealth`
- [ ] `scripts/download-product-images.ts` lee de `scripts/product-images.json` y escribe a `public/products/<id>/`
- [ ] `scripts/normalize-product-images.ts` convierte cualquier formato en `.jpg` falso a JPEG real con sharp
- [ ] `scripts/audit-product-images.ts` reporta source de cada imagen (local/unsplash/other) — debe mostrar **0 unsplash** en producción
- [ ] CERO referencias a `images.unsplash.com` en `Product.image` o `Product.images[]` (todos los paths son `/products/<id>/N.jpg`)
- [ ] `next.config.ts` `remotePatterns` puede mantener `unsplash.com` y `pexels.com` por compatibilidad con assets decorativos no-producto, pero NO se usan para imágenes de producto en producción
- [ ] Hero (0.jpg) de cada producto pasa verificación visual: muestra el producto real, no infografías marketing ("Blazing Speed", "RTX 3070 Ti" overlay, etc.) ni lifestyle shots con personas como sujeto principal
- [ ] Todos los archivos `.jpg` en `public/products/` son JPEG real (no PNG/WEBP/HEIF disfrazados) — verificable con `check-image-magic.ps1`
- [ ] `package.json` tiene scripts: `images:download`, `images:normalize` (opcional `images:audit`)

---

## 15. Style of code

- Server components by default; only mark `'use client'` where state/event handlers live
- No comments unless explaining a non-obvious workaround
- No barrel files except for `components/<group>/index.ts` re-exports
- Tailwind class order grouped: layout → spacing → sizing → typography → color → state
- All money values are numbers in JS, formatted at render with `formatPrice`
- Error handling at boundaries only (API routes, fetch wrappers); trust internal types

---

## 16. Final deliverables

1. The full project as described above
2. A short `README.md` explaining: prerequisites, install, dev, env vars, how to swap mock products for Prisma, how to wire the real payment gateway, deployment notes (Vercel + Neon/Supabase)
3. Seed data sized to look like a real catalog (50+ products, distribuidos en al menos 7 de las 10 categorías, con marcas reales reconocidas: ASUS, MSI, Razer, Logitech, Sony, JBL, Apple, Dell, Lenovo, HP, Acer, Gigabyte, AMD, Intel, NVIDIA, Samsung, WD, Crucial, TP-Link, Kingston, etc.)
4. Working sandbox payment with test card numbers visible on the payment form
5. Pipeline de imágenes funcional: `npm run images:download && npm run images:normalize` produce un catálogo con 100% imágenes locales reales (cero placeholders Unsplash en producción)
6. `BrandStrip` con logos reales vía Simple Icons CDN + onError fallback

Begin. Confirm the BRIEF values you'll use in one short paragraph, then build the entire project end-to-end. Do not ask follow-up questions — pick reasonable defaults from the BRIEF and proceed.
