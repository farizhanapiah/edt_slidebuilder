"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { ContentListContent, ContentListItem } from "@/types/slide";

interface Props {
  content: ContentListContent;
  onChange: (updated: Partial<ContentListContent>) => void;
}

export function ContentListForm({ content, onChange }: Props) {
  function updateItem(i: number, updates: Partial<ContentListItem>) {
    const items = [...content.items];
    items[i] = { ...items[i], ...updates };
    onChange({ items });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Input label="Eyebrow (optional)" value={content.eyebrow ?? ""} onChange={(e) => onChange({ eyebrow: e.target.value })} />
      <Input label="Headline" value={content.headline} onChange={(e) => onChange({ headline: e.target.value })} />
      <Select label="Layout" value={content.layout} onChange={(e) => onChange({ layout: e.target.value as "single-column" | "two-column" })}
        options={[{ value: "single-column", label: "Single Column" }, { value: "two-column", label: "Two Columns" }]} />
      <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
        <input type="checkbox" checked={content.show_numbers} onChange={(e) => onChange({ show_numbers: e.target.checked })} />
        <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8C8C8C" }}>Numbered List</span>
      </label>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8C8C8C" }}>LIST ITEMS</span>
        {content.items.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <input type="checkbox" checked={!!item.highlight} onChange={(e) => updateItem(i, { highlight: e.target.checked })} title="Highlight" style={{ marginTop: 10, accentColor: "#2D2DFF" }} />
            <Input value={item.text} onChange={(e) => updateItem(i, { text: e.target.value })} placeholder={`Item ${i + 1}`} className="flex-1" />
            <button onClick={() => onChange({ items: content.items.filter((_, idx) => idx !== i) })} style={{ backgroundColor: "transparent", border: "none", color: "#555", cursor: "pointer", fontSize: 14, marginTop: 8 }}>✕</button>
          </div>
        ))}
        {content.items.length < 8 && (
          <Button variant="secondary" size="sm" onClick={() => onChange({ items: [...content.items, { text: "", highlight: false }] })}>+ ADD ITEM</Button>
        )}
      </div>
    </div>
  );
}
