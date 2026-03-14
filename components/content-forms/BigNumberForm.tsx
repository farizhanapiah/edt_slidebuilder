"use client";

import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ImageAdjuster } from "@/components/editor/ImageAdjuster";
import type { BigNumberContent, ImagePosition } from "@/types/slide";

interface Props {
  content: BigNumberContent;
  onChange: (updated: Partial<BigNumberContent>) => void;
  onUploadImage?: (file: File) => Promise<string>;
}

export function BigNumberForm({ content, onChange, onUploadImage }: Props) {
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !onUploadImage) return;
    const url = await onUploadImage(file);
    onChange({ background_image_url: url });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Input
        label="Eyebrow (optional)"
        value={content.eyebrow ?? ""}
        onChange={(e) => onChange({ eyebrow: e.target.value })}
        placeholder="e.g. Year over year"
      />
      <Input
        label="Number"
        value={content.number}
        onChange={(e) => onChange({ number: e.target.value })}
        placeholder="e.g. $2.4M, 96%, 24h"
      />
      <Input
        label="Label"
        value={content.label}
        onChange={(e) => onChange({ label: e.target.value })}
        placeholder="e.g. Revenue Growth"
      />
      <Textarea
        label="Context (optional)"
        value={content.context ?? ""}
        onChange={(e) => onChange({ context: e.target.value })}
        placeholder="Additional context or description"
        rows={2}
      />
      <Select
        label="Accent Color"
        value={content.accent_color}
        onChange={(e) => onChange({ accent_color: e.target.value as BigNumberContent["accent_color"] })}
        options={[
          { value: "blue", label: "Blue" },
          { value: "white", label: "White" },
        ]}
      />

      {/* Background image (optional) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Input
          label="Background Image URL (optional)"
          value={content.background_image_url ?? ""}
          onChange={(e) => onChange({ background_image_url: e.target.value })}
          placeholder="https://..."
        />
        {onUploadImage && (
          <label style={{ cursor: "pointer", display: "inline-block" }}>
            <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#2D2DFF", textDecoration: "underline" }}>
              OR UPLOAD IMAGE
            </span>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
          </label>
        )}
      </div>

      {content.background_image_url && (
        <ImageAdjuster
          imageUrl={content.background_image_url}
          position={content.image_position}
          onChange={(pos: ImagePosition) => onChange({ image_position: pos })}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8C8C8C" }}>
          Overlay Opacity: {content.overlay_opacity}%
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={content.overlay_opacity}
          onChange={(e) => onChange({ overlay_opacity: Number(e.target.value) })}
          style={{ width: "100%", accentColor: "#2D2DFF" }}
        />
      </div>
    </div>
  );
}
