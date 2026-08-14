"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProjectCard/ProjectCard";
import { getProjects, PROJECT_TAGS, type ProjectTag } from "@/data/projects";
import { getUi } from "@/data/ui";
import type { Locale } from "@/data/locale";

const filterBtnBase =
  "cursor-pointer rounded-[var(--radius-full)] border-[length:var(--border-width-thin)] border-solid px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--caption)] leading-[var(--caption-lh)] font-medium tracking-[var(--letter-spacing-wide)] [transition:var(--transition-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-blue-screen)]";

const filterBtnInactive =
  "border-[color:var(--color-blue-screen-muted)] bg-transparent text-[var(--text-on-light)] hover:border-[color:var(--color-blue-screen-moderate)] dark:border-[color:var(--border-subtle)] dark:hover:border-[color:var(--color-b-white-moderate)]";

const filterBtnActive =
  "border-[color:var(--text-on-light)] bg-[var(--text-on-light)] text-[var(--color-white-pure)] dark:text-[var(--color-deep)]";

interface ProjectsGridProps {
  locale: Locale;
}

export default function ProjectsGrid({ locale }: ProjectsGridProps) {
  const [activeTag, setActiveTag] = useState<ProjectTag | null>(null);
  const ui = getUi(locale).projectsPage;
  const projects = getProjects(locale);

  const visibleProjects = activeTag
    ? projects.filter((project) => project.tags.includes(activeTag))
    : projects;

  return (
    <div>
      <div
        role="group"
        aria-label={ui.filterGroupLabel}
        className="mb-[var(--content-gap)] flex flex-wrap gap-[var(--space-3)]"
      >
        <button
          type="button"
          onClick={() => setActiveTag(null)}
          aria-pressed={activeTag === null}
          className={`${filterBtnBase} ${activeTag === null ? filterBtnActive : filterBtnInactive}`}
        >
          {ui.filterAll}
        </button>
        {PROJECT_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag(tag)}
            aria-pressed={activeTag === tag}
            className={`${filterBtnBase} ${activeTag === tag ? filterBtnActive : filterBtnInactive}`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* role="list" intencional: Safari descarta la semántica de lista con list-style:none. */}
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ul
        role="list"
        className="grid list-none grid-cols-2 gap-[var(--content-gap)] max-[768px]:grid-cols-1 max-[768px]:gap-[var(--element-gap)]"
      >
        {visibleProjects.map((project) => (
          <li key={project.slug}>
            <ProjectCard project={project} locale={locale} />
          </li>
        ))}
      </ul>
    </div>
  );
}
