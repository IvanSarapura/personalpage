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
      "Subjective-logic contracts on GenLayer, Solidity on EVM networks and permissioned Hyperledger deployments. I build decentralized systems that hold up under real legal requirements.",
    meta: "Proven · EcoTrace",
  },
  {
    id: "ai-agents",
    title: "AI Agents & LLM Apps",
    description:
      "Conversational agents and retrieval-augmented pipelines with Claude and the Vercel AI SDK. I design them for predictable, auditable answers in sensitive domains.",
    meta: "Sana · Compliance oracle",
  },
  {
    id: "regtech",
    title: "RegTech & Compliance",
    description:
      "Automated regulatory compliance. I cross public datasets from ANMAT, SENASA and FAO with the Argentine Food Code to turn scattered regulation into queryable logic.",
    meta: "In development",
  },
  {
    id: "legal-engineering",
    title: "Legal Engineering",
    description:
      "Translating procedural law into protocol design. Digital evidence, chain of custody and governance, grounded in commercial-law training at UBA.",
    meta: "Awarded paper",
  },
  {
    id: "typesafe-frontend",
    title: "Type-safe Web Development",
    description:
      "Accessible, performance-minded interfaces with TypeScript, Next.js and Tailwind. Strict typing end to end so regulatory logic cannot silently break in the UI.",
    meta: "This site",
  },
  {
    id: "product-venture",
    title: "Product & Venture",
    description:
      "From hackathon build to validated product. Market sizing, go-to-market discipline and fast iteration, trained at Trama (ITBA) and Founder School.",
    meta: "Founder School '26",
  },
] as const satisfies readonly Signal[];

const SIGNALS_ES = [
  {
    id: "web3-contracts",
    title: "Smart Contracts y Web3",
    description:
      "Contratos de lógica subjetiva en GenLayer, Solidity en redes EVM y despliegues permisionados de Hyperledger. Construyo sistemas descentralizados que resisten requisitos legales reales.",
    meta: "Proven · EcoTrace",
  },
  {
    id: "ai-agents",
    title: "Agentes de IA y apps con LLMs",
    description:
      "Agentes conversacionales y pipelines RAG con Claude y el Vercel AI SDK. Los diseño para respuestas predecibles y auditables en dominios sensibles.",
    meta: "Sana · Oráculo de cumplimiento",
  },
  {
    id: "regtech",
    title: "RegTech y Compliance",
    description:
      "Cumplimiento regulatorio automatizado. Cruzo bases públicas de ANMAT, SENASA y FAO con el Código Alimentario Argentino para convertir normativa dispersa en lógica consultable.",
    meta: "En desarrollo",
  },
  {
    id: "legal-engineering",
    title: "Ingeniería Legal",
    description:
      "Traducir derecho procesal a diseño de protocolos. Evidencia digital, cadena de custodia y gobernanza, con base en la formación en derecho comercial de la UBA.",
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
      "Del build de hackathon al producto validado. Dimensionamiento de mercado, disciplina de go-to-market e iteración rápida, entrenadas en Trama (ITBA) y Founder School.",
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
