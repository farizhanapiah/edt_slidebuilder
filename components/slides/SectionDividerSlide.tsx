import { PixelGrid } from "@/components/ui/PixelGrid";
import type { SectionDividerContent } from "@/types/slide";

interface Props {
  content: SectionDividerContent;
  isExport?: boolean;
}

export function SectionDividerSlide({ content, isExport }: Props) {
  const { section_number, section_title, section_subtitle, background_color } = content;
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
      }}
    >
      <PixelGrid opacity={isBlue ? 0.08 : 0.06} />

      {/* Horizontal divider lines */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: isBlue ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.12)",
          transform: "translateY(-120px)",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: isBlue ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.12)",
          transform: "translateY(60px)",
          zIndex: 1,
        }}
      />

      {/* Section number — large ghost text */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: '"Dela Gothic One", sans-serif',
          fontSize: 240,
          fontWeight: 400,
          color: isBlue ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
          lineHeight: 1,
          userSelect: "none",
          zIndex: 1,
        }}
      >
        {section_number}
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "0 88px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          maxWidth: 900,
        }}
      >
        {/* Section number badge */}
        <span
          className={animate ? "anim-fade-up anim-d-0" : ""}
          style={{
            display: "block",
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: isBlue ? "rgba(255,255,255,0.7)" : "#2D2DFF",
          }}
        >
          {section_number}
        </span>

        <h2
          className={animate ? "anim-fade-up anim-d-2" : ""}
          style={{
            fontFamily: '"Dela Gothic One", sans-serif',
            fontSize: 80,
            fontWeight: 400,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            color: "#FFFFFF",
            lineHeight: 1,
            margin: 0,
          }}
        >
          {section_title}
        </h2>

        {section_subtitle && (
          <p
            className={animate ? "anim-fade-up anim-d-3" : ""}
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 20,
              fontWeight: 400,
              color: isBlue ? "rgba(255,255,255,0.75)" : "#8C8C8C",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {section_subtitle}
          </p>
        )}
      </div>

      {/* Left blue bar (only on dark bg) */}
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
    </div>
  );
}
