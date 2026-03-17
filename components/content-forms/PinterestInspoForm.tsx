"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { PinterestInspoContent } from "@/types/slide";

interface Props {
  content: PinterestInspoContent;
  onChange: (updated: Partial<PinterestInspoContent>) => void;
}

const labelStyle: React.CSSProperties = {
  fontFamily: '"Space Grotesk", sans-serif',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#8C8C8C",
};

export function PinterestInspoForm({ content, onChange }: Props) {
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleImport() {
    if (!content.board_url.trim()) {
      setError("Enter a Pinterest board URL first");
      return;
    }

    setImporting(true);
    setError(null);

    try {
      const res = await fetch("/api/pinterest/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board_url: content.board_url }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Import failed");
        return;
      }

      onChange({ pins: data.pins });
    } catch {
      setError("Network error. Try again.");
    } finally {
      setImporting(false);
    }
  }

  function removePin(index: number) {
    onChange({ pins: content.pins.filter((_, i) => i !== index) });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header fields */}
      <Input
        label="Eyebrow (optional)"
        value={content.eyebrow ?? ""}
        onChange={(e) => onChange({ eyebrow: e.target.value })}
        placeholder="MOOD BOARD"
      />
      <Input
        label="Headline"
        value={content.headline}
        onChange={(e) => onChange({ headline: e.target.value })}
        placeholder="INSPIRATION"
      />

      {/* Pinterest board URL */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={labelStyle}>PINTEREST BOARD URL</span>
        <Input
          value={content.board_url}
          onChange={(e) => onChange({ board_url: e.target.value })}
          placeholder="https://www.pinterest.com/username/board-name/"
        />
        <Button
          variant="primary"
          size="sm"
          onClick={handleImport}
          disabled={importing || !content.board_url.trim()}
        >
          {importing
            ? "IMPORTING..."
            : content.pins.length > 0
              ? "RE-IMPORT BOARD"
              : "IMPORT BOARD"}
        </Button>
        {error && (
          <span
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 11,
              color: "#ef4444",
            }}
          >
            {error}
          </span>
        )}
        {importing && (
          <span
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 11,
              color: "#8C8C8C",
            }}
          >
            Loading Pinterest board with headless browser... This may take 5-10 seconds.
          </span>
        )}
      </div>

      {/* Background color */}
      <Select
        label="Background color"
        value={content.background_color}
        onChange={(e) =>
          onChange({ background_color: e.target.value as "black" | "blue" })
        }
        options={[
          { value: "black", label: "Black" },
          { value: "blue", label: "Electric Blue" },
        ]}
      />

      {/* Imported pins */}
      {content.pins.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={labelStyle}>IMPORTED PINS ({content.pins.length})</span>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 4,
            }}
          >
            {content.pins.map((pin, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  aspectRatio: "1",
                  overflow: "hidden",
                  backgroundColor: "#111",
                }}
              >
                <img
                  src={`/api/image-proxy?url=${encodeURIComponent(pin.image_url)}`}
                  alt={pin.title || `Pin ${i + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  loading="lazy"
                />
                <button
                  onClick={() => removePin(i)}
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    width: 18,
                    height: 18,
                    backgroundColor: "rgba(10,10,10,0.8)",
                    border: "none",
                    color: "#8C8C8C",
                    cursor: "pointer",
                    fontSize: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
