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
        "Curiosity is an EdTech platform for young people and students. Short courses build study habits, and completed work earns points that turn into discounts on books, courses and other educational programs.",
      link: {
        href: "#",
        label: "Visit Curiosity",
      },
    },
    {
      id: "link2pay",
      title: "Link2Pay",
      category: "FinTech",
      status: "Active venture",
      description:
        "Link2Pay is non-custodial payment-link infrastructure on Stellar. Businesses and independent professionals create invoices and share checkout links in XLM, USDC and EURC. Payment settles on-chain, and an API plus TypeScript SDK make the flow easy to integrate.",
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
        "Curiosity es una plataforma EdTech para jóvenes y estudiantes. Los minicursos construyen hábitos de estudio, y el trabajo terminado suma puntos que se canjean por descuentos en libros, cursos y otras formaciones.",
      link: {
        href: "#",
        label: "Visitar Curiosity",
      },
    },
    {
      id: "link2pay",
      title: "Link2Pay",
      category: "FinTech",
      status: "Emprendimiento activo",
      description:
        "Link2Pay es una infraestructura no custodial de links de pago sobre Stellar. Empresas y profesionales independientes crean facturas y comparten checkouts en XLM, USDC y EURC. El pago se confirma on-chain, y una API más un SDK de TypeScript facilitan la integración.",
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
