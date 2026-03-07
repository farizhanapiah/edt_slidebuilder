import { PixelGrid } from "@/components/ui/PixelGrid";
import type { VideoContent } from "@/types/slide";

interface Props {
  content: VideoContent;
  isExport?: boolean;
}

function detectVideoType(url: string): "youtube" | "vimeo" | "direct" | "empty" {
  if (!url) return "empty";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("vimeo.com")) return "vimeo";
  return "direct";
}

function buildEmbedUrl(url: string, autoplay: boolean, showControls: boolean): string {
  const type = detectVideoType(url);
  if (type === "youtube") {
    const idMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    const id = idMatch?.[1] ?? "";
    const params = new URLSearchParams({
      autoplay: autoplay ? "1" : "0",
      controls: showControls ? "1" : "0",
      modestbranding: "1",
      rel: "0",
      color: "white",
    });
    return `https://www.youtube.com/embed/${id}?${params}`;
  }
  if (type === "vimeo") {
    const idMatch = url.match(/vimeo\.com\/(\d+)/);
    const id = idMatch?.[1] ?? "";
    const params = new URLSearchParams({
      autoplay: autoplay ? "1" : "0",
      controls: showControls ? "1" : "0",
      color: "2D2DFF",
      title: "0",
      byline: "0",
      portrait: "0",
    });
    return `https://player.vimeo.com/video/${id}?${params}`;
  }
  return url;
}

function VideoTypeBadge({ type }: { type: "youtube" | "vimeo" | "direct" | "empty" }) {
  const labels: Record<string, string> = {
    youtube: "YOUTUBE",
    vimeo: "VIMEO",
    direct: "MP4",
    empty: "NO VIDEO",
  };
  return (
    <span
      style={{
        fontFamily: '"Space Grotesk", sans-serif',
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "#2D2DFF",
        border: "1px solid #2D2DFF",
        padding: "2px 8px",
        display: "inline-block",
      }}
    >
      {labels[type]}
    </span>
  );
}

export function VideoSlide({ content, isExport }: Props) {
  const {
    headline,
    video_url,
    caption,
    autoplay,
    show_controls,
    background_color,
  } = content;

  const isBlue = background_color === "blue";
  const animate = !isExport;
  const videoType = detectVideoType(video_url);
  const embedUrl = buildEmbedUrl(video_url, autoplay, show_controls);

  // Video area dimensions — 16:9 at max width
  const videoAreaW = 1100;
  const videoAreaH = Math.round(videoAreaW * (9 / 16)); // 618px
  const headerH = headline ? 100 : 0;
  const captionH = caption ? 40 : 0;
  const totalContentH = headerH + videoAreaH + captionH + 32; // gaps
  const videoTop = Math.round((720 - totalContentH) / 2) + headerH;

  return (
    <div
      className="slide-base"
      style={{
        backgroundColor: isBlue ? "#2D2DFF" : "#0A0A0A",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <PixelGrid opacity={isBlue ? 0.07 : 0.05} />

      {/* Left blue bar (dark bg only) */}
      {!isBlue && (
        <div
          className={animate ? "anim-bar-in anim-d-0" : ""}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            backgroundColor: "#2D2DFF",
            zIndex: 3,
          }}
        />
      )}

      {/* Headline */}
      {headline && (
        <div
          className={animate ? "anim-fade-up anim-d-0" : ""}
          style={{
            position: "absolute",
            top: Math.round((720 - totalContentH) / 2),
            left: 88,
            right: 88,
            zIndex: 2,
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: '"Dela Gothic One", sans-serif',
              fontSize: 40,
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
        </div>
      )}

      {/* Video player */}
      <div
        className={animate ? "anim-fade-up anim-d-1" : ""}
        style={{
          position: "absolute",
          top: videoTop,
          left: Math.round((1280 - videoAreaW) / 2),
          width: videoAreaW,
          height: videoAreaH,
          zIndex: 2,
          backgroundColor: "#000",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        {isExport ? (
          /* Static placeholder for PDF */
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              backgroundColor: "#0D0D0D",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                backgroundColor: "#2D2DFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <polygon points="8,5 19,12 8,19" />
              </svg>
            </div>
            <VideoTypeBadge type={videoType} />
            {video_url && (
              <span
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 12,
                  color: "#8C8C8C",
                  maxWidth: 600,
                  textAlign: "center",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {video_url}
              </span>
            )}
          </div>
        ) : videoType === "empty" ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                border: "2px solid rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(255,255,255,0.3)">
                <polygon points="8,5 19,12 8,19" />
              </svg>
            </div>
            <span
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#444",
              }}
            >
              Add a video URL in the editor
            </span>
          </div>
        ) : videoType === "direct" ? (
          <video
            src={video_url}
            controls={show_controls}
            autoPlay={autoplay}
            style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
          />
        ) : (
          <iframe
            src={embedUrl}
            style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      {/* Caption */}
      {caption && (
        <div
          className={animate ? "anim-fade-up anim-d-2" : ""}
          style={{
            position: "absolute",
            top: videoTop + videoAreaH + 16,
            left: Math.round((1280 - videoAreaW) / 2),
            width: videoAreaW,
            zIndex: 2,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 13,
              fontWeight: 400,
              color: isBlue ? "rgba(255,255,255,0.65)" : "#8C8C8C",
              letterSpacing: "0.04em",
            }}
          >
            {caption}
          </span>
        </div>
      )}

      {/* Video type badge — top right of player */}
      {!isExport && videoType !== "empty" && (
        <div
          style={{
            position: "absolute",
            top: videoTop - 28,
            right: Math.round((1280 - videoAreaW) / 2),
            zIndex: 3,
          }}
        >
          <VideoTypeBadge type={videoType} />
        </div>
      )}
    </div>
  );
}
