"use client";

import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ImageAdjuster } from "@/components/editor/ImageAdjuster";
import type { TextImageContent, ImagePosition } from "@/types/slide";

interface Props {
  content: TextImageContent;
  onChange: (updated: Partial<TextImageContent>) => void;
  onUploadImage?: (file: File) => Promise<string>;
}

export function TextImageForm({ content, onChange, onUploadImage }: Props) {
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !onUploadImage) return;
    const url = await onUploadImage(file);
    onChange({ image_url: url });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Input label="Eyebrow (optional)" value={content.eyebrow ?? ""} onChange={(e) => onChange({ eyebrow: e.target.value })} />
      <Input label="Headline" value={content.headline} onChange={(e) => onChange({ headline: e.target.value })} />
      <Textarea label="Body Copy" value={content.body} onChange={(e) => onChange({ body: e.target.value })} />
      <Select
        label="Image Side"
        value={content.image_side}
        onChange={(e) => onChange({ image_side: e.target.value as "left" | "right" })}
        options={[{ value: "right", label: "Right" }, { value: "left", label: "Left" }]}
      />
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
      <Input label="Image Caption (optional)" value={content.image_caption ?? ""} onChange={(e) => onChange({ image_caption: e.target.value })} />
      {content.image_url && (
        <ImageAdjuster
          imageUrl={content.image_url}
          position={content.image_position}
          onChange={(pos: ImagePosition) => onChange({ image_position: pos })}
        />
      )}
    </div>
  );
}
