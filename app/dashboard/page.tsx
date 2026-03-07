"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DeckCard } from "@/components/dashboard/DeckCard";
import { NewDeckModal } from "@/components/dashboard/NewDeckModal";
import { Button } from "@/components/ui/Button";
import { PixelGrid } from "@/components/ui/PixelGrid";
import type { Deck, DeckType } from "@/types/deck";

const FILTER_OPTIONS: { value: "all" | DeckType; label: string }[] = [
  { value: "all", label: "ALL" },
  { value: "pitch", label: "PITCH" },
  { value: "case_study", label: "CASE STUDY" },
  { value: "product", label: "PRODUCT" },
  { value: "recap", label: "RECAP" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [filter, setFilter] = useState<"all" | DeckType>("all");
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [copyNotice, setCopyNotice] = useState("");

  const fetchDecks = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/decks");
    if (res.ok) {
      const data = await res.json();
      setDecks(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this deck? This cannot be undone.")) return;
    await fetch(`/api/decks/${id}`, { method: "DELETE" });
    setDecks((prev) => prev.filter((d) => d.id !== id));
  }

  function handleCopyLink(shareToken: string) {
    const url = `${window.location.origin}/share/${shareToken}`;
    navigator.clipboard.writeText(url);
    setCopyNotice("Link copied!");
    setTimeout(() => setCopyNotice(""), 2000);
  }

  function handleCreate(deck: Deck) {
    setShowNewModal(false);
    router.push(`/decks/${deck.id}/edit`);
  }

  const filtered = filter === "all" ? decks : decks.filter((d) => d.deck_type === filter);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0A0A0A", position: "relative" }}>
      <PixelGrid opacity={0.04} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            padding: "32px 48px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#2D2DFF",
                margin: 0,
                marginBottom: 6,
              }}
            >
              EDT SLIDEBUILDER
            </p>
            <h1
              style={{
                fontFamily: '"Dela Gothic One", sans-serif',
                fontSize: 40,
                fontWeight: 400,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
                color: "#FFFFFF",
                margin: 0,
                lineHeight: 1,
              }}
            >
              DECKS
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {copyNotice && (
              <span
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 12,
                  color: "#2D2DFF",
                }}
              >
                {copyNotice}
              </span>
            )}
            <Button variant="primary" arrow onClick={() => setShowNewModal(true)}>
              NEW DECK
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div
          style={{
            padding: "16px 48px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            gap: 4,
          }}
        >
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              style={{
                padding: "6px 14px",
                backgroundColor: filter === opt.value ? "#2D2DFF" : "transparent",
                border: `1px solid ${filter === opt.value ? "#2D2DFF" : "rgba(255,255,255,0.15)"}`,
                color: filter === opt.value ? "#FFFFFF" : "#8C8C8C",
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: 0,
                transition: "all 0.15s",
              }}
            >
              {opt.label}
            </button>
          ))}

          <span
            style={{
              marginLeft: "auto",
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 12,
              color: "#555",
              alignSelf: "center",
            }}
          >
            {filtered.length} {filtered.length === 1 ? "deck" : "decks"}
          </span>
        </div>

        {/* Deck grid */}
        <div style={{ padding: "32px 48px" }}>
          {loading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 24,
              }}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    height: 280,
                    backgroundColor: "#111",
                    border: "1px solid rgba(255,255,255,0.06)",
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
              }}
            >
              <div
                style={{
                  fontFamily: '"Dela Gothic One", sans-serif',
                  fontSize: 64,
                  color: "rgba(255,255,255,0.05)",
                  lineHeight: 1,
                }}
              >
                0
              </div>
              <p
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 14,
                  color: "#555",
                  margin: 0,
                  letterSpacing: "0.04em",
                }}
              >
                {filter === "all" ? "No decks yet." : `No ${filter} decks.`}
              </p>
              <Button variant="primary" arrow onClick={() => setShowNewModal(true)}>
                CREATE FIRST DECK
              </Button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 24,
              }}
            >
              {filtered.map((deck) => (
                <DeckCard
                  key={deck.id}
                  deck={deck}
                  onDelete={handleDelete}
                  onCopyLink={handleCopyLink}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showNewModal && (
        <NewDeckModal onClose={() => setShowNewModal(false)} onCreate={handleCreate} />
      )}
    </div>
  );
}
