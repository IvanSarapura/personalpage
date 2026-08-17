import type { ReactNode, ElementType } from "react";

type Variant = "blue" | "white" | "dark";
type PaddingY = "lg" | "md" | "sm" | "none";

// Fondos/colores por variante (tokens semánticos → hacen flip en dark mode).
const VARIANT_CLASSES: Record<Variant, string> = {
  blue: "bg-[var(--surface-primary)] text-[var(--text-primary)]",
  white: "bg-[var(--surface-secondary)] text-[var(--text-on-light)]",
  dark: "bg-[var(--surface-dark)] text-[var(--text-primary)]",
};

// Padding vertical por tamaño (con override mobile en ≤768px, como Sira).
const PADDING_CLASSES: Record<PaddingY, string> = {
  lg: "py-[var(--section-padding-y)] max-[768px]:py-[var(--section-padding-y-mobile)]",
  md: "py-[var(--space-6)] max-[768px]:py-[var(--space-5)]",
  sm: "py-[var(--space-5)] max-[768px]:py-[var(--space-4)]",
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
  variant = "blue",
  paddingY = "lg",
  className = "",
  as: Component = "section",
  ariaLabel,
  ariaLabelledBy,
  id,
}: SectionProps) {
  const combined = `w-full ${VARIANT_CLASSES[variant]} ${PADDING_CLASSES[paddingY]}${
    className ? ` ${className}` : ""
  }`;

  return (
    <Component id={id} className={combined} aria-label={ariaLabel} aria-labelledby={ariaLabelledBy}>
      {children}
    </Component>
  );
}
