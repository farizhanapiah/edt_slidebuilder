import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getBrowser } from "@/lib/puppeteer/browser";

interface ScrapedPin {
  image_url: string;
  title: string;
  description: string;
  pin_url: string;
}

const PINTEREST_URL_RE =
  /^https?:\/\/(www\.)?pinterest\.(com|co\.uk|ca|com\.au|de|fr|es|it|jp|kr|se|nz|at|ch|ru|cl|com\.mx|co|pt|ie)(\/[\w._-]+){1,3}\/?$/;

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { board_url } = await request.json();

  if (!board_url || typeof board_url !== "string") {
    return NextResponse.json({ error: "board_url is required" }, { status: 400 });
  }

  if (!PINTEREST_URL_RE.test(board_url.trim())) {
    return NextResponse.json(
      { error: "Invalid Pinterest board URL. Expected format: https://www.pinterest.com/username/board-name/" },
      { status: 400 },
    );
  }

  let page;
  try {
    const browser = await getBrowser();
    page = await browser.newPage();

    // Block unnecessary resources to speed up loading
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const type = req.resourceType();
      if (["font", "media"].includes(type)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.setViewport({ width: 1280, height: 900 });
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    );

    await page.goto(board_url.trim(), {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Wait for pin images to appear
    await page.waitForSelector('img[src*="pinimg.com"]', { timeout: 10000 }).catch(() => {});

    // Scroll down a few times to load more pins
    for (let i = 0; i < 4; i++) {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await new Promise((r) => setTimeout(r, 1200));
    }

    // Extract pin data from the DOM
    const pins: ScrapedPin[] = await page.evaluate(() => {
      const results: ScrapedPin[] = [];
      const seen = new Set<string>();

      // Pinterest renders pins as divs with img elements containing pinimg.com URLs
      const images = document.querySelectorAll('img[src*="pinimg.com"]');

      for (const img of images) {
        const src = (img as HTMLImageElement).src;
        if (!src || seen.has(src)) continue;

        // Upgrade to highest resolution
        const highRes = src
          .replace(/\/\d+x\d+\//, "/originals/")
          .replace(/\/\d+x\//, "/originals/");

        // Deduplicate by the base path (ignoring resolution prefix)
        const basePath = highRes.replace(/https:\/\/i\.pinimg\.com\/[^/]+\//, "");
        if (seen.has(basePath)) continue;
        seen.add(basePath);
        seen.add(src);

        // Try to find title/description from nearby elements
        const pinContainer = (img as HTMLElement).closest("[data-test-id='pin']")
          || (img as HTMLElement).closest("[data-test-id='pinWrapper']")
          || (img as HTMLElement).closest("div[data-grid-item]")
          || (img as HTMLElement).closest("div[role='listitem']")
          || (img as HTMLElement).parentElement?.parentElement?.parentElement;

        let title = (img as HTMLImageElement).alt || "";
        let description = "";
        let pinUrl = "";

        if (pinContainer) {
          // Try to get the link to the individual pin
          const link = pinContainer.querySelector("a[href*='/pin/']") as HTMLAnchorElement;
          if (link) {
            pinUrl = link.href;
          }

          // Try to find title text
          if (!title) {
            const titleEl = pinContainer.querySelector("[title]");
            if (titleEl) title = titleEl.getAttribute("title") || "";
          }

          // Try to find description
          const descEl = pinContainer.querySelector("[data-test-id='pinDescription']")
            || pinContainer.querySelector("[data-test-id='truncated-description']");
          if (descEl) description = (descEl as HTMLElement).innerText || "";
        }

        results.push({
          image_url: highRes,
          title: title.slice(0, 200),
          description: description.slice(0, 500),
          pin_url: pinUrl,
        });
      }

      return results;
    });

    if (pins.length === 0) {
      return NextResponse.json(
        { error: "No pins found. The board may be private, empty, or require login." },
        { status: 422 },
      );
    }

    // Cap at 50
    const capped = pins.slice(0, 50);

    return NextResponse.json({ pins: capped, count: capped.length });
  } catch (err) {
    console.error("[pinterest/scrape] Error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";

    if (message.includes("timeout") || message.includes("Timeout")) {
      return NextResponse.json(
        { error: "Pinterest page took too long to load. Try again." },
        { status: 504 },
      );
    }

    return NextResponse.json({ error: "Failed to scrape Pinterest board" }, { status: 500 });
  } finally {
    if (page) {
      await page.close().catch(() => {});
    }
  }
}
