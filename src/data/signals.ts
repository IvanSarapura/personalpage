import { DEFAULT_LOCALE, type Locale } from "@/data/locale";

/** IDs estables entre locales: alimentan el mapa de íconos en SignalsSection. */
export const SIGNAL_IDS = [
  "web3-contracts",
  "ai-agents",
  "regtech",
  "legal-engineering",
  "typesafe-frontend",
  "product-venture",
] as const;

export type SignalId = (typeof SIGNAL_IDS)[number];

export interface Signal {
  id: SignalId;
  title: string;
  description: string;
  meta: string;
}

/** Dominios de trabajo (sección "What I do"), con el proyecto que los respalda en `meta`.
 *  Los ids son estables entre locales: alimentan el mapa de íconos en SignalsSection. */
const SIGNALS_EN = [
  {
    id: "web3-contracts",
    title: "Smart Contracts & Web3",
    description:
      "Subjective-logic contracts on GenLayer, Solidity on EVM networks and permissioned Hyperledger deployments — decentralized systems that hold up under real legal requirements.",
    meta: "Proven · EcoTrace",
  },
  {
    id: "ai-agents",
    title: "AI Agents & LLM Apps",
    description:
      "Conversational agents and retrieval-augmented pipelines with Claude and the Vercel AI SDK, designed for predictable, auditable answers in sensitive domains.",
    meta: "Sana · Compliance oracle",
  },
  {
    id: "regtech",
    title: "RegTech & Compliance",
    description:
      "Automated regulatory compliance: crossing public datasets (ANMAT, SENASA, FAO) with the Argentine Food Code to turn scattered regulation into queryable logic.",
    meta: "In development",
  },
  {
    id: "legal-engineering",
    title: "Legal Engineering",
    description:
      "Translating procedural law into protocol design — digital evidence, chain of custody and governance, grounded in commercial-law training at UBA.",
    meta: "Awarded paper",
  },
  {
    id: "typesafe-frontend",
    title: "Type-safe Web Development",
    description:
      "Accessible, performance-minded interfaces with TypeScript, Next.js and Tailwind. Strict typing end to end so regulatory logic can't silently break in the UI.",
    meta: "This site",
  },
  {
    id: "product-venture",
    title: "Product & Venture",
    description:
      "From hackathon build to validated product: market sizing, go-to-market discipline and fast iteration, trained at Trama (ITBA) and Founder School.",
    meta: "Founder School '26",
  },
] as const satisfies readonly Signal[];

const SIGNALS_ES = [
  {
    id: "web3-contracts",
    title: "Smart Contracts y Web3",
    description:
      "Contratos de lógica subjetiva en GenLayer, Solidity en redes EVM y despliegues permisionados de Hyperledger — sistemas descentralizados que resisten requisitos legales reales.",
    meta: "Proven · EcoTrace",
  },
  {
    id: "ai-agents",
    title: "Agentes de IA y apps con LLMs",
    description:
      "Agentes conversacionales y pipelines RAG con Claude y el Vercel AI SDK, diseñados para respuestas predecibles y auditables en dominios sensibles.",
    meta: "Sana · Oráculo de cumplimiento",
  },
  {
    id: "regtech",
    title: "RegTech y Compliance",
    description:
      "Cumplimiento regulatorio automatizado: cruzar bases públicas (ANMAT, SENASA, FAO) con el Código Alimentario Argentino para convertir normativa dispersa en lógica consultable.",
    meta: "En desarrollo",
  },
  {
    id: "legal-engineering",
    title: "Ingeniería Legal",
    description:
      "Traducir derecho procesal a diseño de protocolos — evidencia digital, cadena de custodia y gobernanza, con base en la formación en derecho comercial de la UBA.",
    meta: "Paper premiado",
  },
  {
    id: "typesafe-frontend",
    title: "Desarrollo web type-safe",
    description:
      "Interfaces accesibles y orientadas a rendimiento con TypeScript, Next.js y Tailwind. Tipado estricto de punta a punta para que la lógica regulatoria no se rompa en silencio en la UI.",
    meta: "Este sitio",
  },
  {
    id: "product-venture",
    title: "Producto y Venture",
    description:
      "Del build de hackathon al producto validado: dimensionamiento de mercado, disciplina de go-to-market e iteración rápida, entrenadas en Trama (ITBA) y Founder School.",
    meta: "Founder School '26",
  },
] as const satisfies readonly Signal[];

const SIGNALS_BY_LOCALE: Record<Locale, readonly Signal[]> = {
  en: SIGNALS_EN,
  es: SIGNALS_ES,
};

export function getSignals(locale: Locale): readonly Signal[] {
  return SIGNALS_BY_LOCALE[locale];
}

export const SIGNALS = SIGNALS_BY_LOCALE[DEFAULT_LOCALE];

interface Stat {
  value: string;
  label: string;
}

/** Strip de logros (sección "Track record") — .agents/propuesta.md §5.1. */
const STATS_BY_LOCALE: Record<Locale, readonly Stat[]> = {
  en: [
    { value: "1st", label: "Prediction Markets — Aleph & GenLayer Hackathon" },
    { value: "1st", label: "Legalthon UBA · Cardano — co-authored paper" },
    { value: "Finalist", label: "Trama BootCamp (ITBA) — Lupio" },
    { value: "FS '26", label: "Founder School — Crecimiento & Lucero Ventures" },
  ],
  es: [
    { value: "1º", label: "Prediction Markets — Aleph & GenLayer Hackathon" },
    { value: "1º", label: "Legalthon UBA · Cardano — paper en co-autoría" },
    { value: "Finalista", label: "BootCamp de Trama (ITBA) — Lupio" },
    { value: "FS '26", label: "Founder School — Crecimiento & Lucero Ventures" },
  ],
};

export function getStats(locale: Locale): readonly Stat[] {
  return STATS_BY_LOCALE[locale];
}

export const STATS = STATS_BY_LOCALE[DEFAULT_LOCALE];
