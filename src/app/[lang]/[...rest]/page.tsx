import { notFound } from "next/navigation";

/** Catch-all: cualquier ruta no reconocida bajo /[lang] renderiza el 404 del
 *  árbol [lang] (no existe root layout fuera de [lang] que pueda hacerlo). */
export default function CatchAllNotFound() {
  notFound();
}
