import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";

const SLIDE_W = 1280;
const SLIDE_H = 720;

// macOS Chrome paths in order of preference
const MAC_CHROME_PATHS = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
];

async function getExecutablePath(): Promise<string> {
  if (process.platform === "darwin") {
    const fs = await import("fs");
    for (const p of MAC_CHROME_PATHS) {
      if (fs.existsSync(p)) return p;
    }
    throw new Error(
      "No Chrome/Chromium found on macOS. Install Google Chrome or Chromium."
    );
  }
  return chromium.executablePath(
    "https://github.com/Sparticuz/chromium/releases/download/v143.0.0/chromium-v143.0.0-pack.tar"
  );
}

export async function generateDeckPdf(deckId: string, baseUrl: string): Promise<Buffer> {
  const exportToken = process.env.EXPORT_SECRET;
  const previewUrl = `${baseUrl}/decks/${deckId}/preview?exportToken=${exportToken}`;

  const executablePath = await getExecutablePath();
  const isLocal = process.platform === "darwin";

  const browser = await puppeteer.launch({
    args: isLocal
      ? ["--no-sandbox", "--disable-setuid-sandbox"]
      : [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    defaultViewport: { width: SLIDE_W, height: SLIDE_H },
    executablePath,
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: SLIDE_W, height: SLIDE_H });

    await page.goto(previewUrl, { waitUntil: "networkidle0", timeout: 30000 });

    // Wait for fonts and slide content to be ready
    await page.evaluateHandle("document.fonts.ready");
    await page.waitForSelector("[data-slides-ready]", { timeout: 10000 });

    // Give images a moment to fully load
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        const images = document.querySelectorAll("img");
        if (images.length === 0) { resolve(); return; }
        let loaded = 0;
        images.forEach((img) => {
          if (img.complete) { loaded++; if (loaded === images.length) resolve(); }
          else {
            img.onload = img.onerror = () => { loaded++; if (loaded === images.length) resolve(); };
          }
        });
        // Safety timeout
        setTimeout(resolve, 3000);
      });
    });

    const pdfBuffer = await page.pdf({
      width: SLIDE_W,
      height: SLIDE_H,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}
