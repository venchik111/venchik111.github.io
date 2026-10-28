import type { Project } from "@/data/projects";
import s from "./ui.module.css";

// Цвета языков и библиотек в духе GitHub. Остальные теги (роли, подходы) — нейтральные пилюли.
const langColors: Record<string, string> = {
  Python: "#3572a5",
  pandas: "#e70488",
  openpyxl: "#3fb950",
  requests: "#58a6ff",
  pytest: "#d29922",
  Linux: "#f1c40f",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={`${s.card} ${project.featured ? s.cardFeatured : ""}`} data-spot>
      <div className={s.cardMain}>
        <h3 className={`mono ${s.cardName}`}>
          <span className={s.muted}>~/</span>
          {project.name}
        </h3>
        <p className={s.cardDesc}>{project.description}</p>
        <p className={s.contrib}>
          <span className={`mono ${s.contribLabel}`}>{"// мой вклад"}</span>
          {project.contribution}
        </p>
      </div>
      <div className={s.cardSide}>
        <p className={`mono ${s.highlight}`}>
          <span className={s.muted}>$ result →</span> {project.highlight}
        </p>
        <div className={`mono ${s.cardMeta}`}>
          {project.stack.map((t) =>
            langColors[t] ? (
              <span key={t} className={s.tag}>
                <span className={s.dot} style={{ background: langColors[t] }} />
                {t}
              </span>
            ) : (
              <span key={t} className={`${s.tag} ${s.pill}`}>
                {t}
              </span>
            ),
          )}
        </div>
        <a href={project.repo} target="_blank" rel="noreferrer" className={`mono ${s.cardLink}`}>
          source <span aria-hidden="true">↗</span>
          <span className="sr-only">: {project.name} на GitHub</span>
        </a>
      </div>
    </article>
  );
}
