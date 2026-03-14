import { PixelGrid } from "@/components/ui/PixelGrid";
import { PositionedImage } from "@/components/ui/PositionedImage";
import type { TextImageContent } from "@/types/slide";

interface Props {
  content: TextImageContent;
  isExport?: boolean;
}

export function TextImageSlide({ content, isExport }: Props) {
  const { eyebrow, headline, body, image_url, image_alt, image_side, image_caption, image_position } = content;
  const animate = !isExport;
  const imageLeft = image_side === "left";

  const textPanel = (
    <div
      style={{
        flex: "0 0 50%",
        backgroundColor: "#0A0A0A",
        padding: "64px 56px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 24,
        position: "relative",
      }}
    >
      <PixelGrid opacity={0.06} />
      {/* Left bar (only on left panel or always) */}
      {!imageLeft && (
        <div
          className={animate ? "anim-bar-in anim-d-0" : ""}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            backgroundColor: "#2D2DFF",
          }}
        />
      )}

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
        {eyebrow && (
          <span
            className={animate ? "anim-fade-up anim-d-0" : ""}
            style={{
              display: "block",
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#2D2DFF",
            }}
          >
            {eyebrow}
          </span>
        )}

        <h2
          className={animate ? "anim-fade-up anim-d-2" : ""}
          style={{
            fontFamily: '"Dela Gothic One", sans-serif',
            fontSize: 52,
            fontWeight: 400,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            color: "#FFFFFF",
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          {headline}
        </h2>

        {/* Divider */}
        <div className={animate ? "anim-fade-up anim-d-3" : ""} style={{ height: 1, backgroundColor: "rgba(255,255,255,0.15)", width: 48 }} />

        <p
          className={animate ? "anim-fade-up anim-d-3" : ""}
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 17,
            fontWeight: 400,
            color: "#8C8C8C",
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {body}
        </p>
      </div>
    </div>
  );

  const imagePanel = (
    <div
      style={{
        flex: "0 0 50%",
        position: "relative",
        backgroundColor: "#111",
        overflow: "hidden",
      }}
    >
      {image_url ? (
        <>
          <PositionedImage
            src={image_url}
            alt={image_alt}
            position={image_position}
            style={{ width: "100%", height: "100%", display: "block" }}
          />
          {/* Subtle blue overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(45,45,255,0.15)",
              mixBlendMode: "multiply",
            }}
          />
        </>
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#3a3a3a",
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 13,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          NO IMAGE
        </div>
      )}
      {image_caption && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(10,10,10,0.8)",
            padding: "8px 16px",
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 11,
            color: "#8C8C8C",
          }}
        >
          {image_caption}
        </div>
      )}
    </div>
  );

  return (
    <div
      className="slide-base"
      style={{
        display: "flex",
        flexDirection: imageLeft ? "row-reverse" : "row",
        overflow: "hidden",
      }}
    >
      {textPanel}
      {/* Hard divider */}
      <div style={{ width: 1, backgroundColor: "#FFFFFF", flexShrink: 0 }} />
      {imagePanel}
    </div>
  );
}
