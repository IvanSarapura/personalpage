# Sistema de diseño

Este documento describe el sistema implementado en el repositorio. Su objetivo es conservar la identidad visual de Sira, mantener contraste WCAG 2.2 AA y evitar que cada pantalla invente colores, escalas o controles nuevos.

## Fuente de verdad

La entrada global es `src/app/globals.css`. Su única responsabilidad es importar, en este orden, Tailwind CSS, `tw-animate-css`, `src/styles/tokens.css` y `src/styles/base.css`.

- `src/styles/tokens.css`: única fuente de verdad para colores, tipografía, espaciado, radios, movimiento, geometría compartida y el puente de Tailwind v4.
- `src/styles/base.css`: estilos realmente globales del documento, foco, selección, skip link y preferencias del usuario.
- `src/components/Section/Section.module.css`: asigna los roles semánticos a cada superficie.
- CSS Modules: estilos locales que consumen tokens. Pueden definir propiedades privadas del componente cuando derivan de tokens globales.
- Tailwind: composición y layout. Los valores de diseño deben consumir el puente `@theme inline` o `var(--token)`; no deben duplicar valores literales.

No hay un `tailwind.config.js`: el proyecto usa la configuración CSS-first de Tailwind 4.

## Arquitectura de tokens

La dirección de dependencia es siempre `primitive → semantic → component`.

### Primitivos

Son valores sin contexto de uso:

- Color: `--primitive-color-*` y `--primitive-alpha-*`.
- Espacio: `--space-1` a `--space-10`.
- Radio: `--primitive-radius-*`, derivados de `--radius-base`.
- Tipografía: `--type-size-*`, `--type-leading-*`, `--type-weight-*` y `--letter-spacing-*`.
- Movimiento: `--duration-*` y `--primitive-ease-*`.

Un primitivo no debe usarse directamente para expresar intención de contenido si existe un token semántico adecuado. Sí puede usarse al definir un nuevo rol semántico o una geometría de componente.

### Semánticos

Expresan propósito y contraste sobre una superficie:

- Superficies: `--surface-brand`, `--surface-paper`, `--surface-ink`, `--surface-ink-elevated`.
- Texto: `--text-on-brand`, `--text-on-paper`, `--text-on-ink` y sus variantes `*-secondary`.
- Bordes: roles `*-interactive` para controles y `*-decorative` para separación visual.
- Contexto de sección: `--section-surface`, `--section-text`, `--section-text-secondary`, `--section-border-*`, `--section-focus-ring` y `--section-error-text`.
- Controles: `--control-fill`, `--control-fill-text`, `--control-hover` y `--control-subtle`.

Los componentes deben preferir los roles `--section-*` y `--control-*`: así mantienen el contraste al moverse entre superficies y temas.

### Componente

Definen geometría o comportamiento reutilizable, por ejemplo `--section-padding-y`, `--container-max-width`, `--switch-*`, `--btn-*`, `--touch-target`, `--transition-hover` y `--navbar-transition`.

Las variables de componente estrictamente locales pueden vivir en un CSS Module —por ejemplo, `--contact-control-surface`— si se alimentan de tokens globales y no duplican valores de marca.

### Puente Tailwind y shadcn

El bloque `@theme inline` de `tokens.css` expone colores, radios, espaciado `ds-*` y estilos tipográficos a Tailwind. El contrato shadcn (`--background`, `--foreground`, `--primary`, etc.) se conserva para que los componentes añadidos con shadcn partan de la identidad del sitio, pero deben revisarse en todas las superficies antes de usarse.

## Temas y superficies

`ThemeProvider` alterna la clase `dark` en `<html>`, persiste la preferencia cuando `localStorage` está disponible y responde al tema del sistema cuando no hay una elección guardada. La transición lee `--duration-slow` desde CSS y se omite con `prefers-reduced-motion: reduce`.

`Section` crea el contexto visual para sus descendientes:

