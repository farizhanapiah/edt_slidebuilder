"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { IconGridContent, IconGridItem } from "@/types/slide";

interface Props {
  content: IconGridContent;
  onChange: (updated: Partial<IconGridContent>) => void;
}

export function IconGridForm({ content, onChange }: Props) {
  function updateItem(i: number, updates: Partial<IconGridItem>) {
    const items = [...content.items];
    items[i] = { ...items[i], ...updates };
    onChange({ items });
  }

  function addItem() {
    onChange({ items: [...content.items, { icon: "⭐", label: "LABEL", description: "" }] });
  }

  function removeItem(i: number) {
    onChange({ items: content.items.filter((_, idx) => idx !== i) });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Input label="Eyebrow (optional)" value={content.eyebrow ?? ""} onChange={(e) => onChange({ eyebrow: e.target.value })} />
      <Input label="Headline" value={content.headline} onChange={(e) => onChange({ headline: e.target.value })} />
      <Select
        label="Columns"
        value={String(content.columns)}
        onChange={(e) => onChange({ columns: Number(e.target.value) as 2 | 3 | 4 })}
        options={[{ value: "2", label: "2 Columns" }, { value: "3", label: "3 Columns" }, { value: "4", label: "4 Columns" }]}
      />
      <Select
        label="Style"
        value={content.style}
        onChange={(e) => onChange({ style: e.target.value as "minimal" | "cards" | "window_chrome" })}
        options={[{ value: "minimal", label: "Minimal" }, { value: "cards", label: "Cards" }, { value: "window_chrome", label: "Window Chrome" }]}
      />
      <Select
        label="Background Color"
        value={content.background_color}
        onChange={(e) => onChange({ background_color: e.target.value as "black" | "blue" })}
        options={[{ value: "black", label: "Black" }, { value: "blue", label: "Blue" }]}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8C8C8C" }}>
          GRID ITEMS
        </span>
        {content.items.map((item, i) => (
          <div key={i} style={{ border: "1px solid rgba(255,255,255,0.1)", padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, color: "#555" }}>ITEM {i + 1}</span>
              <button onClick={() => removeItem(i)} style={{ backgroundColor: "transparent", border: "none", color: "#555", cursor: "pointer", fontSize: 14, padding: 0 }}>✕</button>
            </div>
            <Input label="Icon (emoji)" value={item.icon} onChange={(e) => updateItem(i, { icon: e.target.value })} placeholder="🚀" />
            <Input label="Label" value={item.label} onChange={(e) => updateItem(i, { label: e.target.value })} placeholder="FEATURE" />
            <Input label="Description (optional)" value={item.description ?? ""} onChange={(e) => updateItem(i, { description: e.target.value })} placeholder="Short description..." />
          </div>
        ))}
        {content.items.length < 12 && (
          <Button variant="secondary" size="sm" onClick={addItem}>+ ADD ITEM</Button>
        )}
      </div>
    </div>
  );
}
