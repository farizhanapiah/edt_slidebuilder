import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const SLIDE_W = 1280;
const SLIDE_H = 720;

/**
 * Captures all slide elements from a container and builds a landscape PDF.
 * Each direct child of `container` is treated as one slide (1280×720).
 */
export async function exportSlidesToPdf(
  container: HTMLElement,
  filename: string
): Promise<void> {
  const slideElements = Array.from(container.children) as HTMLElement[];
  if (slideElements.length === 0) return;

  // Wait for images to load
  const images = container.querySelectorAll("img");
  await Promise.all(
    Array.from(images).map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) return resolve();
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
    )
  );

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
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#0A0A0A",
      logging: false,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, 0, SLIDE_W, SLIDE_H);
  }

  pdf.save(filename);
}
