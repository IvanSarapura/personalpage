import type { Project } from "@/data/projects";
import { localePath, type Locale } from "@/data/locale";
import { getUi } from "@/data/ui";
import { Badge } from "@/components/ui/badge";
import SectionLink from "@/components/SectionLink/SectionLink";

const cardClass =
  "flex h-full flex-col gap-[var(--element-gap-sm)] rounded-[var(--radius-lg)] border-[length:var(--border-width-thin)] border-solid border-[color:var(--section-border-decorative)] bg-[var(--section-surface-elevated)] p-[var(--content-gap)] hover:border-[color:var(--section-border-interactive)] motion-safe:[transition:transform_var(--duration-slow)_var(--ease-out),border-color_var(--duration-slow)_var(--ease-out)] motion-safe:hover:-translate-y-0.5";

interface ProjectCardProps {
  project: Project;
  locale: Locale;
}

export default function ProjectCard({ project, locale }: ProjectCardProps) {
  const ui = getUi(locale).caseStudy;

  return (
    <article className={cardClass} aria-labelledby={`project-title-${project.slug}`}>
      <span className="text-[length:var(--caption)] leading-[var(--caption-lh)] font-medium tracking-[var(--letter-spacing-wide)] text-[var(--section-text-secondary)]">
        {project.num} · {project.status}
      </span>

      <h3
        id={`project-title-${project.slug}`}
        className="text-[length:var(--heading-3)] leading-[var(--heading-3-lh)] font-semibold tracking-[var(--heading-3-tracking)] text-[var(--section-text)]"
      >
        {project.title}
      </h3>

      <p className="text-[length:var(--body)] leading-[var(--body-lh)] font-normal text-[var(--section-text-secondary)]">
        {project.tagline}
      </p>

      {project.award && (
        <p className="text-[length:var(--caption)] leading-[var(--caption-lh)] font-semibold tracking-[var(--letter-spacing-wide)] text-[var(--accent-emphasis)]">
          🏆 {project.award}
        </p>
      )}

      <p className="grow text-[length:var(--body)] leading-[var(--body-lh)] font-normal text-[var(--section-text-secondary)]">
        {project.summary}
      </p>

      {project.stack.length > 0 && (
        <ul
          className="m-0 flex list-none flex-wrap gap-[var(--space-2)] p-0"
          aria-label={ui.stackAriaLabel}
        >
          {project.stack.map((tech) => (
            <li key={tech}>
              <Badge variant="emphasis">{tech}</Badge>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-[var(--space-2)] flex flex-wrap items-center gap-[var(--space-4)]">
        <SectionLink href={localePath(locale, `/projects/${project.slug}`)}>
          {ui.readCaseStudy}
        </SectionLink>
        {project.links.demo && (
          <SectionLink href={project.links.demo} external opensInNewTabLabel={ui.opensInNewTab}>
            {ui.liveDemo}
          </SectionLink>
        )}
        {project.links.repo && (
          <SectionLink href={project.links.repo} external opensInNewTabLabel={ui.opensInNewTab}>
            {ui.repo}
          </SectionLink>
        )}
        {project.links.paper && (
          <SectionLink href={project.links.paper} external opensInNewTabLabel={ui.opensInNewTab}>
            {ui.paper}
          </SectionLink>
        )}
      </div>
    </article>
  );
}
