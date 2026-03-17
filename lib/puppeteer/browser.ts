import puppeteer, { type Browser } from "puppeteer";

let _browser: Browser | null = null;

/**
 * Returns a shared headless Chrome browser instance.
 * Reuses the same browser across requests to avoid cold-start overhead.
 */
export async function getBrowser(): Promise<Browser> {
  if (_browser && _browser.connected) return _browser;

  _browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--single-process",
    ],
  });

  return _browser;
}

/** Close the shared browser instance (for cleanup). */
export async function closeBrowser(): Promise<void> {
  if (_browser) {
    await _browser.close();
    _browser = null;
  }
}
