"use client";

import { useState } from "react";
import { PixelGrid } from "@/components/ui/PixelGrid";
import type { ImageGalleryContent, GalleryImage, TiledLayout } from "@/types/slide";

interface Props {
  content: ImageGalleryContent;
  isExport?: boolean;
}

/* ── Tiled layout grid templates ── */
const TILED_CONFIGS: Record<TiledLayout, React.CSSProperties> = {
  "2x2": { gridTemplateColumns: "1fr 1fr",         gridTemplateRows: "1fr 1fr" },
  "2x3": { gridTemplateColumns: "1fr 1fr 1fr",     gridTemplateRows: "1fr 1fr" },
  "3x2": { gridTemplateColumns: "1fr 1fr",         gridTemplateRows: "1fr 1fr 1fr" },
  "1+2": { gridTemplateColumns: "3fr 2fr",         gridTemplateRows: "1fr 1fr" },
  "1+3": { gridTemplateColumns: "2fr 1fr",         gridTemplateRows: "1fr 1fr 1fr" },
};

const TILED_SPANS: Record<TiledLayout, Record<number, React.CSSProperties>> = {
  "2x2": {},
  "2x3": {},
  "3x2": {},
  "1+2": { 0: { gridRow: "1 / 3" } },
  "1+3": { 0: { gridRow: "1 / 4" } },
};

/* ── Placeholder image component ── */
function ImageCell({
  image,
  style,
  animate,
  delayIdx,
  showCaption,
}: {
  image: GalleryImage | null;
  style?: React.CSSProperties;
  animate: boolean;
  delayIdx: number;
  showCaption: boolean;
}) {
  return (
    <div
      className={animate ? `anim-fade-in anim-d-${Math.min(delayIdx, 12)}` : ""}
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#111",
        ...style,
      }}
    >
      {image?.url ? (
        <>
          <img
            src={image.url}
            alt={image.alt || ""}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          {showCaption && image.caption && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "6px 12px",
                backgroundColor: "rgba(10,10,10,0.8)",
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 11,
                color: "#CCCCCC",
                letterSpacing: "0.04em",
              }}
            >
              {image.caption}
            </div>
          )}
        </>
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#333",
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 11,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          NO IMAGE
        </div>
      )}
    </div>
  );
}

/* ── Carousel mode ── */
function CarouselGallery({
  images,
  animate,
  showCaptions,
  hasHeader,
}: {
  images: GalleryImage[];
  animate: boolean;
  showCaptions: boolean;
  hasHeader: boolean;
}) {
  const [idx, setIdx] = useState(0);
  const current = images[idx];
  const headerPad = hasHeader ? 100 : 0;
  const imageAreaH = 720 - headerPad - 64 - 48; // top pad + nav strip + bottom pad

  if (images.length === 0) {
    return (
      <div
        style={{
          position: "absolute",
          top: headerPad + 48,
          left: 88,
          right: 88,
          height: imageAreaH,
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
        ADD IMAGES IN THE EDITOR
      </div>
    );
  }

  return (
    <>
      {/* Main image */}
      <div
        key={idx}
        className={animate ? "anim-fade-in anim-d-1" : ""}
        style={{
          position: "absolute",
          top: headerPad + 48,
          left: 88,
          right: 88,
          height: imageAreaH,
          overflow: "hidden",
          backgroundColor: "#111",
        }}
      >
        {current?.url ? (
          <>
            <img
              src={current.url}
              alt={current.alt || ""}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            {showCaptions && current.caption && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "10px 20px",
                  backgroundColor: "rgba(10,10,10,0.85)",
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 13,
                  color: "#CCCCCC",
                }}
              >
                {current.caption}
              </div>
            )}
          </>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#333",
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 11,
              textTransform: "uppercase",
            }}
          >
            NO IMAGE
          </div>
        )}

        {/* Prev / Next arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
              style={{
                position: "absolute",
                left: 20,
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(10,10,10,0.7)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#FFFFFF",
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 2,
              }}
              aria-label="Previous"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="square" />
              </svg>
            </button>
            <button
              onClick={() => setIdx((i) => (i + 1) % images.length)}
              style={{
                position: "absolute",
                right: 20,
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(10,10,10,0.7)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#FFFFFF",
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 2,
              }}
              aria-label="Next"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="square" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Dot indicators */}
      {images.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 8,
            zIndex: 3,
          }}
        >
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                width: i === idx ? 24 : 8,
                height: 8,
                backgroundColor: i === idx ? "#2D2DFF" : "rgba(255,255,255,0.3)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "width 0.25s ease, background-color 0.25s ease",
              }}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      <div
        style={{
          position: "absolute",
          top: headerPad + 48 + 16,
          right: 108,
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
        {idx + 1} / {images.length}
      </div>
    </>
  );
}

