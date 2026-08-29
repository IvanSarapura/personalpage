import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/data/locale";

/**
 * Registro canónico de publicaciones de la Bitácora de Ingeniería Legal.
 *
 * La identidad editorial vive en el nivel superior y cada locale aporta su
 * propia metadata y archivo MDX. El slug es estable entre idiomas para que las
 * rutas relacionadas y los alternates SEO no se rompan al cambiar de locale.
 */
export interface PostTranslation {
  title: string;
  description: string;
  tags: readonly string[];
  contentFile: string;
}

export interface PostMeta {
  slug: string;
  date: string;
  readingMinutes: number;
  translations: Record<Locale, PostTranslation>;
}

export interface LocalizedPost extends PostTranslation {
  slug: string;
  lang: Locale;
  date: string;
  readingMinutes: number;
}

export const POSTS: readonly PostMeta[] = [
  {
    slug: "llm-oracles-genlayer",
    date: "2026-06-10",
    readingMinutes: 5,
    translations: {
      en: {
        title: "Judging evidence with LLM oracles on GenLayer",
        description:
          "What building Proven taught me about latency, cost and disagreement when smart contracts ask LLMs to evaluate evidence.",
        tags: ["Web3", "GenLayer", "Proven"],
        contentFile: "llm-oracles-genlayer",
      },
      es: {
        title: "Evaluar evidencia con oráculos LLM en GenLayer",
        description:
          "Lo que construir Proven me enseñó sobre latencia, costos y desacuerdos cuando los contratos inteligentes piden a modelos LLM que evalúen evidencia.",
        tags: ["Web3", "GenLayer", "Proven"],
        contentFile: "llm-oracles-genlayer.es",
      },
    },
  },
  {
    slug: "cruzar-bases-publicas-alimentarias",
    date: "2026-05-18",
    readingMinutes: 4,
    translations: {
      en: {
        title: "Crossing public food databases with RAG: the hard part is the data",
        description:
          "Lessons from building the Food Code oracle over ANMAT, SENASA and FAO datasets: normalize, version and cite every source.",
        tags: ["RegTech", "RAG", "AI"],
        contentFile: "cruzar-bases-publicas-alimentarias.en",
      },
      es: {
        title: "Cruzar bases públicas alimentarias con RAG: la parte difícil son los datos",
        description:
          "Lecciones de construir el oráculo del Código Alimentario sobre las bases de ANMAT, SENASA y FAO: normalizar, versionar y citar.",
        tags: ["RegTech", "RAG", "IA"],
        contentFile: "cruzar-bases-publicas-alimentarias",
      },
    },
  },
  {
    slug: "evidencia-digital-cardano",
    date: "2026-04-22",
    readingMinutes: 5,
    translations: {
      en: {
        title: "Digital chain of custody: from an award-winning paper to practice",
        description:
          "Why evidence custody is a protocol implemented on paper, and how we proposed redesigning it on Cardano without exposing sensitive data.",
        tags: ["Legal", "Cardano", "Digital evidence"],
        contentFile: "evidencia-digital-cardano.en",
      },
      es: {
        title: "Cadena de custodia digital: del paper premiado a la práctica",
        description:
          "Por qué la custodia de evidencia es un protocolo implementado en papel, y cómo propusimos rediseñarla sobre Cardano sin exponer datos sensibles.",
        tags: ["Legal", "Cardano", "Evidencia digital"],
        contentFile: "evidencia-digital-cardano",
      },
    },
  },
  {
    slug: "zero-to-agent-v0",
    date: "2026-03-30",
    readingMinutes: 4,
    translations: {
      en: {
        title: "From zero to agent: prototyping with v0 and the AI SDK",
        description:
          "The constraint was to ship a type-safe agent without hand-writing the interface. What held up, what didn't, and why it changed my MVP workflow.",
        tags: ["AI", "v0", "Vercel AI SDK"],
        contentFile: "zero-to-agent-v0",
      },
      es: {
        title: "De cero a agente: prototipar con v0 y el AI SDK",
        description:
          "El desafío era publicar un agente type-safe sin escribir la interfaz a mano. Qué funcionó, qué no y por qué cambió mi flujo para construir MVPs.",
        tags: ["IA", "v0", "Vercel AI SDK"],
        contentFile: "zero-to-agent-v0.es",
      },
    },
  },
];

function localizePost(post: PostMeta, locale: Locale): LocalizedPost {
  return {
    slug: post.slug,
    lang: locale,
    date: post.date,
    readingMinutes: post.readingMinutes,
    ...post.translations[locale],
  };
}

/** Posts localizados y ordenados por fecha, más reciente primero. */
export function getPosts(locale: Locale = DEFAULT_LOCALE): LocalizedPost[] {
  return [...POSTS]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((post) => localizePost(post, locale));
}

export function getPost(slug: string, locale: Locale = DEFAULT_LOCALE): LocalizedPost | undefined {
  const post = POSTS.find((entry) => entry.slug === slug);
  return post ? localizePost(post, locale) : undefined;
}

export function getMissingTranslations(): Array<{ slug: string; locale: Locale }> {
  return POSTS.flatMap((post) =>
    LOCALES.filter((locale) => !post.translations[locale]).map((locale) => ({
      slug: post.slug,
      locale,
    }))
  );
}
