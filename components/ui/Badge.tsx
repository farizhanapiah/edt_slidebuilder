import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "blue" | "white" | "grey" | "black";
  className?: string;
}

const variantStyles = {
  blue: "bg-edt-blue text-white border-edt-blue",
  white: "bg-transparent text-white border-white",
  grey: "bg-transparent text-edt-grey border-edt-grey",
  black: "bg-edt-black text-white border-white",
};

export function Badge({ children, variant = "white", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block border px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-widest",
        variantStyles[variant],
        className
      )}
      style={{ borderRadius: 0 }}
    >
      {children}
    </span>
  );
}
