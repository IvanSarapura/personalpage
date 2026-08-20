import type { MDXComponents } from "mdx/types";

/** Requerido por @next/mdx con App Router. Mapea la tipografía de los posts
 *  a los tokens del design system para que el blog herede el tema (dark/light)
 *  sin estilos ad-hoc. */

const bodyText =
  "text-[length:var(--body)] leading-[var(--body-lh)] font-normal text-[var(--text-on-light)] opacity-[var(--opacity-strong)] md:text-[length:var(--body-large)] md:leading-[var(--body-large-lh)]";

const components: MDXComponents = {
  h2: ({ children }) => (
    <h2 className="mt-[var(--content-gap)] mb-[var(--element-gap-sm)] text-[length:var(--heading-2)] leading-[var(--heading-2-lh)] font-semibold tracking-[var(--heading-2-tracking)] text-[var(--text-on-light)]">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-[var(--element-gap)] mb-[var(--space-2)] text-[length:var(--heading-3)] leading-[var(--heading-3-lh)] font-semibold tracking-[var(--heading-3-tracking)] text-[var(--text-on-light)]">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className={`mb-[var(--element-gap)] ${bodyText}`}>{children}</p>,
  ul: ({ children }) => (
    <ul className={`mb-[var(--element-gap)] list-disc pl-[var(--content-gap)] ${bodyText}`}>
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className={`mb-[var(--element-gap)] list-decimal pl-[var(--content-gap)] ${bodyText}`}>
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="mb-[var(--space-2)]">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-[var(--text-on-light)] underline underline-offset-4 [transition:var(--transition-hover)] hover:opacity-70"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-[var(--element-gap)] border-l-[length:var(--border-width-thin)] border-solid border-[color:var(--color-blue-screen-muted)] pl-[var(--element-gap)] italic opacity-[var(--opacity-emphasized)] dark:border-[color:var(--border-subtle)]">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded-[var(--radius-sm)] bg-[var(--accent-surface-subtle)] px-[var(--space-1)] py-[2px] font-mono text-[0.9em] text-[var(--accent-emphasis)]">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mb-[var(--element-gap)] overflow-x-auto rounded-[var(--radius-lg)] border-[length:var(--border-width-thin)] border-solid border-[color:var(--color-blue-screen-muted)] bg-[var(--color-white-pure)] p-[var(--element-gap)] text-[length:var(--body)] leading-[var(--body-lh)] dark:border-[color:var(--border-subtle)] dark:bg-[var(--surface-primary)] [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-[var(--text-on-light)]">
      {children}
    </pre>
  ),
  hr: () => (
    <hr className="my-[var(--content-gap)] border-t border-[color:var(--color-blue-screen-muted)] dark:border-[color:var(--border-subtle)]" />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
