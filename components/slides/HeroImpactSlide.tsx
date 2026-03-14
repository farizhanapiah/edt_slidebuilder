import { PositionedImage } from "@/components/ui/PositionedImage";
import type { HeroImpactContent } from "@/types/slide";

interface Props {
  content: HeroImpactContent;
  isExport?: boolean;
}

export function HeroImpactSlide({ content, isExport }: Props) {
  const {
    headline,
    headline_size,
    subtext,
    background_image_url,
    image_position,
    overlay_opacity,
    text_alignment,
    accent_bar,
    show_logo,
  } = content;
  const animate = !isExport;

  const headlineFontSize = headline_size === "xxl" ? 160 : 120;

  // Alignment-based positioning
  const alignmentStyles: Record<string, React.CSSProperties> = {
    left: {
      alignItems: "flex-start",
      textAlign: "left",
      paddingLeft: 80,
      paddingRight: 80,
    },
    center: {
      alignItems: "center",
      textAlign: "center",
      paddingLeft: 80,
      paddingRight: 80,
    },
    right: {
      alignItems: "flex-end",
      textAlign: "right",
      paddingLeft: 80,
      paddingRight: 80,
    },
  };

  // Split headline on \n for line breaks
  const headlineLines = headline.split("\\n");

  return (
    <div
      className="slide-base"
      style={{ backgroundColor: "#0A0A0A", position: "relative" }}
    >
      {/* Full-bleed background image */}
      {background_image_url ? (
        <PositionedImage
          src={background_image_url}
          alt=""
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

      {/* Accent bar */}
      {accent_bar && (
        <div
          className={animate ? "anim-bar-in anim-d-0" : ""}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            backgroundColor: "#2D2DFF",
            zIndex: 3,
          }}
        />
      )}

      {/* Content area */}
      <div
        style={{
          position: "relative",
          zIndex: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          ...alignmentStyles[text_alignment],
        }}
      >
        {/* Headline */}
        <h2
          className={animate ? "anim-clip-right anim-d-2" : ""}
          style={{
            fontFamily: '"Dela Gothic One", sans-serif',
            fontSize: headlineFontSize,
            fontWeight: 400,
            textTransform: "uppercase",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            color: "#FFFFFF",
            margin: 0,
          }}
        >
          {headlineLines.map((line, i) => (
            <span key={i}>
              {line}
              {i < headlineLines.length - 1 && <br />}
            </span>
          ))}
        </h2>

        {/* Subtext */}
        {subtext && (
          <p
            className={animate ? "anim-fade-up anim-d-4" : ""}
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 18,
              fontWeight: 400,
              color: "#8C8C8C",
              lineHeight: 1.6,
              marginTop: 24,
              marginBottom: 0,
              maxWidth: 500,
            }}
          >
            {subtext}
          </p>
        )}
      </div>

      {/* EDT logo watermark -- bottom right corner */}
      {show_logo && (
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
      )}
    </div>
  );
}
