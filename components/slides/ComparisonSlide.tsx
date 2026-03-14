import { PixelGrid } from "@/components/ui/PixelGrid";
import { PositionedImage } from "@/components/ui/PositionedImage";
import type { ComparisonContent } from "@/types/slide";

interface Props {
  content: ComparisonContent;
  isExport?: boolean;
}

export function ComparisonSlide({ content, isExport }: Props) {
  const {
    headline,
    eyebrow,
    left_label,
    left_image_url,
    left_image_alt,
    left_image_position,
    left_points,
    right_label,
    right_image_url,
    right_image_alt,
    right_image_position,
    right_points,
    divider_style,
  } = content;
  const animate = !isExport;
  const hasHeader = !!headline;
  const headerHeight = 100;
  const imageHeight = hasHeader ? 720 - headerHeight : 720;

  return (
    <div
      className="slide-base"
      style={{
        backgroundColor: "#0A0A0A",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PixelGrid opacity={0.06} />

      {/* Optional header spanning full width */}
      {hasHeader && (
        <div
          style={{
            position: "relative",
            zIndex: 2,
            height: headerHeight,
            padding: "0 80px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {eyebrow && (
            <span
              className={animate ? "anim-fade-up anim-d-0" : ""}
              style={{
                display: "block",
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 11,
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
            className={animate ? "anim-fade-up anim-d-1" : ""}
            style={{
              fontFamily: '"Dela Gothic One", sans-serif',
              fontSize: 36,
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
        </div>
      )}

      {/* Two-panel comparison area */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          height: imageHeight,
          zIndex: 1,
        }}
      >
        {/* Left half */}
        <div
          className={animate ? "anim-slide-left anim-d-1" : ""}
          style={{
            width: 640,
            height: "100%",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#111111",
          }}
        >
          {/* Label */}
          <span
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              zIndex: 3,
              display: "inline-block",
              padding: "4px 10px",
              border: "1px solid #FFFFFF",
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              backgroundColor: "rgba(10,10,10,0.6)",
            }}
          >
            {left_label}
          </span>

          {/* Image */}
          {left_image_url ? (
            <PositionedImage
              src={left_image_url}
              alt={left_image_alt}
              position={left_image_position}
              style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
            />
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

          {/* Blue overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(45,45,255,0.15)",
              mixBlendMode: "multiply",
              zIndex: 1,
            }}
          />

          {/* Points */}
          {left_points && left_points.length > 0 && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "rgba(10,10,10,0.85)",
                padding: "12px 16px",
                zIndex: 3,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {left_points.map((point, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: 12,
                    color: "#8C8C8C",
                    lineHeight: 1.5,
                  }}
                >
                  {point}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Center divider */}
        {divider_style === "line" && (
          <div
            style={{
              width: 1,
              backgroundColor: "#FFFFFF",
              flexShrink: 0,
              zIndex: 4,
            }}
          />
        )}
        {divider_style === "vs" && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: hasHeader ? headerHeight : 0,
              bottom: 0,
              width: 0,
              zIndex: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                marginLeft: -24,
                backgroundColor: "#2D2DFF",
                border: "2px solid #FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: '"Dela Gothic One", sans-serif',
                fontSize: 16,
                fontWeight: 400,
                color: "#FFFFFF",
                textTransform: "uppercase",
              }}
            >
              VS
            </div>
          </div>
        )}
        {divider_style === "arrow" && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: hasHeader ? headerHeight : 0,
              bottom: 0,
              width: 0,
              zIndex: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                marginLeft: -16,
                fontFamily: '"Dela Gothic One", sans-serif',
                fontSize: 32,
                color: "#2D2DFF",
              }}
            >
              &rarr;
            </span>
          </div>
        )}

        {/* Right half */}
        <div
          className={animate ? "anim-slide-right anim-d-1" : ""}
          style={{
            width: 640,
            height: "100%",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#111111",
          }}
        >
          {/* Label */}
          <span
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 3,
              display: "inline-block",
              padding: "4px 10px",
              border: "1px solid #FFFFFF",
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              backgroundColor: "rgba(10,10,10,0.6)",
            }}
          >
            {right_label}
          </span>

          {/* Image */}
          {right_image_url ? (
            <PositionedImage
              src={right_image_url}
              alt={right_image_alt}
              position={right_image_position}
              style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
            />
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

          {/* Blue overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(45,45,255,0.15)",
              mixBlendMode: "multiply",
              zIndex: 1,
            }}
          />

          {/* Points */}
          {right_points && right_points.length > 0 && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "rgba(10,10,10,0.85)",
                padding: "12px 16px",
                zIndex: 3,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {right_points.map((point, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: 12,
                    color: "#8C8C8C",
                    lineHeight: 1.5,
                  }}
                >
                  {point}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* EDT logo watermark */}
      <img
        src="/images/edt-favicon.svg"
        alt="EDT"
        style={{
          position: "absolute",
          bottom: 36,
          right: 48,
          height: 28,
          opacity: 0.3,
          zIndex: 5,
        }}
      />
    </div>
  );
}
