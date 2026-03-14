import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const SLIDE_W = 1280;
const SLIDE_H = 720;

/* ------------------------------------------------------------------ */
/*  Image pre-fetching — converts all URLs to data-URIs so            */
/*  html2canvas never hits CORS issues.                                */
/* ------------------------------------------------------------------ */

/** Try loading via canvas (works for same-origin + CORS-enabled). */
function fetchViaCanvas(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const c = document.createElement("canvas");
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        c.getContext("2d")!.drawImage(img, 0, 0);
        resolve(c.toDataURL("image/jpeg", 0.92));
      } catch {
        reject(new Error("tainted"));
      }
    };
    img.onerror = () => reject(new Error("load failed"));
    img.src = url;
  });
}

/** Fallback: fetch through our server-side proxy. */
async function fetchViaProxy(url: string): Promise<string> {
  const res = await fetch(`/api/image-proxy?url=${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error("proxy failed");
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/** Convert any image URL to a data-URI, with fallback chain. */
async function toDataUrl(url: string): Promise<string> {
  if (!url || url.startsWith("data:") || url.startsWith("blob:")) return url;
  try {
    return await fetchViaCanvas(url);
  } catch {
    try {
      return await fetchViaProxy(url);
    } catch {
      return url; // last resort: return original
    }
  }
}

/** Extract all image URLs (img src + CSS background-image) from a container. */
function collectImageUrls(container: HTMLElement): string[] {
  const urls = new Set<string>();

  container.querySelectorAll("img").forEach((img) => {
    if (img.src && !img.src.startsWith("data:")) urls.add(img.src);
  });

  container.querySelectorAll("*").forEach((el) => {
    const bg = (el as HTMLElement).style.backgroundImage;
    if (!bg) return;
    for (const match of bg.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
      const u = match[1];
      if (u && !u.startsWith("data:") && !u.startsWith("blob:")) {
        // Resolve relative URLs
        try { urls.add(new URL(u, window.location.href).href); } catch { /* skip */ }
      }
    }
  });

  return Array.from(urls);
}

/** Replace image sources in a cloned element tree using a URL→dataURI map. */
function replaceImagesInClone(
  clone: HTMLElement,
  urlMap: Map<string, string>
) {
  // Replace <img> src
  clone.querySelectorAll("img").forEach((img) => {
    const dataUrl = urlMap.get(img.src);
    if (dataUrl) {
      img.src = dataUrl;
      img.removeAttribute("srcset");
      img.removeAttribute("loading");
    }
  });

  // Replace CSS background-image urls
  clone.querySelectorAll("*").forEach((el) => {
    const htmlEl = el as HTMLElement;
    const bg = htmlEl.style.backgroundImage;
    if (!bg || !bg.includes("url(")) return;

    let replaced = bg;
    for (const [originalUrl, dataUrl] of urlMap) {
      if (replaced.includes(originalUrl)) {
        replaced = replaced.replace(originalUrl, dataUrl);
      }
    }
    if (replaced !== bg) htmlEl.style.backgroundImage = replaced;
  });
}

/* ------------------------------------------------------------------ */
/*  Main export function                                               */
/* ------------------------------------------------------------------ */

export async function exportSlidesToPdf(
  container: HTMLElement,
  filename: string
): Promise<void> {
  const slideElements = Array.from(container.children) as HTMLElement[];
  if (slideElements.length === 0) return;

  // 1. Wait for DOM images to finish loading
  const imgs = container.querySelectorAll("img");
  await Promise.all(
    Array.from(imgs).map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) return resolve();
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
    )
  );

  // 2. Pre-fetch every image as a data-URI (bypasses CORS)
  const urls = collectImageUrls(container);
  const urlMap = new Map<string, string>();
  await Promise.all(
    urls.map(async (url) => {
      const dataUrl = await toDataUrl(url);
      urlMap.set(url, dataUrl);
    })
  );

  // 3. Wait for fonts
  await document.fonts.ready;

  // 4. Capture each slide
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [SLIDE_W, SLIDE_H],
    hotfixes: ["px_scaling"],
  });

  for (let i = 0; i < slideElements.length; i++) {
    const canvas = await html2canvas(slideElements[i], {
      width: SLIDE_W,
      height: SLIDE_H,
      scale: 2,
      useCORS: false, // not needed — all images are data-URIs now
      backgroundColor: "#0A0A0A",
      logging: false,
      onclone: (_doc: Document, clonedEl: HTMLElement) => {
        replaceImagesInClone(clonedEl, urlMap);
      },
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, 0, SLIDE_W, SLIDE_H);
  }

  pdf.save(filename);
}
