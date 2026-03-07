"use client";

import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { QuoteContent } from "@/types/slide";

interface Props {
  content: QuoteContent;
  onChange: (updated: Partial<QuoteContent>) => void;
}

export function QuoteForm({ content, onChange }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Textarea label="Quote Text" value={content.quote_text} onChange={(e) => onChange({ quote_text: e.target.value })} />
      <Input label="Attribution (optional)" value={content.attribution ?? ""} onChange={(e) => onChange({ attribution: e.target.value })} placeholder="— Name, Title, Company" />
      <Input label="Context (optional)" value={content.context ?? ""} onChange={(e) => onChange({ context: e.target.value })} />
      <Select label="Background Color" value={content.background_color}
        onChange={(e) => onChange({ background_color: e.target.value as "blue" | "black" })}
        options={[{ value: "blue", label: "Electric Blue (#2D2DFF)" }, { value: "black", label: "Black (#0A0A0A)" }]} />
      <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
        <input type="checkbox" checked={content.show_quotation_mark} onChange={(e) => onChange({ show_quotation_mark: e.target.checked })} />
        <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8C8C8C" }}>Show Quotation Mark</span>
      </label>
    </div>
  );
}
