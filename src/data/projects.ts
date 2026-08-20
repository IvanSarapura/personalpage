import { DEFAULT_LOCALE, type Locale } from "@/data/locale";
import { CHAIN_OF_CUSTODY_PAPER_URL } from "@/data/research";

/** Tags de filtrado en /projects — .agents/propuesta.md §5.2. */
export type ProjectTag = "Web3" | "AI" | "RegTech" | "Legal" | "Product" | "Academic";

export interface ProjectLinks {
  /** [TODO Iván] URLs reales de demo/repo/paper — propuesta §10. Las cards solo
   *  renderizan los links presentes; NO agregar URLs que devuelvan 404 (un link
   *  roto daña más que su ausencia — propuesta §8). Sugerencias cuando los repos
   *  sean públicos:
   *    proven    → repo: "https://github.com/IvanSarapura/proven"
   *    ecotrace  → repo: "https://github.com/IvanSarapura/ecotrace"
   *    sana      → repo: "https://github.com/IvanSarapura/sana"
   */
  demo?: string;
  repo?: string;
  paper?: string;
}

interface ProjectBase {
  slug: string;
  num: string;
  tags: readonly ProjectTag[];
  stack: readonly string[];
  links: ProjectLinks;
}

interface ProjectCopy {
  title: string;
  tagline: string;
  /** Resumen de 2-3 frases: alimenta la card y el acordeón de la home (modules.ts). */
  summary: string;
  /** Caso de estudio (Origen → Mecanismo → Futuro) — propuesta §6. */
  origin: string;
  mechanism: string;
  future: string;
  award?: string;
  status: string;
}

export type Project = ProjectBase & ProjectCopy;

/** Datos independientes del idioma. El orden define el orden de render. */
const PROJECT_BASES = [
  {
    slug: "proven",
    num: "01",
    tags: ["Web3", "Legal", "Product"],
    stack: ["TypeScript", "Next.js", "GenLayer"],
    links: {},
  },
  {
    slug: "cardano-chain-of-custody",
    num: "02",
    tags: ["Web3", "Legal", "Academic"],
    stack: ["Cardano", "Legal research"],
    links: {
      paper: CHAIN_OF_CUSTODY_PAPER_URL,
    },
  },
  {
    slug: "ecotrace",
    num: "03",
    tags: ["Web3", "Academic", "Product"],
    stack: ["Solidity", "Hyperledger Fabric", "Next.js", "Tailwind CSS"],
    links: {},
  },
  {
    slug: "sana",
    num: "04",
    tags: ["AI", "Product"],
    stack: ["Next.js", "Tailwind CSS", "Claude API"],
    links: {},
  },
  {
    slug: "food-code-oracle",
    num: "05",
    tags: ["AI", "RegTech", "Legal"],
    stack: ["TypeScript", "Next.js", "RAG"],
    links: {},
  },
  {
    slug: "lupio",
    num: "06",
    tags: ["Product"],
    stack: [],
    links: {},
  },
  {
    slug: "zero-to-agent",
    num: "07",
    tags: ["AI"],
    stack: ["v0", "Vercel AI SDK", "MCP", "TypeScript"],
    links: {},
  },
] as const satisfies readonly ProjectBase[];

export type ProjectSlug = (typeof PROJECT_BASES)[number]["slug"];

