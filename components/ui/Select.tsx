"use client";

import { cn } from "@/lib/utils/cn";
import { forwardRef, type SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="font-body text-[11px] font-semibold uppercase tracking-widest text-edt-grey">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          "w-full bg-edt-black border border-white/30 text-white font-body text-sm px-3 py-2",
          "focus:outline-none focus:border-edt-blue transition-colors appearance-none cursor-pointer",
          error && "border-red-400",
          className
        )}
        style={{ borderRadius: 0 }}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="font-body text-[11px] text-red-400">{error}</span>
      )}
    </div>
  )
);
Select.displayName = "Select";
