"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { SlideList } from "@/components/editor/SlideList";
import { SlideCanvas } from "@/components/editor/SlideCanvas";
import { ContentPanel } from "@/components/editor/ContentPanel";
import { EditorTopbar } from "@/components/layout/EditorTopbar";
import { AiAssistantPanel } from "@/components/editor/AiAssistantPanel";
import type { Deck } from "@/types/deck";
import type { Slide, LayoutType, SlideContent } from "@/types/slide";

type SaveStatus = "saved" | "saving" | "unsaved";

interface PendingDelete {
  slide: Slide;
  position: number;
  timer: NodeJS.Timeout;
}

export default function EditorPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [activeSlideId, setActiveSlideId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [aiOpen, setAiOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      const [deckRes, slidesRes] = await Promise.all([
        fetch(`/api/decks/${deckId}`),
        fetch(`/api/decks/${deckId}/slides`),
      ]);
      if (deckRes.ok) setDeck(await deckRes.json());
      if (slidesRes.ok) {
        const data: Slide[] = await slidesRes.json();
        setSlides(data);
        if (data.length > 0) setActiveSlideId(data[0].id);
      }
      setLoading(false);
    }
    fetchData();
  }, [deckId]);

  const activeSlide = slides.find((s) => s.id === activeSlideId) ?? null;

  // Debounced save for slide content
  function scheduleSlideUpdate(slideId: string, content: Partial<SlideContent>) {
    setSaveStatus("unsaved");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      setSaveStatus("saving");
      await fetch(`/api/decks/${deckId}/slides/${slideId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      setSaveStatus("saved");
    }, 600);
  }

  function handleSlideUpdate(slideId: string, partial: Partial<SlideContent>) {
    // Optimistic update
    setSlides((prev) =>
      prev.map((s) =>
        s.id === slideId
          ? { ...s, content: { ...s.content, ...partial } as SlideContent }
          : s
      )
    );
    scheduleSlideUpdate(slideId, partial);
  }

  async function handleAddSlide(layoutType: LayoutType) {
    const res = await fetch(`/api/decks/${deckId}/slides`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ layout_type: layoutType }),
    });
    if (res.ok) {
      const newSlide: Slide = await res.json();

      // Insert right after the currently active slide (not at end)
      const activeIndex = slides.findIndex((s) => s.id === activeSlideId);
      const insertAt = activeIndex >= 0 ? activeIndex + 1 : slides.length;
      const updated = [...slides];
      updated.splice(insertAt, 0, newSlide);
      setSlides(updated);
      setActiveSlideId(newSlide.id);

      // Persist new order if the slide wasn't naturally placed at the end
      if (insertAt < slides.length) {
        await fetch(`/api/decks/${deckId}/reorder`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ordered_ids: updated.map((s) => s.id) }),
        });
      }
    }
  }

  async function handleDeleteSlide(slideId: string) {
    // Flush any existing pending delete before starting a new one
    if (pendingDelete) {
      clearTimeout(pendingDelete.timer);
      await fetch(`/api/decks/${deckId}/slides/${pendingDelete.slide.id}`, { method: "DELETE" });
      setPendingDelete(null);
    }

    const position = slides.findIndex((s) => s.id === slideId);
    const slide = slides[position];
    const remaining = slides.filter((s) => s.id !== slideId);

    // Optimistically remove from UI immediately
    setSlides(remaining);
    if (activeSlideId === slideId) {
      setActiveSlideId(remaining[Math.min(position, remaining.length - 1)]?.id ?? null);
    }

    // Schedule the actual DB delete after 8 seconds (undo window)
    const timer = setTimeout(async () => {
      await fetch(`/api/decks/${deckId}/slides/${slideId}`, { method: "DELETE" });
      setPendingDelete(null);
    }, 8000);

    setPendingDelete({ slide, position, timer });
  }

  function handleUndo() {
    if (!pendingDelete) return;
    clearTimeout(pendingDelete.timer);
    const { slide, position } = pendingDelete;
    setSlides((prev) => {
      const updated = [...prev];
      updated.splice(position, 0, slide);
      return updated;
    });
    setActiveSlideId(slide.id);
    setPendingDelete(null);
  }

  // Cmd+Z / Ctrl+Z keyboard shortcut for undo
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingDelete]);

  async function handleReorder(fromIndex: number, toIndex: number) {
    if (toIndex < 0 || toIndex >= slides.length) return;
    const reordered = [...slides];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    setSlides(reordered);

    await fetch(`/api/decks/${deckId}/reorder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ordered_ids: reordered.map((s) => s.id) }),
    });
  }

  async function handleTitleChange(title: string) {
    setDeck((prev) => prev ? { ...prev, title } : prev);
    await fetch(`/api/decks/${deckId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
  }

  async function handleExportPdf() {
    const res = await fetch(`/api/export/${deckId}`);
    if (!res.ok) { alert("PDF export failed. Please try again."); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${deck?.title ?? "deck"}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleUploadImage(file: File, slideId: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("deckId", deckId);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? "Upload failed");
    const { url } = json;
    return url;
  }

  if (loading || !deck) {
    return (
      <div style={{ height: "100vh", backgroundColor: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontFamily: '"Space Grotesk", sans-serif', fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        LOADING...
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#0A0A0A", overflow: "hidden" }}>
      <EditorTopbar
        deck={deck}
        saveStatus={saveStatus}
        onTitleChange={handleTitleChange}
        onExportPdf={handleExportPdf}
        onOpenAi={() => setAiOpen(true)}
        canUndo={pendingDelete !== null}
        onUndo={handleUndo}
      />

      {/* Three-panel editor */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
        <SlideList
          slides={slides}
          activeSlideId={activeSlideId}
          onSelectSlide={setActiveSlideId}
          onAddSlide={handleAddSlide}
          onDeleteSlide={handleDeleteSlide}
          onReorder={handleReorder}
        />

        <SlideCanvas slide={activeSlide} />

        {activeSlide && (
          <ContentPanel
            slide={activeSlide}
            onUpdate={handleSlideUpdate}
            onUploadImage={handleUploadImage}
          />
        )}
      </div>

      {/* AI Panel overlay */}
      {aiOpen && (
        <AiAssistantPanel
          deck={deck}
          slides={slides}
          activeSlide={activeSlide}
          onDeckGenerated={(newSlides) => {
            setSlides(newSlides);
            setActiveSlideId(newSlides[0]?.id ?? null);
            setAiOpen(false);
          }}
          onSlideRewritten={(updated) => {
            setSlides((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
          }}
          onClose={() => setAiOpen(false)}
        />
      )}
    </div>
  );
}
