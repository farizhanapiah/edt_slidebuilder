import { PixelGrid } from "@/components/ui/PixelGrid";
import { WindowChrome } from "@/components/ui/WindowChrome";
import { PositionedImage } from "@/components/ui/PositionedImage";
import type { TeamContent, TeamMember } from "@/types/slide";

interface Props {
  content: TeamContent;
  isExport?: boolean;
}

function MemberCard({
  member,
  animate,
  index,
  showWindowChrome,
}: {
  member: TeamMember;
  animate: boolean;
  index: number;
  showWindowChrome: boolean;
}) {
  const delayClass = animate ? `anim-clip-up anim-d-${index * 2}` : "";

  const photo = (
    <PositionedImage
      src={member.image_url}
      alt={member.image_alt || member.name}
      position={member.image_position}
      style={{ aspectRatio: "1", width: "100%" }}
    />
  );

  const nameBlock = (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 12 }}>
      <div
        style={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: 16,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          color: "#FFFFFF",
        }}
      >
        {member.name}
      </div>
      <div
        style={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: 13,
          fontWeight: 400,
          color: "#8C8C8C",
        }}
      >
        {member.title}
      </div>
    </div>
  );

  if (showWindowChrome) {
    return (
      <div className={delayClass} style={{ minWidth: 0 }}>
        <WindowChrome title={member.name} titleBarColor="black" showControls={true}>
          {photo}
        </WindowChrome>
        {nameBlock}
      </div>
    );
  }

  return (
    <div className={delayClass} style={{ minWidth: 0 }}>
      {photo}
      {nameBlock}
    </div>
  );
}

export function TeamSlide({ content, isExport }: Props) {
  const { eyebrow, headline, members, layout, show_window_chrome } = content;
  const animate = !isExport;

  return (
    <div
      className="slide-base"
      style={{
        backgroundColor: "#0A0A0A",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PixelGrid opacity={0.06} />

      {/* Top section: eyebrow + headline */}
      <div style={{ position: "relative", zIndex: 2, padding: "48px 80px 0" }}>
        {eyebrow && (
          <div
            className={animate ? "anim-fade-up anim-d-0" : ""}
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#2D2DFF",
              marginBottom: 12,
            }}
          >
            {eyebrow}
          </div>
        )}
        <h2
          className={animate ? "anim-fade-up anim-d-1" : ""}
          style={{
            fontFamily: '"Dela Gothic One", sans-serif',
            fontSize: 42,
            fontWeight: 400,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            color: "#FFFFFF",
            margin: 0,
          }}
        >
          {headline}
        </h2>
      </div>

      {/* Members section */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "32px 80px",
          flex: 1,
          ...(layout === "row"
            ? {
                display: "flex",
                flexDirection: "row" as const,
                gap: 24,
                alignItems: "flex-start",
              }
            : {
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
              }),
        }}
      >
        {members.map((member, i) => (
          <div key={i} style={{ flex: layout === "row" ? 1 : undefined, minWidth: 0 }}>
            <MemberCard
              member={member}
              animate={animate}
              index={i}
              showWindowChrome={show_window_chrome}
            />
          </div>
        ))}
      </div>

      {/* EDT logo watermark -- bottom right corner */}
      <img
        src="/images/EDT-lockup-dark.svg"
        alt="EDT"
        style={{
          position: "absolute",
          bottom: 32,
          right: 48,
          height: 24,
          opacity: 0.5,
          zIndex: 5,
        }}
      />
    </div>
  );
}
