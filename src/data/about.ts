import { DEFAULT_LOCALE, type Locale } from "@/data/locale";

export interface TimelineEntry {
  title: string;
  detail: string;
  badge?: string;
  /** Año del hito. */
  period: string;
}

export interface EducationItem {
  name: string;
  detail: string;
}

export interface EducationCategory {
  title: string;
  items: EducationItem[];
}

interface AboutContent {
  /** Bio de ~150 palabras — .agents/propuesta.md §7.2. */
  bio: string[];
  /** Journey en orden cronológico. */
  timeline: TimelineEntry[];
  /** Educación y credenciales en 3 categorías — propuesta §5.3. */
  education: EducationCategory[];
}

const ABOUT_BY_LOCALE: Record<Locale, AboutContent> = {
  en: {
    bio: [
      "I'm Iván Enzo Sarapura. I study commercial law at UBA and blockchain and digital finance at UTN, and I build software where the two meet.",
      "The problem I keep coming back to is turning real-world regulation into reliable, executable logic. With my teams I won the Prediction Markets track at GenLayer's Bradbury Builders Hackathon, where we started Proven, a peer-to-peer dispute-resolution protocol. I also co-authored an awarded paper on digital chain of custody over Cardano, built Sana at the Kaszek & Anthropic Hackathon, reached the finals of ITBA's Trama BootCamp with Lupio, and was selected for Founder School at Crecimiento & Lucero Ventures.",
      "Today I'm developing EcoTrace at UTN and an AI compliance oracle that crosses ANMAT, SENASA and FAO datasets with Argentina's food code.",
      "If you work at the same edge between law and software, write to me. I'm most useful when the problem is specific.",
    ],
    timeline: [
      {
        title: "Legalthon on Decentralized Governance — UBA · Cardano",
        period: "2025",
        detail: "1st place; co-authored the paper on digital chain of custody.",
        badge: "1st place",
      },
      {
        title: "Kaszek & Anthropic Hackathon — Buenos Aires",
        period: "2025",
        detail: "Built Sana, an AI agent for post-visit medical care.",
      },
      {
        title: "Zero to Agent — Vercel",
        period: "2025",
        detail: "Prototyped a type-safe agent with v0, the Vercel AI SDK and MCP.",
      },
      {
        title: "Trama Entrepreneurship BootCamp — ITBA",
        period: "2026",
        detail: "Finalist with Lupio, evaluated by real investor panels.",
        badge: "Finalist",
      },
      {
        title: "GenLayer Bradbury Builders Hackathon",
        period: "2026",
        detail: "1st place, Prediction Markets track; Proven is still being built.",
        badge: "1st place",
      },
      {
        title: "Founder School — Crecimiento & Lucero Ventures",
        period: "2026",
        detail: "Selected for the intensive startup-building program.",
        badge: "Selected",
      },
    ],
    education: [
      {
        title: "Formal education",
        items: [
          {
            name: "Law, Business orientation — Universidad de Buenos Aires (UBA)",
            detail: "Commercial, corporate and IP law. In progress.",
          },
          {
            name: "Diploma in Blockchain & Digital Finance — Universidad Tecnológica Nacional (UTN)",
            detail: "Smart contracts, asset tokenization and DLT regulatory frameworks.",
          },
          {
            name: "Continuous technical training",
            detail: "Ongoing coursework across blockchain, AI and web development.",
          },
        ],
      },
      {
        title: "Acceleration & business validation",
        items: [
          {
            name: "Founder School — Crecimiento & Lucero Ventures",
            detail: "Intensive program on building, validating and scaling tech startups.",
          },
          {
            name: "Trama Entrepreneurship BootCamp — ITBA",
            detail: "Go-to-market strategy, product design and venture funding.",
          },
        ],
      },
      {
        title: "Awards & recognition",
        items: [
          {
            name: "1st place — Prediction Markets, GenLayer Bradbury Builders Hackathon",
            detail: "Proven: decentralized dispute resolution on GenLayer.",
          },
          {
            name: "1st place — Legalthon on Decentralized Governance (UBA, Cardano)",
            detail: "Co-authored the chain-of-custody digitalization paper.",
          },
          {
            name: "Finalist — Trama BootCamp (ITBA)",
            detail: "Lupio: business-model validation for early-stage founders.",
          },
        ],
      },
    ],
  },
  es: {
    bio: [
      "Soy Iván Enzo Sarapura. Estudio derecho comercial en la UBA y blockchain y finanzas digitales en la UTN, y construyo software donde se juntan ambas.",
      "El problema al que siempre vuelvo es convertir la regulación del mundo real en lógica ejecutable y confiable. Con mis equipos gané el track de Prediction Markets del GenLayer Bradbury Builders Hackathon, donde empezamos Proven, un protocolo peer-to-peer de resolución de disputas. También soy coautor de un paper premiado sobre cadena de custodia digital en Cardano, construí Sana en el Kaszek & Anthropic Hackathon, llegué a la final del BootCamp de Trama (ITBA) con Lupio y fui seleccionado para Founder School en Crecimiento & Lucero Ventures.",
      "Hoy desarrollo EcoTrace en la UTN y un oráculo de cumplimiento con IA que cruza bases de ANMAT, SENASA y FAO con el código alimentario argentino.",
      "Si trabajás en ese mismo borde entre el derecho y el software, escribime. Aporto más cuando el problema es específico.",
    ],
    timeline: [
      {
        title: "Legalthon de Gobernanza Descentralizada — UBA · Cardano",
        period: "2025",
        detail: "1er puesto; co-autoría del paper sobre cadena de custodia digital.",
        badge: "1er puesto",
      },
      {
        title: "Kaszek & Anthropic Hackathon — Buenos Aires",
        period: "2025",
        detail: "Construí Sana, un agente de IA para el cuidado post-consulta.",
      },
      {
        title: "Zero to Agent — Vercel",
        period: "2025",
        detail: "Prototipé un agente type-safe con v0, el Vercel AI SDK y MCP.",
      },
      {
        title: "BootCamp Emprendedor de Trama — ITBA",
        period: "2026",
        detail: "Finalista con Lupio, evaluado por paneles de inversores reales.",
        badge: "Finalista",
      },
      {
        title: "GenLayer Bradbury Builders Hackathon",
        period: "2026",
        detail: "1er puesto, track de Prediction Markets; Proven sigue en construcción.",
        badge: "1er puesto",
      },
      {
        title: "Founder School — Crecimiento & Lucero Ventures",
        period: "2026",
        detail: "Seleccionado para el programa intensivo de construcción de startups.",
        badge: "Seleccionado",
      },
    ],
    education: [
      {
        title: "Educación formal",
        items: [
          {
            name: "Abogacía, orientación empresarial — Universidad de Buenos Aires (UBA)",
            detail: "Derecho comercial, societario y de la propiedad intelectual. En curso.",
          },
          {
            name: "Diplomatura en Blockchain y Finanzas Digitales — Universidad Tecnológica Nacional (UTN)",
            detail: "Contratos inteligentes, tokenización de activos y marcos regulatorios DLT.",
          },
          {
            name: "Formación técnica continua",
            detail: "Cursos en blockchain, IA y desarrollo web de forma sostenida.",
          },
        ],
      },
      {
        title: "Aceleración y validación de negocio",
        items: [
          {
            name: "Founder School — Crecimiento & Lucero Ventures",
            detail: "Programa intensivo de construcción, validación y escalado de startups.",
          },
          {
            name: "BootCamp Emprendedor de Trama — ITBA",
            detail: "Estrategia de go-to-market, diseño de producto e inversión de riesgo.",
          },
        ],
      },
      {
        title: "Logros y reconocimientos",
        items: [
          {
            name: "1er puesto — Prediction Markets, GenLayer Bradbury Builders Hackathon",
            detail: "Proven: resolución descentralizada de disputas sobre GenLayer.",
          },
          {
            name: "1er puesto — Legalthon de Gobernanza Descentralizada (UBA, Cardano)",
            detail: "Co-autoría del paper de digitalización de la cadena de custodia.",
          },
          {
            name: "Finalista — BootCamp de Trama (ITBA)",
            detail: "Lupio: validación de modelos de negocio para founders early-stage.",
          },
        ],
      },
    ],
  },
};

export function getAbout(locale: Locale): AboutContent {
  return ABOUT_BY_LOCALE[locale];
}

export const ABOUT: AboutContent = ABOUT_BY_LOCALE[DEFAULT_LOCALE];

/** Stack mostrado en /about — solo tecnologías usadas en proyectos reales. */
export const STACK = [
  "TypeScript",
  "Next.js",
  "Tailwind CSS",
  "Solidity",
  "Hyperledger Fabric",
  "GenLayer",
  "Claude API",
  "Vercel AI SDK",
  "RAG",
] as const;
