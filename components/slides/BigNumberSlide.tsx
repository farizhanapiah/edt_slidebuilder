"use client";

import { PositionedImage } from "@/components/ui/PositionedImage";
import { useCountUp } from "@/hooks/useCountUp";
import type { BigNumberContent } from "@/types/slide";

interface Props {
  content: BigNumberContent;
  isExport?: boolean;
}

export function BigNumberSlide({ content, isExport }: Props) {
  const { eyebrow, number, label, context, background_image_url, image_position, overlay_opacity, accent_color } = content;
  const animate = !isExport;
  const display = useCountUp(number, 1400, animate);
  const accentHex = accent_color === "blue" ? "#2D2DFF" : "#FFFFFF";

  return (
    <div
      className="slide-base"
      style={{ backgroundColor: "#0A0A0A", position: "relative" }}
    >
      {/* Background image (optional) */}
      {background_image_url ? (
        <>
          <PositionedImage
            src={background_image_url}
            alt=""
            position={image_position}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }}
          />
          {/* Dark overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: `rgba(10,10,10,${overlay_opacity / 100})`,
              zIndex: 1,
            }}
          />
        </>
      ) : null}

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

      {/* Centered content */}
      <div
        style={{
          position: "relative",
          zIndex: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          textAlign: "center",
        }}
      >
        {/* Eyebrow */}
        {eyebrow && (
          <div
            className={animate ? "anim-fade-up anim-d-1" : ""}
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: accentHex,
              marginBottom: 16,
            }}
          >
            {eyebrow}
          </div>
        )}

        {/* Big number */}
        <div
          className={animate ? "anim-scale-up anim-d-2" : ""}
          style={{
            fontFamily: '"Dela Gothic One", sans-serif',
            fontSize: 200,
            fontWeight: 400,
            textTransform: "uppercase",
            color: "#FFFFFF",
            lineHeight: 1,
            margin: 0,
          }}
        >
          {display}
        </div>

        {/* Label */}
        <div
          className={animate ? "anim-fade-up anim-d-4" : ""}
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 24,
            fontWeight: 400,
            color: "#8C8C8C",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginTop: 8,
          }}
        >
          {label}
        </div>

        {/* Context */}
        {context && (
          <p
            className={animate ? "anim-fade-up anim-d-5" : ""}
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 16,
              fontWeight: 400,
              color: "#8C8C8C",
              lineHeight: 1.6,
              maxWidth: 600,
              margin: "20px 0 0",
            }}
          >
            {context}
          </p>
        )}
      </div>

      {/* EDT logo watermark -- bottom right corner */}
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
