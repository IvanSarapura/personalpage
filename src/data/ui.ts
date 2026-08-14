import { DEFAULT_LOCALE, type Locale } from "@/data/locale";

/** Diccionario tipado de strings de UI (chrome + secciones), por locale.
 *  El contenido largo (proyectos, about, señales) vive en sus data files;
 *  acá van los textos sueltos de componentes y páginas. */
export interface UiDict {
  skipLink: string;
  navbar: {
    homeAriaLabel: string;
    mainNavAriaLabel: string;
    openMenu: string;
    closeMenu: string;
    switchToLight: string;
    switchToDark: string;
    lightLabel: string;
    darkLabel: string;
    menuDialogLabel: string;
    menuNavAriaLabel: string;
    navigationLabel: string;
    switchLocale: string;
    switchLocaleShort: string;
  };
  hero: {
    ariaLabel: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  focus: {
    ariaLabel: string;
    heading: string;
    subheading: string;
  };
  building: {
    ariaLabel: string;
    heading: string;
    allCaseStudies: string;
    expand: string;
    collapse: string;
  };
  stats: {
    ariaLabel: string;
    heading: string;
    subheading: string;
  };
  contact: {
    ariaLabel: string;
    heading: string;
    subheading: string;
    emailCta: string;
  };
  footer: {
    ariaLabel: string;
    navAriaLabel: string;
    homeAriaLabel: string;
    onLinkedIn: string;
    onGitHub: string;
    rights: string;
  };
  projectsPage: {
    title: string;
    intro: string;
    description: string;
    filterGroupLabel: string;
    filterAll: string;
  };
  caseStudy: {
    backToProjects: string;
    origin: string;
    mechanism: string;
    future: string;
    liveDemo: string;
    repo: string;
    paper: string;
    readCaseStudy: string;
    getInTouch: string;
    stackAriaLabel: string;
    stackAndTagsAriaLabel: string;
  };
  aboutPage: {
    title: string;
    description: string;
    ariaLabel: string;
    journey: string;
    education: string;
    stack: string;
  };
  blog: {
    title: string;
    heading: string;
    description: string;
    entries: string;
    featured: string;
    archive: string;
    tagsLabel: string;
    featuredImageAlt: string;
    readingTime: string;
    backToBlog: string;
    langBadge: Record<Locale, string>;
  };
  notFound: {
    title: string;
    message: string;
    backHome: string;
  };
}

const UI_BY_LOCALE: Record<Locale, UiDict> = {
  en: {
    skipLink: "Skip to main content",
    navbar: {
      homeAriaLabel: "Iván Sarapura — home",
      mainNavAriaLabel: "Main navigation",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      switchToLight: "Switch to light mode",
      switchToDark: "Switch to dark mode",
      lightLabel: "Light",
      darkLabel: "Dark",
      menuDialogLabel: "Main navigation menu",
      menuNavAriaLabel: "Fullscreen navigation",
      navigationLabel: "Navigation",
      switchLocale: "Ver en español",
      switchLocaleShort: "ES",
    },
    hero: {
      ariaLabel: "Introduction",
      subheadline:
        "I build software where law meets code — type-safe web apps, smart contracts and AI for regulatory compliance. Law student (UBA), blockchain developer (UTN), hackathon winner.",
      ctaPrimary: "View my work",
      ctaSecondary: "Get in touch",
    },
    focus: {
      ariaLabel: "What I do",
      heading: "Where law meets code.",
      subheading:
        "Six areas of work, each backed by a shipped project — from subjective-logic smart contracts to AI agents for regulatory compliance.",
    },
    building: {
      ariaLabel: "Case studies",
      heading: "What I'm building",
      allCaseStudies: "All case studies →",
      expand: "Expand",
      collapse: "Collapse",
    },
    stats: {
      ariaLabel: "Track record",
      heading: "Track record",
      subheading:
        "Hackathons won, a published paper and programs that back the work — facts, not promises.",
    },
    contact: {
      ariaLabel: "Contact",
      heading: "Let's build something.",
      subheading: "Open to opportunities, collaborations and good conversations.",
      emailCta: "Email me",
    },
    footer: {
      ariaLabel: "Footer",
      navAriaLabel: "Footer navigation",
      homeAriaLabel: "Iván Sarapura — home",
      onLinkedIn: "Iván Sarapura on LinkedIn",
      onGitHub: "Iván Sarapura on GitHub",
      rights: "All rights reserved.",
    },
    projectsPage: {
      title: "Projects",
      intro:
        "Engineering case studies, not screenshots: the problem behind each project, the architecture chosen and where it goes next.",
      description:
        "Case studies at the intersection of law and code: decentralized dispute resolution, digital evidence on Cardano, environmental traceability and AI compliance.",
      filterGroupLabel: "Filter projects by tag",
      filterAll: "All",
    },
    caseStudy: {
      backToProjects: "← All projects",
      origin: "Origin",
      mechanism: "Mechanism",
      future: "What's next",
      liveDemo: "Live demo",
      repo: "GitHub",
      paper: "Paper",
      readCaseStudy: "Read case study",
      getInTouch: "Get in touch",
      stackAriaLabel: "Stack",
      stackAndTagsAriaLabel: "Stack and tags",
    },
    aboutPage: {
      title: "About",
      description:
        "Commercial-law student at UBA, blockchain developer at UTN. Hackathon winner, co-author of an awarded paper on Cardano and Founder School alumn.",
      ariaLabel: "About me",
      journey: "Journey",
      education: "Education & credentials",
      stack: "Stack",
    },
    blog: {
      title: "Blog",
      heading: "Blog",
      description:
        "Blog — notes on smart contracts, RegTech, AI compliance and the projects behind them.",
      entries: "Published entries",
      featured: "Featured note",
      archive: "The index",
      tagsLabel: "Topics",
      featuredImageAlt:
        "Annotated legal documents, an evidence envelope and software code arranged on a blue work surface",
      readingTime: "min read",
      backToBlog: "← All posts",
      langBadge: { en: "In English", es: "In Spanish" },
    },
    notFound: {
      title: "Page not found",
      message: "The page you're looking for doesn't exist or was moved.",
      backHome: "Back to home",
    },
  },
  es: {
    skipLink: "Saltar al contenido principal",
    navbar: {
      homeAriaLabel: "Iván Sarapura — inicio",
      mainNavAriaLabel: "Navegación principal",
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
      switchToLight: "Cambiar a modo claro",
      switchToDark: "Cambiar a modo oscuro",
      lightLabel: "Claro",
      darkLabel: "Oscuro",
      menuDialogLabel: "Menú de navegación principal",
      menuNavAriaLabel: "Navegación a pantalla completa",
      navigationLabel: "Navegación",
      switchLocale: "View in English",
      switchLocaleShort: "EN",
    },
    hero: {
      ariaLabel: "Introducción",
      subheadline:
        "Construyo software donde el derecho se encuentra con el código — aplicaciones web type-safe, contratos inteligentes e IA para cumplimiento regulatorio. Estudiante de Abogacía (UBA), desarrollador blockchain (UTN), ganador de hackathons.",
      ctaPrimary: "Ver mis proyectos",
      ctaSecondary: "Contactame",
    },
    focus: {
      ariaLabel: "Qué hago",
      heading: "Donde el derecho se encuentra con el código.",
      subheading:
        "Seis áreas de trabajo, cada una respaldada por un proyecto real — de contratos de lógica subjetiva a agentes de IA para cumplimiento regulatorio.",
    },
    building: {
      ariaLabel: "Casos de estudio",
      heading: "Qué estoy construyendo",
      allCaseStudies: "Todos los casos de estudio →",
      expand: "Expandir",
      collapse: "Colapsar",
    },
    stats: {
      ariaLabel: "Trayectoria",
      heading: "Trayectoria",
      subheading:
        "Hackathons ganados, un paper publicado y programas que respaldan el trabajo — hechos, no promesas.",
    },
    contact: {
      ariaLabel: "Contacto",
      heading: "Construyamos algo.",
      subheading: "Abierto a oportunidades, colaboraciones y buenas conversaciones.",
      emailCta: "Escribime",
    },
    footer: {
      ariaLabel: "Pie de página",
      navAriaLabel: "Navegación del pie de página",
      homeAriaLabel: "Iván Sarapura — inicio",
      onLinkedIn: "Iván Sarapura en LinkedIn",
      onGitHub: "Iván Sarapura en GitHub",
      rights: "Todos los derechos reservados.",
    },
    projectsPage: {
      title: "Proyectos",
      intro:
        "Casos de estudio de ingeniería, no capturas de pantalla: el problema detrás de cada proyecto, la arquitectura elegida y hacia dónde va.",
      description:
        "Casos de estudio en la intersección del derecho y el código: resolución descentralizada de disputas, evidencia digital en Cardano, trazabilidad ambiental y cumplimiento con IA.",
      filterGroupLabel: "Filtrar proyectos por tag",
      filterAll: "Todos",
    },
    caseStudy: {
      backToProjects: "← Todos los proyectos",
      origin: "Origen",
      mechanism: "Mecanismo",
      future: "Lo que sigue",
      liveDemo: "Demo en vivo",
      repo: "GitHub",
      paper: "Paper",
      readCaseStudy: "Leer caso de estudio",
      getInTouch: "Contactame",
      stackAriaLabel: "Stack",
      stackAndTagsAriaLabel: "Stack y tags",
    },
    aboutPage: {
      title: "Sobre mí",
      description:
        "Estudiante de derecho comercial en la UBA, desarrollador blockchain en la UTN. Ganador de hackathons, co-autor de un paper premiado sobre Cardano y alumno de Founder School.",
      ariaLabel: "Sobre mí",
      journey: "Recorrido",
      education: "Educación y credenciales",
      stack: "Stack",
    },
    blog: {
      title: "Blog",
      heading: "Blog",
      description:
        "Blog — notas sobre contratos inteligentes, RegTech, cumplimiento con IA y los proyectos detrás.",
      entries: "Entradas publicadas",
      featured: "Nota destacada",
      archive: "El índice",
      tagsLabel: "Temas",
      featuredImageAlt:
        "Documentos legales anotados, un sobre de evidencia y código de software sobre una mesa azul",
      readingTime: "min de lectura",
      backToBlog: "← Todos los posts",
      langBadge: { en: "En inglés", es: "En español" },
    },
    notFound: {
      title: "Página no encontrada",
      message: "La página que buscás no existe o fue movida.",
      backHome: "Volver al inicio",
    },
  },
};

export function getUi(locale: Locale): UiDict {
  return UI_BY_LOCALE[locale];
}

export const UI = getUi(DEFAULT_LOCALE);
