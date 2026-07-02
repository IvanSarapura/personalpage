interface ToggleIconProps {
  variant: "more" | "less";
}

/**
 * Ícono toggle usado en los módulos de la lista.
 * Renderiza un SVG inline con currentColor para adaptarse al tema.
 */
export function ToggleIcon({ variant }: ToggleIconProps) {
  const isMore = variant === "more";

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{
        width: "100%",
        height: "100%",
        display: "block",
      }}
    >
      <path
        d="M6 12H18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {isMore && (
        <path
          d="M12 18L12 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
