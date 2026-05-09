/**
 * Fetches Amazon product data using Puppeteer with stealth plugin to bypass
 * Amazon's anti-bot detection. Extracts title, price, gallery image URLs and
 * feature bullets.
 *
 * Run: npx tsx scripts/fetch-amazon-puppeteer.ts <ASIN> [<ASIN> ...]
 *   e.g. npx tsx scripts/fetch-amazon-puppeteer.ts B0FN15LKGD B0FDM8D8HQ
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
  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9",
  });

  try {
    await page.goto(`https://www.amazon.com/dp/${asin}`, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });

    const isCaptcha = await page.evaluate(() =>
      document.body.innerText.includes("we just need to make sure you're not a robot")
    );
    if (isCaptcha) {
      return {
        asin,
        title: null,
        brand: null,
        priceUSD: null,
        images: [],
        bullets: [],
        status: "blocked",
        note: "CAPTCHA",
      };
    }

    await page.waitForSelector("#productTitle", { timeout: 15000 }).catch(() => {});

    const data = await page.evaluate(() => {
      const titleEl = document.querySelector("#productTitle");
      const title = titleEl?.textContent?.trim() ?? null;

      const brandEl =
        document.querySelector("#bylineInfo") ||
        document.querySelector("a#bylineInfo") ||
        document.querySelector(".a-link-normal#bylineInfo");
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

      const scripts = document.querySelectorAll("script");
      for (const s of scripts) {
        const text = s.textContent || "";
        const hiresRegex = /"hiRes":"(https:\/\/[^"]+\.(?:jpg|png|webp))"/g;
        let m: RegExpExecArray | null;
        while ((m = hiresRegex.exec(text)) !== null) {
          if (m[1].includes("m.media-amazon.com")) images.add(m[1]);
        }
      }

      const bulletEls = document.querySelectorAll(
        "#feature-bullets ul li span.a-list-item"
      );
      const bullets = Array.from(bulletEls)
        .map((el) => (el.textContent ?? "").trim())
        .filter((t) => t.length > 0 && t.length < 500);

      return { title, brand, priceUSD, images: Array.from(images), bullets };
    });

    return { asin, ...data, status: "ok" };
  } catch (err) {
    return {
      asin,
      title: null,
      brand: null,
      priceUSD: null,
      images: [],
      bullets: [],
      status: "error",
      note: err instanceof Error ? err.message : String(err),
    };
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

  console.error(`Launching headless Chromium...`);
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
  });

  const results: ProductData[] = [];
  for (const asin of asins) {
    process.stderr.write(`[${asin}] fetching... `);
    const data = await fetchProduct(browser, asin);
    process.stderr.write(`${data.status} (${data.images.length} imgs)\n`);
    results.push(data);
    await new Promise((r) => setTimeout(r, 2000 + Math.random() * 1500));
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
