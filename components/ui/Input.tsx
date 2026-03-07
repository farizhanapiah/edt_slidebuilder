import { cn } from "@/lib/utils/cn";
import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="font-body text-[11px] font-semibold uppercase tracking-widest text-edt-grey">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full bg-transparent border border-white/30 text-white font-body text-sm px-3 py-2",
          "placeholder:text-white/30 focus:outline-none focus:border-edt-blue transition-colors",
          error && "border-red-400",
          className
        )}
        style={{ borderRadius: 0 }}
        {...props}
      />
      {error && (
        <span className="font-body text-[11px] text-red-400">{error}</span>
      )}
    </div>
  )
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="font-body text-[11px] font-semibold uppercase tracking-widest text-edt-grey">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn(
          "w-full bg-transparent border border-white/30 text-white font-body text-sm px-3 py-2 resize-y min-h-[80px]",
          "placeholder:text-white/30 focus:outline-none focus:border-edt-blue transition-colors",
          error && "border-red-400",
          className
        )}
        style={{ borderRadius: 0 }}
        {...props}
      />
      {error && (
        <span className="font-body text-[11px] text-red-400">{error}</span>
      )}
    </div>
  )
);
Textarea.displayName = "Textarea";
