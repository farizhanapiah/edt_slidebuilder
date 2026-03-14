import type { ImagePosition } from "@/types/slide";

interface PositionedImageProps {
  src: string;
  alt: string;
  position?: ImagePosition;
  className?: string;
  style?: React.CSSProperties;
}

export function PositionedImage({ src, alt, position, className, style }: PositionedImageProps) {
  const focalX = position?.focal_x ?? 50;
  const focalY = position?.focal_y ?? 50;
  const zoom = position?.zoom ?? 1;

  return (
    <div
      className={className}
      style={{
        overflow: "hidden",
        ...style,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `${focalX}% ${focalY}%`,
          transform: zoom !== 1 ? `scale(${zoom})` : undefined,
          transformOrigin: `${focalX}% ${focalY}%`,
        }}
      />
    </div>
  );
}
