"use client";

import { cn } from "@/lib/utils/cn";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  arrow?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      arrow = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center gap-2 font-body font-semibold uppercase tracking-widest transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-edt-blue text-white hover:bg-[#0000CC] active:scale-[0.98]",
      secondary:
        "bg-transparent text-white border border-white hover:bg-white hover:text-edt-black active:scale-[0.98]",
      ghost:
        "bg-transparent text-edt-blue hover:underline",
      danger:
        "bg-transparent text-red-400 border border-red-400 hover:bg-red-400 hover:text-white active:scale-[0.98]",
    };

    const sizes = {
      sm: "text-[11px] px-3 py-2",
      md: "text-[13px] px-5 py-3",
      lg: "text-[14px] px-7 py-4",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(base, variants[variant], sizes[size], className)}
        style={{ borderRadius: 0 }}
        {...props}
      >
        {children}
        {arrow && <span className="text-edt-blue">→</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
