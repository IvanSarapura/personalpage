import Link from "next/link";
import type { Project } from "@/data/projects";
import { localePath, type Locale } from "@/data/locale";
import { getUi } from "@/data/ui";

const cardClass =
  "flex h-full flex-col gap-[var(--element-gap-sm)] rounded-[var(--radius-lg)] border-[length:var(--border-width-thin)] border-solid border-[color:var(--color-blue-screen-muted)] bg-[var(--surface-secondary)] p-[var(--content-gap)] [transition:transform_var(--duration-slow)_var(--ease-out),border-color_var(--duration-slow)_var(--ease-out)] hover:-translate-y-0.5 hover:border-[color:var(--color-blue-screen-moderate)] dark:border-[color:var(--border-subtle)] dark:bg-[var(--color-deep-elevated)] dark:hover:border-[color:var(--color-b-white-moderate)]";

const chipClass =
  "inline-block rounded-[var(--radius-full)] bg-[var(--accent-surface-subtle)] px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--caption)] leading-[var(--caption-lh)] font-medium tracking-[var(--letter-spacing-wide)] text-[var(--accent-emphasis)]";

const externalLinkClass =
  "text-[length:var(--body)] font-medium tracking-[var(--letter-spacing-wide)] text-[var(--text-on-light)] underline underline-offset-4 [transition:var(--transition-hover)] hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[color:var(--color-blue-screen)]";

interface ProjectCardProps {
  project: Project;
  locale: Locale;
}

export default function ProjectCard({ project, locale }: ProjectCardProps) {
  const ui = getUi(locale).caseStudy;

  return (
    <article className={cardClass} aria-labelledby={`project-title-${project.slug}`}>
      <span className="text-[length:var(--caption)] leading-[var(--caption-lh)] font-medium tracking-[var(--letter-spacing-wide)] text-[var(--text-on-light)] opacity-[var(--opacity-subtle)]">
        {project.num} · {project.status}
      </span>

      <h3
        id={`project-title-${project.slug}`}
        className="text-[length:var(--heading-3)] leading-[var(--heading-3-lh)] font-semibold tracking-[var(--heading-3-tracking)] text-[var(--text-on-light)]"
      >
        {project.title}
      </h3>

      <p className="text-[length:var(--body)] leading-[var(--body-lh)] font-normal text-[var(--text-on-light)] opacity-[var(--opacity-strong)]">
        {project.tagline}
      </p>

      {project.award && (
        <p className="text-[length:var(--caption)] leading-[var(--caption-lh)] font-semibold tracking-[var(--letter-spacing-wide)] text-[var(--accent-emphasis)]">
          🏆 {project.award}
        </p>
      )}

      <p className="grow text-[length:var(--body)] leading-[var(--body-lh)] font-normal text-[var(--text-on-light)] opacity-[var(--opacity-emphasized)]">
        {project.summary}
      </p>

      {project.stack.length > 0 && (
        <ul
          className="m-0 flex list-none flex-wrap gap-[var(--space-2)] p-0"
          aria-label={ui.stackAriaLabel}
        >
          {project.stack.map((tech) => (
            <li key={tech} className={chipClass}>
              {tech}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-[var(--space-2)] flex flex-wrap items-center gap-[var(--space-4)]">
        <Link href={localePath(locale, `/projects/${project.slug}`)} className={externalLinkClass}>
          {ui.readCaseStudy}
        </Link>
        {project.links.demo && (
          <a href={project.links.demo} className={externalLinkClass} target="_blank" rel="noopener">
            {ui.liveDemo}
          </a>
        )}
        {project.links.repo && (
          <a href={project.links.repo} className={externalLinkClass} target="_blank" rel="noopener">
            {ui.repo}
          </a>
        )}
        {project.links.paper && (
          <a
            href={project.links.paper}
            className={externalLinkClass}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${ui.paper} (${ui.opensInNewTab})`}
          >
            {ui.paper}
          </a>
        )}
      </div>
    </article>
  );
}
