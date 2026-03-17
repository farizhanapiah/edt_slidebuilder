"use client";

import { useState } from "react";
import { PixelGrid } from "@/components/ui/PixelGrid";
import type { PinterestInspoContent, PinterestPin } from "@/types/slide";

interface Props {
  content: PinterestInspoContent;
  isExport?: boolean;
}

/* ── Detail overlay ── */
function PinOverlay({
  pin,
  onClose,
}: {
  pin: PinterestPin;
  onClose: () => void;
}) {
  async function handleDownload(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/image-proxy?url=${encodeURIComponent(pin.image_url)}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pin-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open image in new tab
      window.open(`/api/image-proxy?url=${encodeURIComponent(pin.image_url)}`, "_blank");
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(10,10,10,0.92)",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          gap: 32,
          maxWidth: 1000,
          maxHeight: 600,
          cursor: "default",
        }}
      >
        {/* Large image */}
        <div
          style={{
            flex: "0 0 auto",
            maxWidth: 560,
            maxHeight: 560,
            overflow: "hidden",
            backgroundColor: "#111",
          }}
        >
          <img
            src={`/api/image-proxy?url=${encodeURIComponent(pin.image_url)}`}
            alt={pin.title || "Pin image"}
            style={{
              maxWidth: "100%",
              maxHeight: 560,
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>

        {/* Info panel */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            minWidth: 200,
            maxWidth: 300,
            justifyContent: "center",
          }}
        >
          {pin.title && (
            <h3
              style={{
                fontFamily: '"Dela Gothic One", sans-serif',
                fontSize: 20,
                fontWeight: 400,
                textTransform: "uppercase",
                color: "#FFFFFF",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {pin.title}
            </h3>
          )}
          {pin.description && (
            <p
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 13,
                color: "#8C8C8C",
                lineHeight: 1.5,
                margin: 0,
                maxHeight: 200,
                overflow: "auto",
              }}
            >
              {pin.description}
            </p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            <button
              onClick={handleDownload}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "8px 16px",
                backgroundColor: "#2D2DFF",
                color: "#FFFFFF",
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                border: "none",
                cursor: "pointer",
              }}
            >
              DOWNLOAD IMAGE
            </button>

            {pin.pin_url && (
              <a
                href={pin.pin_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "8px 16px",
                  backgroundColor: "transparent",
                  color: "#FFFFFF",
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.3)",
                  cursor: "pointer",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                VIEW ON PINTEREST
              </a>
            )}
          </div>

          <span
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 10,
              color: "#555",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginTop: 8,
            }}
          >
            CLICK OUTSIDE TO CLOSE
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ── */
export function PinterestInspoSlide({ content, isExport }: Props) {
  const { headline, eyebrow, pins, background_color } = content;
  const isBlue = background_color === "blue";
  const animate = !isExport;
  const hasHeader = !!(headline || eyebrow);

  const [selectedPin, setSelectedPin] = useState<PinterestPin | null>(null);

  const displayPins = isExport ? pins.slice(0, 12) : pins;
  const headerPad = hasHeader ? 110 : 48;
  const gridH = 720 - headerPad - 32;

  return (
    <div
      className="slide-base"
      style={{
        backgroundColor: isBlue ? "#2D2DFF" : "#0A0A0A",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <PixelGrid opacity={isBlue ? 0.06 : 0.04} />

      {/* Left blue bar (dark bg only) */}
      {!isBlue && (
        <div
          className={animate ? "anim-bar-in anim-d-0" : ""}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            backgroundColor: "#2D2DFF",
            zIndex: 3,
          }}
        />
      )}

      {/* Header */}
      {hasHeader && (
        <div
          style={{
            position: "absolute",
            top: 48,
            left: 88,
            right: 80,
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {eyebrow && (
            <span
              className={animate ? "anim-fade-up anim-d-0" : ""}
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: isBlue ? "rgba(255,255,255,0.7)" : "#2D2DFF",
              }}
            >
              {eyebrow}
            </span>
          )}
          {headline && (
            <h2
              className={animate ? "anim-fade-up anim-d-1" : ""}
              style={{
                fontFamily: '"Dela Gothic One", sans-serif',
                fontSize: 40,
                fontWeight: 400,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
                color: "#FFFFFF",
                lineHeight: 1,
                margin: 0,
              }}
            >
              {headline}
            </h2>
          )}
        </div>
      )}

      {/* Pin count badge */}
      {pins.length > 0 && (
        <div
          className={animate ? "anim-fade-in anim-d-1" : ""}
          style={{
            position: "absolute",
            top: hasHeader ? 56 : 20,
            right: 80,
            zIndex: 4,
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.5)",
            backgroundColor: "rgba(10,10,10,0.7)",
            padding: "4px 10px",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {pins.length} PINS
        </div>
      )}

      {/* Scrollable grid */}
      {displayPins.length > 0 ? (
        <div
          style={{
            position: "absolute",
            top: headerPad,
            left: 88,
            right: 80,
            height: gridH,
            overflowY: isExport ? "hidden" : "auto",
            overflowX: "hidden",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 8,
              gridAutoRows: "minmax(100px, auto)",
            }}
          >
            {displayPins.map((pin, i) => (
              <button
                key={i}
                onClick={() => !isExport && setSelectedPin(pin)}
                className={animate ? `anim-fade-in anim-d-${Math.min(i + 2, 12)}` : ""}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  backgroundColor: "#111",
                  border: "none",
                  padding: 0,
                  cursor: isExport ? "default" : "pointer",
                  gridRow: `span ${i % 3 === 0 ? 2 : 1}`,
                  minHeight: i % 3 === 0 ? 220 : 140,
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isExport) {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(45,45,255,0.3)";
                    e.currentTarget.style.zIndex = "2";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isExport) {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.zIndex = "auto";
                  }
                }}
                aria-label={pin.title || `Pin ${i + 1}`}
              >
                <img
                  src={`/api/image-proxy?url=${encodeURIComponent(pin.image_url)}`}
                  alt={pin.title || `Pin ${i + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            top: headerPad,
            left: 88,
            right: 80,
            height: gridH,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#333",
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          IMPORT A PINTEREST BOARD IN THE EDITOR
        </div>
      )}

      {/* Pin detail overlay */}
      {selectedPin && !isExport && (
        <PinOverlay pin={selectedPin} onClose={() => setSelectedPin(null)} />
      )}
    </div>
  );
}