| Variante   | Uso                           | Comportamiento                                |
| ---------- | ----------------------------- | --------------------------------------------- |
| `brand`    | Bloques principales de marca  | Azul en claro; tinta en oscuro.               |
| `surface`  | Páginas y bloques sobre papel | Papel en claro; tinta en oscuro.              |
| `elevated` | Hero, CTA o tarjetas elevadas | Blanco en claro; tinta elevada en oscuro.     |
| `inverse`  | Contraste oscuro explícito    | Tinta elevada con texto claro en ambos temas. |

No se debe inferir el color del texto a partir de “claro/oscuro” ni usar opacidad para texto secundario. Se usa `--section-text-secondary`, cuyo color ya fue compuesto para cumplir contraste.

## Escalas

### Tipografía

Inter se carga como fuente variable mediante `next/font` y publica `--font-inter`. Las familias de respaldo viven en `--font-family`.

La escala pública es `display-1`, `display-2`, `heading-1`, `heading-2`, `heading-3`, `body-large`, `body`, `caption` y `label`. Cada nivel tiene tamaño, altura de línea y, cuando corresponde, peso y tracking. Los tamaños son `rem`; los títulos fluidos combinan `rem` y `vw` mediante `clamp()`.

No se permiten `font-size` en `px` en la interfaz. En Tailwind se prefieren utilidades como `text-heading-2`; en CSS Modules, `font-size: var(--heading-2)`.

### Espaciado y radio

La escala de espaciado va de `--space-1` (0.25rem) a `--space-10` (8rem). En Tailwind está disponible como `ds-1` a `ds-10`, además del consumo explícito con `var()`.

Los radios son `sm`, `md`, `lg` y `full`, derivados de una base de 0.75rem. `full` usa 9999px deliberadamente para controles tipo píldora; no es un tamaño tipográfico.

Los tamaños locales de iconos, columnas o targets pueden derivarse con `calc()` cuando no existe un escalón exacto.

### Movimiento

- `--duration-fast`: respuesta breve.
- `--duration-base`: hover y controles.
- `--duration-slow`: cambio de tema.
- `--duration-smooth`: movimientos de interfaz más amplios.
- `--ease-out`, `--ease-in-out` y `--ease-smooth`: vocabulario público de easing.

Las animaciones no esenciales deben desactivarse de forma explícita bajo `prefers-reduced-motion: reduce`. No se usa la técnica global de `0.01ms`.

## Componentes

### Excepción: Navbar art-directed

`Navbar` y su subsistema (`FullscreenMenu`, `MenuHeader`, `MenuNav`, `MenuFooter`,
`NavbarControls`, `LocaleSwitcher` y `Switch`) son componentes art-directed y
pixel-specific. Su geometría, espaciado, radios, color, tipografía, iconos,
estados, responsive y movimiento constituyen una composición deliberada y no
deben normalizarse automáticamente con `Button` ni con otros componentes
canónicos del sistema.

Se permiten controles nativos con estilos locales en esta frontera. Las mejoras
de accesibilidad deben conservar la caja visible: nombres y relaciones ARIA no
visuales, foco visible y pseudo-elementos para ampliar el área táctil sin
alterar el layout. Cualquier cambio visual requiere revisión explícita de diseño
y comparación contra la referencia aprobada.

El menú fullscreen aplica el token semántico `--text-on-brand` (blanco sobre la
superficie brand en claro) para la etiqueta, los índices y el tagline, sin
opacidad sobre texto: la jerarquía se expresa por tipografía (uppercase,
letter-spacing y tabular-nums). Suele conservar una leve opacidad en el enlace
(`--navbar-menu-link-opacity`) que se revisa contra WCAG AA. Estos estilos son una
excepción local art-directed, documentada y vigilada por el checker; no deben
copiarse a otros componentes ni convertirse automáticamente en colores
precompuestos.

### Button

