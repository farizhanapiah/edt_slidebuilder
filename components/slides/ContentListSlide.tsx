import { PixelGrid } from "@/components/ui/PixelGrid";
import type { ContentListContent } from "@/types/slide";

interface Props {
  content: ContentListContent;
  isExport?: boolean;
}

export function ContentListSlide({ content, isExport }: Props) {
  const { eyebrow, headline, items, layout, show_numbers } = content;
  const animate = !isExport;
  const isTwoCol = layout === "two-column";

  const half = Math.ceil(items.length / 2);
  const col1 = isTwoCol ? items.slice(0, half) : items;
  const col2 = isTwoCol ? items.slice(half) : [];

  const renderItems = (list: typeof items, offset = 0) =>
    list.map((item, i) => (
      <div
        key={i}
        className={animate ? `anim-fade-up anim-d-${Math.min(offset + i + 3, 12)}` : ""}
        style={{
          display: "flex",
          gap: 16,
          alignItems: "flex-start",
          borderLeft: item.highlight ? "3px solid #2D2DFF" : "3px solid transparent",
          paddingLeft: 16,
          paddingTop: 4,
          paddingBottom: 4,
        }}
      >
        {show_numbers ? (
          <span
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 13,
              fontWeight: 700,
              color: "#2D2DFF",
              letterSpacing: "0.04em",
              flexShrink: 0,
              minWidth: 24,
            }}
          >
            {String(offset + i + 1).padStart(2, "0")}
          </span>
        ) : (
          <span
            style={{
              width: 6,
              height: 6,
              backgroundColor: item.highlight ? "#2D2DFF" : "#8C8C8C",
              flexShrink: 0,
              marginTop: 8,
            }}
          />
        )}
        <span
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 18,
            fontWeight: item.highlight ? 600 : 400,
            color: item.highlight ? "#FFFFFF" : "#CCCCCC",
            lineHeight: 1.55,
          }}
        >
          {item.text}
        </span>
      </div>
    ));

  return (
    <div
      className="slide-base"
      style={{
        backgroundColor: "#0A0A0A",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "64px 88px",
      }}
    >
      <PixelGrid opacity={0.06} />

      {/* Left bar */}
      <div
        className={animate ? "anim-bar-in anim-d-0" : ""}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          backgroundColor: "#2D2DFF",
          zIndex: 2,
        }}
      />

      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: 36 }}>
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {eyebrow && (
            <span
              className={animate ? "anim-fade-up anim-d-0" : ""}
              style={{
                display: "block",
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#2D2DFF",
              }}
            >
              {eyebrow}
            </span>
          )}
          <h2
            className={animate ? "anim-fade-up anim-d-2" : ""}
            style={{
              fontFamily: '"Dela Gothic One", sans-serif',
              fontSize: 56,
              fontWeight: 400,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
              lineHeight: 1,
              margin: 0,
            }}
          >
            {headline}
          </h2>
          <div className={animate ? "anim-fade-up anim-d-3" : ""} style={{ height: 1, backgroundColor: "rgba(255,255,255,0.15)", width: 64 }} />
        </div>

        {/* Items */}
        {isTwoCol ? (
          <div style={{ display: "flex", gap: 64 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
              {renderItems(col1, 0)}
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
              {renderItems(col2, col1.length)}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {renderItems(col1, 0)}
          </div>
        )}
      </div>
    </div>
  );
}
