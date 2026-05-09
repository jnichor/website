/**
 * Downloads product images from manufacturer URLs to public/products/<id>/.
 *
 * Reads scripts/product-images.json with shape:
 *   {
 *     "p001": {
 *       "sourceUrls": [
 *         "https://www.asus.com/.../hero.jpg",
 *         "https://www.asus.com/.../keyboard.jpg",
 *         ...
 *       ]
 *     },
 *     "p002": { ... }
 *   }
 *
 * For each entry:
 *   - Saves to public/products/<id>/0.<ext>, 1.<ext>, 2.<ext>, ...
 *   - Skips if local file already exists (idempotent — safe to re-run)
 *   - Uses a real browser User-Agent so manufacturer CDNs don't 403
 *   - Reports per-image success / failure but never crashes the whole run
 *
 * Usage:  npm run images:download
 */

import { writeFile, mkdir, access } from "node:fs/promises";
import { resolve, extname } from "node:path";
import { readFile } from "node:fs/promises";

interface ProductConfig {
  sourceUrls: string[];
}

type Config = Record<string, ProductConfig>;

const ROOT = resolve(process.cwd());
const CONFIG_PATH = resolve(ROOT, "scripts", "product-images.json");
const PUBLIC_DIR = resolve(ROOT, "public", "products");

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function extFromUrl(url: string): string {
  const clean = url.split("?")[0].split("#")[0];
  const ext = extname(clean).toLowerCase();
  if (ext && [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"].includes(ext)) {
    return ext;
  }
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

    if (!res.ok) {
      console.error(`  ✗ ${url} → HTTP ${res.status}`);
      return "failed";
    }

    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength < 1024) {
      console.error(`  ✗ ${url} → suspiciously small (${buf.byteLength} bytes)`);
      return "failed";
    }

    await writeFile(dest, buf);
    return "saved";
  } catch (err) {
    console.error(`  ✗ ${url} → ${err instanceof Error ? err.message : String(err)}`);
    return "failed";
  }
}

async function main() {
  let raw: string;
  try {
    raw = await readFile(CONFIG_PATH, "utf8");
  } catch {
    console.error(`No config found at ${CONFIG_PATH}`);
    console.error("Create it with the shape documented at the top of this script.");
    process.exit(1);
  }

  let config: Config;
  try {
    config = JSON.parse(raw);
  } catch (err) {
    console.error(`Invalid JSON in ${CONFIG_PATH}:`, err);
    process.exit(1);
  }

  await mkdir(PUBLIC_DIR, { recursive: true });

  const totals = { saved: 0, skipped: 0, failed: 0 };
  const productEntries = Object.entries(config);

  if (productEntries.length === 0) {
    console.warn("Config is empty — nothing to download. Add product entries first.");
    return;
  }

  for (const [productId, { sourceUrls }] of productEntries) {
    if (!sourceUrls || sourceUrls.length === 0) {
      console.log(`[${productId}] no URLs — skipping`);
      continue;
    }
    console.log(`[${productId}] ${sourceUrls.length} image(s)`);

    const productDir = resolve(PUBLIC_DIR, productId);
    await mkdir(productDir, { recursive: true });

    for (let i = 0; i < sourceUrls.length; i++) {
      const url = sourceUrls[i];
      const ext = extFromUrl(url);
      const dest = resolve(productDir, `${i}${ext}`);
      const result = await downloadOne(url, dest);
      totals[result]++;
      if (result === "saved") console.log(`  ✓ ${i}${ext}`);
      else if (result === "skipped") console.log(`  · ${i}${ext} (already exists)`);
    }
  }

  console.log(
    `\nDone. saved=${totals.saved}  skipped=${totals.skipped}  failed=${totals.failed}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
