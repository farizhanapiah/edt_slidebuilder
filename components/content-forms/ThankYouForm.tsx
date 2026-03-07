"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { ThankYouContent } from "@/types/slide";

interface Props {
  content: ThankYouContent;
  onChange: (updated: Partial<ThankYouContent>) => void;
}

export function ThankYouForm({ content, onChange }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Input label="Headline" value={content.headline} onChange={(e) => onChange({ headline: e.target.value })} placeholder="LET'S BUILD SOMETHING." />
      <Input label="Subheadline (optional)" value={content.subheadline ?? ""} onChange={(e) => onChange({ subheadline: e.target.value })} />
      <Select label="Background Color" value={content.background_color}
        onChange={(e) => onChange({ background_color: e.target.value as "black" | "blue" })}
        options={[{ value: "black", label: "Black (#0A0A0A)" }, { value: "blue", label: "Electric Blue (#2D2DFF)" }]} />
      <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.1)" }} />
      <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#555" }}>CONTACT INFO</span>
      <Input label="Name" value={content.contact_name ?? ""} onChange={(e) => onChange({ contact_name: e.target.value })} />
      <Input label="Title / Role" value={content.contact_title ?? ""} onChange={(e) => onChange({ contact_title: e.target.value })} />
      <Input label="Email" type="email" value={content.contact_email ?? ""} onChange={(e) => onChange({ contact_email: e.target.value })} />
      <Input label="Phone" value={content.contact_phone ?? ""} onChange={(e) => onChange({ contact_phone: e.target.value })} />
      <Input label="Website" value={content.website ?? ""} onChange={(e) => onChange({ website: e.target.value })} placeholder="weareedt.com" />
      <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
        <input type="checkbox" checked={content.show_logo} onChange={(e) => onChange({ show_logo: e.target.checked })} />
        <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8C8C8C" }}>Show EDT Logo</span>
      </label>
    </div>
  );
}
