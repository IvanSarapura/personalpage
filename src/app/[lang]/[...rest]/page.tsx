import { notFound } from "next/navigation";

/** Catch-all: cualquier ruta no reconocida bajo /[lang] renderiza el 404 del
 *  árbol [lang] (no existe root layout fuera de [lang] que pueda hacerlo).
 *
 *  Nota: en `next dev`, llamar notFound() desde una ruta dinámica puede lanzar
 *  en consola "Failed to execute 'measure' on 'Performance': 'CatchAllNotFound'
 *  cannot have a negative time stamp". Es un bug conocido de Next/React en dev
 *  (vercel/next.js#86060, fix sin mergear en #88688) — cosmético, no afecta
 *  producción. No "arreglarlo" cambiando esta lógica. */
export default function CatchAllNotFound() {
  notFound();
}
