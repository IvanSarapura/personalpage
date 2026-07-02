import type { ReactNode, ElementType } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

// Contenedor centrado: max-width 1200px, padding-x responsive (48px → 24px en ≤768px).
const CONTAINER_CLASS =
  "mx-auto w-full max-w-[var(--container-max-width)] px-[var(--container-padding-x)] max-[768px]:px-[var(--container-padding-x-mobile)]";

export default function Container({
  children,
  className = "",
  as: Component = "div",
}: ContainerProps) {
  const combined = `${CONTAINER_CLASS}${className ? ` ${className}` : ""}`;

  return <Component className={combined}>{children}</Component>;
}
