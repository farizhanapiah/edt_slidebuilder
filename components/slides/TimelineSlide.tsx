import { PixelGrid } from "@/components/ui/PixelGrid";
import type { TimelineContent } from "@/types/slide";

interface Props {
  content: TimelineContent;
  isExport?: boolean;
}

export function TimelineSlide({ content, isExport }: Props) {
  const { headline, events, orientation } = content;
  const animate = !isExport;
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className="slide-base"
      style={{
        backgroundColor: "#0A0A0A",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "56px 88px",
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

      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: 48 }}>
        {/* Headline */}
        {headline && (
          <h2
            className={animate ? "anim-fade-up anim-d-2" : ""}
            style={{
              fontFamily: '"Dela Gothic One", sans-serif',
              fontSize: 52,
              fontWeight: 400,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
              margin: 0,
              lineHeight: 1,
            }}
          >
            {headline}
          </h2>
        )}

        {isHorizontal ? (
          <HorizontalTimeline events={events} animate={animate} />
        ) : (
          <VerticalTimeline events={events} animate={animate} />
        )}
      </div>
    </div>
  );
}

function HorizontalTimeline({ events, animate }: { events: TimelineContent["events"]; animate: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
      {events.map((event, i) => (
        <div key={i} className={animate ? `anim-fade-up anim-d-${Math.min(i + 3, 12)}` : ""} style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
          {/* Connector line */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
            {/* Left half line */}
            <div
              style={{
                flex: 1,
                height: 1,
                backgroundColor: i === 0 ? "transparent" : "rgba(255,255,255,0.2)",
              }}
            />
            {/* Dot */}
            <div
              style={{
                width: event.is_milestone ? 16 : 10,
                height: event.is_milestone ? 16 : 10,
                backgroundColor: event.is_milestone ? "#2D2DFF" : "#8C8C8C",
                border: event.is_milestone ? "2px solid #2D2DFF" : "1px solid #8C8C8C",
                flexShrink: 0,
              }}
            />
            {/* Right half line */}
            <div
              style={{
                flex: 1,
                height: 1,
                backgroundColor: i === events.length - 1 ? "transparent" : "rgba(255,255,255,0.2)",
              }}
            />
          </div>

          {/* Event content */}
          <div style={{ padding: "0 12px", textAlign: "center" }}>
            <div
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: event.is_milestone ? "#2D2DFF" : "#8C8C8C",
                marginBottom: 8,
              }}
            >
              {event.date}
            </div>
            <div
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 15,
                fontWeight: event.is_milestone ? 700 : 500,
                color: "#FFFFFF",
                lineHeight: 1.4,
                marginBottom: 8,
              }}
            >
              {event.title}
            </div>
            {event.description && (
              <div
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 13,
                  fontWeight: 400,
                  color: "#8C8C8C",
                  lineHeight: 1.5,
                }}
              >
                {event.description}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function VerticalTimeline({ events, animate }: { events: TimelineContent["events"]; animate: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {events.map((event, i) => (
        <div key={i} className={animate ? `anim-fade-up anim-d-${Math.min(i + 3, 12)}` : ""} style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
          {/* Timeline column */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 40 }}>
            <div
              style={{
                width: event.is_milestone ? 16 : 10,
                height: event.is_milestone ? 16 : 10,
                backgroundColor: event.is_milestone ? "#2D2DFF" : "#8C8C8C",
                flexShrink: 0,
                marginTop: 4,
              }}
            />
            {i < events.length - 1 && (
              <div
                style={{
                  width: 1,
                  flex: 1,
                  backgroundColor: "rgba(255,255,255,0.15)",
                  minHeight: 32,
                  marginTop: 4,
                }}
              />
            )}
          </div>

          {/* Event content */}
          <div style={{ flex: 1, paddingBottom: 28 }}>
            <div style={{ display: "flex", gap: 16, alignItems: "baseline", marginBottom: 6 }}>
              <span
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: event.is_milestone ? "#2D2DFF" : "#8C8C8C",
                }}
              >
                {event.date}
              </span>
              <span
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 18,
                  fontWeight: event.is_milestone ? 700 : 500,
                  color: "#FFFFFF",
                }}
              >
                {event.title}
              </span>
            </div>
            {event.description && (
              <p
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 14,
                  fontWeight: 400,
                  color: "#8C8C8C",
                  margin: 0,
                  lineHeight: 1.55,
                }}
              >
                {event.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
