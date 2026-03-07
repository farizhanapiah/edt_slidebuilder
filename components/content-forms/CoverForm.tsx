"use client";

import { Input, Textarea } from "@/components/ui/Input";
import type { CoverContent } from "@/types/slide";

interface Props {
  content: CoverContent;
  onChange: (updated: Partial<CoverContent>) => void;
}

export function CoverForm({ content, onChange }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Input label="Eyebrow" value={content.eyebrow} onChange={(e) => onChange({ eyebrow: e.target.value })} placeholder="PITCH DECK · 2026" />
      <Input label="Headline" value={content.headline} onChange={(e) => onChange({ headline: e.target.value })} placeholder="YOUR PROJECT TITLE" />
      <Textarea label="Subheadline" value={content.subheadline} onChange={(e) => onChange({ subheadline: e.target.value })} placeholder="One line description" />
      <Input label="Client Name" value={content.client_name} onChange={(e) => onChange({ client_name: e.target.value })} />
      <Input label="Deck Type Label" value={content.deck_type_label} onChange={(e) => onChange({ deck_type_label: e.target.value })} placeholder="PITCH DECK" />
      <Input label="Background Image URL" value={content.background_image_url ?? ""} onChange={(e) => onChange({ background_image_url: e.target.value })} placeholder="https://..." />
      <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
        <input type="checkbox" checked={content.show_logo} onChange={(e) => onChange({ show_logo: e.target.checked })} />
        <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8C8C8C" }}>
          Show EDT Logo
        </span>
      </label>
    </div>
  );
}
