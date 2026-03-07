"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { StatsContent, StatItem } from "@/types/slide";

interface Props {
  content: StatsContent;
  onChange: (updated: Partial<StatsContent>) => void;
}

export function StatsForm({ content, onChange }: Props) {
  function updateStat(i: number, updates: Partial<StatItem>) {
    const stats = [...content.stats];
    stats[i] = { ...stats[i], ...updates };
    onChange({ stats });
  }

  function addStat() {
    onChange({ stats: [...content.stats, { value: "—", label: "METRIC", window_title: "STAT.EXE" }] });
  }

  function removeStat(i: number) {
    onChange({ stats: content.stats.filter((_, idx) => idx !== i) });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Input label="Slide Headline (optional)" value={content.headline ?? ""} onChange={(e) => onChange({ headline: e.target.value })} />
      <Select
        label="Columns"
        value={String(content.columns)}
        onChange={(e) => onChange({ columns: Number(e.target.value) as 2 | 3 | 4 })}
        options={[{ value: "2", label: "2 Columns" }, { value: "3", label: "3 Columns" }, { value: "4", label: "4 Columns" }]}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8C8C8C" }}>
          STAT CARDS
        </span>
        {content.stats.map((stat, i) => (
          <div key={i} style={{ border: "1px solid rgba(255,255,255,0.1)", padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, color: "#555" }}>CARD {i + 1}</span>
              <button onClick={() => removeStat(i)} style={{ backgroundColor: "transparent", border: "none", color: "#555", cursor: "pointer", fontSize: 14, padding: 0 }}>✕</button>
            </div>
            <Input label="Window Title" value={stat.window_title} onChange={(e) => updateStat(i, { window_title: e.target.value })} placeholder="METAHRISE.EXE" />
            <Input label="Value" value={stat.value} onChange={(e) => updateStat(i, { value: e.target.value })} placeholder="52,417" />
            <Input label="Label" value={stat.label} onChange={(e) => updateStat(i, { label: e.target.value })} placeholder="AR IMPRESSIONS" />
          </div>
        ))}
        {content.stats.length < 4 && (
          <Button variant="secondary" size="sm" onClick={addStat}>+ ADD STAT</Button>
        )}
      </div>
    </div>
  );
}
