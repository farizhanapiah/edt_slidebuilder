"use client";

import Link from "next/link";
import { WindowChrome } from "@/components/ui/WindowChrome";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Deck } from "@/types/deck";
import { DECK_TYPE_LABELS } from "@/types/deck";

interface DeckCardProps {
  deck: Deck;
  onDelete: (id: string) => void;
  onCopyLink: (shareToken: string) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function DeckCard({ deck, onDelete, onCopyLink }: DeckCardProps) {
  return (
    <WindowChrome
      title={`${deck.title.toUpperCase()}.DEC`}
      titleBarColor="black"
      showControls
      className="hover:border-edt-blue transition-colors duration-150"
    >
      <div
        style={{
          backgroundColor: "#111111",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Thumbnail placeholder */}
        <div
          style={{
            height: 140,
            backgroundColor: "#0A0A0A",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* EDT monogram watermark */}
          <span
            style={{
              fontFamily: '"Dela Gothic One", sans-serif',
              fontSize: 80,
              color: "rgba(255,255,255,0.04)",
              userSelect: "none",
              lineHeight: 1,
            }}
          >
            EDT
          </span>
          {/* Type badge */}
          <div style={{ position: "absolute", top: 10, left: 10 }}>
            <Badge variant="blue">{DECK_TYPE_LABELS[deck.deck_type]}</Badge>
          </div>
          {/* Status badge */}
          {deck.status !== "draft" && (
            <div style={{ position: "absolute", top: 10, right: 10 }}>
              <Badge variant={deck.status === "published" ? "white" : "grey"}>
                {deck.status.toUpperCase()}
              </Badge>
            </div>
          )}
        </div>

        {/* Card content */}
        <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
          {/* Client name */}
          <span
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#8C8C8C",
            }}
          >
            {deck.client_name}
          </span>

          {/* Deck title */}
          <h3
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 16,
              fontWeight: 600,
              color: "#FFFFFF",
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            {deck.title}
          </h3>

          {/* Date */}
          <span
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 12,
              color: "#555",
            }}
          >
            Updated {formatDate(deck.updated_at)}
          </span>
        </div>

        {/* Actions */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "12px 20px",
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <Link href={`/decks/${deck.id}/edit`} style={{ flex: 1 }}>
            <Button variant="primary" size="sm" arrow className="w-full justify-center">
              EDIT
            </Button>
          </Link>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onCopyLink(deck.share_token)}
            title="Copy share link"
          >
            SHARE
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(deck.id)}
            title="Delete deck"
          >
            ✕
          </Button>
        </div>
      </div>
    </WindowChrome>
  );
}
