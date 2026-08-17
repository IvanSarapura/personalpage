import { DEFAULT_LOCALE, type Locale } from "@/data/locale";

export const CURRENT_WORK_IDS = ["curiosity", "link2pay"] as const;

export type CurrentWorkId = (typeof CURRENT_WORK_IDS)[number];

interface CurrentWorkLink {
  href: string;
  label: string;
}

export interface CurrentWorkItem {
  id: CurrentWorkId;
  title: string;
  category: string;
  status: string;
  description: string;
  highlights: readonly string[];
  link?: CurrentWorkLink;
}

const CURRENT_WORK_BY_LOCALE: Record<Locale, readonly CurrentWorkItem[]> = {
  en: [
    {
      id: "curiosity",
      title: "Curiosity",
      category: "EdTech",
      status: "In development",
      description:
        "Curiosity is an EdTech platform for young people and students. Users complete short courses, earn points and redeem them for discounts on books, courses and other educational programs.",
      highlights: ["Micro-courses", "Points", "Learning rewards"],
    },
    {
      id: "link2pay",
      title: "Link2Pay",
      category: "FinTech",
      status: "Active venture",
      description:
        "Link2Pay is non-custodial payment-link infrastructure on Stellar. It lets businesses and independent professionals create invoices and share checkout links in XLM, USDC and EURC, with on-chain confirmation plus an API and TypeScript SDK for integrations.",
      highlights: ["Stellar", "Payment links", "API & SDK"],
      link: {
        href: "https://www.link2pay.xyz",
        label: "Visit Link2Pay",
      },
    },
  ],
  es: [
    {
      id: "curiosity",
      title: "Curiosity",
      category: "EdTech",
      status: "En desarrollo",
      description:
        "Curiosity es una plataforma EdTech para jóvenes y estudiantes. Las personas completan minicursos, suman puntos y los canjean por descuentos en libros, cursos y otras formaciones.",
      highlights: ["Minicursos", "Puntos", "Beneficios educativos"],
    },
    {
      id: "link2pay",
      title: "Link2Pay",
      category: "FinTech",
      status: "Emprendimiento activo",
      description:
        "Link2Pay es una infraestructura no custodial de links de pago sobre Stellar. Permite a empresas y profesionales independientes crear facturas y compartir checkouts en XLM, USDC y EURC, con confirmación on-chain, una API y un SDK de TypeScript para integraciones.",
      highlights: ["Stellar", "Links de pago", "API y SDK"],
      link: {
        href: "https://www.link2pay.xyz",
        label: "Visitar Link2Pay",
      },
    },
  ],
};

export function getCurrentWork(locale: Locale): readonly CurrentWorkItem[] {
  return CURRENT_WORK_BY_LOCALE[locale];
}

export const CURRENT_WORK = getCurrentWork(DEFAULT_LOCALE);