/* ── Tiled mode ── */
function TiledGallery({
  images,
  tiledLayout,
  animate,
  showCaptions,
  hasHeader,
}: {
  images: GalleryImage[];
  tiledLayout: TiledLayout;
  animate: boolean;
  showCaptions: boolean;
  hasHeader: boolean;
}) {
  const headerPad = hasHeader ? 110 : 48;
  const gridTop = headerPad;
  const gridH = 720 - gridTop - 48;
  const gridStyle = TILED_CONFIGS[tiledLayout] || TILED_CONFIGS["2x2"];
  const spanMap = TILED_SPANS[tiledLayout] || {};

  return (
    <div
      style={{
        position: "absolute",
        top: gridTop,
        left: 88,
        right: 80,
        height: gridH,
        display: "grid",
        gap: 8,
        ...gridStyle,
      }}
    >
      {images.slice(0, 9).map((img, i) => (
        <ImageCell
          key={i}
          image={img}
          style={spanMap[i]}
          animate={animate}
          delayIdx={i + 1}
          showCaption={showCaptions}
        />
      ))}
    </div>
  );
}

/* ── Album flow mode (Apple Photos style) ── */
function AlbumFlowGallery({
  images,
  animate,
  showCaptions,
  hasHeader,
}: {
  images: GalleryImage[];
  animate: boolean;
  showCaptions: boolean;
  hasHeader: boolean;
}) {
  const [featured, setFeatured] = useState(0);
  const headerPad = hasHeader ? 110 : 48;
  const areaTop = headerPad;
  const areaH = 720 - areaTop - 40;
  const featuredW = Math.round((1280 - 88 - 80) * 0.62);
  const thumbColW = 1280 - 88 - 80 - featuredW - 16;

  const featuredImg = images[featured];

  return (
    <div
      style={{
        position: "absolute",
        top: areaTop,
        left: 88,
        right: 80,
        height: areaH,
        display: "flex",
        gap: 16,
      }}
    >
      {/* Featured image */}
      <div
        key={featured}
        className={animate ? "anim-fade-in anim-d-1" : ""}
        style={{
          width: featuredW,
          height: "100%",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#111",
          flexShrink: 0,
        }}
      >
        {featuredImg?.url ? (
          <>
            <img
              src={featuredImg.url}
              alt={featuredImg.alt || ""}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            {showCaptions && featuredImg.caption && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "10px 16px",
                  backgroundColor: "rgba(10,10,10,0.85)",
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 13,
                  color: "#CCCCCC",
                }}
              >
                {featuredImg.caption}
              </div>
            )}
            {/* Featured label */}
            <div
              style={{
                position: "absolute",
                top: 16,
                left: 16,
                backgroundColor: "#2D2DFF",
                padding: "3px 10px",
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#FFFFFF",
              }}
            >
              {featured + 1} / {images.length}
            </div>
          </>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#333",
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 12,
              textTransform: "uppercase",
            }}
          >
            NO IMAGE
          </div>
        )}
      </div>

      {/* Thumbnail column */}
      <div
        style={{
          width: thumbColW,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          overflowY: "auto",
          flexShrink: 0,
        }}
      >
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setFeatured(i)}
            style={{
              position: "relative",
              width: "100%",
              height: Math.max(72, Math.round((areaH - (images.length - 1) * 8) / Math.max(images.length, 1))),
              overflow: "hidden",
              backgroundColor: "#111",
              border: i === featured ? "2px solid #2D2DFF" : "2px solid transparent",
              padding: 0,
              cursor: "pointer",
              flexShrink: 0,
              transition: "border-color 0.15s ease",
            }}
            className={animate ? `anim-fade-in anim-d-${Math.min(i + 2, 12)}` : ""}
            aria-label={`View image ${i + 1}`}
          >
            {img?.url ? (
              <img
                src={img.url}
                alt={img.alt || ""}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#333",
                  fontSize: 10,
                  textTransform: "uppercase",
                  fontFamily: '"Space Grotesk", sans-serif',
                }}
              >
                EMPTY
              </div>
            )}
            {/* Active overlay */}
            {i === featured && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(45,45,255,0.2)",
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Main component ── */
export function ImageGallerySlide({ content, isExport }: Props) {
  const {
    headline,
    eyebrow,
    images,
    mode,
    tiled_layout,
    show_captions,
    background_color,
  } = content;

  const isBlue = background_color === "blue";
  const animate = !isExport;
  const hasHeader = !!(headline || eyebrow);

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

      {/* Mode-specific gallery */}
      {mode === "carousel" && (
        <CarouselGallery
          images={images}
          animate={animate}
          showCaptions={show_captions}
          hasHeader={hasHeader}
        />
      )}
      {mode === "tiled" && (
        <TiledGallery
          images={images}
          tiledLayout={tiled_layout}
          animate={animate}
          showCaptions={show_captions}
          hasHeader={hasHeader}
        />
      )}
      {mode === "album_flow" && (
        <AlbumFlowGallery
          images={images}
          animate={animate}
          showCaptions={show_captions}
          hasHeader={hasHeader}
        />
      )}
    </div>
  );
}
