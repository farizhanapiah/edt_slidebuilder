import { cn } from "@/lib/utils/cn";

interface PixelGridProps {
  opacity?: number;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function PixelGrid({
  opacity = 0.06,
  size = 20,
  className,
  style,
}: PixelGridProps) {
  return (
    <div
      className={cn("absolute inset-0 pointer-events-none", className)}
      style={{
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,${opacity}) 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
        zIndex: 0,
        ...style,
      }}
      aria-hidden
    />
  );
}
