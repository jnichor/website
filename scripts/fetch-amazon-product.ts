/**
 * Fetches an Amazon product page directly with a real browser User-Agent and
 * extracts the data WebFetch loses (image URLs and price), since Amazon serves
 * these via JS and the markdown converter strips them.
 *
 * Run: npx tsx scripts/fetch-amazon-product.ts <ASIN> [<ASIN> ...]
 *   e.g. npx tsx scripts/fetch-amazon-product.ts B0FFDDFW47 B0F6NRYPPG
 */

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

interface AmazonData {
  asin: string;
  title: string | null;
  priceUSD: number | null;
  imageUrls: string[];
  status: "ok" | "blocked" | "no-images" | "error";
  note?: string;
}

async function fetchAmazon(asin: string): Promise<AmazonData> {
  const url = `https://www.amazon.com/dp/${asin}`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
      },
      redirect: "follow",
    });

    if (!res.ok) {
      return {
        asin,
        title: null,
        priceUSD: null,
        imageUrls: [],
        status: "blocked",
        note: `HTTP ${res.status}`,
      };
    }

    const html = await res.text();

    if (
      html.includes("Sorry, we just need to make sure you're not a robot") ||
      html.includes("api-services-support@amazon.com")
    ) {
      return {
        asin,
        title: null,
        priceUSD: null,
        imageUrls: [],
        status: "blocked",
        note: "CAPTCHA or robot check",
      };
    }

    // Title
    const titleMatch = html.match(/<span[^>]*id="productTitle"[^>]*>([\s\S]*?)<\/span>/);
    const title = titleMatch ? titleMatch[1].replace(/\s+/g, " ").trim() : null;

    // Price — try multiple patterns
    let priceUSD: number | null = null;
    const priceMatch1 = html.match(
      /<span class="a-price aok-align-center[^"]*"[^>]*>[\s\S]*?<span class="a-offscreen">\$([\d,]+\.\d{2})<\/span>/
    );
    const priceMatch2 = html.match(/"priceAmount":(\d+\.?\d*)/);
    const priceMatch3 = html.match(/"displayPrice":"\$([\d,]+\.\d{2})"/);
    const m = priceMatch1 ?? priceMatch3 ?? priceMatch2;
    if (m) priceUSD = parseFloat(m[1].replace(/,/g, ""));

    // Image URLs from the colorImages JSON blob (Amazon's preferred place)
    const imageUrls = new Set<string>();

    // First: the high-quality "hiRes" or "large" entries inside colorImages
    const colorImagesMatch = html.match(/'colorImages':\s*({[\s\S]*?}),\s*'colorToAsin'/);
    if (colorImagesMatch) {
      const block = colorImagesMatch[1];
      const hiResRegex = /"hiRes":"(https:\/\/[^"]+\.(?:jpg|png|webp))"/g;
      const largeRegex = /"large":"(https:\/\/[^"]+\.(?:jpg|png|webp))"/g;
      let mm: RegExpExecArray | null;
      while ((mm = hiResRegex.exec(block)) !== null) imageUrls.add(mm[1]);
      // Only fall back to large if hiRes was empty
      if (imageUrls.size === 0) {
        while ((mm = largeRegex.exec(block)) !== null) imageUrls.add(mm[1]);
      }
    }

    // Fallback: scan whole HTML for media-amazon image URLs and dedupe
    if (imageUrls.size === 0) {
      const mediaRegex =
        /https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9+\-_]+\.(?:_[A-Z0-9_,]+_\.)?(?:jpg|png|webp)/g;
      const matches = html.match(mediaRegex) ?? [];
      for (const u of matches) {
        // upgrade size suffix to _SL1500_ if present
        const upgraded = u.replace(/\._[A-Z0-9_,]+_\.(jpg|png|webp)/, "._SL1500_.$1");
        imageUrls.add(upgraded);
      }
    }

    if (imageUrls.size === 0) {
      return {
        asin,
        title,
        priceUSD,
        imageUrls: [],
        status: "no-images",
        note: `HTML length ${html.length}`,
      };
    }

    return {
      asin,
      title,
      priceUSD,
      imageUrls: [...imageUrls],
      status: "ok",
    };
  } catch (err) {
    return {
      asin,
      title: null,
      priceUSD: null,
      imageUrls: [],
      status: "error",
      note: err instanceof Error ? err.message : String(err),
    };
  }
}

async function main() {
  const asins = process.argv.slice(2);
  if (asins.length === 0) {
    console.error("Usage: npx tsx scripts/fetch-amazon-product.ts <ASIN> [<ASIN> ...]");
    process.exit(1);
  }

  const results: AmazonData[] = [];
  for (const asin of asins) {
    process.stderr.write(`Fetching ${asin}... `);
    const d = await fetchAmazon(asin);
    process.stderr.write(`${d.status} (${d.imageUrls.length} imgs)\n`);
    results.push(d);
    // be polite, brief jitter
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
  }

  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
