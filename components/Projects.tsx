import { projects } from "@/data/projects";
import { delay } from "./delay";
import { ProjectCard } from "./ProjectCard";
import { Prompt } from "./Prompt";
import s from "./ui.module.css";

export function Projects() {
  return (
    <section id="projects" className={s.section}>
      <div className="container">
        <Prompt command="ls projects/" comment="избранные работы" />
        <div className={s.grid}>
          {projects.map((p, i) => (
            <div key={p.name} className={p.featured ? s.cellFeatured : s.cell} data-reveal style={delay(i * 90)}>
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
