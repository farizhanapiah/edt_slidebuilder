"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { VideoContent } from "@/types/slide";

interface Props {
  content: VideoContent;
  onChange: (updated: Partial<VideoContent>) => void;
}

function detectType(url: string): string {
  if (!url) return "";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube detected";
  if (url.includes("vimeo.com")) return "Vimeo detected";
  if (url.match(/\.(mp4|webm|ogg)$/i)) return "Direct video file detected";
  return "URL format unrecognised";
}

const labelStyle: React.CSSProperties = {
  fontFamily: '"Space Grotesk", sans-serif',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#8C8C8C",
};

export function VideoForm({ content, onChange }: Props) {
  const typeHint = detectType(content.video_url);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* URL */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Input
          label="Video URL"
          value={content.video_url}
          onChange={(e) => onChange({ video_url: e.target.value })}
          placeholder="https://youtube.com/watch?v=... or Vimeo or .mp4"
        />
        {typeHint && (
          <span
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 11,
              color: typeHint.includes("detected") ? "#2D2DFF" : "#8C8C8C",
              letterSpacing: "0.06em",
            }}
          >
            {typeHint}
          </span>
        )}
        <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, color: "#555" }}>
          Supports YouTube, Vimeo, and direct .mp4 / .webm URLs
        </span>
      </div>

      {/* Headline */}
      <Input
        label="Headline (optional)"
        value={content.headline ?? ""}
        onChange={(e) => onChange({ headline: e.target.value })}
        placeholder="VIDEO TITLE"
      />

      {/* Caption */}
      <Input
        label="Caption (optional)"
        value={content.caption ?? ""}
        onChange={(e) => onChange({ caption: e.target.value })}
        placeholder="A brief description or credit"
      />

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

      {/* Toggles */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <span style={labelStyle}>PLAYBACK</span>
        {[
          { key: "show_controls", label: "Show player controls" },
          { key: "autoplay",      label: "Autoplay (muted)" },
        ].map(({ key, label }) => (
          <label key={key} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={!!content[key as keyof VideoContent]}
              onChange={(e) => onChange({ [key]: e.target.checked } as Partial<VideoContent>)}
              style={{ accentColor: "#2D2DFF" }}
            />
            <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 13, color: "#CCCCCC" }}>
              {label}
            </span>
          </label>
        ))}
      </div>

      {/* Info */}
      <div
        style={{
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "10px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <span style={{ ...labelStyle, fontSize: 10 }}>NOTE</span>
        <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 12, color: "#555", lineHeight: 1.5 }}>
          Video playback is interactive in the share/presentation view. The editor shows a static preview.
          PDF export shows a placeholder.
        </span>
      </div>
    </div>
  );
}
