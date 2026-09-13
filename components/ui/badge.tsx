import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

function Badge({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-green/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-green",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
