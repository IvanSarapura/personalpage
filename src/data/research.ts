import { DEFAULT_LOCALE, type Locale } from "@/data/locale";

export const RESEARCH_IDS = ["cryptographic-infrastructure", "cardano-chain-of-custody"] as const;

export const CHAIN_OF_CUSTODY_PAPER_URL =
  "https://legalthon-2025.vercel.app/documents/Paper%2001%20La%20blockchain%20como%20tecnologia%20aplicable%20a%20la%20cadena%20de%20custodia.pdf";

export type ResearchId = (typeof RESEARCH_IDS)[number];

export interface ResearchAuthor {
  name: string;
  isSiteOwner?: boolean;
}

export interface ResearchLink {
  href: string;
  label: string;
}

interface ResearchItemBase {
  id: ResearchId;
  status: string;
  dateLabel: string;
  title: string;
  titleLanguage: "es";
  authors: readonly ResearchAuthor[];
  context: string;
  preview: string;
  summary: string;
}

export interface InProgressResearchItem extends ResearchItemBase {
  kind: "in-progress";
  dateCreated: string;
  academicBackground: readonly string[];
}

export interface PublishedResearchItem extends ResearchItemBase {
  kind: "published";
  datePublished: string;
  subtitle: string;
  recognition: string;
  sourceOrganization: string;
  link: ResearchLink;
}

export type ResearchItem = InProgressResearchItem | PublishedResearchItem;

const RESEARCH_BY_LOCALE: Record<Locale, readonly ResearchItem[]> = {
  en: [
    {
      kind: "in-progress",
      id: "cryptographic-infrastructure",
      status: "Research in progress",
      dateLabel: "October, 2026",
      dateCreated: "2026",
      title: "Infraestructura criptográfica implementable para propiciar la seguridad jurídica",
      titleLanguage: "es",
      authors: [{ name: "Sarapura, Iván Enzo", isSiteOwner: true }],
      context: "Developed for UCEMA",
      preview:
        "A legal-technical framework for turning digital signatures, hashes and timestamps into trustworthy documentary evidence.",
      academicBackground: [
        "Law studies — UBA",
        "Blockchain & Digital Finance diploma program — UTN",
      ],
      summary:
        "The research proposes a legal-technical framework for applying digital signatures, hash functions, timestamping and distributed ledgers to documentary and evidentiary processes. It examines which governance, auditability and interoperability conditions let these tools reinforce authenticity, integrity and traceability without replacing existing legal safeguards.",
    },
    {
      kind: "published",
      id: "cardano-chain-of-custody",
      status: "Published paper",
      dateLabel: "November, 2025",
      datePublished: "2025-11-24",
      title: "La blockchain como tecnología aplicable a la cadena de custodia",
      titleLanguage: "es",
      subtitle: "¿Puede esta tecnología mejorar el resguardo de la evidencia?",
      authors: [
        { name: "José G. Damiani Corraro" },
        { name: "Lara M. Quevedo Arcuri" },
        { name: "Iván E. Sarapura", isSiteOwner: true },
      ],
      context:
        "Faculty of Law, University of Buenos Aires · LegalThon, Academic Hackathon on Decentralized Governance",
      preview:
        "A Cardano-based model that preserves the integrity of digital evidence without exposing case data.",
      summary:
        "The research analyzes how a hybrid architecture on Cardano can record hashes and timestamps on-chain while keeping sensitive evidence off-chain. The paper combines comparative law, forensic traceability and guidelines for an Argentine draft bill.",
      recognition: "1st prize — Cardano Academic LegalThon 2025",
      sourceOrganization: "Facultad de Derecho, Universidad de Buenos Aires",
      link: {
        href: CHAIN_OF_CUSTODY_PAPER_URL,
        label: "Read paper (PDF)",
      },
    },
  ],
  es: [
    {
      kind: "in-progress",
      id: "cryptographic-infrastructure",
      status: "Investigación en desarrollo",
      dateLabel: "octubre de 2026",
      dateCreated: "2026",
      title: "Infraestructura criptográfica implementable para propiciar la seguridad jurídica",
      titleLanguage: "es",
      authors: [{ name: "Sarapura, Iván Enzo", isSiteOwner: true }],
      context: "Desarrollado para UCEMA",
      preview:
        "Un marco jurídico-técnico para convertir firmas digitales, hashes y sellos de tiempo en evidencia documental confiable.",
      academicBackground: [
        "Abogacía — UBA",
        "Diplomatura en Blockchain y Finanzas Digitales — UTN",
      ],
      summary:
        "La investigación propone un marco jurídico-técnico para aplicar firmas digitales, funciones hash, sellado de tiempo y registros distribuidos en procesos documentales y probatorios. Analiza qué condiciones de gobernanza, auditabilidad e interoperabilidad permiten que estas herramientas refuercen la autenticidad, integridad y trazabilidad sin sustituir las garantías jurídicas existentes.",
    },
    {
      kind: "published",
      id: "cardano-chain-of-custody",
      status: "Paper publicado",
      dateLabel: "noviembre de 2025",
      datePublished: "2025-11-24",
      title: "La blockchain como tecnología aplicable a la cadena de custodia",
      titleLanguage: "es",
      subtitle: "¿Puede esta tecnología mejorar el resguardo de la evidencia?",
      authors: [
        { name: "José G. Damiani Corraro" },
        { name: "Lara M. Quevedo Arcuri" },
        { name: "Iván E. Sarapura", isSiteOwner: true },
      ],
      context:
        "Facultad de Derecho, Universidad de Buenos Aires · LegalThon, Hackathon Académico de Gobernanza Descentralizada",
      preview:
        "Un modelo sobre Cardano que preserva la integridad de la evidencia digital sin exponer los datos del proceso.",
      summary:
        "La investigación analiza cómo una arquitectura híbrida sobre Cardano puede registrar hashes y sellos de tiempo on-chain mientras conserva la evidencia sensible off-chain. El trabajo combina derecho comparado, trazabilidad forense y lineamientos para un anteproyecto de ley argentino.",
      recognition: "1er premio — LegalThon Académico de Cardano 2025",
      sourceOrganization: "Facultad de Derecho, Universidad de Buenos Aires",
      link: {
        href: CHAIN_OF_CUSTODY_PAPER_URL,
        label: "Leer paper (PDF)",
      },
    },
  ],
};

export function getResearch(locale: Locale): readonly ResearchItem[] {
  return RESEARCH_BY_LOCALE[locale];
}

export const RESEARCH = getResearch(DEFAULT_LOCALE);
