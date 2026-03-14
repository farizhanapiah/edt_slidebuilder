"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ImageAdjuster } from "@/components/editor/ImageAdjuster";
import type { TeamContent, TeamMember, ImagePosition } from "@/types/slide";

interface Props {
  content: TeamContent;
  onChange: (updated: Partial<TeamContent>) => void;
  onUploadImage: (file: File) => Promise<string>;
}

export function TeamForm({ content, onChange, onUploadImage }: Props) {
  function updateMember(i: number, updates: Partial<TeamMember>) {
    const members = [...content.members];
    members[i] = { ...members[i], ...updates };
    onChange({ members });
  }

  function addMember() {
    onChange({
      members: [
        ...content.members,
        { name: "Name", title: "Title", image_url: "", image_alt: "" },
      ],
    });
  }

  function removeMember(i: number) {
    if (content.members.length <= 1) return;
    onChange({ members: content.members.filter((_, idx) => idx !== i) });
  }

  async function handleFileChange(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await onUploadImage(file);
    updateMember(i, { image_url: url });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Input
        label="Eyebrow (optional)"
        value={content.eyebrow ?? ""}
        onChange={(e) => onChange({ eyebrow: e.target.value })}
      />
      <Input
        label="Headline"
        value={content.headline}
        onChange={(e) => onChange({ headline: e.target.value })}
      />
      <Select
        label="Layout"
        value={content.layout}
        onChange={(e) => onChange({ layout: e.target.value as "grid" | "row" })}
        options={[
          { value: "grid", label: "Grid (2x2)" },
          { value: "row", label: "Row" },
        ]}
      />
      <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={content.show_window_chrome}
          onChange={(e) => onChange({ show_window_chrome: e.target.checked })}
        />
        <span
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#8C8C8C",
          }}
        >
          Window Chrome Frame
        </span>
      </label>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <span
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#8C8C8C",
          }}
        >
          TEAM MEMBERS
        </span>
        {content.members.map((member, i) => (
          <div
            key={i}
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
              padding: 14,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 11,
                  color: "#555",
                }}
              >
                MEMBER {i + 1}
              </span>
              {content.members.length > 1 && (
                <button
                  onClick={() => removeMember(i)}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#555",
                    cursor: "pointer",
                    fontSize: 14,
                    padding: 0,
                  }}
                >
                  ✕
                </button>
              )}
            </div>
            <Input
              label="Name"
              value={member.name}
              onChange={(e) => updateMember(i, { name: e.target.value })}
              placeholder="Jane Doe"
            />
            <Input
              label="Title"
              value={member.title}
              onChange={(e) => updateMember(i, { title: e.target.value })}
              placeholder="Creative Director"
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Input
                label="Image URL"
                value={member.image_url}
                onChange={(e) => updateMember(i, { image_url: e.target.value })}
                placeholder="https://..."
              />
              <label style={{ cursor: "pointer", display: "inline-block" }}>
                <span
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#2D2DFF",
                    textDecoration: "underline",
                  }}
                >
                  OR UPLOAD IMAGE
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(i, e)}
                  style={{ display: "none" }}
                />
              </label>
            </div>
            <Input
              label="Image Alt Text"
              value={member.image_alt}
              onChange={(e) => updateMember(i, { image_alt: e.target.value })}
              placeholder="Photo of Jane Doe"
            />
            {member.image_url && (
              <ImageAdjuster
                imageUrl={member.image_url}
                position={member.image_position}
                onChange={(pos: ImagePosition) => updateMember(i, { image_position: pos })}
              />
            )}
          </div>
        ))}
        {content.members.length < 4 && (
          <Button variant="secondary" size="sm" onClick={addMember}>
            + ADD MEMBER
          </Button>
        )}
      </div>
    </div>
  );
}
