import type { Locale } from "@/data/locale";

/** Registro de posts de la Bitácora de Ingeniería Legal (fase 4 — propuesta §4.3).
 *
 *  Cada entrada apunta a src/content/posts/<slug>.mdx. Los posts son monolingües
 *  (campo `lang`); el chrome del blog sí se traduce. Para publicar un post nuevo:
 *  1) crear el .mdx, 2) agregar su entrada acá. El test de datos verifica que
 *  ambos no diverjan.
 *
 *  [TODO Iván]: las fechas son placeholders razonables — ajustalas a las reales. */
export interface PostMeta {
  slug: string;
  /** Locale del contenido del post (los posts no se traducen). */
  lang: Locale;
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD). Ordena el listado, más reciente primero. */
  date: string;
  tags: readonly string[];
  readingMinutes: number;
}

export const POSTS: readonly PostMeta[] = [
  {
    slug: "llm-oracles-genlayer",
    lang: "en",
    title: "Judging evidence with LLM oracles on GenLayer",
    description:
      "What building Proven taught me about latency, cost and disagreement when smart contracts ask LLMs to evaluate evidence.",
    date: "2026-06-10",
    tags: ["Web3", "GenLayer", "Proven"],
    readingMinutes: 5,
  },
  {
    slug: "cruzar-bases-publicas-alimentarias",
    lang: "es",
    title: "Cruzar bases públicas alimentarias con RAG: la parte difícil son los datos",
    description:
      "Lecciones de construir el oráculo del Código Alimentario sobre las bases de ANMAT, SENASA y FAO: normalizar, versionar y citar.",
    date: "2026-05-18",
    tags: ["RegTech", "RAG", "IA"],
    readingMinutes: 4,
  },
  {
    slug: "evidencia-digital-cardano",
    lang: "es",
    title: "Cadena de custodia digital: del paper premiado a la práctica",
    description:
      "Por qué la custodia de evidencia es un protocolo implementado en papel, y cómo propusimos rediseñarla sobre Cardano sin exponer datos sensibles.",
    date: "2026-04-22",
    tags: ["Legal", "Cardano", "Evidencia digital"],
    readingMinutes: 5,
  },
  {
    slug: "zero-to-agent-v0",
    lang: "en",
    title: "From zero to agent: prototyping with v0 and the AI SDK",
    description:
      "One constraint — ship a type-safe agent without hand-writing the interface. What held up, what didn't, and why it changed my MVP workflow.",
    date: "2026-03-30",
    tags: ["AI", "v0", "Vercel AI SDK"],
    readingMinutes: 4,
  },
];

/** Posts ordenados por fecha, más reciente primero. */
export function getPosts(): PostMeta[] {
  return [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): PostMeta | undefined {
  return POSTS.find((post) => post.slug === slug);
}
