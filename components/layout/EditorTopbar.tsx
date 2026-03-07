"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { Deck } from "@/types/deck";

interface EditorTopbarProps {
  deck: Deck;
  saveStatus: "saved" | "saving" | "unsaved";
  onTitleChange: (title: string) => void;
  onExportPdf: () => void;
  onOpenAi: () => void;
  canUndo?: boolean;
  onUndo?: () => void;
}

export function EditorTopbar({
  deck,
  saveStatus,
  onTitleChange,
  onExportPdf,
  onOpenAi,
  canUndo = false,
  onUndo,
}: EditorTopbarProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(deck.title);
  const [copyNotice, setCopyNotice] = useState("");

  function handleTitleBlur() {
    setEditingTitle(false);
    if (titleDraft.trim() && titleDraft !== deck.title) {
      onTitleChange(titleDraft.trim());
    }
  }

  function copyShareLink() {
    const url = `${window.location.origin}/share/${deck.share_token}`;
    navigator.clipboard.writeText(url);
    setCopyNotice("Copied!");
    setTimeout(() => setCopyNotice(""), 2000);
  }

  const saveColors = {
    saved: "#2D2DFF",
    saving: "#8C8C8C",
    unsaved: "#f59e0b",
  };

  return (
    <div
      style={{
        height: 52,
        backgroundColor: "#0A0A0A",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: 16,
        flexShrink: 0,
      }}
    >
      {/* Back */}
      <Link
        href="/dashboard"
        style={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#555",
          textDecoration: "none",
          flexShrink: 0,
        }}
      >
        ← BACK
      </Link>

      <div style={{ width: 1, height: 24, backgroundColor: "rgba(255,255,255,0.1)" }} />

      {/* Logo */}
      <Image src="/images/EDT-lockup-dark.svg" alt="EDT" width={80} height={18} style={{ opacity: 0.5 }} />

      {/* Deck title — editable */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {editingTitle ? (
          <input
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTitleBlur();
              if (e.key === "Escape") { setTitleDraft(deck.title); setEditingTitle(false); }
            }}
            autoFocus
            style={{
              backgroundColor: "transparent",
              border: "none",
              borderBottom: "1px solid #2D2DFF",
              color: "#FFFFFF",
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 14,
              fontWeight: 600,
              outline: "none",
              width: "100%",
              maxWidth: 400,
              padding: "2px 0",
            }}
          />
        ) : (
          <button
            onClick={() => setEditingTitle(true)}
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#FFFFFF",
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              padding: 0,
              textAlign: "left",
              maxWidth: 400,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title="Click to rename"
          >
            {deck.title}
          </button>
        )}
      </div>

      {/* Undo button — active when a slide deletion is pending */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo last deletion (⌘Z)"
        style={{
          backgroundColor: "transparent",
          border: `1px solid ${canUndo ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)"}`,
          color: canUndo ? "#FFFFFF" : "#333",
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          padding: "4px 10px",
          cursor: canUndo ? "pointer" : "not-allowed",
          borderRadius: 0,
          flexShrink: 0,
          transition: "all 0.15s",
        }}
      >
        ↩ UNDO
      </button>

      {/* Save status */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <div
          style={{
            width: 6,
            height: 6,
            backgroundColor: saveColors[saveStatus],
            borderRadius: saveStatus === "saved" ? "50%" : 0,
          }}
        />
        <span
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 11,
            color: saveColors[saveStatus],
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {saveStatus === "saved" ? "SAVED" : saveStatus === "saving" ? "SAVING..." : "UNSAVED"}
        </span>
      </div>

      <div style={{ width: 1, height: 24, backgroundColor: "rgba(255,255,255,0.1)" }} />

      {/* AI button */}
      <button
        onClick={onOpenAi}
        style={{
          backgroundColor: "transparent",
          border: "1px solid #2D2DFF",
          color: "#2D2DFF",
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          padding: "5px 12px",
          cursor: "pointer",
          borderRadius: 0,
          flexShrink: 0,
        }}
      >
        AI →
      </button>

      {/* Share */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {copyNotice && (
          <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 11, color: "#2D2DFF" }}>
            {copyNotice}
          </span>
        )}
        <Button variant="secondary" size="sm" onClick={copyShareLink}>
          SHARE
        </Button>
      </div>

      {/* Export PDF */}
      <Button variant="primary" size="sm" onClick={onExportPdf} arrow>
        EXPORT PDF
      </Button>
    </div>
  );
}
