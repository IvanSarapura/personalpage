/**
 * Icono de menú hamburguesa minimalista.
 *
 * Las líneas tocan los bordes del viewBox para maximizar el
 * área visual dentro del contenedor 28×28 del navbar.
 * strokeWidth="2" con strokeLinecap="round" requiere
 * 1px de margen para que el borde del trazo toque exactamente
 * el límite del viewBox.
 */
export function MenuIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <line x1="1" y1="4" x2="23" y2="4" />
      <line x1="1" y1="12" x2="23" y2="12" />
      <line x1="1" y1="20" x2="23" y2="20" />
    </svg>
  );
}

/**
 * Icono de cierre (X) minimalista.
 *
 * La X toca los bordes del viewBox para maximizar el área visual
 * dentro del contenedor 28×28 del navbar.
 */
export function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <line x1="2" y1="2" x2="22" y2="22" />
      <line x1="22" y1="2" x2="2" y2="22" />
    </svg>
  );
}
