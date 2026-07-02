"use client";

import styles from "./Switch.module.css";

interface SwitchProps {
  /** Estado actual del switch (controlled). */
  checked: boolean;
  /** Handler invocado al activar/desactivar. */
  onChange: () => void;
  /** Etiqueta accesible — debe describir la **acción** (a dónde vas), no el estado actual. */
  ariaLabel: string;
  /** ID de elemento que describe el switch (opcional). */
  ariaDescribedby?: string;
  /** Deshabilita el control. */
  disabled?: boolean;
  /** Clase adicional sobre el track. */
  className?: string;
}

/**
 * `<Switch>` — toggle binario accesible.
 *
 * Usa `<button role="switch">` semántico: Enter/Space, focus ring nativo,
 * gestión de SR y formularios funcionan sin código extra.
 *
 * Geometría parametrizada por tokens `--switch-*` en `globals.css`.
 * Respeta `prefers-reduced-motion: reduce`.
 */
export function Switch({
  checked,
  onChange,
  ariaLabel,
  ariaDescribedby,
  disabled = false,
  className,
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      disabled={disabled}
      onClick={onChange}
      className={className ? `${styles.switch} ${className}` : styles.switch}
    >
      <span className={styles.knob} aria-hidden="true" />
    </button>
  );
}
