"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ImageAdjuster } from "@/components/editor/ImageAdjuster";
import type { ComparisonContent, ImagePosition } from "@/types/slide";

interface Props {
  content: ComparisonContent;
  onChange: (updated: Partial<ComparisonContent>) => void;
  onUploadImage: (file: File) => Promise<string>;
}

export function ComparisonForm({ content, onChange, onUploadImage }: Props) {
  async function handleLeftFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await onUploadImage(file);
    onChange({ left_image_url: url });
  }

  async function handleRightFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await onUploadImage(file);
    onChange({ right_image_url: url });
  }

  function updateLeftPoint(i: number, value: string) {
    const points = [...(content.left_points ?? [])];
    points[i] = value;
    onChange({ left_points: points });
  }

  function addLeftPoint() {
    onChange({ left_points: [...(content.left_points ?? []), ""] });
  }

  function removeLeftPoint(i: number) {
    onChange({ left_points: (content.left_points ?? []).filter((_, idx) => idx !== i) });
  }

  function updateRightPoint(i: number, value: string) {
    const points = [...(content.right_points ?? [])];
    points[i] = value;
    onChange({ right_points: points });
  }

  function addRightPoint() {
    onChange({ right_points: [...(content.right_points ?? []), ""] });
  }

  function removeRightPoint(i: number) {
    onChange({ right_points: (content.right_points ?? []).filter((_, idx) => idx !== i) });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Input label="Eyebrow (optional)" value={content.eyebrow ?? ""} onChange={(e) => onChange({ eyebrow: e.target.value })} />
      <Input label="Headline (optional)" value={content.headline ?? ""} onChange={(e) => onChange({ headline: e.target.value })} />
      <Select
        label="Divider Style"
        value={content.divider_style}
        onChange={(e) => onChange({ divider_style: e.target.value as "line" | "vs" | "arrow" })}
        options={[{ value: "line", label: "Line" }, { value: "vs", label: "VS Badge" }, { value: "arrow", label: "Arrow" }]}
      />

      {/* Left side */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8C8C8C" }}>
          LEFT SIDE
        </span>
        <Input label="Left Label" value={content.left_label} onChange={(e) => onChange({ left_label: e.target.value })} placeholder="BEFORE" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Input label="Left Image URL" value={content.left_image_url} onChange={(e) => onChange({ left_image_url: e.target.value })} placeholder="https://..." />
          <label style={{ cursor: "pointer", display: "inline-block" }}>
            <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#2D2DFF", textDecoration: "underline" }}>
              OR UPLOAD IMAGE
            </span>
            <input type="file" accept="image/*" onChange={handleLeftFileChange} style={{ display: "none" }} />
          </label>
        </div>
        <Input label="Left Image Alt Text" value={content.left_image_alt} onChange={(e) => onChange({ left_image_alt: e.target.value })} />
        {content.left_image_url && (
          <ImageAdjuster
            imageUrl={content.left_image_url}
            position={content.left_image_position}
            onChange={(pos: ImagePosition) => onChange({ left_image_position: pos })}
          />
        )}

        {/* Left points */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#555" }}>
            LEFT POINTS
          </span>
          {(content.left_points ?? []).map((point, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <Input value={point} onChange={(e) => updateLeftPoint(i, e.target.value)} placeholder="Point text..." />
              </div>
              <button onClick={() => removeLeftPoint(i)} style={{ backgroundColor: "transparent", border: "none", color: "#555", cursor: "pointer", fontSize: 14, padding: 0 }}>✕</button>
            </div>
          ))}
          <Button variant="secondary" size="sm" onClick={addLeftPoint}>+ ADD POINT</Button>
        </div>
      </div>

      {/* Right side */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8C8C8C" }}>
          RIGHT SIDE
        </span>
        <Input label="Right Label" value={content.right_label} onChange={(e) => onChange({ right_label: e.target.value })} placeholder="AFTER" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Input label="Right Image URL" value={content.right_image_url} onChange={(e) => onChange({ right_image_url: e.target.value })} placeholder="https://..." />
          <label style={{ cursor: "pointer", display: "inline-block" }}>
            <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#2D2DFF", textDecoration: "underline" }}>
              OR UPLOAD IMAGE
            </span>
            <input type="file" accept="image/*" onChange={handleRightFileChange} style={{ display: "none" }} />
          </label>
        </div>
        <Input label="Right Image Alt Text" value={content.right_image_alt} onChange={(e) => onChange({ right_image_alt: e.target.value })} />
        {content.right_image_url && (
          <ImageAdjuster
            imageUrl={content.right_image_url}
            position={content.right_image_position}
            onChange={(pos: ImagePosition) => onChange({ right_image_position: pos })}
          />
        )}

        {/* Right points */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#555" }}>
            RIGHT POINTS
          </span>
          {(content.right_points ?? []).map((point, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <Input value={point} onChange={(e) => updateRightPoint(i, e.target.value)} placeholder="Point text..." />
              </div>
              <button onClick={() => removeRightPoint(i)} style={{ backgroundColor: "transparent", border: "none", color: "#555", cursor: "pointer", fontSize: 14, padding: 0 }}>✕</button>
            </div>
          ))}
          <Button variant="secondary" size="sm" onClick={addRightPoint}>+ ADD POINT</Button>
        </div>
      </div>
    </div>
  );
}
