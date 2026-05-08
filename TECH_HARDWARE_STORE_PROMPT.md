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
> - **Idioma de TODA la interfaz, copys, metadatos, mensajes de error, emails y formularios: ESPAÑOL (es-PE).** No se admite mezcla con inglés en texto visible (los identificadores de código siguen en inglés).
> - **Medios de pago obligatorios:** **Yape**, **Plin**, **Tarjeta de crédito Visa**, **Tarjeta de crédito Mastercard**, **Tarjeta de débito Visa**, **Tarjeta de débito Mastercard**. Estos cuatro tipos de tarjeta se exponen como opciones explícitas (no agrupadas como un único "tarjeta").

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

Seed `lib/products.ts` with **at least 16 realistic products** distributed across categories. Use representative brands (ASUS, MSI, Gigabyte, Logitech, Razer, Corsair, Kingston, Samsung, WD, NVIDIA, AMD, Intel, LG, TP-Link, etc.) and realistic prices in the BRIEF's currency. Use `images.unsplash.com` URLs for product photos (configure `next.config.ts` `images.remotePatterns` for `unsplash.com` and `pexels.com`).

---

## 5. Homepage sections (in order)

1. **TopBar** — left: free-shipping promo, right: phone + WhatsApp. Brand-color background.
2. **Header** — sticky, blurred white, logo, nav (Inicio, Productos, Categorías dropdown, Marcas, Nosotros, Contacto), **input de búsqueda** centrado (icono lucide `Search`, placeholder "Buscar productos, marcas, SKU…", al hacer Enter o submit redirige a `/buscar?q=<término>`; en mobile se colapsa a un icono que abre un sheet con el input), cart icon con item-count badge desde Zustand, sheet mobile menu. Todo el header es navegable por teclado: focus visible, `aria-label` en cada icono, `role="search"` en el form de búsqueda.
3. **Hero** — split layout: left = badge ("Tienda oficial"), big H1 with accent-colored word, subhead, two CTAs ("Ver productos" / "Armar mi PC"), 4 trust badges (Garantía oficial, Envío 24h, Pago seguro, Soporte técnico). Right = product/setup hero image with floating cards (e.g., "8+ años de experiencia", "Tienda autorizada").
4. **Trust stats row** — 4 big numbers (products in stock, brands, customers, years).
5. **Featured categories** — 6 category cards with icons (Laptop, Cpu, Mouse, Monitor, Wifi, HardDrive) linking to `/productos?category=X`.
6. **Featured products** — 4-card grid pulled via `getFeaturedProducts()`. "Ver todos" link.
7. **Brand strip** — horizontal logos of supported brands (Asus, MSI, Logitech, NVIDIA, AMD, Intel…) on a muted band.
8. **Why-us / comparison section** — 5-row table contrasting "Tienda oficial" vs "Tiendas informales" (Garantía, Producto original, Soporte post-venta, Factura electrónica, Envío seguro). Image collage on the other side.
9. **Testimonials** — 3 customer quote cards with avatar, role (Gamer / Profesional IT / Streamer), 5-star rating.
10. **PC builder CTA** (optional) — banner: "¿Vas a armar tu PC? Te asesoramos gratis" with WhatsApp deep link `https://wa.me/<phone>?text=Hola, quiero armar una PC`.
11. **Benefits + CTA** — 4 benefit icons (Truck/Envío 24h, ShieldCheck/Garantía, RefreshCw/Cambios 7 días, Headphones/Soporte) on brand-primary background, big H2, two CTAs.
12. **Footer** — grid de 5 columnas: marca+social, Productos, Empresa, Soporte, Contacto. Fila de medios de pago con **6 badges fijos en este orden**: Visa, Mastercard, Yape, Plin (todos los textos del footer en español). Copyright + enlaces a Privacidad y Términos.

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
- Headings use display font, body uses sans; H1 is 4xl/5xl/6xl responsive
- Sticky blurred header (`bg-white/95 backdrop-blur`)
- Cards: `rounded-xl`, `shadow-lg`, hover `shadow-xl`, image hover `scale-105`
- Buttons: primary = brand-primary bg, accent = brand-accent bg; size lg has `px-8`
- Section padding: `py-20`; container `mx-auto px-4`
- Animated decorative blurs in Hero (`absolute -top-40 ... rounded-full blur-3xl`)
- Dark mode: provide `.dark` overrides; toggle is optional but tokens must support it

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
  layout/SearchInput.tsx  layout/MobileNav.tsx
  home/Hero.tsx           home/TrustStats.tsx     home/CategoryGrid.tsx
  home/FeaturedProducts.tsx home/BrandStrip.tsx   home/WhyUs.tsx
  home/Testimonials.tsx   home/CTA.tsx
  products/ProductCard.tsx  products/ProductGrid.tsx  products/ProductGallery.tsx
  products/SpecsTable.tsx   products/InstallmentBadge.tsx
  cart/CartItem.tsx       cart/CartSummary.tsx       cart/IgvBreakdown.tsx
  checkout/ShippingForm.tsx checkout/PaymentForm.tsx checkout/OrderSummary.tsx
  checkout/IzipayEmbedded.tsx                          // wrapper del iframe oficial
  checkout/TermsCheckbox.tsx
  complaint/ComplaintForm.tsx
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
public/
  logo.svg  icon.svg  og-image.jpg
  payments/yape.svg  payments/plin.svg  payments/visa.svg  payments/mastercard.svg
  icons/libro-reclamaciones.svg
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
- [ ] All 16+ seed products visible on `/productos`, filterable by category
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
3. Seed data sized to look like a real catalog (16+ products, 4+ brands per category where applicable)
4. Working sandbox payment with test card numbers visible on the payment form

Begin. Confirm the BRIEF values you'll use in one short paragraph, then build the entire project end-to-end. Do not ask follow-up questions — pick reasonable defaults from the BRIEF and proceed.
