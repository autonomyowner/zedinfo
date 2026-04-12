import { cn } from "@/lib/cn";

type Variant = "primary" | "success" | "warning" | "error" | "muted";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-white",
  success: "bg-green-600 text-white",
  warning: "bg-amber-500 text-white",
  error: "bg-error text-on-error",
  muted: "bg-surface-container text-on-surface-variant",
};

export function Badge({
  children,
  variant = "primary",
  className,
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full text-[10px] font-bold uppercase tracking-tighter px-2.5 py-1",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
