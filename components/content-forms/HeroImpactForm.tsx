"use client";

import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ImageAdjuster } from "@/components/editor/ImageAdjuster";
import type { HeroImpactContent, ImagePosition } from "@/types/slide";

interface Props {
  content: HeroImpactContent;
  onChange: (updated: Partial<HeroImpactContent>) => void;
  onUploadImage?: (file: File) => Promise<string>;
}

export function HeroImpactForm({ content, onChange, onUploadImage }: Props) {
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !onUploadImage) return;
    const url = await onUploadImage(file);
    onChange({ background_image_url: url });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Textarea
        label="Headline"
        value={content.headline}
        onChange={(e) => onChange({ headline: e.target.value })}
        placeholder="Main headline text (use \n for line breaks)"
        rows={3}
      />
      <Select
        label="Headline Size"
        value={content.headline_size}
        onChange={(e) => onChange({ headline_size: e.target.value as HeroImpactContent["headline_size"] })}
        options={[
          { value: "xl", label: "XL (120px)" },
          { value: "xxl", label: "XXL (160px)" },
        ]}
      />
      <Input
        label="Subtext (optional)"
        value={content.subtext ?? ""}
        onChange={(e) => onChange({ subtext: e.target.value })}
        placeholder="Supporting text below headline"
      />
      <Select
        label="Text Alignment"
        value={content.text_alignment}
        onChange={(e) => onChange({ text_alignment: e.target.value as HeroImpactContent["text_alignment"] })}
        options={[
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
          { value: "right", label: "Right" },
        ]}
      />

      <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={content.accent_bar}
          onChange={(e) => onChange({ accent_bar: e.target.checked })}
        />
        <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8C8C8C" }}>
          Accent Bar
        </span>
      </label>

      <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={content.show_logo}
          onChange={(e) => onChange({ show_logo: e.target.checked })}
        />
        <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8C8C8C" }}>
          Show EDT Logo
        </span>
      </label>

      {/* Background image */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Input
          label="Background Image URL"
          value={content.background_image_url}
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
