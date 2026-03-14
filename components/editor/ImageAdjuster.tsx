"use client";

import { useRef, useState, useCallback } from "react";
import type { ImagePosition } from "@/types/slide";

interface Props {
  imageUrl: string;
  position: ImagePosition | undefined;
  onChange: (position: ImagePosition) => void;
}

const DEFAULT_POSITION: ImagePosition = { focal_x: 50, focal_y: 50, zoom: 1 };

export function ImageAdjuster({ imageUrl, position, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const pos = position ?? DEFAULT_POSITION;
  const focalX = pos.focal_x;
  const focalY = pos.focal_y;
  const zoom = pos.zoom;

  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

  const calcPosition = useCallback(
    (clientX: number, clientY: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const fx = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
      const fy = clamp(((clientY - rect.top) / rect.height) * 100, 0, 100);
      onChange({ focal_x: Math.round(fx * 10) / 10, focal_y: Math.round(fy * 10) / 10, zoom });
    },
    [onChange, zoom]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      calcPosition(e.clientX, e.clientY);
    },
    [calcPosition]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      calcPosition(e.clientX, e.clientY);
    },
    [isDragging, calcPosition]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Focal point label */}
      <label
        style={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#8C8C8C",
          marginBottom: -10,
        }}
      >
        FOCAL POINT
      </label>

      {/* Thumbnail preview with crosshair */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          width: 280,
          height: 160,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.1)",
          position: "relative",
          cursor: "crosshair",
          userSelect: "none",
        }}
      >
        {/* Image preview */}
        <img
          src={imageUrl}
          alt="Preview"
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: `${focalX}% ${focalY}%`,
            transform: zoom !== 1 ? `scale(${zoom})` : undefined,
            transformOrigin: `${focalX}% ${focalY}%`,
            pointerEvents: "none",
          }}
        />

        {/* Crosshair — horizontal line */}
        <div
          style={{
            position: "absolute",
            left: `calc(${focalX}% - 8px)`,
            top: `${focalY}%`,
            width: 16,
            height: 1,
            backgroundColor: "#2D2DFF",
            pointerEvents: "none",
          }}
        />

        {/* Crosshair — vertical line */}
        <div
          style={{
            position: "absolute",
            left: `${focalX}%`,
            top: `calc(${focalY}% - 8px)`,
            width: 1,
            height: 16,
            backgroundColor: "#2D2DFF",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Zoom control */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#8C8C8C",
          }}
        >
          ZOOM
        </label>
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          className="image-adjuster-range"
          onChange={(e) =>
            onChange({ focal_x: focalX, focal_y: focalY, zoom: Number(e.target.value) })
          }
          style={{
            width: 280,
            appearance: "none",
            WebkitAppearance: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        />
      </div>

      {/* Reset button */}
      <button
        onClick={() => onChange({ ...DEFAULT_POSITION })}
        style={{
          backgroundColor: "transparent",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#8C8C8C",
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          padding: "6px 12px",
          cursor: "pointer",
          width: "fit-content",
          borderRadius: 0,
        }}
      >
        RESET
      </button>

      {/* Range input styling */}
      <style>{`
        .image-adjuster-range::-webkit-slider-runnable-track {
          height: 2px;
          background: rgba(255,255,255,0.2);
        }
        .image-adjuster-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          background: #2D2DFF;
          margin-top: -5px;
          cursor: pointer;
        }
        .image-adjuster-range::-moz-range-track {
          height: 2px;
          background: rgba(255,255,255,0.2);
          border: none;
        }
        .image-adjuster-range::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: #2D2DFF;
          border: none;
          border-radius: 0;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
