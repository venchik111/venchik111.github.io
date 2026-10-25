import { profile } from "@/data/profile";
import { delay } from "./delay";
import { Prompt } from "./Prompt";
import s from "./ui.module.css";

export function Experience() {
  return (
    <section id="experience" className={s.section}>
      <div className="container">
        <Prompt command="git log --graph" comment="Образование и опыт" />
        <ol className={`mono ${s.log}`} data-reveal>
          {profile.experience.map((e, i) => (
            <li key={e.id} className={s.logItem} data-reveal style={delay(200 + i * 150)}>
              <span className={s.node} aria-hidden="true" />
              <span className={s.hash}>{e.id}</span>
              <span className={s.period}>{e.period}</span>
              <span>
                <span className={s.logTitle}>{e.title}</span> @ <span className={s.logCompany}>{e.organization}</span>
                {i === 0 && <span className={s.headTag}>HEAD</span>}
                <span className={s.logNote}>{e.note}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
