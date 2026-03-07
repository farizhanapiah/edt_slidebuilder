"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { ImageGalleryContent, GalleryImage, GalleryMode, TiledLayout } from "@/types/slide";

interface Props {
  content: ImageGalleryContent;
  onChange: (updated: Partial<ImageGalleryContent>) => void;
  onUploadImage?: (file: File) => Promise<string>;
}

const GALLERY_MODE_OPTIONS: { value: GalleryMode; label: string; desc: string }[] = [
  { value: "carousel",    label: "Carousel",     desc: "One image at a time with navigation" },
  { value: "tiled",       label: "Tiled Grid",   desc: "All images in a fixed grid layout" },
  { value: "album_flow",  label: "Album Flow",   desc: "Large featured image + thumbnails (Apple style)" },
];

const TILED_LAYOUT_OPTIONS: { value: TiledLayout; label: string }[] = [
  { value: "2x2",  label: "2 × 2 grid" },
  { value: "2x3",  label: "2 rows, 3 columns" },
  { value: "3x2",  label: "3 rows, 2 columns" },
  { value: "1+2",  label: "1 large + 2 stacked (right)" },
  { value: "1+3",  label: "1 large + 3 stacked (right)" },
];

const labelStyle: React.CSSProperties = {
  fontFamily: '"Space Grotesk", sans-serif',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#8C8C8C",
};

export function ImageGalleryForm({ content, onChange, onUploadImage }: Props) {
  function updateImage(i: number, updates: Partial<GalleryImage>) {
    const images = [...content.images];
    images[i] = { ...images[i], ...updates };
    onChange({ images });
  }

  function addImage() {
    onChange({ images: [...content.images, { url: "", alt: "", caption: "" }] });
  }

  function removeImage(i: number) {
    onChange({ images: content.images.filter((_, idx) => idx !== i) });
  }

  function moveImage(i: number, direction: -1 | 1) {
    const images = [...content.images];
    const j = i + direction;
    if (j < 0 || j >= images.length) return;
    [images[i], images[j]] = [images[j], images[i]];
    onChange({ images });
  }

  async function handleUpload(i: number, file: File) {
    if (!onUploadImage) return;
    const url = await onUploadImage(file);
    updateImage(i, { url });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <Input
        label="Eyebrow (optional)"
        value={content.eyebrow ?? ""}
        onChange={(e) => onChange({ eyebrow: e.target.value })}
        placeholder="INSPIRATION BOARD"
      />
      <Input
        label="Headline (optional)"
        value={content.headline ?? ""}
        onChange={(e) => onChange({ headline: e.target.value })}
        placeholder="VISUAL REFERENCES"
      />

      {/* Gallery mode */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={labelStyle}>DISPLAY MODE</span>
        {GALLERY_MODE_OPTIONS.map((opt) => (
          <label
            key={opt.value}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 10px",
              border: `1px solid ${content.mode === opt.value ? "#2D2DFF" : "rgba(255,255,255,0.08)"}`,
              backgroundColor: content.mode === opt.value ? "rgba(45,45,255,0.12)" : "transparent",
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name="gallery_mode"
              value={opt.value}
              checked={content.mode === opt.value}
              onChange={() => onChange({ mode: opt.value })}
              style={{ accentColor: "#2D2DFF" }}
            />
            <div>
              <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 12, fontWeight: 600, color: "#FFFFFF" }}>
                {opt.label}
              </div>
              <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, color: "#8C8C8C" }}>
                {opt.desc}
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* Tiled layout (only when mode = tiled) */}
      {content.mode === "tiled" && (
        <Select
          label="Grid layout"
          value={content.tiled_layout}
          onChange={(e) => onChange({ tiled_layout: e.target.value as TiledLayout })}
          options={TILED_LAYOUT_OPTIONS}
        />
      )}

      {/* Background */}
      <Select
        label="Background color"
        value={content.background_color}
        onChange={(e) => onChange({ background_color: e.target.value as "black" | "blue" })}
        options={[
          { value: "black", label: "Black" },
          { value: "blue",  label: "Electric Blue" },
        ]}
      />

      {/* Show captions */}
      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={content.show_captions}
          onChange={(e) => onChange({ show_captions: e.target.checked })}
          style={{ accentColor: "#2D2DFF" }}
        />
        <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 13, color: "#CCCCCC" }}>
          Show image captions
        </span>
      </label>

      {/* Images */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <span style={labelStyle}>IMAGES ({content.images.length})</span>
        {content.images.map((img, i) => (
          <div
            key={i}
            style={{ border: "1px solid rgba(255,255,255,0.1)", padding: 12, display: "flex", flexDirection: "column", gap: 10 }}
          >
            {/* Controls */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 4 }}>
                <button
                  onClick={() => moveImage(i, -1)}
                  disabled={i === 0}
                  style={{ backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: i === 0 ? "#333" : "#8C8C8C", cursor: i === 0 ? "default" : "pointer", padding: "2px 7px", fontSize: 12 }}
                >
                  ↑
                </button>
                <button
                  onClick={() => moveImage(i, 1)}
                  disabled={i === content.images.length - 1}
                  style={{ backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: i === content.images.length - 1 ? "#333" : "#8C8C8C", cursor: i === content.images.length - 1 ? "default" : "pointer", padding: "2px 7px", fontSize: 12 }}
                >
                  ↓
                </button>
                <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, color: "#555", paddingLeft: 4, lineHeight: "24px" }}>
                  IMG {i + 1}
                </span>
              </div>
              <button
                onClick={() => removeImage(i)}
                style={{ backgroundColor: "transparent", border: "none", color: "#555", cursor: "pointer", fontSize: 14, padding: 0 }}
              >
                ✕
              </button>
            </div>

            {/* Preview thumbnail */}
            {img.url && (
              <div
                style={{
                  width: "100%",
                  height: 80,
                  overflow: "hidden",
                  backgroundColor: "#111",
                  position: "relative",
                }}
              >
                <img
                  src={img.url}
                  alt={img.alt || ""}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            )}

            {/* Upload */}
            {onUploadImage && (
              <label style={{ cursor: "pointer" }}>
                <div
                  style={{
                    border: "1px solid rgba(255,255,255,0.15)",
                    padding: "6px 12px",
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#8C8C8C",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  {img.url ? "REPLACE IMAGE" : "UPLOAD IMAGE"}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(i, file);
                  }}
                />
              </label>
            )}

            {/* URL fallback */}
            <Input
              label="Or paste image URL"
              value={img.url}
              onChange={(e) => updateImage(i, { url: e.target.value })}
              placeholder="https://..."
            />

            <Input
              label="Alt text"
              value={img.alt}
              onChange={(e) => updateImage(i, { alt: e.target.value })}
              placeholder="Describe the image"
            />

            {content.show_captions && (
              <Input
                label="Caption"
                value={img.caption ?? ""}
                onChange={(e) => updateImage(i, { caption: e.target.value })}
                placeholder="Photo credit or description"
              />
            )}
          </div>
        ))}
        <Button variant="secondary" size="sm" onClick={addImage}>+ ADD IMAGE</Button>
      </div>
    </div>
  );
}
