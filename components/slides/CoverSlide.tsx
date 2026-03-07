import { PixelGrid } from "@/components/ui/PixelGrid";
import type { CoverContent } from "@/types/slide";

interface Props {
  content: CoverContent;
  isExport?: boolean;
}

export function CoverSlide({ content, isExport }: Props) {
  const {
    eyebrow,
    headline,
    subheadline,
    client_name,
    deck_type_label,
    background_image_url,
    show_logo,
  } = content;

  const animate = !isExport;

  return (
    <div
      className="slide-base"
      style={{
        backgroundColor: "#0A0A0A",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background image */}
      {background_image_url && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${background_image_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 0,
            }}
          />
          {/* Dark overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(10,10,10,0.65)",
              zIndex: 1,
            }}
          />
        </>
      )}

      {/* Pixel grid */}
      <PixelGrid opacity={0.05} style={{ zIndex: 2 }} />

      {/* Left electric blue bar */}
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

      {/* Content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px 56px 88px",
        }}
      >
        {/* Top — eyebrow */}
        <div>
          <span
            className={animate ? "anim-fade-up anim-d-0" : ""}
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#2D2DFF",
              display: "block",
            }}
          >
            {eyebrow}
          </span>
        </div>

        {/* Centre — headline block */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 20 }}>
          <h1
            className={animate ? "anim-fade-up anim-d-2" : ""}
            style={{
              fontFamily: '"Dela Gothic One", sans-serif',
              fontSize: 96,
              fontWeight: 400,
              textTransform: "uppercase",
              letterSpacing: "-0.03em",
              color: "#FFFFFF",
              lineHeight: 1,
              margin: 0,
              maxWidth: 900,
            }}
          >
            {headline}
          </h1>
          <p
            className={animate ? "anim-fade-up anim-d-4" : ""}
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 20,
              fontWeight: 400,
              color: "#8C8C8C",
              lineHeight: 1.6,
              margin: 0,
              maxWidth: 640,
            }}
          >
            {subheadline}
          </p>
        </div>

        {/* Bottom row */}
        <div
          className={animate ? "anim-fade-up anim-d-6" : ""}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}
        >
          {/* Client info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                display: "inline-block",
                border: "1px solid #2D2DFF",
                padding: "4px 10px",
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#2D2DFF",
              }}
            >
              {deck_type_label}
            </div>
            <span
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 16,
                fontWeight: 600,
                color: "#FFFFFF",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {client_name}
            </span>
          </div>

          {/* EDT Logo */}
          {show_logo && (
            <img
              src="/images/EDT-lockup-dark.svg"
              alt="EDT"
              style={{ height: 32, opacity: 0.85 }}
            />
          )}
        </div>
      </div>

      {/* Right grid line accent */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 0,
          bottom: 0,
          width: 1,
          backgroundColor: "rgba(255,255,255,0.08)",
          zIndex: 3,
        }}
      />
    </div>
  );
}