const PROJECT_COPY: Record<Locale, Record<ProjectSlug, ProjectCopy>> = {
  en: {
    proven: {
      title: "Proven",
      tagline: "Decentralized dispute resolution",
      summary:
        "1st place, Prediction Markets track at GenLayer's Bradbury Builders Hackathon. Proven mediates peer-to-peer commercial disputes with smart contracts that weigh evidence on GenLayer, where coordinated LLM validators review what each party submits. The project is still in active development.",
      origin:
        "Traditional smart contracts run deterministic rules and cannot weigh subjective evidence. Real commercial conflicts turn on interpretation. Proven started at GenLayer's Bradbury Builders Hackathon to mediate peer-to-peer disputes in digital commerce, and won 1st place in the Prediction Markets track.",
      mechanism:
        "The protocol runs subjective-logic smart contracts on GenLayer's experimental network. Coordinated LLM validators act as decentralized adjudicators over the evidence each party submits. The TypeScript and Next.js frontend covers the full dispute flow: structured evidence upload, state tracking and verdict monitoring.",
      future:
        "Development continues with the post-hackathon team. The mid-term roadmap explores digital identity and applying subjective logic to automated audits of supply contracts, to lower the cost of commercial arbitration.",
      award: "1st place — Prediction Markets, GenLayer Bradbury Builders Hackathon",
      status: "In active development",
    },
    "cardano-chain-of-custody": {
      title: "Chain of Custody on Cardano",
      tagline: "Digital evidence, redesigned as protocol",
      summary:
        "1st place at the Legalthon on Decentralized Governance (UBA, Cardano community). Co-authored a technical and normative proposal that turns procedural requirements such as timestamping, hash integrity and authorized signatures into an immutable protocol on Cardano, with guidelines for a draft bill.",
      origin:
        "Weaknesses in the chain of custody of digital evidence are a recurring source of nullities and distrust in civil and criminal justice. The research, presented at the Legalthon on Decentralized Governance (UBA, Cardano community), took 1st place.",
      mechanism:
        "The paper proposes a hybrid architecture on Cardano. Every interaction with physical or digital evidence is recorded through cryptographic signatures, which gives forensic traceability and tamper-proof timestamps without exposing sensitive case data. Formal procedural requirements are translated into protocol rules, with guidelines for a draft bill.",
      future:
        "The published paper serves as a technical base for regulatory reform in justice digitalization, and as an integration model for court document-management systems.",
      award: "1st place — Legalthon UBA · Cardano community",
      status: "Published paper",
    },
    ecotrace: {
      title: "EcoTrace",
      tagline: "Verifiable life-cycle traceability",
      summary:
        "Research collaboration at UTN. EcoTrace records environmental metrics per production phase with Solidity contracts on EVM networks and permissioned Hyperledger Fabric deployments. A Next.js frontend validates each claim against external environmental databases.",
      origin:
        "Global directives demand transparency on the environmental impact of consumer goods, yet life-cycle assessment still relies on static, manual reports that are easy to greenwash. EcoTrace automates the capture of carbon footprint and ecological impact from raw material to delivery.",
      mechanism:
        "Solidity smart contracts target EVM networks, while permissioned Hyperledger Fabric deployments cover restrictive corporate environments. The Next.js and Tailwind frontend processes environmental metrics per production phase, and the core validates impact claims against external databases to keep telemetry auditable and repeatable.",
      future:
        "The strategic goal is to become the environmental-traceability standard for the region's agro-export industry, enabling exports under strict carbon-footprint regulations.",
      status: "In development at UTN",
    },
    sana: {
      title: "Sana",
      tagline: "AI agent for post-visit care",
      summary:
        "Built at the Kaszek & Anthropic Hackathon in Buenos Aires. Sana is a conversational assistant that reads prescriptions from images, structures the treatment plan and cross-checks doses against pharmacological databases to flag harmful interactions.",
      origin:
        "Post-visit follow-up is one of healthcare's biggest bottlenecks. Patients forget or misread the indications and dosages on a physical prescription. Sana was designed at the Kaszek & Anthropic Hackathon to accompany and validate post-visit care plans.",
      mechanism:
        "The interface and interaction logic run on Next.js and Tailwind with secure async calls to Anthropic's Claude models. Patients load prescriptions through image recognition, the treatment is structured interactively, and doses are cross-checked against pharmacological databases to prevent harmful interactions. Accessibility was a design requirement, not an afterthought.",
      future:
        "Sana's modular design scales toward enterprise telemedicine: better treatment adherence, less overload on primary-care centers and an auditable record of clinical progress.",
      status: "Hackathon build",
    },
    "food-code-oracle": {
      title: "Food-Code Compliance Oracle",
      tagline: "RegTech for the right to food",
      summary:
        "Independent research, in development. The oracle crosses ANMAT, SENASA and FAO datasets with the Argentine Food Code using retrieval-augmented generation, answering natural-language queries with auditable compliance reports.",
      origin:
        "Food-industry compliance means parsing scattered regulation. The Argentine Food Code and agency provisions change frequently, causing delays and involuntary breaches for small and mid-sized producers. This project unifies and interprets those heterogeneous sources automatically.",
      mechanism:
        "A web application automates the analytical crossing of records with retrieval-augmented generation (RAG), integrating public datasets from ANMAT, SENASA and FAO with the Food Code. Inspectors and legal auditors query in natural language and receive compliance reports with a full audit trail. The Next.js frontend keeps regulatory logic from silently breaking in the interface.",
      future:
        "The roadmap points to a public compliance API that simplifies launching new food products, cutting approval times while protecting the right to safe food.",
      status: "In development",
    },
    lupio: {
      title: "Lupio",
      tagline: "Business-model validation for founders",
      summary:
        "Finalist at ITBA's Trama Entrepreneurship BootCamp. Lupio lets early-stage founders load market hypotheses and returns structured viability analysis such as TAM/SAM/SOM and monetization consistency, evaluated in front of real investor panels.",
      origin:
        "Most tech startups fail from lack of early validation. The technical design of the MVP disconnects from the go-to-market strategy. Lupio was conceived to simplify business modeling for early-stage founders, guiding them through validated frameworks.",
      mechanism:
        "During ITBA's intensive bootcamp the team focused on commercial viability and agile interface development. Founders enter market hypotheses and receive structured analysis of financial viability, market sizing and monetization consistency, with responsive visualizations. The project passed evaluation panels of active investors and mentors.",
      future:
        "Reaching the finals validated the approach. The next steps depend on the team's post-bootcamp roadmap.",
      award: "Finalist — Trama BootCamp (ITBA)",
      status: "Finalist project",
    },
    "zero-to-agent": {
      title: "Zero to Agent",
      tagline: "Rapid AI-agent prototyping",
      summary:
        "Vercel's global Zero to Agent sessions. Prototyped a type-safe agent with the Vercel AI SDK and MCP integrations, using v0 as the experimentation environment. That workflow is now part of how I build every MVP.",
      origin:
        "In early-stage products, development speed decides outcomes. Agent architectures need tools that go from concept to working prototype immediately, without repetitive interface code. Vercel's global Zero to Agent sessions were the testing ground.",
      mechanism:
        "v0 served as the integrated experimentation environment for prototyping adaptive interfaces and logic flows. The resulting agent is type-safe, built on the Vercel AI SDK, and interacts asynchronously with semantic-search tools and Model Context Protocol (MCP) servers.",
      future:
        "The rapid-prototyping workflow validated there is now part of my daily practice: faster MVPs and a much shorter design feedback loop.",
      status: "Experiment",
    },
  },
  es: {
    proven: {
      title: "Proven",
      tagline: "Resolución descentralizada de disputas",
      summary:
        "1er puesto, track de Prediction Markets en el GenLayer Bradbury Builders Hackathon. Proven media disputas comerciales peer-to-peer con contratos inteligentes que ponderan evidencia sobre GenLayer, donde validadores LLM coordinados revisan lo que aporta cada parte. El proyecto sigue en desarrollo activo.",
      origin:
        "Los smart contracts tradicionales ejecutan reglas deterministas y no pueden ponderar evidencia subjetiva. Los conflictos comerciales reales dependen de interpretación. Proven empezó en el GenLayer Bradbury Builders Hackathon para mediar disputas peer-to-peer en el comercio digital, y ganó el 1er puesto del track de Prediction Markets.",
      mechanism:
        "El protocolo ejecuta contratos de lógica subjetiva sobre la red experimental de GenLayer. Validadores LLM coordinados actúan como adjudicadores descentralizados sobre la evidencia que aporta cada parte. El frontend en TypeScript y Next.js cubre el flujo completo: carga estructurada de evidencia, seguimiento de estados y monitoreo de veredictos.",
      future:
        "El desarrollo continúa con el equipo post-hackathon. La proyección a mediano plazo explora identidad digital y aplicar lógica subjetiva a auditorías automáticas de contratos de suministro, para bajar el costo del arbitraje comercial.",
      award: "1er puesto — Prediction Markets, GenLayer Bradbury Builders Hackathon",
      status: "En desarrollo activo",
    },
    "cardano-chain-of-custody": {
      title: "Cadena de Custodia sobre Cardano",
      tagline: "Evidencia digital, rediseñada como protocolo",
      summary:
        "1er puesto en el Legalthon de Gobernanza Descentralizada (UBA, comunidad Cardano). Coautoría de una propuesta técnico-normativa que convierte requisitos procesales como sellado de tiempo, integridad hash y firmas autorizadas en un protocolo inmutable sobre Cardano, con lineamientos para un anteproyecto de ley.",
      origin:
        "Las debilidades en la cadena de custodia de la evidencia digital son fuente recurrente de nulidades y desconfianza en la justicia civil y penal. La investigación, presentada en el Legalthon de Gobernanza Descentralizada (UBA, comunidad Cardano), obtuvo el 1er puesto.",
      mechanism:
        "El paper propone una arquitectura híbrida sobre Cardano. Cada interacción con la prueba física o digital queda registrada mediante firmas criptográficas, lo que da trazabilidad forense y marcas de tiempo inalterables sin exponer datos sensibles del proceso. Los requisitos procesales formales se traducen a reglas de protocolo, con lineamientos para un anteproyecto de ley.",
      future:
        "El paper publicado funciona como base técnica para reformas regulatorias en digitalización de la justicia, y como modelo de integración para sistemas de gestión documental de juzgados.",
      award: "1er puesto — Legalthon UBA · comunidad Cardano",
      status: "Paper publicado",
    },
    ecotrace: {
      title: "EcoTrace",
      tagline: "Trazabilidad verificable del ciclo de vida",
      summary:
        "Colaboración de investigación en la UTN. EcoTrace registra métricas ambientales por fase productiva con contratos Solidity en redes EVM y despliegues permisionados de Hyperledger Fabric. Un frontend en Next.js valida cada declaración contra bases ambientales externas.",
      origin:
        "Las directivas globales exigen transparencia sobre el impacto ambiental de los bienes de consumo, pero el análisis de ciclo de vida sigue dependiendo de informes manuales estáticos, fáciles de maquillar. EcoTrace automatiza la captura de huella de carbono e impacto ecológico desde la materia prima hasta la entrega.",
      mechanism:
        "Los contratos inteligentes en Solidity apuntan a redes EVM, mientras los despliegues permisionados de Hyperledger Fabric cubren entornos corporativos restrictivos. El frontend en Next.js y Tailwind procesa métricas ambientales por fase productiva, y el núcleo valida las declaraciones de impacto contra bases externas para mantener la telemetría auditable y repetible.",
      future:
        "El objetivo estratégico es convertirse en el estándar de trazabilidad ambiental para la industria agroexportadora de la región, habilitando exportaciones bajo regulaciones estrictas de huella de carbono.",
      status: "En desarrollo en la UTN",
    },
    sana: {
      title: "Sana",
      tagline: "Agente de IA para el cuidado post-consulta",
      summary:
        "Construida en el Kaszek & Anthropic Hackathon de Buenos Aires. Sana es un asistente conversacional que lee recetas desde imágenes, estructura el plan de tratamiento y cruza las dosis con bases farmacológicas para detectar interacciones dañinas.",
      origin:
        "El seguimiento post-consulta es uno de los mayores cuellos de botella de la salud. Los pacientes olvidan o malinterpretan las indicaciones y posologías de la receta física. Sana se diseñó en el Kaszek & Anthropic Hackathon para acompañar y validar planes de cuidado post-consulta.",
      mechanism:
        "La interfaz y la lógica de interacción corren sobre Next.js y Tailwind con llamadas seguras y asíncronas a los modelos Claude de Anthropic. Los pacientes cargan recetas mediante reconocimiento de imágenes, el tratamiento se estructura de forma interactiva y las dosis se cruzan con bases farmacológicas para prevenir interacciones dañinas. La accesibilidad fue requisito de diseño, no un agregado.",
      future:
        "El diseño modular de Sana escala hacia telemedicina empresarial: mejor adherencia al tratamiento, menos sobrecarga en centros de atención primaria y un registro auditable del progreso clínico.",
      status: "Build de hackathon",
    },
    "food-code-oracle": {
      title: "Oráculo del Código Alimentario",
      tagline: "RegTech por el derecho a la alimentación",
      summary:
        "Investigación independiente, en desarrollo. El oráculo cruza bases de ANMAT, SENASA y FAO con el Código Alimentario Argentino mediante RAG, respondiendo consultas en lenguaje natural con reportes de conformidad auditables.",
      origin:
        "El cumplimiento en la industria alimenticia implica analizar normativa dispersa. El Código Alimentario Argentino y las disposiciones de los organismos cambian con frecuencia, generando demoras e incumplimientos involuntarios en pymes. Este proyecto unifica e interpreta esas fuentes heterogéneas de forma automatizada.",
      mechanism:
        "Una aplicación web automatiza el cruce analítico de registros con RAG, integrando bases públicas de ANMAT, SENASA y FAO con el Código Alimentario. Inspectores y auditores jurídicos consultan en lenguaje natural y reciben reportes de conformidad con historial auditable completo. El frontend en Next.js evita que la lógica regulatoria se rompa en silencio en la interfaz.",
      future:
        "La proyección es una API pública de cumplimiento que simplifique el lanzamiento de nuevos productos alimenticios, reduciendo tiempos de aprobación y protegiendo el derecho a la alimentación segura.",
      status: "En desarrollo",
    },
    lupio: {
      title: "Lupio",
      tagline: "Validación de modelos de negocio para founders",
      summary:
        "Finalista en el BootCamp Emprendedor de Trama (ITBA). Lupio permite a founders early-stage cargar hipótesis de mercado y devuelve análisis estructurado de viabilidad como TAM/SAM/SOM y consistencia de monetización, evaluado frente a paneles de inversores reales.",
      origin:
        "La mayoría de las startups falla por falta de validación temprana. El diseño técnico del MVP se desconecta de la estrategia real de go-to-market. Lupio se concibió para simplificar el modelado de negocios de founders en etapas tempranas, guiándolos por marcos validados.",
      mechanism:
        "Durante el bootcamp intensivo del ITBA el equipo se enfocó en viabilidad comercial y desarrollo ágil de la interfaz. Los founders ingresan hipótesis de mercado y reciben análisis estructurado de viabilidad financiera, dimensionamiento de mercado y consistencia de monetización, con visualizaciones responsivas. El proyecto superó paneles de evaluación con inversores y mentores reales.",
      future:
        "Llegar a la final validó el enfoque. Los próximos pasos dependen del roadmap del equipo después del bootcamp.",
      award: "Finalista — BootCamp de Trama (ITBA)",
      status: "Proyecto finalista",
    },
    "zero-to-agent": {
      title: "Zero to Agent",
      tagline: "Prototipado rápido de agentes de IA",
      summary:
        "Jornadas globales Zero to Agent de Vercel. Prototipé un agente type-safe con el Vercel AI SDK e integraciones MCP, usando v0 como entorno de experimentación. Ese flujo hoy es parte de cómo construyo cada MVP.",
      origin:
        "En productos early-stage la velocidad de desarrollo define resultados. Las arquitecturas de agentes necesitan herramientas que pasen del concepto al prototipo funcional de inmediato, sin código repetitivo de interfaces. Las jornadas globales Zero to Agent de Vercel fueron el campo de prueba.",
      mechanism:
        "v0 funcionó como entorno integrado de experimentación para prototipar interfaces adaptables y flujos lógicos. El agente resultante es type-safe, construido sobre el Vercel AI SDK, e interactúa de forma asíncrona con herramientas de búsqueda semántica y servidores MCP.",
      future:
        "El flujo de prototipado rápido validado ahí es hoy parte de mi práctica diaria: MVPs más rápidos y un ciclo de feedback de diseño mucho más corto.",
      status: "Experimento",
    },
  },
};

function buildProjects(locale: Locale): Project[] {
  return PROJECT_BASES.map((base) => ({
    ...base,
    ...PROJECT_COPY[locale][base.slug],
  }));
}

const PROJECTS_BY_LOCALE: Record<Locale, Project[]> = {
  en: buildProjects("en"),
  es: buildProjects("es"),
};

/** Única fuente de verdad del contenido de proyectos: la home (modules.ts),
 *  /projects y el sitemap derivan de acá. Los slugs son idénticos entre locales. */
export function getProjects(locale: Locale): Project[] {
  return PROJECTS_BY_LOCALE[locale];
}

export const PROJECTS: Project[] = PROJECTS_BY_LOCALE[DEFAULT_LOCALE];

export function getProject(slug: string, locale: Locale = DEFAULT_LOCALE): Project | undefined {
  return PROJECTS_BY_LOCALE[locale].find((project) => project.slug === slug);
}

/** Todos los tags presentes en los proyectos, en orden de primera aparición. */
export const PROJECT_TAGS: ProjectTag[] = [...new Set(PROJECTS.flatMap((p) => p.tags))];
