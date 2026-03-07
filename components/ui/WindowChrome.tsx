import { cn } from "@/lib/utils/cn";

interface WindowChromeProps {
  title: string;
  titleBarColor?: "black" | "blue";
  showControls?: boolean;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function WindowChrome({
  title,
  titleBarColor = "black",
  showControls = true,
  children,
  className,
  contentClassName,
}: WindowChromeProps) {
  return (
    <div
      className={cn("border border-white flex flex-col", className)}
      style={{ borderRadius: 0 }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-3 border-b border-white shrink-0"
        style={{
          height: 32,
          backgroundColor: titleBarColor === "blue" ? "#2D2DFF" : "#0A0A0A",
          borderRadius: 0,
        }}
      >
        {showControls && (
          <div className="flex gap-1 shrink-0">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: 10,
                  height: 10,
                  border: "1px solid rgba(255,255,255,0.35)",
                  borderRadius: 9999,
                  display: "block",
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        )}
        <span
          className="text-white truncate"
          style={{
            fontFamily: '"Space Grotesk", monospace',
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
      </div>

      {/* Content */}
      <div className={cn("flex-1", contentClassName)}>{children}</div>
    </div>
  );
}
