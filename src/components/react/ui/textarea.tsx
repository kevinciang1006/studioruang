import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../../../lib/utils";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-sm border border-border bg-bone px-4 py-3 text-sm text-ink placeholder:text-muted focus-visible:border-clay",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