Archivo: `src/components/ui/button.tsx`. Usa el primitivo `Button` de Base UI. Para enlaces con apariencia de botón se usa `buttonVariants`; no se anida un enlace dentro de un botón.

| Prop            | Tipo                                                              | Default   | Descripción                              |
| --------------- | ----------------------------------------------------------------- | --------- | ---------------------------------------- |
| `variant`       | `default \| secondary \| outline \| ghost \| destructive \| link` | `default` | Jerarquía visual de la acción.           |
| `size`          | `sm \| default \| lg \| icon`                                     | `default` | Geometría y target del control.          |
| Props restantes | `ButtonPrimitive.Props`                                           | —         | Props, eventos y composición de Base UI. |

Estados implementados: default, hover, focus-visible, disabled y `aria-invalid`. No existe una prop `loading`: el consumidor renderiza el indicador y aplica `disabled`/`aria-busy` según el flujo.

Accesibilidad:

- El foco siempre tiene outline contextual.
- `disabled` elimina interacción y conserva texto legible.
- `size="icon"` garantiza el target compartido; requiere nombre accesible si no hay texto visible.
- Para una acción se usa `<Button>`; para navegación, `<Link className={buttonVariants(...)}>`.

```tsx
<Button type="submit" size="sm" disabled={isPending}>
  {isPending ? "Sending…" : "Send"}
</Button>

<Link href="/projects" className={buttonVariants({ variant: "outline", size: "sm" })}>
  View projects
</Link>
```

Haz: reserva `default` para la acción principal y usa una etiqueta específica. No hagas: simular botones con clases copiadas, anidar elementos interactivos o ocultar el nombre de un botón de icono.

### ToggleChip

Archivo: `src/components/ui/toggle-chip.tsx`. Es un botón de selección binaria para filtros.

| Prop            | Tipo                                                           | Default   | Descripción                                     |
| --------------- | -------------------------------------------------------------- | --------- | ----------------------------------------------- |
| `pressed`       | `boolean`                                                      | requerido | Estado controlado, reflejado en `aria-pressed`. |
| Props restantes | `ButtonHTMLAttributes<HTMLButtonElement>` salvo `aria-pressed` | —         | Etiqueta, eventos y estado disabled.            |

Estados implementados: sin seleccionar, seleccionado, hover, focus-visible y disabled. El tipo por defecto es `button` para no enviar formularios accidentalmente.

```tsx
<ToggleChip pressed={activeTag === tag} onClick={() => setActiveTag(tag)}>
  {tag}
</ToggleChip>
```

Haz: mantener `pressed` sincronizado con el filtro real. No hagas: usar `Badge` como filtro ni añadir `role="switch"`; `aria-pressed` ya expresa el patrón.

### Badge

Archivo: `src/components/ui/badge.tsx`. Es información no interactiva renderizada como `span`.

| Prop            | Tipo                              | Default  | Descripción                        |
| --------------- | --------------------------------- | -------- | ---------------------------------- |
| `variant`       | `subtle \| emphasis`              | `subtle` | Intensidad visual.                 |
| Props restantes | `HTMLAttributes<HTMLSpanElement>` | —        | Atributos nativos de presentación. |

`subtle` usa borde decorativo y texto secundario; `emphasis` usa fondo sutil y texto principal. No tiene estados interactivos.

```tsx
<Badge>TypeScript</Badge>
<Badge variant="emphasis">Featured</Badge>
```

Haz: usarlo para metadatos breves. No hagas: convertirlo en botón mediante `onClick`; usa `ToggleChip`.

### Section

Archivo: `src/components/Section/Section.tsx`.

