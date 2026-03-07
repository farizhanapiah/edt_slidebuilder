"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { TimelineContent, TimelineEvent } from "@/types/slide";

interface Props {
  content: TimelineContent;
  onChange: (updated: Partial<TimelineContent>) => void;
}

export function TimelineForm({ content, onChange }: Props) {
  function updateEvent(i: number, updates: Partial<TimelineEvent>) {
    const events = [...content.events];
    events[i] = { ...events[i], ...updates };
    onChange({ events });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Input label="Headline (optional)" value={content.headline ?? ""} onChange={(e) => onChange({ headline: e.target.value })} />
      <Select label="Orientation" value={content.orientation}
        onChange={(e) => onChange({ orientation: e.target.value as "horizontal" | "vertical" })}
        options={[{ value: "horizontal", label: "Horizontal" }, { value: "vertical", label: "Vertical" }]} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8C8C8C" }}>EVENTS</span>
        {content.events.map((event, i) => (
          <div key={i} style={{ border: "1px solid rgba(255,255,255,0.1)", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, color: "#555" }}>EVENT {i + 1}</span>
              <button onClick={() => onChange({ events: content.events.filter((_, idx) => idx !== i) })} style={{ backgroundColor: "transparent", border: "none", color: "#555", cursor: "pointer" }}>✕</button>
            </div>
            <Input label="Date / Phase" value={event.date} onChange={(e) => updateEvent(i, { date: e.target.value })} placeholder="PHASE 1" />
            <Input label="Title" value={event.title} onChange={(e) => updateEvent(i, { title: e.target.value })} />
            <Input label="Description (optional)" value={event.description ?? ""} onChange={(e) => updateEvent(i, { description: e.target.value })} />
            <label style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
              <input type="checkbox" checked={event.is_milestone} onChange={(e) => updateEvent(i, { is_milestone: e.target.checked })} />
              <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, color: "#8C8C8C", textTransform: "uppercase", letterSpacing: "0.06em" }}>Milestone</span>
            </label>
          </div>
        ))}
        {content.events.length < 8 && (
          <Button variant="secondary" size="sm" onClick={() => onChange({ events: [...content.events, { date: "", title: "", description: "", is_milestone: false }] })}>+ ADD EVENT</Button>
        )}
      </div>
    </div>
  );
}
