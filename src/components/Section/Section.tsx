import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";
import styles from "./Section.module.css";

type Variant = "brand" | "surface" | "elevated" | "inverse";
type PaddingY = "lg" | "md" | "sm" | "none";

const VARIANT_CLASSES: Record<Variant, string> = {
  brand: styles.brand!,
  surface: styles.surface!,
  elevated: styles.elevated!,
  inverse: styles.inverse!,
};

const PADDING_CLASSES: Record<PaddingY, string> = {
  lg: "py-[var(--section-padding-y-mobile)] md:py-[var(--section-padding-y)]",
  md: "py-[var(--space-5)] md:py-[var(--space-6)]",
  sm: "py-[var(--space-4)] md:py-[var(--space-5)]",
  none: "py-0",
};

interface SectionProps {
  children: ReactNode;
  variant?: Variant;
  paddingY?: PaddingY;
  className?: string;
  as?: ElementType;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  id?: string;
}

export default function Section({
  children,
  variant = "brand",
  paddingY = "lg",
  className,
  as: Component = "section",
  ariaLabel,
  ariaLabelledBy,
  id,
}: SectionProps) {
  return (
    <Component
      id={id}
      data-surface={variant}
      className={cn("w-full", VARIANT_CLASSES[variant], PADDING_CLASSES[paddingY], className)}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {children}
    </Component>
  );
}
