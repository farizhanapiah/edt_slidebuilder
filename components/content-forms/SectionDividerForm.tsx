"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { SectionDividerContent } from "@/types/slide";

interface Props {
  content: SectionDividerContent;
  onChange: (updated: Partial<SectionDividerContent>) => void;
}

export function SectionDividerForm({ content, onChange }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Input label="Section Number" value={content.section_number} onChange={(e) => onChange({ section_number: e.target.value })} placeholder="01" />
      <Input label="Section Title" value={content.section_title} onChange={(e) => onChange({ section_title: e.target.value })} placeholder="THE CHALLENGE" />
      <Input label="Section Subtitle (optional)" value={content.section_subtitle ?? ""} onChange={(e) => onChange({ section_subtitle: e.target.value })} />
      <Select
        label="Background Color"
        value={content.background_color}
        onChange={(e) => onChange({ background_color: e.target.value as "black" | "blue" })}
        options={[{ value: "black", label: "Black (#0A0A0A)" }, { value: "blue", label: "Electric Blue (#2D2DFF)" }]}
      />
    </div>
  );
}
