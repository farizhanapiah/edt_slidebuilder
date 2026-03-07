"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { WindowChrome } from "@/components/ui/WindowChrome";
import type { Deck } from "@/types/deck";
import type { Slide, SlideContent } from "@/types/slide";
import type { SuggestedStructureItem } from "@/types/api";

type Tab = "generate" | "rewrite" | "structure";

interface AiAssistantPanelProps {
  deck: Deck;
  slides: Slide[];
  activeSlide: Slide | null;
  onDeckGenerated: (slides: Slide[]) => void;
  onSlideRewritten: (slide: Slide) => void;
  onClose: () => void;
}

export function AiAssistantPanel({
  deck,
  slides,
  activeSlide,
  onDeckGenerated,
  onSlideRewritten,
  onClose,
}: AiAssistantPanelProps) {
  const [tab, setTab] = useState<Tab>("generate");
  const [brief, setBrief] = useState("");
  const [rewriteInstruction, setRewriteInstruction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestedStructureItem[]>([]);

  async function handleGenerate() {
    if (!brief.trim()) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate-deck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deck_id: deck.id,
          title: deck.title,
          client_name: deck.client_name,
          deck_type: deck.deck_type,
          brief,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const newSlides: Slide[] = await res.json();
      onDeckGenerated(newSlides);
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI error");
    } finally {
      setLoading(false);
    }
  }

  async function handleRewrite() {
    if (!activeSlide) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/rewrite-slide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slide: activeSlide,
          instruction: rewriteInstruction || undefined,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const updated: Slide = await res.json();
      onSlideRewritten(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSuggestStructure() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/suggest-structure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deck_id: deck.id }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const data = await res.json();
      setSuggestions(data.suggestions);
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI error");
    } finally {
      setLoading(false);
    }
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: "generate", label: "GENERATE" },
    { id: "rewrite", label: "REWRITE" },
    { id: "structure", label: "STRUCTURE" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: 380,
        zIndex: 40,
        boxShadow: "-4px 0 32px rgba(0,0,0,0.5)",
      }}
    >
      <WindowChrome title="CLAUDE_AI.EXE" titleBarColor="blue" showControls className="h-full">
        <div
          style={{
            backgroundColor: "#0D0D0D",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Tab bar */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  flex: 1,
                  padding: "10px 4px",
                  backgroundColor: tab === t.id ? "rgba(45,45,255,0.15)" : "transparent",
                  border: "none",
                  borderBottom: `2px solid ${tab === t.id ? "#2D2DFF" : "transparent"}`,
                  color: tab === t.id ? "#FFFFFF" : "#555",
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                {t.label}
              </button>
            ))}
            <button
              onClick={onClose}
              style={{
                padding: "10px 14px",
                backgroundColor: "transparent",
                border: "none",
                color: "#555",
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              ✕
            </button>
          </div>

          {/* Panel content */}
          <div style={{ flex: 1, overflow: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            {tab === "generate" && (
              <>
                <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 13, color: "#8C8C8C", margin: 0, lineHeight: 1.6 }}>
                  Describe the deck's purpose and Claude will generate all slides with copy.
                </p>
                <Textarea
                  label="Brief"
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  placeholder={`e.g. "Create a pitch deck for MetaHRise, EDT's VR onboarding product. The client is MCMC. Key results: 145 employees onboarded, 4.8/5 rating, Malaysia Book of Records."`}
                  style={{ minHeight: 140 }}
                />
                <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, color: "#555", margin: 0 }}>
                  ⚠️ This will replace all existing slides in this deck.
                </p>
                <Button variant="primary" disabled={loading || !brief.trim()} onClick={handleGenerate} arrow className="w-full justify-center">
                  {loading ? "GENERATING..." : "GENERATE DECK"}
                </Button>
              </>
            )}

            {tab === "rewrite" && (
              <>
                {!activeSlide ? (
                  <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 13, color: "#555", margin: 0 }}>
                    Select a slide in the editor first.
                  </p>
                ) : (
                  <>
                    <div style={{ border: "1px solid rgba(45,45,255,0.3)", padding: 12, backgroundColor: "rgba(45,45,255,0.06)" }}>
                      <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, fontWeight: 600, color: "#2D2DFF", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        Active: {activeSlide.layout_type.replace("_", " ")}
                      </span>
                    </div>
                    <Textarea
                      label="Instruction (optional)"
                      value={rewriteInstruction}
                      onChange={(e) => setRewriteInstruction(e.target.value)}
                      placeholder="e.g. Make the headline shorter and more punchy. Focus on the Malaysia Book of Records angle."
                    />
                    <Button variant="primary" disabled={loading} onClick={handleRewrite} arrow className="w-full justify-center">
                      {loading ? "REWRITING..." : "REWRITE SLIDE"}
                    </Button>
                  </>
                )}
              </>
            )}

            {tab === "structure" && (
              <>
                <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 13, color: "#8C8C8C", margin: 0, lineHeight: 1.6 }}>
                  Claude will analyse your {slides.length} slides and suggest a better narrative structure.
                </p>
                <Button variant="primary" disabled={loading || slides.length === 0} onClick={handleSuggestStructure} arrow className="w-full justify-center">
                  {loading ? "ANALYSING..." : "SUGGEST STRUCTURE"}
                </Button>

                {suggestions.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
                    <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8C8C8C" }}>
                      SUGGESTIONS
                    </span>
                    {suggestions.map((s, i) => (
                      <div key={i} style={{ border: "1px solid rgba(255,255,255,0.1)", padding: 12 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "baseline", marginBottom: 4 }}>
                          <span style={{
                            fontFamily: '"Space Grotesk", sans-serif',
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: s.action === "add" ? "#2D2DFF" : s.action === "remove" ? "#f87171" : "#8C8C8C",
                            border: "1px solid currentColor",
                            padding: "1px 5px",
                          }}>
                            {s.action.toUpperCase()}
                          </span>
                          <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, color: "#555", letterSpacing: "0.04em" }}>
                            POS {s.new_position + 1}
                            {s.layout_type ? ` — ${s.layout_type.replace("_", " ")}` : ""}
                          </span>
                        </div>
                        <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 12, color: "#CCCCCC", margin: 0, lineHeight: 1.5 }}>
                          {s.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {error && (
              <p style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 12, color: "#f87171", margin: 0, padding: "8px 12px", border: "1px solid rgba(248,113,113,0.3)" }}>
                {error}
              </p>
            )}
          </div>
        </div>
      </WindowChrome>
    </div>
  );
}
