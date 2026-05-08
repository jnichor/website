import { PrismaClient, Prisma } from "@prisma/client";
import { PRODUCTS } from "../lib/products";

const prisma = new PrismaClient();

async function main() {
  console.log(`Seeding ${PRODUCTS.length} products...`);

  for (const p of PRODUCTS) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        sku: p.sku,
        name: p.name,
        slug: p.slug,
        brand: p.brand,
        description: p.description,
        shortDescription: p.shortDescription,
        price: new Prisma.Decimal(p.price),
        originalPrice:
          p.originalPrice != null ? new Prisma.Decimal(p.originalPrice) : null,
        image: p.image,
        images: p.images,
        category: p.category,
        tags: p.tags,
        specs: p.specs as unknown as Prisma.InputJsonValue,
        highlights: p.highlights,
        inBox: p.inBox ?? [],
        warrantyMonths: p.warrantyMonths,
        inStock: p.inStock,
        stockQty: p.stockQty ?? 0,
        featured: p.featured ?? false,
        isNew: p.isNew ?? false,
        isBestseller: p.isBestseller ?? false,
        rating: p.rating ?? null,
        reviewCount: p.reviewCount ?? 0,
      },
      create: {
        id: p.id,
        sku: p.sku,
        name: p.name,
        slug: p.slug,
        brand: p.brand,
        description: p.description,
        shortDescription: p.shortDescription,
        price: new Prisma.Decimal(p.price),
        originalPrice:
          p.originalPrice != null ? new Prisma.Decimal(p.originalPrice) : null,
        image: p.image,
        images: p.images,
        category: p.category,
        tags: p.tags,
        specs: p.specs as unknown as Prisma.InputJsonValue,
        highlights: p.highlights,
        inBox: p.inBox ?? [],
        warrantyMonths: p.warrantyMonths,
        inStock: p.inStock,
        stockQty: p.stockQty ?? 0,
        featured: p.featured ?? false,
        isNew: p.isNew ?? false,
        isBestseller: p.isBestseller ?? false,
        rating: p.rating ?? null,
        reviewCount: p.reviewCount ?? 0,
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
