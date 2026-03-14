import { PixelGrid } from "@/components/ui/PixelGrid";
import { WindowChrome } from "@/components/ui/WindowChrome";
import type { IconGridContent, IconGridItem } from "@/types/slide";

interface Props {
  content: IconGridContent;
  isExport?: boolean;
}

function GridItem({ item, style, index }: { item: IconGridItem; style: IconGridContent["style"]; index: number }) {
  const inner = (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ fontSize: 48, lineHeight: 1 }}>{item.icon}</span>
      <span
        style={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#FFFFFF",
        }}
      >
        {item.label}
      </span>
      {item.description && (
        <span
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 13,
            fontWeight: 400,
            color: "#8C8C8C",
            lineHeight: 1.5,
          }}
        >
          {item.description}
        </span>
      )}
    </div>
  );

  if (style === "cards") {
    return (
      <div
        style={{
          border: "1px solid rgba(255,255,255,0.2)",
          padding: 24,
        }}
      >
        {inner}
      </div>
    );
  }

  if (style === "window_chrome") {
    return (
      <WindowChrome title={item.label} titleBarColor="blue" showControls={true}>
        <div style={{ padding: 24 }}>{inner}</div>
      </WindowChrome>
    );
  }

  // minimal
  return inner;
}

export function IconGridSlide({ content, isExport }: Props) {
  const { eyebrow, headline, items, columns, style, background_color } = content;
  const animate = !isExport;
  const bgColor = background_color === "blue" ? "#2D2DFF" : "#0A0A0A";
  const isBlue = background_color === "blue";

  return (
    <div
      className="slide-base"
      style={{
        backgroundColor: bgColor,
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PixelGrid opacity={0.06} />

      {/* Top section: eyebrow + headline */}
      <div style={{ padding: "64px 80px 0", position: "relative", zIndex: 2 }}>
        {eyebrow && (
          <span
            className={animate ? "anim-fade-up anim-d-0" : ""}
            style={{
              display: "block",
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: isBlue ? "#FFFFFF" : "#2D2DFF",
              marginBottom: 12,
            }}
          >
            {eyebrow}
          </span>
        )}
        <h2
          className={animate ? "anim-fade-up anim-d-1" : ""}
          style={{
            fontFamily: '"Dela Gothic One", sans-serif',
            fontSize: 48,
            fontWeight: 400,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            color: "#FFFFFF",
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          {headline}
        </h2>
      </div>

      {/* Grid section */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 24,
          padding: "40px 80px 64px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className={animate ? `anim-scale-up anim-d-${Math.min(i, 12)}` : ""}
          >
            <GridItem item={item} style={style} index={i} />
          </div>
        ))}
      </div>

      {/* EDT logo watermark */}
      <img
        src="/images/edt-favicon.svg"
        alt="EDT"
        style={{
          position: "absolute",
          bottom: 36,
          right: 48,
          height: 28,
          opacity: isBlue ? 0.4 : 0.3,
          zIndex: 2,
        }}
      />
    </div>
  );
}
