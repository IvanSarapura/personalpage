import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const toggleChipVariants = cva(
  "inline-flex min-h-8 touch-manipulation items-center justify-center rounded-[var(--radius-full)] border-[length:var(--border-width-thin)] border-solid px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--caption)] leading-[var(--caption-lh)] font-medium tracking-[var(--letter-spacing-wide)] [transition:var(--transition-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--section-focus-ring)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-[color:var(--section-border-decorative)] disabled:text-[var(--section-text-secondary)] [@media(pointer:coarse)]:min-h-[var(--touch-target)]",
  {
    variants: {
      pressed: {
        true: "border-[color:var(--control-fill)] bg-[var(--control-fill)] text-[var(--control-fill-text)]",
        false:
          "border-[color:var(--section-border-interactive)] bg-transparent text-[var(--section-text)] hover:bg-[var(--control-subtle)]",
      },
    },
    defaultVariants: { pressed: false },
  }
);

interface ToggleChipProps
  extends
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-pressed">,
    VariantProps<typeof toggleChipVariants> {
  pressed: boolean;
}

function ToggleChip({ className, pressed, type = "button", ...props }: ToggleChipProps) {
  return (
    <button
      type={type}
      aria-pressed={pressed}
      data-slot="toggle-chip"
      className={cn(toggleChipVariants({ pressed, className }))}
      {...props}
    />
  );
}

export { ToggleChip, toggleChipVariants };
export type { ToggleChipProps };
