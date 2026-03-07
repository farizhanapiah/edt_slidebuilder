import { PixelGrid } from "@/components/ui/PixelGrid";
import type { QuoteContent } from "@/types/slide";

interface Props {
  content: QuoteContent;
  isExport?: boolean;
}

export function QuoteSlide({ content, isExport }: Props) {
  const { quote_text, attribution, context, background_color, show_quotation_mark } = content;
  const animate = !isExport;
  const isBlue = background_color === "blue";

  return (
    <div
      className="slide-base"
      style={{
        backgroundColor: isBlue ? "#2D2DFF" : "#0A0A0A",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 120px",
      }}
    >
      <PixelGrid opacity={isBlue ? 0.07 : 0.06} />

      {/* 1px inset border */}
      <div
        style={{
          position: "absolute",
          inset: 16,
          border: "1px solid rgba(255,255,255,0.25)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          gap: 32,
          maxWidth: 900,
        }}
      >
        {/* Quotation mark */}
        {show_quotation_mark && (
          <div
            className={animate ? "anim-fade-up anim-d-0" : ""}
            style={{
              fontFamily: '"Dela Gothic One", sans-serif',
              fontSize: 120,
              lineHeight: 0.8,
              color: isBlue ? "rgba(255,255,255,0.3)" : "rgba(45,45,255,0.4)",
              userSelect: "none",
            }}
          >
            "
          </div>
        )}

        <blockquote
          className={animate ? "anim-fade-up anim-d-2" : ""}
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 32,
            fontWeight: 500,
            color: "#FFFFFF",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {quote_text}
        </blockquote>

        {attribution && (
          <div className={animate ? "anim-fade-up anim-d-3" : ""} style={{ display: "flex", flexDirection: "column", gap: 6, borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 20 }}>
            <p
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 16,
                fontWeight: 500,
                color: isBlue ? "rgba(255,255,255,0.85)" : "#FFFFFF",
                margin: 0,
                letterSpacing: "0.03em",
              }}
            >
              {attribution}
            </p>
            {context && (
              <p
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 13,
                  fontWeight: 400,
                  color: isBlue ? "rgba(255,255,255,0.6)" : "#8C8C8C",
                  margin: 0,
                }}
              >
                {context}
              </p>
            )}
          </div>
        )}
      </div>

      {/* EDT icon watermark */}
      <img
        src="/images/edt-favicon.svg"
        alt="EDT"
        style={{
          position: "absolute",
          bottom: 36,
          right: 48,
          height: 28,
          opacity: isBlue ? 0.4 : 0.3,
          zIndex: 2,
        }}
      />
    </div>
  );
}
