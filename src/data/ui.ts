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
    themeLabel: string;
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
    archiveListLabel: string;
    ownPublications: string;
    sortGroupLabel: string;
    sortRecent: string;
    sortOldest: string;
    sortRecentLabel: string;
    sortOldestLabel: string;
    authorLabel: string;
    authorsLabel: string;
    contextLabel: string;
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
    opensInNewTab: string;
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
  blog: {
    title: string;
    heading: string;
    description: string;
    publications: string;
    latestPublication: string;
    featured: string;
    archive: string;
    sortRecent: string;
    sortOldest: string;
    sortRecentLabel: string;
    sortOldestLabel: string;
    tagsLabel: string;
    featuredImageAlt: string;
    readingTime: string;
    backToBlog: string;
  };
  notFound: {
    title: string;
    message: string;
    backHome: string;
  };
  errorPage: {
    title: string;
    message: string;
    retry: string;
  };
}

const UI_BY_LOCALE: Record<Locale, UiDict> = {
  en: {
    skipLink: "Skip to main content",
    navbar: {
      homeAriaLabel: "Iván Sarapura - home",
      mainNavAriaLabel: "Main navigation",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      themeLabel: "Color theme",
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
        "I build software where law meets code. Web apps with strict typing, smart contracts, and AI tools for regulatory compliance. I study law at UBA, develop on blockchain at UTN, and back the words with shipped work.",
      ctaPrimary: "View my work",
      ctaSecondary: "Get in touch",
    },
    research: {
      heading: "Publications & research",
      subheading: "A short view of my work in legal technology, both in progress and published.",
      allResearch: "Explore all research",
      pageTitle: "Publications & research",
      pageDescription:
        "Academic research by Iván Sarapura on legal technology, cryptographic infrastructure and digital evidence.",
      pageIntro:
        "Work that sits where law, cryptography and digital evidence meet. You'll find research in progress and published papers, each with context, authorship and a link to the full work when it's available.",
      archiveListLabel: "Research list",
      ownPublications: "publications",
      sortGroupLabel: "Sort research",
      sortRecent: "Most recent",
      sortOldest: "Oldest",
      sortRecentLabel: "Sorted by most recent",
      sortOldestLabel: "Sorted by oldest",
      authorLabel: "Author",
      authorsLabel: "Authors",
      contextLabel: "Context",
      opensInNewTab: "opens in a new tab",
    },
    focus: {
      ariaLabel: "What I do",
      heading: "Where law meets code.",
      subheading:
        "Six areas of work, each with a real project behind it. They range from smart contracts that weigh evidence to AI tools for compliance.",
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
        "Products I'm building end to end, from validated idea to working system, with the same rigor I bring to the rest of my work.",
      opensInNewTab: "opens in a new tab",
    },
    stats: {
      ariaLabel: "Achievements",
      heading: "Achievements",
      subheading:
        "A selection of work and recognition that shows what I build and how it's valued.",
      opensInNewTab: "opens in a new tab",
    },
    contact: {
      ariaLabel: "Contact",
      heading: "Let's talk about a concrete problem.",
      subheading:
        "If you're building at the edge of law and software, or you have a case worth studying, write to me.",
      nameLabel: "Name",
      namePlaceholder: "Your name",
      nameError: "Enter your name (2 to 80 characters).",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      emailError: "Enter a valid email address.",
      messageLabel: "Message",
      messagePlaceholder: "Tell me briefly what you'd like to discuss.",
      messageError: "Add a little more detail (20 to 2,000 characters).",
      submit: "Send message",
      submitting: "Sending message",
      success: "Message sent. I'll reply to the email address you provided.",
      validationError: "Review the highlighted fields before sending your message.",
      rateLimited:
        "You've sent several messages in a short time. Please try again in a few minutes.",
      error: "I couldn't send your message right now. Please try again in a moment.",
      fallbackPrefix: "If the problem continues, you can also",
      fallbackLink: "contact me on LinkedIn",
    },
    footer: {
      ariaLabel: "Footer",
      navAriaLabel: "Footer navigation",
      homeAriaLabel: "Iván Sarapura - home",
      rights: "All rights reserved.",
    },
    projectsPage: {
      title: "Projects",
      intro:
        "Case studies that show the problem each project solves, the architecture behind it, and where it goes next.",
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
    blog: {
      title: "Personal Blog",
      heading: "Personal Blog",
      description: "Notes on smart contracts, RegTech, AI compliance and the projects behind them.",
      publications: "Publications",
      latestPublication: "Latest post",
      featured: "Featured note",
      archive: "Index",
      sortRecent: "Most recent",
      sortOldest: "Oldest",
      sortRecentLabel: "Sorted by most recent",
      sortOldestLabel: "Sorted by oldest",
      tagsLabel: "Topics",
      featuredImageAlt:
        "Annotated legal documents, an evidence envelope and software code arranged on a blue work surface",
      readingTime: "min read",
      backToBlog: "All posts",
    },
    notFound: {
      title: "Page not found",
      message: "The page you're looking for doesn't exist or was moved.",
      backHome: "Back to home",
    },
    errorPage: {
      title: "Something went wrong",
      message:
        "An unexpected error occurred. Try again, and if the problem persists, get in touch.",
      retry: "Try again",
    },
  },
  es: {
    skipLink: "Saltar al contenido principal",
    navbar: {
      homeAriaLabel: "Iván Sarapura - inicio",
      mainNavAriaLabel: "Navegación principal",
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
      themeLabel: "Tema de color",
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
        "Construyo software donde el derecho se encuentra con el código. Aplicaciones web con tipado estricto, contratos inteligentes y herramientas de IA para cumplimiento regulatorio. Estudio Abogacía en la UBA, desarrollo sobre blockchain en la UTN y respaldo lo que digo con trabajo publicado.",
      ctaPrimary: "Ver mis proyectos",
      ctaSecondary: "Contactame",
    },
    research: {
      heading: "Publicaciones e investigación",
      subheading:
        "Una mirada breve a mi trabajo en tecnología jurídica, en desarrollo y ya publicado.",
      allResearch: "Ver todas las investigaciones",
      pageTitle: "Publicaciones e investigación",
      pageDescription:
        "Investigación académica de Iván Sarapura sobre tecnología jurídica, infraestructura criptográfica y evidencia digital.",
      pageIntro:
        "Trabajo que se ubica donde se juntan el derecho, la criptografía y la evidencia digital. Vas a encontrar investigaciones en desarrollo y papers publicados, cada uno con su contexto, autoría y acceso al trabajo completo cuando está disponible.",
      archiveListLabel: "Lista de investigaciones",
      ownPublications: "publicaciones",
      sortGroupLabel: "Ordenar investigaciones",
      sortRecent: "Más recientes",
      sortOldest: "Más antiguas",
      sortRecentLabel: "Ordenadas por más recientes",
      sortOldestLabel: "Ordenadas por más antiguas",
      authorLabel: "Autor",
      authorsLabel: "Autores",
      contextLabel: "Contexto",
      opensInNewTab: "se abre en una pestaña nueva",
    },
    focus: {
      ariaLabel: "Qué hago",
      heading: "Donde el derecho se encuentra con el código.",
      subheading:
        "Seis áreas de trabajo, cada una con un proyecto real detrás. Van desde contratos inteligentes que ponderan evidencia hasta herramientas de IA para cumplimiento.",
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
        "Productos que construyo de punta a punta, desde la idea validada hasta el sistema funcionando, con el mismo rigor que aplico al resto de mi trabajo.",
      opensInNewTab: "se abre en una pestaña nueva",
    },
    stats: {
      ariaLabel: "Reconocimientos",
      heading: "Reconocimientos",
      subheading:
        "Una selección de mi trabajo y reconocimientos que muestra qué construyo y cómo se valora.",
      opensInNewTab: "se abre en una pestaña nueva",
    },
    contact: {
      ariaLabel: "Contacto",
      heading: "Hablemos de un problema concreto.",
      subheading:
        "Si estás construyendo en el borde entre el derecho y el software, o tenés un caso que valga la pena estudiar, escribime.",
      nameLabel: "Nombre",
      namePlaceholder: "Tu nombre",
      nameError: "Ingresá tu nombre (entre 2 y 80 caracteres).",
      emailLabel: "Email",
      emailPlaceholder: "vos@ejemplo.com",
      emailError: "Ingresá una dirección de email válida.",
      messageLabel: "Mensaje",
      messagePlaceholder: "Contame brevemente qué te gustaría conversar.",
      messageError: "Agregá un poco más de detalle (entre 20 y 2.000 caracteres).",
      submit: "Enviar mensaje",
      submitting: "Enviando mensaje",
      success: "Mensaje enviado. Voy a responder al email que indicaste.",
      validationError: "Revisá los campos indicados antes de enviar tu mensaje.",
      rateLimited: "Enviaste varios mensajes en poco tiempo. Intentá nuevamente en unos minutos.",
      error: "No pude enviar tu mensaje en este momento. Intentá nuevamente en unos instantes.",
      fallbackPrefix: "Si el problema continúa, también podés",
      fallbackLink: "contactarme por LinkedIn",
    },
    footer: {
      ariaLabel: "Pie de página",
      navAriaLabel: "Navegación del pie de página",
      homeAriaLabel: "Iván Sarapura - inicio",
      rights: "Todos los derechos reservados.",
    },
    projectsPage: {
      title: "Proyectos",
      intro:
        "Casos de estudio que muestran el problema que resuelve cada proyecto, la arquitectura detrás y hacia dónde va.",
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
    blog: {
      title: "Blog Personal",
      heading: "Blog Personal",
      description:
        "Notas sobre contratos inteligentes, RegTech, cumplimiento con IA y los proyectos detrás.",
      publications: "Publicaciones realizadas",
      latestPublication: "Última publicación",
      featured: "Nota destacada",
      archive: "Índice",
      sortRecent: "Más recientes",
      sortOldest: "Más antiguas",
      sortRecentLabel: "Ordenadas por más recientes",
      sortOldestLabel: "Ordenadas por más antiguas",
      tagsLabel: "Temas",
      featuredImageAlt:
        "Documentos legales anotados, un sobre de evidencia y código de software sobre una mesa azul",
      readingTime: "min de lectura",
      backToBlog: "Todos los posts",
    },
    notFound: {
      title: "Página no encontrada",
      message: "La página que buscás no existe o fue movida.",
      backHome: "Volver al inicio",
    },
    errorPage: {
      title: "Algo salió mal",
      message: "Ocurrió un error inesperado. Probá de nuevo y, si el problema continúa, escribime.",
      retry: "Intentar de nuevo",
    },
  },
};

export function getUi(locale: Locale): UiDict {
  return UI_BY_LOCALE[locale];
}

export const UI = getUi(DEFAULT_LOCALE);
