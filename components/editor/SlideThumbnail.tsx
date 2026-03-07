"use client";

import { useState } from "react";
import { SlideRenderer } from "@/components/slides/SlideRenderer";
import type { Slide } from "@/types/slide";
import { LAYOUT_TYPE_LABELS } from "@/types/slide";

const THUMB_W = 1280;
const THUMB_H = 720;
const SCALE = 0.155; // renders to ~198×112px

interface SlideThumbnailProps {
  slide: Slide;
  index: number;
  isActive: boolean;
  onClick: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function SlideThumbnail({
  slide,
  index,
  isActive,
  onClick,
  onMoveUp,
  onMoveDown,
  onDelete,
  isFirst,
  isLast,
}: SlideThumbnailProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        padding: "8px 12px",
        cursor: "pointer",
        backgroundColor: isActive ? "rgba(45,45,255,0.12)" : "transparent",
        borderLeft: isActive ? "2px solid #2D2DFF" : "2px solid transparent",
        transition: "all 0.12s",
      }}
    >
      {/* Slide number */}
      <span
        style={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: 10,
          fontWeight: 600,
          color: isActive ? "#2D2DFF" : "#555",
          flexShrink: 0,
          marginTop: 4,
          width: 16,
          textAlign: "right",
        }}
      >
        {index + 1}
      </span>

      {/* Thumbnail */}
      <div
        style={{
          width: THUMB_W * SCALE,
          height: THUMB_H * SCALE,
          overflow: "hidden",
          flexShrink: 0,
          border: `1px solid ${isActive ? "#2D2DFF" : "rgba(255,255,255,0.1)"}`,
          position: "relative",
        }}
      >
        <div
          style={{
            width: THUMB_W,
            height: THUMB_H,
            transform: `scale(${SCALE})`,
            transformOrigin: "top left",
            pointerEvents: "none",
          }}
        >
          <SlideRenderer slide={slide} />
        </div>

        {/* Delete overlay — appears on hover */}
        {hovered && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            title="Delete slide"
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              width: 20,
              height: 20,
              backgroundColor: "rgba(180,20,20,0.9)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              color: "#FFFFFF",
              fontSize: 10,
              fontWeight: 700,
              lineHeight: 1,
              padding: 0,
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Right: label + reorder controls */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
        <span
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: isActive ? "#FFFFFF" : "#8C8C8C",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {LAYOUT_TYPE_LABELS[slide.layout_type]}
        </span>

        {/* Reorder controls */}
        <div style={{ display: "flex", gap: 4 }}>
          {(["↑", "↓"] as const).map((icon, i) => {
            const handlers = [onMoveUp, onMoveDown];
            const disabled = (i === 0 && isFirst) || (i === 1 && isLast);
            return (
              <button
                key={icon}
                onClick={(e) => { e.stopPropagation(); if (!disabled) handlers[i](); }}
                disabled={disabled}
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: "transparent",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: disabled ? "#333" : "#8C8C8C",
                  fontSize: 10,
                  cursor: disabled ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 0,
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                {icon}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
