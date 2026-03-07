"use client";

import { useState } from "react";
import { WindowChrome } from "@/components/ui/WindowChrome";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { Deck, DeckType } from "@/types/deck";

interface NewDeckModalProps {
  onClose: () => void;
  onCreate: (deck: Deck) => void;
}

const DECK_TYPE_OPTIONS = [
  { value: "pitch", label: "Pitch Deck" },
  { value: "case_study", label: "Case Study" },
  { value: "product", label: "Product" },
  { value: "recap", label: "Event Recap" },
];

export function NewDeckModal({ onClose, onCreate }: NewDeckModalProps) {
  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [deckType, setDeckType] = useState<DeckType>("pitch");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, client_name: clientName, deck_type: deckType }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create deck");
      }

      const deck: Deck = await res.json();
      onCreate(deck);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    /* Backdrop */
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.75)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ width: 480 }}>
        <WindowChrome title="NEW_DECK.EXE" titleBarColor="blue" showControls>
          <div style={{ backgroundColor: "#111", padding: "32px 28px" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <Input
                label="Deck Title"
                placeholder="MetaHRise VR Onboarding"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
              />
              <Input
                label="Client Name"
                placeholder="MCMC"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
              <Select
                label="Deck Type"
                options={DECK_TYPE_OPTIONS}
                value={deckType}
                onChange={(e) => setDeckType(e.target.value as DeckType)}
              />

              {error && (
                <p
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: 13,
                    color: "#f87171",
                    margin: 0,
                  }}
                >
                  {error}
                </p>
              )}

              <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading || !title.trim() || !clientName.trim()}
                  arrow
                  className="flex-1"
                >
                  {loading ? "CREATING..." : "CREATE DECK"}
                </Button>
                <Button type="button" variant="secondary" onClick={onClose}>
                  CANCEL
                </Button>
              </div>
            </form>
          </div>
        </WindowChrome>
      </div>
    </div>
  );
}