| Prop                          | Tipo                                      | Default   | Descripción                                 |
| ----------------------------- | ----------------------------------------- | --------- | ------------------------------------------- |
| `variant`                     | `brand \| surface \| elevated \| inverse` | `brand`   | Superficie y roles de contraste.            |
| `paddingY`                    | `lg \| md \| sm \| none`                  | `lg`      | Ritmo vertical responsive.                  |
| `as`                          | `ElementType`                             | `section` | Elemento semántico renderizado.             |
| `ariaLabel`                   | `string`                                  | —         | Nombre accesible directo.                   |
| `ariaLabelledBy`              | `string`                                  | —         | Referencia a un título visible.             |
| `id`, `className`, `children` | valores React                             | —         | Identidad, extensión de layout y contenido. |

Cada variante define los tokens contextuales que consumen sus descendientes y expone `data-surface`. En tema oscuro, `brand`, `surface` y `elevated` adoptan superficies de tinta; `inverse` permanece oscuro.

```tsx
<Section variant="surface" ariaLabelledBy="projects-title">
  <h1 id="projects-title">Projects</h1>
</Section>
```

Haz: dar nombre accesible a regiones con propósito propio. No hagas: pasar las variantes antiguas `blue`, `white` o `dark`, ni fijar el color de todos los descendientes desde la página.

### SectionLink

Archivo: `src/components/SectionLink/SectionLink.tsx`. Es el enlace textual canónico con indicador direccional.

| Prop                                 | Tipo                    | Default                 | Descripción                                 |
| ------------------------------------ | ----------------------- | ----------------------- | ------------------------------------------- |
| `href`                               | `string`                | requerido               | Destino.                                    |
| `external`                           | `boolean` discriminante | `false`                 | Si es `true`, abre una nueva pestaña.       |
| `opensInNewTabLabel`                 | `string`                | requerido si `external` | Texto localizado para lectores de pantalla. |
| `icon`                               | `arrow \| external`     | según destino           | Indicador visual decorativo.                |
| `size`                               | `body \| caption`       | `body`                  | Escala tipográfica.                         |
| `ariaLabel`, `className`, `children` | valores React           | —                       | Nombre, extensión y contenido.              |

Los destinos externos se renderizan con `target="_blank"`, `rel="noopener noreferrer"` y aviso oculto de nueva pestaña. Los internos usan `next/link`. Los iconos están ocultos a tecnologías de asistencia.

```tsx
<SectionLink href="/research">All research</SectionLink>
<SectionLink href={paperUrl} external opensInNewTabLabel={ui.opensInNewTab}>
  Read paper
</SectionLink>
```

Haz: localizar `opensInNewTabLabel`. No hagas: escribir `target="_blank"` directamente en otra parte del producto.

## Formularios

El formulario de contacto es el patrón implementado de referencia:

- Cada control tiene `label` visible y la marca requerida es decorativa.
- Los límites nativos y de dominio comparten `CONTACT_LIMITS`.
- Los errores visibles se enlazan mediante `aria-invalid` y `aria-errormessage`.
- El estado general usa una región `aria-live="polite"` y `aria-atomic="true"`.
- El formulario aplica `aria-busy` durante el envío y deshabilita el botón.
- Los valores se restauran tras errores esperables para no perder el mensaje.
- Inputs, placeholder, autofill, error y foco consumen roles de superficie; no usan opacidad de texto.

Para campos nuevos se reutiliza esta estructura. Los errores no deben comunicarse sólo mediante color, y el placeholder nunca sustituye al label.

## Excepciones autocontenidas

Sólo existen dos excepciones a los colores literales:

1. `src/app/global-error.tsx`: reemplaza el layout completo cuando la aplicación falla. Debe funcionar sin `globals.css`, Tailwind, providers ni tokens externos; por eso incluye paleta, tema, foco, reduced motion y estilos mínimos propios.
2. `src/lib/contact-email.ts`: genera HTML para clientes de correo, donde las variables CSS y hojas externas no son fiables. Mantiene colores y tamaños inline deliberadamente.

El checker también permite tamaños tipográficos en píxeles dentro de esas dos fronteras autocontenidas. No se deben añadir excepciones nuevas sin documentar la limitación técnica y revisar accesibilidad en ambos temas o clientes relevantes.

