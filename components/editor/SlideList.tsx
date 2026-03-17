"use client";

import { SlideThumbnail } from "./SlideThumbnail";
import { Button } from "@/components/ui/Button";
import { LAYOUT_TYPE_LABELS, type LayoutType } from "@/types/slide";
import type { Slide } from "@/types/slide";
import { useState } from "react";

const LAYOUT_OPTIONS: LayoutType[] = [
  "cover", "section_divider", "hero_impact", "big_number",
  "stats", "text_image", "full_bleed_image", "comparison",
  "icon_grid", "team", "content_list", "quote", "timeline", "thank_you",
  "table", "chart", "video", "image_gallery", "pinterest_inspo",
];

interface SlideListProps {
  slides: Slide[];
  activeSlideId: string | null;
  onSelectSlide: (id: string) => void;
  onAddSlide: (layoutType: LayoutType) => void;
  onDeleteSlide: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export function SlideList({
  slides,
  activeSlideId,
  onSelectSlide,
  onAddSlide,
  onDeleteSlide,
  onReorder,
}: SlideListProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  function handleDragStart(e: React.DragEvent, index: number) {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dropIndex !== index) setDropIndex(index);
  }

  function handleDrop(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== index) {
      onReorder(dragIndex, index);
    }
    setDragIndex(null);
    setDropIndex(null);
  }

  function handleDragEnd() {
    setDragIndex(null);
    setDropIndex(null);
  }

  return (
    <div
      style={{
        width: 260,
        borderRight: "1px solid rgba(255,255,255,0.1)",
        backgroundColor: "#0D0D0D",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 12px 10px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#555",
          }}
        >
          SLIDES ({slides.length})
        </span>
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          style={{
            backgroundColor: showAddMenu ? "#2D2DFF" : "transparent",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.06em",
            padding: "3px 8px",
            cursor: "pointer",
            borderRadius: 0,
          }}
        >
          + ADD
        </button>
      </div>

      {/* Add slide menu */}
      {showAddMenu && (
        <div
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            backgroundColor: "#0A0A0A",
            padding: 8,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {LAYOUT_OPTIONS.map((lt) => (
            <button
              key={lt}
              onClick={() => {
                onAddSlide(lt);
                setShowAddMenu(false);
              }}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "#8C8C8C",
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                textAlign: "left",
                padding: "6px 10px",
                cursor: "pointer",
                borderRadius: 0,
                transition: "color 0.12s, background 0.12s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(45,45,255,0.15)";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#8C8C8C";
              }}
            >
              {LAYOUT_TYPE_LABELS[lt]}
            </button>
          ))}
        </div>
      )}

      {/* Slide list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            style={{
              opacity: dragIndex === index ? 0.35 : 1,
              transition: "opacity 0.12s",
              borderTop: dropIndex === index && dragIndex !== index
                ? "2px solid #2D2DFF"
                : "2px solid transparent",
              cursor: dragIndex !== null ? "grabbing" : "grab",
            }}
          >
            <SlideThumbnail
              slide={slide}
              index={index}
              isActive={slide.id === activeSlideId}
              onClick={() => onSelectSlide(slide.id)}
              onMoveUp={() => onReorder(index, index - 1)}
              onMoveDown={() => onReorder(index, index + 1)}
              onDelete={() => onDeleteSlide(slide.id)}
              isFirst={index === 0}
              isLast={index === slides.length - 1}
            />
          </div>
        ))}

        {slides.length === 0 && (
          <div
            style={{
              padding: "40px 16px",
              textAlign: "center",
              color: "#333",
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 12,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            NO SLIDES YET
          </div>
        )}
      </div>
    </div>
  );
}
