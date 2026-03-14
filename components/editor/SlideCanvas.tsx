"use client";

import { useRef, useEffect, useState } from "react";
import { SlideRenderer } from "@/components/slides/SlideRenderer";
import type { Slide } from "@/types/slide";

interface SlideCanvasProps {
  slide: Slide | null;
}

const SLIDE_W = 1280;
const SLIDE_H = 720;

export function SlideCanvas({ slide }: SlideCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);

  useEffect(() => {
    function updateScale() {
      if (!containerRef.current) return;
      const { width } = containerRef.current.getBoundingClientRect();
      const padding = 64;
      setScale((width - padding) / SLIDE_W);
    }
    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        backgroundColor: "#161616",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        minHeight: 0,
      }}
    >
      {/* Subtle dot grid background for editor */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          pointerEvents: "none",
        }}
      />

      {slide ? (
        <div
          style={{
            position: "relative",
            width: SLIDE_W * scale,
            height: SLIDE_H * scale,
            boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 24px 64px rgba(0,0,0,0.5)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: SLIDE_W,
              height: SLIDE_H,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              pointerEvents: "none",
            }}
          >
            <div key={slide.id} className="canvas-slide-enter">
              <SlideRenderer slide={slide} />
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 13,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#333",
          }}
        >
          SELECT A SLIDE
        </div>
      )}
    </div>
  );
}
