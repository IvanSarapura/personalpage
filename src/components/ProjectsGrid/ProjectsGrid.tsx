"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProjectCard/ProjectCard";
import {
  EXCLUDED_PROJECT_SLUGS,
  getProjects,
  PROJECT_TAGS,
  type ProjectTag,
} from "@/data/projects";
import { getUi } from "@/data/ui";
import type { Locale } from "@/data/locale";
import { ToggleChip } from "@/components/ui/toggle-chip";

interface ProjectsGridProps {
  locale: Locale;
}

export default function ProjectsGrid({ locale }: ProjectsGridProps) {
  const [activeTag, setActiveTag] = useState<ProjectTag | null>(null);
  const ui = getUi(locale).projectsPage;
  const projects = getProjects(locale).filter(
    (project) => !EXCLUDED_PROJECT_SLUGS.has(project.slug)
  );

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
        <ToggleChip onClick={() => setActiveTag(null)} pressed={activeTag === null}>
          {ui.filterAll}
        </ToggleChip>
        {PROJECT_TAGS.map((tag) => (
          <ToggleChip key={tag} onClick={() => setActiveTag(tag)} pressed={activeTag === tag}>
            {tag}
          </ToggleChip>
        ))}
      </div>

      {/* role="list" intencional: Safari descarta la semántica de lista con list-style:none. */}
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ul
        role="list"
        className="grid list-none grid-cols-1 gap-[var(--element-gap)] md:grid-cols-2 md:gap-[var(--content-gap)]"
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
