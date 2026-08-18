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
  research: {
    heading: string;
    subheading: string;
    allResearch: string;
    pageTitle: string;
    pageDescription: string;
    pageIntro: string;
    archiveHeading: string;
    worksLabel: string;
    authorLabel: string;
    authorsLabel: string;
    contextLabel: string;
    backgroundLabel: string;
    recognitionLabel: string;
    opensInNewTab: string;
  };
  focus: {
    ariaLabel: string;
    heading: string;
    subheading: string;
  };
  selectedWork: {
    ariaLabel: string;
    heading: string;
    allCaseStudies: string;
  };
  building: {
    ariaLabel: string;
    heading: string;
    subheading: string;
    opensInNewTab: string;
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
    nameLabel: string;
    namePlaceholder: string;
    nameError: string;
    emailLabel: string;
    emailPlaceholder: string;
    emailError: string;
    messageLabel: string;
    messagePlaceholder: string;
    messageError: string;
    submit: string;
    submitting: string;
    success: string;
    validationError: string;
    rateLimited: string;
    error: string;
    fallbackPrefix: string;
    fallbackLink: string;
    openFormCta: string;
  };
  footer: {
    ariaLabel: string;
    navAriaLabel: string;
    homeAriaLabel: string;
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
    opensInNewTab: string;
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
    publications: string;
    latestPublication: string;
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
    research: {
      heading: "Research & publications",
      subheading: "A concise view of my ongoing and published work in legal technology.",
      allResearch: "Explore all research",
      pageTitle: "Research & publications",
      pageDescription:
        "An evolving archive of Iván Sarapura's academic research on legal technology, cryptographic infrastructure and digital evidence.",
      pageIntro:
        "An evolving archive of academic work at the intersection of law, cryptography and digital evidence. It brings together research in progress and published papers, with context, authorship and access to the complete work when available.",
      archiveHeading: "Research archive",
      worksLabel: "works",
      authorLabel: "Author",
      authorsLabel: "Authors",
      contextLabel: "Context",
      backgroundLabel: "Academic background",
      recognitionLabel: "Recognition",
      opensInNewTab: "opens in a new tab",
    },
    focus: {
      ariaLabel: "What I do",
      heading: "Where law meets code.",
      subheading:
        "Six areas of work, each backed by a shipped project — from subjective-logic smart contracts to AI agents for regulatory compliance.",
    },
    selectedWork: {
      ariaLabel: "Selected projects",
      heading: "Selected work",
      allCaseStudies: "All case studies",
    },
    building: {
      ariaLabel: "Current work",
      heading: "What I'm building",
      subheading:
        "Two products in active development: one connects learning with rewards; the other makes global digital payments simpler and verifiable.",
      opensInNewTab: "opens in a new tab",
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
      nameLabel: "Name",
      namePlaceholder: "Your name",
      nameError: "Enter your name (2–80 characters).",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      emailError: "Enter a valid email address.",
      messageLabel: "Message",
      messagePlaceholder: "Tell me briefly what you would like to discuss…",
      messageError: "Add a little more detail (20–2,000 characters).",
      submit: "Send message",
      submitting: "Sending message…",
      success: "Message sent. Thanks — I'll reply to the email address you provided.",
      validationError: "Review the highlighted fields before sending your message.",
      rateLimited:
        "You've sent several messages in a short time. Please try again in a few minutes.",
      error: "I couldn't send your message right now. Please try again in a moment.",
      fallbackPrefix: "If the problem continues, you can also",
      fallbackLink: "contact me on LinkedIn",
      openFormCta: "Write to me",
    },
    footer: {
      ariaLabel: "Footer",
      navAriaLabel: "Footer navigation",
      homeAriaLabel: "Iván Sarapura — home",
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
      paper: "Paper (PDF)",
      opensInNewTab: "opens in a new tab",
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
      title: "Personal Blog",
      heading: "Personal Blog",
      description:
        "Blog — notes on smart contracts, RegTech, AI compliance and the projects behind them.",
      publications: "Publications",
      latestPublication: "Latest post",
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
    research: {
      heading: "Investigación y publicaciones",
      subheading:
        "Una selección breve de mi trabajo académico en curso y publicado sobre tecnología jurídica.",
      allResearch: "Ver todas las investigaciones",
      pageTitle: "Investigación y publicaciones",
      pageDescription:
        "Un archivo en evolución de las investigaciones académicas de Iván Sarapura sobre tecnología jurídica, infraestructura criptográfica y evidencia digital.",
      pageIntro:
        "Un archivo en evolución de trabajos académicos en la intersección entre derecho, criptografía y evidencia digital. Reúne investigaciones en desarrollo y papers publicados, con su contexto, autoría y acceso al trabajo completo cuando está disponible.",
      archiveHeading: "Archivo de investigaciones",
      worksLabel: "trabajos",
      authorLabel: "Autor",
      authorsLabel: "Autores",
      contextLabel: "Contexto",
      backgroundLabel: "Formación académica",
      recognitionLabel: "Reconocimiento",
      opensInNewTab: "se abre en una pestaña nueva",
    },
    focus: {
      ariaLabel: "Qué hago",
      heading: "Donde el derecho se encuentra con el código.",
      subheading:
        "Seis áreas de trabajo, cada una respaldada por un proyecto real — de contratos de lógica subjetiva a agentes de IA para cumplimiento regulatorio.",
    },
    selectedWork: {
      ariaLabel: "Proyectos seleccionados",
      heading: "Proyectos seleccionados",
      allCaseStudies: "Todos los casos de estudio",
    },
    building: {
      ariaLabel: "Trabajo actual",
      heading: "Qué estoy construyendo",
      subheading:
        "Dos productos en desarrollo: uno conecta aprendizaje y recompensas; el otro simplifica pagos digitales globales y verificables.",
      opensInNewTab: "se abre en una pestaña nueva",
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
      nameLabel: "Nombre",
      namePlaceholder: "Tu nombre",
      nameError: "Ingresá tu nombre (entre 2 y 80 caracteres).",
      emailLabel: "Email",
      emailPlaceholder: "vos@ejemplo.com",
      emailError: "Ingresá una dirección de email válida.",
      messageLabel: "Mensaje",
      messagePlaceholder: "Contame brevemente qué te gustaría conversar…",
      messageError: "Agregá un poco más de detalle (entre 20 y 2.000 caracteres).",
      submit: "Enviar mensaje",
      submitting: "Enviando mensaje…",
      success: "Mensaje enviado. Gracias; voy a responder al email que indicaste.",
      validationError: "Revisá los campos indicados antes de enviar tu mensaje.",
      rateLimited: "Enviaste varios mensajes en poco tiempo. Intentá nuevamente en unos minutos.",
      error: "No pude enviar tu mensaje en este momento. Intentá nuevamente en unos instantes.",
      fallbackPrefix: "Si el problema continúa, también podés",
      fallbackLink: "contactarme por LinkedIn",
      openFormCta: "Escribime",
    },
    footer: {
      ariaLabel: "Pie de página",
      navAriaLabel: "Navegación del pie de página",
      homeAriaLabel: "Iván Sarapura — inicio",
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
      paper: "Paper (PDF)",
      opensInNewTab: "se abre en una pestaña nueva",
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
      title: "Blog Personal",
      heading: "Blog Personal",
      description:
        "Blog — notas sobre contratos inteligentes, RegTech, cumplimiento con IA y los proyectos detrás.",
      publications: "Publicaciones",
      latestPublication: "Última publicación",
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
