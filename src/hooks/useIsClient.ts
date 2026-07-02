import { useSyncExternalStore } from "react";

/**
 * Hook SSR-safe que devuelve `true` solo en el cliente.
 *
 * Reemplaza el antipatrón `useState + useEffect(() => setMounted(true), [])`
 * que causa renders en cascada. `useSyncExternalStore` lee el valor de
 * forma sincrónica sin disparar effects adicionales.
 */
export function useIsClient() {
  return useSyncExternalStore(
    () => () => {}, // subscribe: no-op, no hay eventos externos
    () => true, // getSnapshot: en el cliente siempre es true
    () => false // getServerSnapshot: en el servidor siempre es false
  );
}
