import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../../lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-sm border border-border bg-bone px-4 py-3 text-sm text-ink placeholder:text-muted focus-visible:border-clay",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