## Enforcement automático

Ejecuta:

```bash
npm run lint:design
```

`scripts/check-design-system.mjs` recorre el código web bajo `src/` y falla con archivo, línea, columna, regla y fragmento cuando encuentra:

- colores hexadecimales, funciones de color y nombres CSS en declaraciones CSS o propiedades React `style`, fuera de las dos excepciones; se inspecciona cualquier propiedad terminada en `-color`, además de fondos, imágenes y gradientes, bordes e imágenes de borde, sombras, filtros, outline, fill/stroke y propiedades SVG relacionadas;
- atributos JSX/MDX estáticos `color`, `fill`, `stroke`, `stopColor`, `floodColor` y `lightingColor`; keywords como `none`/`currentColor` y tokens mediante `var()` están permitidos;
- cualquier utilidad Tailwind cuyo sufijo sea una paleta fundacional, por ejemplo `text-white`, `accent-red-500`, `placeholder-red-500` o `caret-blue-500` (`font-black` se reconoce como peso tipográfico); también se inspeccionan literales dentro de valores arbitrarios sin depender de una lista cerrada de namespaces, incluyendo `drop-shadow`, `text-shadow`, `inset-shadow` e `inset-ring`;
- los valores arbitrarios de layout, `content`, URL, position y el type hint `length:` se excluyen del análisis cromático para evitar falsos positivos; `color:`, las utilidades semánticas expuestas por `@theme` y valores `var(--token)` siguen permitidos;
- marcadores de capa de tokens ausentes, duplicados o desordenados, colores literales fuera del bloque marcado de primitivos, y declaraciones literales primitivas que no sigan `--primitive-color-*`/`--primitive-alpha-*`;
- `font-size` en píxeles, valores React numéricos —que implican píxeles— y tokens CSS locales que resuelven indirectamente a píxeles, fuera de las excepciones;
- tokens o variantes de `Section` anteriores a la migración;
- usos de `var()` sin definición global en `tokens.css`/`base.css` ni definición local en el mismo CSS; se permite `--font-inter`, inyectado por Next.js;
- `target="_blank"` fuera de `SectionLink`;
- `outline: none`, scrollbars ocultos y la técnica `0.01ms`;
- opacidad aplicada de forma identificable a texto de contenido.
- destinos `#main-content` que no sean programáticamente enfocables mediante `tabIndex={-1}`.

El análisis usa el AST de TypeScript para archivos JS/JSX/TS/TSX, y análisis acotado a atributos JSX para MDX. Resuelve expresiones estáticas entre paréntesis, `as`/`satisfies`, strings dentro de `cn`/`clsx`, condicionales, arrays, templates, objetos de clases y spreads de bindings `const`; también resuelve strings/templates `const` usados como `className` y objetos `const` locales usados directamente en `style`. Por eso distingue `Section variant={"dark"}` de una variante `dark` válida en otro componente, y no interpreta una función `color()`, un `href="#feed"`, comentarios, strings de documentación, código inline ni fences MDX con backticks o virgulillas como estilos. Los bindings mutables, imports, spreads no resolubles, helpers propios y estilos realmente dinámicos requieren revisión humana.

La regla de opacidad es deliberadamente conservadora para no confundir overlays, logos o transiciones decorativas con texto: en CSS sólo inspecciona selectores con nombres de contenido; en JSX/MDX inspecciona utilidades de opacidad sobre elementos textuales semánticos. `text-sm/6` se reconoce como tipografía con line-height, no como opacidad. Los nombres de clase ambiguos siguen necesitando revisión humana.

