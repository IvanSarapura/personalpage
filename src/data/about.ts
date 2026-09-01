import { type Locale } from "@/data/locale";

export const ABOUT_SECTION_IDS = {
  method: "about-method",
  formation: "about-formation",
} as const;

type AboutSectionId = (typeof ABOUT_SECTION_IDS)[keyof typeof ABOUT_SECTION_IDS];

interface AboutIndexItem {
  id: AboutSectionId;
  label: string;
}

interface Principle {
  title: string;
  description: string;
}

interface FormationItem {
  title: string;
  institution: string;
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
  title: string;
  introduction: readonly string[];
  index: {
    label: string;
    items: readonly AboutIndexItem[];
  };
  principles: {
    heading: string;
    description: string;
    items: readonly Principle[];
  };
  formation: {
    heading: string;
    description: string;
    educationHeading: string;
    stackHeading: string;
    groups: readonly FormationGroup[];
    stackGroupTitles: StackGroupTitles;
  };
}

export interface AboutProfileData extends Omit<AboutCopy, "formation"> {
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
      "Iván Sarapura studies business law and builds products as a freelancer, with interests in legaltech, blockchain, artificial intelligence and AI Safety research.",
  },
  es: {
    title: "Sobre mí",
    description:
      "Iván Sarapura estudia derecho empresarial y construye productos como freelancer, con intereses en legaltech, blockchain, inteligencia artificial e investigación en AI Safety.",
  },
};

const ABOUT_COPY: Record<Locale, AboutCopy> = {
  en: {
    title: "About me",
    introduction: [
      "I'm Iván Sarapura. I study business law and build products as a freelancer. My work and interests connect legaltech, blockchain, product development, artificial intelligence and AI Safety research.",
      "I develop and study systems for contexts where rules, technology and real-world decisions have to work together.",
    ],
    index: {
      label: "On this page",
      items: [
        { id: ABOUT_SECTION_IDS.method, label: "Method" },
        { id: ABOUT_SECTION_IDS.formation, label: "Formation" },
      ],
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
              title: "Law, Business orientation",
              institution: "University of Buenos Aires",
              detail: "Commercial, corporate and intellectual-property law. In progress.",
            },
            {
              title: "Diploma in Blockchain & Digital Finance",
              institution: "National Technological University",
              detail: "Smart contracts, asset tokenization and regulatory frameworks for DLT.",
            },
          ],
        },
        {
          title: "Product & venture formation",
          items: [
            {
              title: "Founder School",
              institution: "Aleph Crecimiento & Protocol Labs",
              detail: "Intensive company-building program in the Crecimiento ecosystem.",
            },
            {
              title: "Trama Entrepreneurship BootCamp",
              institution: "Buenos Aires Institute of Technology",
              detail: "Product validation, go-to-market and investor evaluation.",
            },
          ],
        },
      ],
      stackGroupTitles: ["Product engineering", "AI & retrieval", "Verifiable systems"],
    },
  },
  es: {
    title: "Sobre mí",
    introduction: [
      "Soy Iván Sarapura. Estudio derecho empresarial y construyo productos como freelancer. Mi trabajo y mis intereses conectan legaltech, blockchain, desarrollo de producto, inteligencia artificial e investigación en AI Safety.",
      "Desarrollo y estudio sistemas para contextos donde las reglas, la tecnología y las decisiones concretas tienen que funcionar juntas.",
    ],
    index: {
      label: "En esta página",
      items: [
        { id: ABOUT_SECTION_IDS.method, label: "Método" },
        { id: ABOUT_SECTION_IDS.formation, label: "Formación" },
      ],
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
              title: "Abogacía, orientación empresarial",
              institution: "Universidad de Buenos Aires",
              detail: "Derecho comercial, societario y de la propiedad intelectual. En curso.",
            },
            {
              title: "Diplomatura en Blockchain & Finanzas Digitales",
              institution: "Universidad Tecnológica Nacional",
              detail: "Contratos inteligentes, tokenización de activos y marcos regulatorios DLT.",
            },
          ],
        },
        {
          title: "Formación de producto y negocio",
          items: [
            {
              title: "Founder School",
              institution: "Aleph Crecimiento & Protocol Labs",
              detail: "Programa intensivo de construcción de empresas del ecosistema Crecimiento.",
            },
            {
              title: "Trama Entrepreneurship Bootcamp",
              institution: "Instituto Tecnológico de Buenos Aires",
              detail: "Validación de producto, go-to-market y evaluación ante inversores.",
            },
          ],
        },
      ],
      stackGroupTitles: ["Ingeniería de producto", "IA y recuperación", "Sistemas verificables"],
    },
  },
};

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
  return {
    ...copy,
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
