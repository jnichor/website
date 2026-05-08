# NovaTech Hardware — E-Commerce

E-commerce de hardware tecnológico construido con Next.js 16, React 19, TypeScript, Tailwind v4, Prisma e Izipay. Cumple con normativa peruana: IGV 18%, Libro de Reclamaciones (INDECOPI), comprobantes electrónicos (boleta/factura) y Ley 29733 de Datos Personales.

> Reemplazá `NovaTech Hardware` y los datos de empresa por los tuyos. Ver `.env.example`.

---

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack) + React 19 + TypeScript estricto
- **UI**: Tailwind CSS v4 (`@theme inline`) + shadcn/ui + lucide-react
- **Estado**: Zustand con `persist` para el carrito
- **Forms**: react-hook-form + zod
- **DB**: Prisma 7 + PostgreSQL
- **Pagos**: Izipay (Yape, Plin, Visa crédito/débito, Mastercard crédito/débito)
- **Notificaciones**: sonner

---

## Requisitos previos

- Node.js ≥ 20.10
- npm ≥ 10 (o pnpm/yarn equivalente)
- PostgreSQL 14+ (local con Docker, o cuenta en [Neon](https://neon.tech) / [Supabase](https://supabase.com))
- Cuenta de Izipay con credenciales de TEST (sandbox)

---

## Quick start

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
cp .env.example .env.local

# 3. Editar .env.local con tus credenciales (ver sección "Variables de entorno")

# 4. (Opcional) Levantar Postgres con Docker
docker run -d --name novatech-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=novatech \
  -p 5432:5432 postgres:16

# 5. Generar cliente Prisma y aplicar migraciones
npx prisma generate
npx prisma migrate dev --name init

# 6. Levantar servidor de desarrollo
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

---

## Variables de entorno

Todas las vars se validan con zod en `lib/env.ts` al arrancar el servidor. Si falta una requerida, el server **no levanta** y muestra qué variable falta.

| Variable | Requerida | Descripción |
|---|---|---|
| `DATABASE_URL` | sí | Connection string de Postgres |
| `IZIPAY_MERCHANT_CODE` | sí | Código de comercio de Izipay |
| `IZIPAY_API_KEY` | sí | API key del backend (firma HMAC) |
| `IZIPAY_WEBHOOK_SECRET` | sí | Secreto para validar webhooks |
| `IZIPAY_ENVIRONMENT` | sí | `TEST` o `PRODUCTION` |
| `NEXT_PUBLIC_IZIPAY_PUBLIC_KEY` | sí | Public key del frontend (iframe) |
| `NEXT_PUBLIC_IZIPAY_ENDPOINT` | sí | `https://api.micuentaweb.pe` |
| `NEXT_PUBLIC_SITE_URL` | sí | URL pública del sitio |
| `NEXT_PUBLIC_SITE_NAME` | sí | Nombre de la marca |
| `NEXT_PUBLIC_COMPANY_PREFIX` | sí | 2-3 letras MAYÚS para order IDs (ej. `NT`) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | sí | Solo dígitos, formato `51XXXXXXXXX` |
| `COMPANY_LEGAL_NAME` | sí | Razón social (para boleta/factura/Libro) |
| `COMPANY_RUC` | sí | 11 dígitos |
| `COMPANY_FISCAL_ADDRESS` | sí | Dirección fiscal completa |

---

## Estructura del proyecto

```
app/                      Rutas (App Router)
  (legal)/                terminos, privacidad, libro-de-reclamaciones
  api/                    Route handlers (orders, payment, complaints)
  productos/[slug]/       Detalle de producto
  checkout/               Multi-step checkout
components/
  layout/                 Header, Footer, TopBar, SearchInput
  home/                   Hero, FeaturedProducts, WhyUs, etc.
  products/               Card, Grid, Gallery, SpecsTable
  cart/                   CartItem, CartSummary, IgvBreakdown
  checkout/               ShippingForm, PaymentForm, IzipayEmbedded
  ui/                     Primitivos shadcn
lib/
  izipay.ts               Integración con Izipay (formToken, HMAC)
  tax.ts                  Cálculo IGV 18%
  search.ts               Búsqueda por name + brand + tags + sku
  env.ts                  Validación zod de process.env
  store.ts                Zustand cart
  validators.ts           DNI, RUC, teléfono PE
  rate-limit.ts           Throttling de endpoints públicos
prisma/
  schema.prisma           Product, Customer, Order, OrderItem, Complaint
public/
  payments/               Logos: yape, plin, visa, mastercard
  icons/                  Sticker Libro de Reclamaciones
```

---

## Migrar de mock a Prisma

Por defecto, el sitio corre con datos seed en `lib/products.ts` (16+ productos). Para usar la base de datos real:

1. Verificá que `DATABASE_URL` apunta a tu Postgres.
2. `npx prisma migrate deploy` (en producción) o `npx prisma migrate dev` (en dev).
3. Sembrar la DB: `npx prisma db seed` (el script en `prisma/seed.ts` carga `lib/products.ts`).
4. En `lib/db.ts`, descomentá el bloque que usa `PrismaClient` como singleton sobre `globalThis` y comentá el fallback a mock.

```ts
// lib/db.ts (producción)
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

## Wiring de Izipay (paso clave)

> **CRÍTICO — PCI-DSS:** los datos de tarjeta NUNCA tocan tu backend. Toda la captura ocurre dentro del iframe oficial de Izipay (`@lyracom/embedded-form-glue`). Si ves un input propio para número de tarjeta o CVV en el código, es un bug — borralo.

### Flujo end-to-end

1. **Cliente confirma pago** → frontend llama `POST /api/payment/create` con `{ orderId, amount, currency: 'PEN', paymentMethod, installments, customer }`.
2. **Backend pide formToken a Izipay** firmando con `IZIPAY_API_KEY` (HMAC-SHA256). Endpoint: `POST {IZIPAY_ENDPOINT}/api-payment/V4/Charge/CreatePayment`.
3. **Frontend recibe `{ formToken, publicKey, environment }`** y monta `<KR-Embedded>` con ese token. El usuario tipea su tarjeta dentro del iframe.
4. **Izipay procesa** y dispara dos cosas:
   - Callback al frontend (UX inmediata: redirige a `/checkout/success`).
   - Webhook a `POST /api/payment/webhook` (fuente de verdad para confirmar el pago).
5. **Webhook valida**:
   - HMAC con `crypto.timingSafeEqual` contra `IZIPAY_WEBHOOK_SECRET`.
   - Timestamp del payload < 5 minutos (replay protection).
   - Idempotencia: si `paymentId` ya está en `paid`, responde 200 sin reprocesar.
6. **Si todo OK**: `Order.status = 'paid'`, `Order.paymentStatus = 'completed'`, decremento atómico de `Product.stockQty`.

### Tarjetas de prueba (sandbox)

Visibles en el formulario solo cuando `IZIPAY_ENVIRONMENT === 'TEST'`:

| Resultado | Número | CVV | Vencimiento |
|---|---|---|---|
| Aprobada | `4970 1000 0000 0055` | 123 | cualquier futuro |
| Rechazada | `4970 1000 0000 0014` | 123 | cualquier futuro |

### Yape / Plin en sandbox

En el ambiente TEST de Izipay, el QR que se muestra es simulado. El "N° de operación" puede ser cualquier número de 8-10 dígitos para testing.

### Pasar a producción

1. Cambiar `IZIPAY_ENVIRONMENT=PRODUCTION`.
2. Reemplazar las credenciales TEST por las de producción.
3. Configurar la URL del webhook en el panel de Izipay: `https://tu-dominio.pe/api/payment/webhook`.
4. Verificar que el dominio tenga HTTPS válido.
5. Probar con un pago real de monto bajo (S/ 1.00) antes de habilitar al público.

---

## Cumplimiento legal Perú

Estos puntos son **obligatorios por ley**. No los saques.

### Libro de Reclamaciones (D.S. 011-2011-PCM)

- Página `/libro-de-reclamaciones` con formulario completo y datos de la empresa.
- Sticker oficial visible en el footer linkeando a la página.
- Plazo legal de respuesta: **15 días hábiles**. Configurar un job (cron o trigger) que avise al equipo de los reclamos sin respuesta a los 10 días.

### IGV (18%)

- Los precios en `Product.price` SON con IGV incluido (convención local).
- Cálculo: `IGV = precio_total / 1.18 * 0.18`. Helper en `lib/tax.ts`.
- Mostrar SIEMPRE desglosado: `Subtotal sin IGV` + `IGV 18%` + `Envío` + `Total`.

### Comprobantes electrónicos (SUNAT)

- **Boleta** (default) → DNI 8 dígitos.
- **Factura** → RUC 11 dígitos (empieza en 10/15/17/20) + razón social + dirección fiscal.
- En esta versión se genera un PDF mock. Para producción integrar un PSE certificado por SUNAT (Nubefact, Facturador SUNAT, BSale, etc.).

### Privacidad (Ley 29733)

- Página `/privacidad` con derechos ARCO.
- Banner de cookies (Aceptar todas / Solo necesarias / Personalizar).
- Email de contacto del DPO en el footer.

### Términos y devoluciones

- Mínimo **7 días** para devolución en venta a distancia (ley peruana).
- Página `/terminos` con condiciones, política de envíos, garantía, jurisdicción.

---

## Scripts disponibles

```bash
npm run dev          # Servidor dev en localhost:3000 (Turbopack)
npm run build        # Build de producción
npm run start        # Server de producción (después de build)
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npx prisma studio    # GUI de la DB en localhost:5555
```

---

## Deployment

### Vercel (recomendado)

1. Conectar el repo a Vercel.
2. Configurar variables de entorno (todas las del `.env.example`).
3. Build command: `npm run build` (Vercel detecta Next.js).
4. Configurar dominio custom y HTTPS.
5. Webhook de Izipay: apuntar a `https://tu-dominio.pe/api/payment/webhook`.

### DB en Neon / Supabase

1. Crear proyecto y copiar `DATABASE_URL`.
2. `npx prisma migrate deploy` desde local apuntando a la DB de producción.
3. Sembrar productos: `npx prisma db seed`.

### Checklist pre-deploy

- [ ] Todas las env vars configuradas en Vercel
- [ ] Webhook de Izipay configurado en su panel
- [ ] Dominio con HTTPS válido
- [ ] DNS apuntando correctamente
- [ ] Probar flujo completo con tarjeta real de monto bajo
- [ ] Lighthouse a11y ≥ 95 en home, productos y checkout
- [ ] OG images cargan correctamente al compartir en WhatsApp/Facebook
- [ ] Sitemap accesible en `/sitemap.xml`
- [ ] `robots.txt` con disallows correctos en `/api`, `/checkout`, `/carrito`

---

## Soporte

- **Issues**: usar el tracker del repo.
- **Izipay**: [docs.micuentaweb.pe](https://docs.micuentaweb.pe) o soporte@izipay.pe.
- **INDECOPI** (consultas legales): [www.indecopi.gob.pe](https://www.indecopi.gob.pe).
