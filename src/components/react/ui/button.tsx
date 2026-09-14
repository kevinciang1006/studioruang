import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../../lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-sm px-6 py-3 text-xs font-medium uppercase tracking-widest transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-clay text-bone hover:bg-ink",
        variant === "secondary" && "border border-ink text-ink hover:bg-ink hover:text-bone",
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
