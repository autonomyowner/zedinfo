import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary shadow-[0_8px_24px_-8px_rgba(0,53,208,0.5)] hover:shadow-[0_12px_32px_-8px_rgba(0,53,208,0.55)] hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:brightness-95",
  secondary:
    "bg-primary-container text-white shadow-[0_6px_20px_-8px_rgba(26,75,255,0.45)] hover:shadow-[0_10px_28px_-8px_rgba(26,75,255,0.5)] hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0",
  outline:
    "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(0,53,208,0.35)]",
  ghost:
    "text-on-surface hover:bg-surface-container-high hover:text-primary",
  danger:
    "bg-error text-on-error shadow-[0_8px_24px_-8px_rgba(186,26,26,0.45)] hover:brightness-110 hover:-translate-y-0.5",
};

const sizes: Record<Size, string> = {
  sm: "px-5 py-2.5 text-[11px]",
  md: "px-8 py-4 text-xs",
  lg: "px-10 py-5 text-xs",
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = "primary", size = "md", className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "rounded-xl font-bold uppercase tracking-widest inline-flex items-center justify-center gap-2",
          "transition-all duration-200 ease-out",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
