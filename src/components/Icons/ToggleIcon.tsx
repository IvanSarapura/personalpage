/**
 * Chevron descendente usado en controles disclosure.
 * Su contenedor lo rota 180° cuando el panel está expandido.
 */
export function ToggleIcon() {
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
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