El checker considera globales únicamente las propiedades definidas en `tokens.css` y `base.css`; como heurística conservadora, una propiedad privada de un CSS Module sólo satisface usos de ese mismo archivo. Esto no modela todo el cascade ni propiedades publicadas intencionalmente por un ancestro desde otro módulo: esos contratos deben convertirse en tokens globales o revisarse explícitamente. No intenta resolver variables creadas dinámicamente en runtime, salvo la allowlist explícita. Sí inspecciona fallbacks literales de `var()` y tokens tipográficos locales que resuelven a píxeles. El control de reduced motion evita la técnica global agresiva, pero la adecuación semántica de cada animación y de valores calculados dinámicamente sigue formando parte de la revisión visual.

El comando forma parte de CI antes de los tests y del hook pre-commit. Los tests de Vitest usan fixtures aislados para validar el motor sin volver a escanear el repositorio durante el mismo job de CI.

## Proceso de cambio y migración

1. Confirma que ningún token o componente existente expresa ya la intención.
2. Si falta un valor, añade primero el primitivo; después crea o ajusta el rol semántico y finalmente el token de componente. Evita saltar capas.
3. Valida contraste WCAG 2.2 AA en `brand`, `surface`, `elevated` e `inverse`, en claro y oscuro.
4. Actualiza el componente compartido antes que las instancias. Conserva semántica HTML, teclado, foco visible, targets y reduced motion.
5. Migra todos los consumidores y elimina el nombre anterior en el mismo cambio. No mantengas alias indefinidamente.
6. Actualiza este documento y las pruebas del componente/checker cuando cambie una API o una regla.
7. Ejecuta `npm run lint:design`, lint, typecheck, tests, formato y build antes de integrar.

Los cambios que alteren color, escala, API o comportamiento deben incluir una nota de migración en la descripción del PR y revisión visual en los dos temas.

## Verificación en navegador

Playwright y axe complementan el checker estático y Vitest sobre un build de producción servido con
`next start` en un puerto dedicado:

- después de `npm run build`, `npm run test:e2e` valida rutas representativas en inglés y español, ambos temas, navegación por teclado, foco, menú modal, filtros, formulario, preferencias de medios, reflow y targets táctiles;
- axe se ejecuta con las etiquetas WCAG 2.0/2.1/2.2 nivel A y AA. La política es cero violaciones en las rutas cubiertas; no hay reglas excluidas;
- Chromium ejecuta la matriz completa; Firefox y WebKit cubren axe, interacción, medios y responsive. Los snapshots se generan sólo en Linux/Chromium, con fuentes/imágenes cargadas y estabilización visual acotada a las capturas. La estrategia combina siete rutas en viewports de 390×844 y 1440×900, estados interactivos críticos y regiones focales below-fold de home, footer, listado de blog y artículo. Así se conserva contexto de página y detalle útil sin depender de capturas `fullPage` gigantes y frágiles;
- `npm run test:e2e:update` actualiza los baselines únicamente después de revisar que el cambio visual sea intencional.

En CI el build ocurre una sola vez antes de E2E, `--fail-on-flaky-tests` convierte cualquier retry
recuperado en fallo del gate y se instalan los tres motores mediante
`npx playwright install --with-deps chromium firefox webkit`. Ante un fallo se publican el reporte
HTML, screenshots, vídeos y traces. La automatización de reflow a 320 px no sustituye una revisión
manual con zoom al 200 %, lector de pantalla ni pruebas con usuarios.

### Handoff de seguridad de dependencias (2026-08-24)

El `npm audit` existente reporta 11 vulnerabilidades (2 moderadas y 9 altas) en el árbol completo;
`npm audit --omit=dev` reporta 4 altas en dependencias de producción (`nanoid`, `next`, el `postcss`
incluido por Next.js y `sharp`). Se documentan separadamente del sistema de diseño: esta fase no
ejecuta `npm audit fix --force`, no actualiza Next.js y no acepta cambios mayores automáticos. Cada
cadena vulnerable debe tratarse en un cambio de dependencias dedicado, con revisión de las notas de
migración y nueva verificación completa.
