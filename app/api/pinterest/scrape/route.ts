import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

interface ScrapedPin {
  image_url: string;
  title: string;
  description: string;
  pin_url: string;
}

const PINTEREST_URL_RE =
  /^https?:\/\/(www\.)?pinterest\.(com|co\.uk|ca|com\.au|de|fr|es|it|jp|kr|se|nz|at|ch|ru|cl|com\.mx|co|pt|ie)(\/[\w._-]+){1,4}\/?$/;

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

  try {
    const html = await fetchBoardHtml(board_url.trim());

    // Try multiple extraction strategies
    let pins: ScrapedPin[] = [];

    // Strategy 1: Parse __PWS_DATA__ embedded JSON
    pins = extractFromPwsData(html);

    // Strategy 2: Parse any application/json script tags
    if (pins.length === 0) {
      pins = extractFromJsonScripts(html);
    }

    // Strategy 3: Regex fallback for pinimg.com URLs
    if (pins.length === 0) {
      pins = extractFromRegex(html);
    }

    if (pins.length === 0) {
      return NextResponse.json(
        { error: "No pins found. The board may be private, empty, or require login." },
        { status: 422 },
      );
    }

    const capped = pins.slice(0, 50);
    return NextResponse.json({ pins: capped, count: capped.length });
  } catch (err) {
    console.error("[pinterest/scrape] Error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";

    if (message.includes("404")) {
      return NextResponse.json(
        { error: "Board not found. Check the URL and ensure the board is public." },
        { status: 404 },
      );
    }

    return NextResponse.json({ error: "Failed to scrape Pinterest board" }, { status: 500 });
  }
}

/* ── Fetch board HTML with browser-like headers ── */

async function fetchBoardHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
    },
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error(`Pinterest returned ${res.status}`);
  }

  return res.text();
}

/* ── Strategy 1: Extract from __PWS_DATA__ ── */

function extractFromPwsData(html: string): ScrapedPin[] {
  const match = html.match(
    /<script\s+id="__PWS_DATA__"[^>]*>([\s\S]*?)<\/script>/,
  );
  if (!match) return [];

  try {
    const data = JSON.parse(match[1]);
    return traverseForPins(data);
  } catch {
    return [];
  }
}

/* ── Strategy 2: Parse all application/json script tags ── */

function extractFromJsonScripts(html: string): ScrapedPin[] {
  const pins: ScrapedPin[] = [];
  const scriptRe =
    /<script[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/g;
  let scriptMatch;

  while ((scriptMatch = scriptRe.exec(html)) !== null) {
    try {
      const data = JSON.parse(scriptMatch[1]);
      pins.push(...traverseForPins(data));
    } catch {
      /* continue */
    }
  }

  return pins;
}

/* ── Strategy 3: Regex fallback for pinimg.com URLs ── */

function extractFromRegex(html: string): ScrapedPin[] {
  const pins: ScrapedPin[] = [];
  const seen = new Set<string>();

  // Match high-res Pinterest CDN URLs
  const patterns = [
    /https:\/\/i\.pinimg\.com\/originals\/[a-f0-9/]+\.\w+/g,
    /https:\/\/i\.pinimg\.com\/736x\/[a-f0-9/]+\.\w+/g,
    /https:\/\/i\.pinimg\.com\/564x\/[a-f0-9/]+\.\w+/g,
    /https:\/\/i\.pinimg\.com\/474x\/[a-f0-9/]+\.\w+/g,
  ];

  for (const pattern of patterns) {
    const matches = html.match(pattern) || [];
    for (const url of matches) {
      const highRes = upgradeImageUrl(url);
      const base = highRes.replace(/https:\/\/i\.pinimg\.com\/[^/]+\//, "");
      if (seen.has(base)) continue;
      seen.add(base);

      pins.push({
        image_url: highRes,
        title: "",
        description: "",
        pin_url: "",
      });
    }
    // If we found originals, don't bother with smaller sizes
    if (pins.length > 0) break;
  }

  return pins;
}

/* ── Recursive traversal to find pin-like objects in JSON ── */

function traverseForPins(data: unknown): ScrapedPin[] {
  const pins: ScrapedPin[] = [];
  const seen = new Set<string>();

  function traverse(obj: unknown, depth: number): void {
    if (depth > 12 || !obj || typeof obj !== "object") return;

    const record = obj as Record<string, unknown>;

    // Pinterest pin objects typically have an `images` field with resolution variants
    if (record.images && typeof record.images === "object") {
      const images = record.images as Record<
        string,
        { url?: string; width?: number }
      >;
      const imageUrl =
        images.orig?.url ||
        images["1200x"]?.url ||
        images["736x"]?.url ||
        images["564x"]?.url ||
        images["474x"]?.url ||
        "";

      if (imageUrl && imageUrl.includes("pinimg.com")) {
        const highRes = upgradeImageUrl(imageUrl);
        const base = highRes.replace(/https:\/\/i\.pinimg\.com\/[^/]+\//, "");
        if (!seen.has(base)) {
          seen.add(base);
          pins.push({
            image_url: highRes,
            title:
              typeof record.title === "string" ? record.title.slice(0, 200) : "",
            description:
              typeof record.description === "string"
                ? record.description.slice(0, 500)
                : typeof record.description_html === "string"
                  ? record.description_html.replace(/<[^>]+>/g, "").slice(0, 500)
                  : "",
            pin_url:
              typeof record.id === "string"
                ? `https://www.pinterest.com/pin/${record.id}/`
                : "",
          });
        }
        return;
      }
    }

    // Also check for `image_signature` pattern (older Pinterest format)
    if (
      typeof record.image_large_url === "string" &&
      record.image_large_url.includes("pinimg.com")
    ) {
      const highRes = upgradeImageUrl(record.image_large_url);
      const base = highRes.replace(/https:\/\/i\.pinimg\.com\/[^/]+\//, "");
      if (!seen.has(base)) {
        seen.add(base);
        pins.push({
          image_url: highRes,
          title:
            typeof record.title === "string" ? record.title.slice(0, 200) : "",
          description:
            typeof record.description === "string"
              ? record.description.slice(0, 500)
              : "",
          pin_url:
            typeof record.id === "string"
              ? `https://www.pinterest.com/pin/${record.id}/`
              : "",
        });
      }
      return;
    }

    if (Array.isArray(obj)) {
      for (const item of obj) traverse(item, depth + 1);
    } else {
      for (const value of Object.values(record)) traverse(value, depth + 1);
    }
  }

  traverse(data, 0);
  return pins;
}

/* ── Upgrade image URL to highest resolution ── */

function upgradeImageUrl(url: string): string {
  return url
    .replace(/\/\d+x\d+\//, "/originals/")
    .replace(/\/\d+x\//, "/originals/");
}
