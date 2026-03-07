import { PixelGrid } from "@/components/ui/PixelGrid";
import { WindowChrome } from "@/components/ui/WindowChrome";
import { useCountUp } from "@/hooks/useCountUp";
import type { StatsContent, StatItem } from "@/types/slide";

interface Props {
  content: StatsContent;
  isExport?: boolean;
}

function StatCard({ stat, isExport, index, columns }: { stat: StatItem; isExport?: boolean; index: number; columns: number }) {
  const display = useCountUp(stat.value, 1400, !isExport, index * 150);
  const fontSize = columns === 4 ? 56 : 72;
  return (
    <WindowChrome title={stat.window_title} titleBarColor="blue" showControls={true}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "24px 24px 28px" }}>
        <div
          style={{
            fontFamily: '"Dela Gothic One", sans-serif',
            fontSize: fontSize,
            fontWeight: 400,
            color: "#FFFFFF",
            lineHeight: 1,
          }}
        >
          {display}
        </div>
        <div
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#8C8C8C",
          }}
        >
          {stat.label}
        </div>
      </div>
    </WindowChrome>
  );
}

export function StatsSlide({ content, isExport }: Props) {
  const { headline, stats, columns } = content;
  const animate = !isExport;

  const colWidths: Record<number, string> = {
    2: "calc(50% - 12px)",
    3: "calc(33.333% - 16px)",
    4: "calc(25% - 18px)",
  };

  return (
    <div
      className="slide-base"
      style={{
        backgroundColor: "#0A0A0A",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 80px",
      }}
    >
      <PixelGrid opacity={0.06} />

      {/* Left accent bar */}
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

      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: 40 }}>
        {/* Headline */}
        {headline && (
          <h2
            className={animate ? "anim-fade-up anim-d-2" : ""}
            style={{
              fontFamily: '"Dela Gothic One", sans-serif',
              fontSize: 40,
              fontWeight: 400,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
              margin: 0,
            }}
          >
            {headline}
          </h2>
        )}

        {/* Stat cards */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className={animate ? `anim-fade-up anim-d-${Math.min(i + 2, 12)}` : ""}
              style={{ width: colWidths[columns] || colWidths[3], minWidth: 0 }}
            >
              <StatCard stat={stat} isExport={isExport} index={i} columns={columns} />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom border */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: "rgba(255,255,255,0.1)",
        }}
      />
    </div>
  );
}
