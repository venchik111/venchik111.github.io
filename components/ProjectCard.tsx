import type { Project } from "@/data/projects";
import s from "./ui.module.css";

// Цвета языков в духе GitHub; неизвестные — серые.
const langColors: Record<string, string> = {
  Python: "#3572a5",
  pandas: "#150458",
  openpyxl: "#3fb950",
  requests: "#58a6ff",
  pytest: "#d29922",
  Linux: "#f1c40f",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={`${s.card} ${project.featured ? s.cardFeatured : ""}`} data-spot>
      <div className={s.cardHead}>
        <h3 className={`mono ${s.cardName}`}>
          <span className={s.muted}>~/</span>
          {project.name}
        </h3>
      </div>
      <p className={s.cardDesc}>{project.description}</p>
      <p className={s.cardDesc}>
        <strong>Мой вклад:</strong> {project.contribution}
      </p>
      <p className={`mono ${s.highlight}`}>
        <span className={s.muted}>$ result →</span> {project.highlight}
      </p>
      <div className={`mono ${s.cardMeta}`}>
        {project.stack.map((t) => (
          <span key={t} className={s.tag}>
            <span className={s.dot} style={{ background: langColors[t] ?? "var(--muted)" }} />
            {t}
          </span>
        ))}
      </div>
      <div className={`mono ${s.cardLinks}`}>
        <a href={project.repo} target="_blank" rel="noreferrer">
          source <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}
