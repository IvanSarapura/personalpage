import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit items-center rounded-[var(--radius-full)] px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--caption)] leading-[var(--caption-lh)] font-medium tracking-[var(--letter-spacing-wide)]",
  {
    variants: {
      variant: {
        subtle:
          "border-[length:var(--border-width-thin)] border-solid border-[color:var(--section-border-decorative)] text-[var(--section-text-secondary)]",
        emphasis: "bg-[var(--control-subtle)] text-[var(--section-text)]",
      },
    },
    defaultVariants: { variant: "subtle" },
  }
);

interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant = "subtle", ...props }: BadgeProps) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}

export { Badge, badgeVariants };
export type { BadgeProps };
