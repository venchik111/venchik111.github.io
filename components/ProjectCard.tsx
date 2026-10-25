import type { Project } from "@/data/projects";
import s from "./ui.module.css";

// Цвета языков в духе GitHub; неизвестные — серые.
const langColors: Record<string, string> = {
  Go: "#00add8",
  TypeScript: "#3178c6",
  Rust: "#dea584",
  React: "#61dafb",
  "Next.js": "#e6edf3",
  PostgreSQL: "#336791",
  Redis: "#dc382d",
  NATS: "#27aae1",
  CSS: "#663399",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={`${s.card} ${project.featured ? s.cardFeatured : ""}`} data-spot>
      <div className={s.cardHead}>
        <h3 className={`mono ${s.cardName}`}>
          <span className={s.muted}>~/</span>
          {project.name}
        </h3>
        {project.stars !== undefined && <span className={`mono ${s.stars}`}>★ {project.stars}</span>}
      </div>
      <p className={s.cardDesc}>{project.description}</p>
      {project.highlight && (
        <p className={`mono ${s.highlight}`}>
          <span className={s.muted}>$ bench →</span> {project.highlight}
        </p>
      )}
      <div className={`mono ${s.cardMeta}`}>
        {project.stack.map((t) => (
          <span key={t} className={s.tag}>
            <span className={s.dot} style={{ background: langColors[t] ?? "var(--muted)" }} />
            {t}
          </span>
        ))}
      </div>
      <div className={`mono ${s.cardLinks}`}>
        {project.repo && (
          <a href={project.repo} target="_blank" rel="noreferrer">
            source <span aria-hidden="true">↗</span>
          </a>
        )}
        {project.demo && (
          <a href={project.demo} target="_blank" rel="noreferrer">
            demo <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </article>
  );
}
