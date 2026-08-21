import { DEFAULT_LOCALE, type Locale } from "@/data/locale";
import { CHAIN_OF_CUSTODY_PAPER_URL } from "@/data/research";

export const RECOGNITION_IDS = [
  "legalthon-uba-cardano",
  "genlayer-bradbury-builders",
  "trama-bootcamp",
  "founder-school",
] as const;

export type RecognitionId = (typeof RECOGNITION_IDS)[number];

export type RecognitionKind =
  | "academic-award"
  | "product-award"
  | "venture-recognition"
  | "founder-program";

type EvidenceLabelId =
  | "read-paper"
  | "official-genlayer-result"
  | "founder-school-program"
  | "lupio-app";

interface ExternalEvidenceBase {
  type: "external";
  href: `https://${string}`;
  labelId: EvidenceLabelId;
}

type RecognitionEvidenceBase = ExternalEvidenceBase;

export type RecognitionEvidence = Omit<ExternalEvidenceBase, "labelId"> & { label: string };

interface RecognitionBase {
  id: RecognitionId;
  kind: RecognitionKind;
  year: number;
  evidence: readonly RecognitionEvidenceBase[];
}

interface RecognitionCopy {
  eyebrow: string;
  outcome?: string;
  title?: string;
  issuer: string;
  summary: string;
}

export type Recognition = Omit<RecognitionBase, "evidence"> &
  RecognitionCopy & {
    evidence: readonly RecognitionEvidence[];
  };

const RECOGNITION_BASES = [
  {
    id: "legalthon-uba-cardano",
    kind: "academic-award",
    year: 2025,
    evidence: [
      {
        type: "external",
        href: CHAIN_OF_CUSTODY_PAPER_URL,
        labelId: "read-paper",
      },
    ],
  },
  {
    id: "genlayer-bradbury-builders",
    kind: "product-award",
    year: 2026,
    evidence: [
      {
        type: "external",
        href: "https://portal.genlayer.foundation/hackathon-winners",
        labelId: "official-genlayer-result",
      },
    ],
  },
  {
    id: "trama-bootcamp",
    kind: "venture-recognition",
    year: 2026,
    evidence: [
      {
        type: "external",
        href: "https://lupia.vercel.app/",
        labelId: "lupio-app",
      },
    ],
  },
  {
    id: "founder-school",
    kind: "founder-program",
    year: 2026,
    evidence: [
      {
        type: "external",
        href: "https://founderschool.build",
        labelId: "founder-school-program",
      },
    ],
  },
] as const satisfies readonly RecognitionBase[];

const EVIDENCE_LABELS: Record<Locale, Record<EvidenceLabelId, string>> = {
  en: {
    "read-paper": "Read the paper",
    "official-genlayer-result": "Official GenLayer result",
    "founder-school-program": "About Founder School",
    "lupio-app": "Visit Lupio",
  },
  es: {
    "read-paper": "Leer el paper",
    "official-genlayer-result": "Resultado oficial de GenLayer",
    "founder-school-program": "Sobre Founder School",
    "lupio-app": "Visitar Lupio",
  },
};

const RECOGNITION_COPY: Record<Locale, Record<RecognitionId, RecognitionCopy>> = {
  en: {
    "legalthon-uba-cardano": {
      eyebrow: "Academic recognition",
      title: "First prize for legaltech research",
      issuer: "Comunidad Cardano · Facultad de Derecho",
      summary:
        "Co-authored research proposing a hybrid Cardano architecture for preserving digital evidence integrity, forensic traceability and procedural guarantees.",
    },
    "genlayer-bradbury-builders": {
      eyebrow: "Product award",
      outcome: "Prediction Markets track winner",
      issuer: "GenLayer · Bradbury Builders Hackathon",
      summary:
        "A peer-to-peer challenge market where AI-native consensus evaluates submitted evidence and resolves subjective disputes.",
    },
    "trama-bootcamp": {
      eyebrow: "Venture recognition",
      outcome: "Finalist",
      issuer: "Trama Entrepreneurship BootCamp · ITBA",
      summary:
        "Business-model validation for early-stage founders, developed and evaluated before panels of investors and mentors.",
    },
    "founder-school": {
      eyebrow: "Founder program",
      outcome: "Selected for Founder School · FS26-2",
      issuer: "Crecimiento ecosystem and Protocol Labs",
      summary:
        "Selected for an intensive program focused on building, validating and scaling technology startups.",
    },
  },
  es: {
    "legalthon-uba-cardano": {
      eyebrow: "Reconocimiento académico",
      title: "Primer premio por investigación en legaltech",
      issuer: "Comunidad Cardano · Facultad de Derecho",
      summary:
        "Investigación en coautoría que propone una arquitectura híbrida sobre Cardano para preservar la integridad de la evidencia digital, la trazabilidad forense y las garantías procesales.",
    },
    "genlayer-bradbury-builders": {
      eyebrow: "Premio de producto",
      outcome: "Ganador del track Prediction Markets",
      issuer: "GenLayer · Bradbury Builders Hackathon",
      summary:
        "Un mercado de desafíos peer-to-peer donde el consenso nativo con IA evalúa la evidencia aportada y resuelve disputas subjetivas.",
    },
    "trama-bootcamp": {
      eyebrow: "Reconocimiento emprendedor",
      outcome: "Finalista",
      issuer: "BootCamp Emprendedor de Trama · ITBA",
      summary:
        "Validación de modelos de negocio para founders early-stage, desarrollada y evaluada ante paneles de inversores y mentores.",
    },
    "founder-school": {
      eyebrow: "Programa para founders",
      outcome: "Seleccionado para Founder School · FS26-2",
      issuer: "Ecosistema Crecimiento y Protocol Labs",
      summary:
        "Seleccionado para un programa intensivo enfocado en construir, validar y escalar startups tecnológicas.",
    },
  },
};

function localizeEvidence(evidence: RecognitionEvidenceBase, locale: Locale): RecognitionEvidence {
  return {
    type: evidence.type,
    href: evidence.href,
    label: EVIDENCE_LABELS[locale][evidence.labelId],
  };
}

function buildRecognitions(locale: Locale): Recognition[] {
  return RECOGNITION_BASES.map((base) => ({
    ...base,
    ...RECOGNITION_COPY[locale][base.id],
    evidence: base.evidence.map((item) => localizeEvidence(item, locale)),
  }));
}

const RECOGNITIONS_BY_LOCALE: Record<Locale, Recognition[]> = {
  en: buildRecognitions("en"),
  es: buildRecognitions("es"),
};

/** Fuente canónica de la sección Track record. Los IDs, años y destinos son
 * independientes del idioma; únicamente se localiza la presentación. */
export function getRecognitions(locale: Locale): readonly Recognition[] {
  return RECOGNITIONS_BY_LOCALE[locale];
}

export const RECOGNITIONS = RECOGNITIONS_BY_LOCALE[DEFAULT_LOCALE];
