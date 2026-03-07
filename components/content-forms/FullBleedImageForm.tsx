"use client";

import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { FullBleedImageContent } from "@/types/slide";

interface Props {
  content: FullBleedImageContent;
  onChange: (updated: Partial<FullBleedImageContent>) => void;
  onUploadImage?: (file: File) => Promise<string>;
}

export function FullBleedImageForm({ content, onChange, onUploadImage }: Props) {
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !onUploadImage) return;
    const url = await onUploadImage(file);
    onChange({ image_url: url });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Input label="Image URL" value={content.image_url} onChange={(e) => onChange({ image_url: e.target.value })} placeholder="https://..." />
        {onUploadImage && (
          <label style={{ cursor: "pointer", display: "inline-block" }}>
            <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#2D2DFF", textDecoration: "underline" }}>
              OR UPLOAD IMAGE
            </span>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
          </label>
        )}
      </div>
      <Input label="Image Alt Text" value={content.image_alt} onChange={(e) => onChange({ image_alt: e.target.value })} />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8C8C8C" }}>
          Overlay Opacity: {content.overlay_opacity}%
        </label>
        <input type="range" min={20} max={90} value={content.overlay_opacity} onChange={(e) => onChange({ overlay_opacity: Number(e.target.value) })} style={{ width: "100%", accentColor: "#2D2DFF" }} />
      </div>
      <Input label="Headline (optional)" value={content.headline ?? ""} onChange={(e) => onChange({ headline: e.target.value })} />
      <Input label="Subtext (optional)" value={content.subtext ?? ""} onChange={(e) => onChange({ subtext: e.target.value })} />
      <Select
        label="Text Position"
        value={content.text_position}
        onChange={(e) => onChange({ text_position: e.target.value as FullBleedImageContent["text_position"] })}
        options={[
          { value: "bottom-left", label: "Bottom Left" },
          { value: "top-left", label: "Top Left" },
          { value: "center", label: "Center" },
          { value: "bottom-right", label: "Bottom Right" },
        ]}
      />
      <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
        <input type="checkbox" checked={content.show_scan_lines} onChange={(e) => onChange({ show_scan_lines: e.target.checked })} />
        <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8C8C8C" }}>
          Scan Lines Effect
        </span>
      </label>
    </div>
  );
}
