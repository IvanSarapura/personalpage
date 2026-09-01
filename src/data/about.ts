import { type Locale } from "@/data/locale";
import { getProjects, type Project, type ProjectSlug } from "@/data/projects";
import { getRecognitions, type Recognition } from "@/data/recognition";

export const ABOUT_SECTION_IDS = {
  work: "about-work",
  method: "about-method",
  evidence: "about-evidence",
  formation: "about-formation",
} as const;

export const ABOUT_PROJECT_SLUGS = [
  "ecotrace",
  "food-code-oracle",
  "sana",
  "zero-to-agent",
] as const satisfies readonly ProjectSlug[];

type AboutSectionId = (typeof ABOUT_SECTION_IDS)[keyof typeof ABOUT_SECTION_IDS];

interface AboutIndexItem {
  id: AboutSectionId;
  label: string;
}

interface TranslationStep {
  term: string;
  description: string;
}

interface Principle {
  title: string;
  description: string;
}

interface FormationItem {
  name: string;
  detail: string;
}

interface FormationGroup {
  title: string;
  items: readonly FormationItem[];
}

interface StackGroup {
  title: string;
  items: readonly string[];
}

type StackGroupTitles = readonly [string, string, string];

interface AboutMetadata {
  title: string;
  description: string;
}

interface AboutCopy {
  eyebrow: string;
  title: string;
  introduction: readonly string[];
  translation: {
    heading: string;
    description: string;
    steps: readonly TranslationStep[];
  };
  index: {
    label: string;
    items: readonly AboutIndexItem[];
  };
  work: {
    heading: string;
    description: string;
    linkLabel: string;
  };
  principles: {
    heading: string;
    description: string;
    items: readonly Principle[];
  };
  evidence: {
    heading: string;
    description: string;
    opensInNewTab: string;
  };
  formation: {
    heading: string;
    description: string;
    educationHeading: string;
    stackHeading: string;
    groups: readonly FormationGroup[];
    stackGroupTitles: StackGroupTitles;
  };
  contact: {
    heading: string;
    description: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
}

export interface AboutProfileData extends Omit<AboutCopy, "work" | "evidence" | "formation"> {
  work: AboutCopy["work"] & { projects: readonly Project[] };
  evidence: AboutCopy["evidence"] & { recognitions: readonly Recognition[] };
  formation: Omit<AboutCopy["formation"], "stackGroupTitles"> & {
    stackGroups: readonly StackGroup[];
  };
}

const STACK_TECHNOLOGIES = [
  ["TypeScript", "Next.js", "Tailwind CSS"],
  ["Claude API", "Vercel AI SDK", "RAG"],
  ["Solidity", "Hyperledger Fabric", "GenLayer"],
] as const;

const ABOUT_METADATA: Record<Locale, AboutMetadata> = {
  en: {
    title: "About",
    description:
      "Iván Sarapura builds verifiable software at the intersection of commercial law, blockchain, AI compliance and product design.",
  },
  es: {
    title: "Sobre mí",
    description:
      "Iván Sarapura construye software verificable en la intersección del derecho comercial, blockchain, cumplimiento con IA y diseño de producto.",
  },
};

const ABOUT_COPY: Record<Locale, AboutCopy> = {
  en: {
    eyebrow: "About · Legal engineering",
    title: "From legal rule to executable system.",
    introduction: [
      "I'm Iván Enzo Sarapura. I study commercial law at UBA and blockchain and digital finance at UTN. I build software where those disciplines have to work together.",
      "My focus is the translation layer: turning obligations, evidence and institutional decisions into systems people can inspect, test and revise.",
    ],
    translation: {
      heading: "One translation, three disciplines",
      description:
        "The work moves in one direction, but every implementation has to survive review from all three sides.",
      steps: [
        {
          term: "Law",
          description: "Rules, evidence and compliance.",
        },
        {
          term: "Executable regulation",
          description: "Obligations, decisions and evidence requirements.",
        },
        {
          term: "Code",
          description: "Protocols, AI and interfaces.",
        },
      ],
    },
    index: {
      label: "On this page",
      items: [
        { id: ABOUT_SECTION_IDS.work, label: "Work" },
        { id: ABOUT_SECTION_IDS.method, label: "Method" },
        { id: ABOUT_SECTION_IDS.evidence, label: "Evidence" },
        { id: ABOUT_SECTION_IDS.formation, label: "Formation" },
      ],
    },
    work: {
      heading: "Four working proofs",
      description:
        "Each project tests the same thesis in a different institution: environmental reporting, food compliance, post-visit care and AI-agent tooling.",
      linkLabel: "Read the case study",
    },
    principles: {
      heading: "Working principles",
      description: "The standards I use when rules become product decisions.",
      items: [
        {
          title: "Translate the rule",
          description:
            "Identify the authority, obligation and consequence before choosing an architecture.",
        },
        {
          title: "Design the proof",
          description: "Define which sources, events and records make each result auditable.",
        },
        {
          title: "Build the interface",
          description:
            "Turn that logic into a product people can understand, operate and challenge.",
        },
      ],
    },
    evidence: {
      heading: "Claims need sources",
      description:
        "Published work, official results and programs provide a record outside this portfolio.",
      opensInNewTab: "opens in a new tab",
    },
    formation: {
      heading: "Formation for both sides of the interface",
      description:
        "Formal legal study, applied technical training and founder programs shape how I frame and ship the work.",
      educationHeading: "Education & programs",
      stackHeading: "Operating stack",
      groups: [
        {
          title: "Formal education",
          items: [
            {
              name: "Law, Business orientation — Universidad de Buenos Aires",
              detail: "Commercial, corporate and intellectual-property law. In progress.",
            },
            {
              name: "Diploma in Blockchain & Digital Finance — UTN",
              detail: "Smart contracts, asset tokenization and regulatory frameworks for DLT.",
            },
          ],
        },
        {
          title: "Product & venture formation",
          items: [
            {
              name: "Founder School",
              detail: "Intensive company-building program in the Crecimiento ecosystem.",
            },
            {
              name: "Trama Entrepreneurship BootCamp — ITBA",
              detail: "Product validation, go-to-market and investor evaluation.",
            },
          ],
        },
      ],
      stackGroupTitles: ["Product engineering", "AI & retrieval", "Verifiable systems"],
    },
    contact: {
      heading: "Have a specific problem at the edge of law and software?",
      description: "Tell me what must be interpreted, verified or made executable.",
      primaryLabel: "Start a conversation",
      secondaryLabel: "View all projects",
    },
  },
  es: {
    eyebrow: "Sobre mí · Ingeniería legal",
    title: "De la regla jurídica al sistema ejecutable.",
    introduction: [
      "Soy Iván Enzo Sarapura. Estudio derecho comercial en la UBA y blockchain y finanzas digitales en la UTN. Construyo software donde esas disciplinas tienen que trabajar juntas.",
      "Me concentro en la capa de traducción: convertir obligaciones, evidencia y decisiones institucionales en sistemas que se puedan inspeccionar, probar y revisar.",
    ],
    translation: {
      heading: "Una traducción, tres disciplinas",
      description:
        "El trabajo avanza en una dirección, pero cada implementación tiene que resistir la revisión de los tres lados.",
      steps: [
        {
          term: "Derecho",
          description: "Reglas, evidencia y cumplimiento.",
        },
        {
          term: "Regulación ejecutable",
          description: "Obligaciones, decisiones y requisitos de evidencia.",
        },
        {
          term: "Código",
          description: "Protocolos, IA e interfaces.",
        },
      ],
    },
    index: {
      label: "En esta página",
      items: [
        { id: ABOUT_SECTION_IDS.work, label: "Trabajo" },
        { id: ABOUT_SECTION_IDS.method, label: "Método" },
        { id: ABOUT_SECTION_IDS.evidence, label: "Evidencia" },
        { id: ABOUT_SECTION_IDS.formation, label: "Formación" },
      ],
    },
    work: {
      heading: "Cuatro pruebas en funcionamiento",
      description:
        "Cada proyecto pone a prueba la misma tesis en una institución distinta: reportes ambientales, cumplimiento alimentario, cuidado post-consulta y herramientas para agentes de IA.",
      linkLabel: "Leer el caso de estudio",
    },
    principles: {
      heading: "Principios de trabajo",
      description:
        "Los criterios que aplico cuando una regla se convierte en decisión de producto.",
      items: [
        {
          title: "Traducir la regla",
          description:
            "Identificar la autoridad, la obligación y la consecuencia antes de elegir una arquitectura.",
        },
        {
          title: "Diseñar la prueba",
          description: "Definir qué fuentes, eventos y registros vuelven auditable cada resultado.",
        },
        {
          title: "Construir la interfaz",
          description:
            "Convertir esa lógica en un producto que las personas puedan entender, operar y cuestionar.",
        },
      ],
    },
    evidence: {
      heading: "Las afirmaciones necesitan fuentes",
      description:
        "El trabajo publicado, los resultados oficiales y los programas dejan un registro fuera de este portfolio.",
      opensInNewTab: "se abre en una pestaña nueva",
    },
    formation: {
      heading: "Formación para los dos lados de la interfaz",
      description:
        "El estudio jurídico formal, la formación técnica aplicada y los programas para founders definen cómo encuadro y construyo cada trabajo.",
      educationHeading: "Educación y programas",
      stackHeading: "Stack de trabajo",
      groups: [
        {
          title: "Educación formal",
          items: [
            {
              name: "Abogacía, orientación empresarial — Universidad de Buenos Aires",
              detail: "Derecho comercial, societario y de la propiedad intelectual. En curso.",
            },
            {
              name: "Diplomatura en Blockchain y Finanzas Digitales — UTN",
              detail: "Contratos inteligentes, tokenización de activos y marcos regulatorios DLT.",
            },
          ],
        },
        {
          title: "Formación de producto y negocio",
          items: [
            {
              name: "Founder School",
              detail: "Programa intensivo de construcción de empresas del ecosistema Crecimiento.",
            },
            {
              name: "BootCamp Emprendedor de Trama — ITBA",
              detail: "Validación de producto, go-to-market y evaluación ante inversores.",
            },
          ],
        },
      ],
      stackGroupTitles: ["Ingeniería de producto", "IA y recuperación", "Sistemas verificables"],
    },
    contact: {
      heading: "¿Tenés un problema concreto en la intersección entre derecho y software?",
      description: "Contame qué necesitás interpretar, verificar o volver ejecutable.",
      primaryLabel: "Iniciar una conversación",
      secondaryLabel: "Ver todos los proyectos",
    },
  },
};

function selectProjects(locale: Locale): readonly Project[] {
  const projects = getProjects(locale);
  const bySlug = new Map(projects.map((project) => [project.slug, project]));

  return ABOUT_PROJECT_SLUGS.map((slug) => {
    const project = bySlug.get(slug);
    if (!project) throw new Error(`Missing About project: ${slug}`);
    return project;
  });
}

function buildStackGroups(copy: AboutCopy): readonly StackGroup[] {
  const titles = copy.formation.stackGroupTitles;

  return [
    { title: titles[0], items: STACK_TECHNOLOGIES[0] },
    { title: titles[1], items: STACK_TECHNOLOGIES[1] },
    { title: titles[2], items: STACK_TECHNOLOGIES[2] },
  ];
}

export function getAboutMetadata(locale: Locale): AboutMetadata {
  return ABOUT_METADATA[locale];
}

export function getAboutProfile(locale: Locale): AboutProfileData {
  const copy = ABOUT_COPY[locale];
  const projects = selectProjects(locale);

  return {
    ...copy,
    work: { ...copy.work, projects },
    evidence: { ...copy.evidence, recognitions: getRecognitions(locale) },
    formation: {
      heading: copy.formation.heading,
      description: copy.formation.description,
      educationHeading: copy.formation.educationHeading,
      stackHeading: copy.formation.stackHeading,
      groups: copy.formation.groups,
      stackGroups: buildStackGroups(copy),
    },
  };
}
