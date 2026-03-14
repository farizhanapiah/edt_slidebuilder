"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { SlideRenderer } from "@/components/slides/SlideRenderer";
import type { Deck } from "@/types/deck";
import type { Slide } from "@/types/slide";

const SLIDE_W = 1280;
const SLIDE_H = 720;

interface PublicDeckViewerProps {
  deck: Deck;
  slides: Slide[];
  shareToken?: string;
}

export function PublicDeckViewer({ deck, slides, shareToken }: PublicDeckViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [scale, setScale] = useState(1);
  const [animKey, setAnimKey] = useState(0);
  const [animDir, setAnimDir] = useState<"fwd" | "bwd">("fwd");
  const touchStartX = useRef(0);
  const total = slides.length;

  // Feedback form state
  const [fbName, setFbName] = useState("");
  const [fbEmail, setFbEmail] = useState("");
  const [fbRating, setFbRating] = useState(0);
  const [fbHover, setFbHover] = useState(0);
  const [fbComment, setFbComment] = useState("");
  const [fbSubmitting, setFbSubmitting] = useState(false);
  const [fbDone, setFbDone] = useState(false);
  const [fbError, setFbError] = useState("");

  const goTo = useCallback(
    (index: number) => {
      if (index >= total) {
        setShowFeedback(true);
        setAnimDir("fwd");
        setAnimKey((k) => k + 1);
        return;
      }
      if (index < 0) return;
      setAnimDir(index >= currentIndex ? "fwd" : "bwd");
      setAnimKey((k) => k + 1);
      setCurrentIndex(index);
      setShowFeedback(false);
    },
    [currentIndex, total]
  );

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (showFeedback) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        goTo(currentIndex + 1);
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goTo(currentIndex - 1);
      }
      if (e.key === "Home") goTo(0);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIndex, goTo, showFeedback]);

  // Responsive scaling
  useEffect(() => {
    function updateScale() {
      const vw = window.innerWidth;
      const vh = window.innerHeight - 56; // subtract navbar
      setScale(Math.min(vw / SLIDE_W, vh / SLIDE_H, 1));
    }
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(currentIndex + (diff > 0 ? 1 : -1));
  }

  async function handleFeedbackSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFbError("");
    setFbSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deck_id: deck.id,
          share_token: shareToken,
          name: fbName,
          email: fbEmail,
          rating: fbRating || null,
          comment: fbComment,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setFbDone(true);
    } catch {
      setFbError("Something went wrong. Please try again.");
    } finally {
      setFbSubmitting(false);
    }
  }

  const currentSlide = slides[currentIndex];
  const isOnFeedback = showFeedback;
  const progressPct = isOnFeedback
    ? 100
    : ((currentIndex + 1) / total) * 100;

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#000",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes slideInFwd {
          from { opacity: 0; transform: translateX(48px) scale(0.97); }
          to   { opacity: 1; transform: translateX(0)   scale(1);    }
        }
        @keyframes slideInBwd {
          from { opacity: 0; transform: translateX(-48px) scale(0.97); }
          to   { opacity: 1; transform: translateX(0)    scale(1);    }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fb-star { cursor:pointer; transition: transform 0.1s; user-select:none; }
        .fb-star:hover { transform: scale(1.2); }
      `}</style>

      {/* ── Top navbar ── */}
      <div
        style={{
          height: 48,
          backgroundColor: "rgba(10,10,10,0.97)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Image src="/images/EDT-lockup-dark.svg" alt="EDT" width={72} height={16} />
          <div style={{ width: 1, height: 20, backgroundColor: "rgba(255,255,255,0.1)" }} />
          <span
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 12,
              fontWeight: 600,
              color: "#FFFFFF",
              letterSpacing: "0.04em",
            }}
          >
            {deck.client_name}
          </span>
          <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: 12, color: "#555" }}>
            {deck.title}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 12,
              fontWeight: 600,
              color: "#8C8C8C",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {isOnFeedback
              ? "FEEDBACK"
              : `${String(currentIndex + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`}
          </span>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() =>
                isOnFeedback ? goTo(total - 1) : goTo(currentIndex - 1)
              }
              disabled={!isOnFeedback && currentIndex === 0}
              style={{
                width: 32,
                height: 32,
                backgroundColor: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                color: !isOnFeedback && currentIndex === 0 ? "#333" : "#fff",
                cursor: !isOnFeedback && currentIndex === 0 ? "not-allowed" : "pointer",
                fontSize: 14,
                borderRadius: 0,
              }}
            >
              ←
            </button>
            <button
              onClick={() => !isOnFeedback && goTo(currentIndex + 1)}
              disabled={isOnFeedback}
              style={{
                width: 32,
                height: 32,
                backgroundColor: isOnFeedback ? "transparent" : "#2D2DFF",
                border: "1px solid rgba(255,255,255,0.2)",
                color: isOnFeedback ? "#333" : "#fff",
                cursor: isOnFeedback ? "default" : "pointer",
                fontSize: 14,
                borderRadius: 0,
              }}
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div
        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {isOnFeedback ? (
          /* ── Feedback screen ── */
          <div
            key="feedback"
            style={{
              animation: "fadeUp 0.4s ease-out forwards",
              width: "100%",
              maxWidth: 520,
              padding: "0 24px",
            }}
          >
            {/* Window chrome card */}
            <div style={{ border: "1px solid rgba(255,255,255,0.15)", backgroundColor: "#111" }}>
              {/* Title bar */}
              <div
                style={{
                  height: 32,
                  backgroundColor: "#0A0A0A",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 12px",
                  gap: 6,
                }}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      width: 10,
                      height: 10,
                      border: "1px solid rgba(255,255,255,0.3)",
                      borderRadius: 9999,
                      display: "block",
                    }}
                  />
                ))}
                <span
                  style={{
                    fontFamily: '"Space Grotesk", monospace',
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#555",
                    marginLeft: 4,
                  }}
                >
                  FEEDBACK.EXE
                </span>
              </div>

              <div style={{ padding: "24px 28px 28px" }}>
                {fbDone ? (
                  /* Success state */
                  <div style={{ textAlign: "center", padding: "24px 0" }}>
                    <div
                      style={{
                        fontFamily: '"Dela Gothic One", sans-serif',
                        fontSize: 32,
                        color: "#2D2DFF",
                        marginBottom: 12,
                      }}
                    >
                      THANK YOU
                    </div>
                    <p
                      style={{
                        fontFamily: '"Space Grotesk", sans-serif',
                        fontSize: 14,
                        color: "#8C8C8C",
                        margin: 0,
                      }}
                    >
                      Your feedback has been sent to the EDT team.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div>
                      <p
                        style={{
                          fontFamily: '"Space Grotesk", sans-serif',
                          fontSize: 13,
                          color: "#8C8C8C",
                          margin: "0 0 20px",
                          lineHeight: 1.5,
                        }}
                      >
                        Share your thoughts on this presentation.
                      </p>
                    </div>

                    {/* Name */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label
                        style={{
                          fontFamily: '"Space Grotesk", sans-serif',
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "#8C8C8C",
                        }}
                      >
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fbName}
                        onChange={(e) => setFbName(e.target.value)}
                        placeholder="Your name"
                        style={{
                          backgroundColor: "#0A0A0A",
                          border: "1px solid rgba(255,255,255,0.15)",
                          color: "#fff",
                          fontFamily: '"Space Grotesk", sans-serif',
                          fontSize: 14,
                          padding: "10px 12px",
                          outline: "none",
                          borderRadius: 0,
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    {/* Email */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label
                        style={{
                          fontFamily: '"Space Grotesk", sans-serif',
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "#8C8C8C",
                        }}
                      >
                        Email <span style={{ color: "#444", fontWeight: 400 }}>(optional)</span>
                      </label>
                      <input
                        type="email"
                        value={fbEmail}
                        onChange={(e) => setFbEmail(e.target.value)}
                        placeholder="your@email.com"
                        style={{
                          backgroundColor: "#0A0A0A",
                          border: "1px solid rgba(255,255,255,0.15)",
                          color: "#fff",
                          fontFamily: '"Space Grotesk", sans-serif',
                          fontSize: 14,
                          padding: "10px 12px",
                          outline: "none",
                          borderRadius: 0,
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    {/* Star rating */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <label
                        style={{
                          fontFamily: '"Space Grotesk", sans-serif',
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "#8C8C8C",
                        }}
                      >
                        Rating
                      </label>
                      <div style={{ display: "flex", gap: 6 }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className="fb-star"
                            onClick={() => setFbRating(star)}
                            onMouseEnter={() => setFbHover(star)}
                            onMouseLeave={() => setFbHover(0)}
                            style={{
                              fontSize: 28,
                              color: star <= (fbHover || fbRating) ? "#2D2DFF" : "#333",
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Comment */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label
                        style={{
                          fontFamily: '"Space Grotesk", sans-serif',
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "#8C8C8C",
                        }}
                      >
                        Comments
                      </label>
                      <textarea
                        value={fbComment}
                        onChange={(e) => setFbComment(e.target.value)}
                        placeholder="What did you think of the presentation?"
                        rows={4}
                        style={{
                          backgroundColor: "#0A0A0A",
                          border: "1px solid rgba(255,255,255,0.15)",
                          color: "#fff",
                          fontFamily: '"Space Grotesk", sans-serif',
                          fontSize: 14,
                          padding: "10px 12px",
                          outline: "none",
                          borderRadius: 0,
                          resize: "vertical",
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    {fbError && (
                      <p
                        style={{
                          fontFamily: '"Space Grotesk", sans-serif',
                          fontSize: 13,
                          color: "#f87171",
                          margin: 0,
                        }}
                      >
                        {fbError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={fbSubmitting}
                      style={{
                        backgroundColor: "#2D2DFF",
                        border: "none",
                        color: "#fff",
                        fontFamily: '"Space Grotesk", sans-serif',
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        padding: "14px 24px",
                        cursor: fbSubmitting ? "not-allowed" : "pointer",
                        opacity: fbSubmitting ? 0.6 : 1,
                        borderRadius: 0,
                      }}
                    >
                      {fbSubmitting ? "SENDING..." : "SEND FEEDBACK →"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ── Slide display ── */
          currentSlide && (
            <div
              key={animKey}
              style={{
                animation: `${animDir === "fwd" ? "slideInFwd" : "slideInBwd"} 0.35s ease-out forwards`,
                width: SLIDE_W * scale,
                height: SLIDE_H * scale,
                boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 32px 80px rgba(0,0,0,0.8)",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: SLIDE_W,
                  height: SLIDE_H,
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                }}
              >
                <SlideRenderer slide={currentSlide} />
              </div>
            </div>
          )
        )}
      </div>

      {/* ── Progress bar ── */}
      <div style={{ height: 3, backgroundColor: "rgba(255,255,255,0.05)", flexShrink: 0 }}>
        <div
          style={{
            height: "100%",
            backgroundColor: "#2D2DFF",
            width: `${progressPct}%`,
            transition: "width 0.35s ease",
          }}
        />
      </div>
    </div>
  );
}
