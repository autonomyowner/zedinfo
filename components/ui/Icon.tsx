import { cn } from "@/lib/cn";

export function Icon({
  name,
  className,
  filled,
  flip,
}: {
  name: string;
  className?: string;
  filled?: boolean;
  flip?: boolean;
}) {
  return (
    <span
      className={cn(
        "material-symbols-outlined",
        filled && "filled",
        flip && "rtl-flip",
        className
      )}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
