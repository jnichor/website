/**
 * Normalizes every file in public/products to real JPEG.
 *
 * Many "*.jpg" files in this folder are actually PNG/WEBP/AVIF with a lying
 * extension. Browsers tolerate that via MIME sniffing, but tooling that trusts
 * the extension (image optimizers, the Anthropic API, some CDNs) breaks. Worse,
 * AVIF is not supported by the Anthropic API at all.
 *
 * This script converts everything in place to JPEG quality 90 (mozjpeg),
 * keeping the original .jpg filenames so lib/products.ts paths stay valid.
 *
 * Run with: npx tsx scripts/normalize-product-images.ts
 */
import sharp from "sharp";
import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";

const ROOT = join(process.cwd(), "public", "products");

async function main() {
  const folders = await readdir(ROOT);
  let converted = 0;
  let skipped = 0;
  let failed = 0;

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
          skipped++;
          continue;
        }

        const out = await sharp(buffer)
          .jpeg({ quality: 90, mozjpeg: true })
          .toBuffer();

        await writeFile(filePath, out);
        console.log(`✓ ${rel}  ${meta.format} → JPEG`);
        converted++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`✗ ${rel}  FAILED: ${msg}`);
        failed++;
      }
    }
  }

  console.log("");
  console.log(`Converted: ${converted}`);
  console.log(`Skipped (already JPEG): ${skipped}`);
  console.log(`Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
