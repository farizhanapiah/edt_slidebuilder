import { PixelGrid } from "@/components/ui/PixelGrid";
import type { ThankYouContent } from "@/types/slide";

interface Props {
  content: ThankYouContent;
  isExport?: boolean;
}

export function ThankYouSlide({ content, isExport }: Props) {
  const {
    headline,
    subheadline,
    contact_name,
    contact_title,
    contact_email,
    contact_phone,
    website,
    show_logo,
    background_color,
  } = content;

  const animate = !isExport;
  const isBlue = background_color === "blue";

  return (
    <div
      className="slide-base"
      style={{
        backgroundColor: isBlue ? "#2D2DFF" : "#0A0A0A",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 88px 56px",
      }}
    >
      <PixelGrid opacity={isBlue ? 0.08 : 0.06} />

      {/* Left bar (dark bg only) */}
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
            zIndex: 2,
          }}
        />
      )}

      {/* 1px inset border */}
      <div
        style={{
          position: "absolute",
          inset: 16,
          border: `1px solid ${isBlue ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)"}`,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: 0 }}>
        {/* Main headline */}
        <h1
          className={animate ? "anim-fade-up anim-d-2" : ""}
          style={{
            fontFamily: '"Dela Gothic One", sans-serif',
            fontSize: 88,
            fontWeight: 400,
            textTransform: "uppercase",
            letterSpacing: "-0.03em",
            color: "#FFFFFF",
            lineHeight: 1,
            margin: 0,
          }}
        >
          {headline}
        </h1>
        {subheadline && (
          <p
            className={animate ? "anim-fade-up anim-d-3" : ""}
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 22,
              fontWeight: 400,
              color: isBlue ? "rgba(255,255,255,0.75)" : "#8C8C8C",
              margin: "20px 0 0",
            }}
          >
            {subheadline}
          </p>
        )}
      </div>

      {/* Bottom row */}
      <div
        className={animate ? "anim-fade-up anim-d-3" : ""}
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        {/* Contact info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {(contact_name || contact_title) && (
            <div>
              {contact_name && (
                <div
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#FFFFFF",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  {contact_name}
                </div>
              )}
              {contact_title && (
                <div
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: 13,
                    fontWeight: 400,
                    color: isBlue ? "rgba(255,255,255,0.7)" : "#8C8C8C",
                  }}
                >
                  {contact_title}
                </div>
              )}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 8 }}>
            {contact_email && (
              <span
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 14,
                  fontWeight: 400,
                  color: isBlue ? "rgba(255,255,255,0.85)" : "#FFFFFF",
                }}
              >
                {contact_email}
              </span>
            )}
            {contact_phone && (
              <span
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 14,
                  fontWeight: 400,
                  color: isBlue ? "rgba(255,255,255,0.7)" : "#8C8C8C",
                }}
              >
                {contact_phone}
              </span>
            )}
            {website && (
              <span
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 14,
                  fontWeight: 600,
                  color: isBlue ? "#FFFFFF" : "#2D2DFF",
                  letterSpacing: "0.04em",
                }}
              >
                {website}
              </span>
            )}
          </div>
        </div>

        {/* Logo */}
        {show_logo && (
          <img
            src="/images/EDT-lockup-dark.svg"
            alt="EDT"
            style={{ height: 36, opacity: 0.9 }}
          />
        )}
      </div>
    </div>
  );
}
