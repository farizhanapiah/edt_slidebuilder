import { PositionedImage } from "@/components/ui/PositionedImage";
import type { FullBleedImageContent } from "@/types/slide";

interface Props {
  content: FullBleedImageContent;
  isExport?: boolean;
}

const positionStyles: Record<string, React.CSSProperties> = {
  "top-left": { top: 64, left: 80, bottom: "auto", right: "auto" },
  "bottom-left": { bottom: 60, left: 80, top: "auto", right: "auto" },
  center: { top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" },
  "bottom-right": { bottom: 60, right: 80, top: "auto", left: "auto", textAlign: "right" },
};

export function FullBleedImageSlide({ content, isExport }: Props) {
  const { image_url, image_alt, image_position, overlay_opacity, headline, subtext, text_position, show_scan_lines } = content;
  const animate = !isExport;

  return (
    <div
      className="slide-base"
      style={{ backgroundColor: "#111", position: "relative" }}
    >
      {/* Background image */}
      {image_url ? (
        <PositionedImage
          src={image_url}
          alt={image_alt}
          position={image_position}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#1a1a1a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#333",
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 14,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            zIndex: 0,
          }}
        >
          NO IMAGE
        </div>
      )}

      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: `rgba(10,10,10,${overlay_opacity / 100})`,
          zIndex: 1,
        }}
      />

      {/* Scan lines */}
      {show_scan_lines && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(0,0,0,0.04) 4px, rgba(0,0,0,0.04) 5px)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Pixel grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          pointerEvents: "none",
        }}
      />

      {/* Text overlay */}
      {(headline || subtext) && (
        <div
          style={{
            position: "absolute",
            zIndex: 4,
            maxWidth: 800,
            ...positionStyles[text_position],
          }}
        >
          {headline && (
            <h2
              className={animate ? "anim-fade-up anim-d-2" : ""}
              style={{
                fontFamily: '"Dela Gothic One", sans-serif',
                fontSize: 72,
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
          {subtext && (
            <p
              className={animate ? "anim-fade-up anim-d-3" : ""}
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 18,
                fontWeight: 400,
                color: "#8C8C8C",
                lineHeight: 1.6,
                margin: "16px 0 0",
              }}
            >
              {subtext}
            </p>
          )}
        </div>
      )}

      {/* EDT logo watermark — bottom right corner */}
      <img
        src="/images/EDT-lockup-dark.svg"
        alt="EDT"
        style={{
          position: "absolute",
          bottom: 32,
          right: 48,
          height: 24,
          opacity: 0.5,
          zIndex: 5,
        }}
      />
    </div>
  );
}
