import type { CSSProperties, ReactNode } from "react";
import { profile } from "@/data/profile";
import { delay } from "./delay";
import { Prompt } from "./Prompt";
import s from "./ui.module.css";

// Строки дерева stack/ в стиле утилиты tree.
function treeLines(): ReactNode[] {
  const groups = Object.entries(profile.stack);
  const lines: ReactNode[] = [<span className={s.treeDir}>stack/</span>];
  groups.forEach(([dir, items], gi) => {
    const lastGroup = gi === groups.length - 1;
    lines.push(
      <>
        {lastGroup ? "└── " : "├── "}
        <span className={s.treeDir}>{dir}/</span>
      </>,
    );
    items.forEach((item, i) =>
      lines.push(
        <>
          {lastGroup ? "    " : "│   "}
          {i === items.length - 1 ? "└── " : "├── "}
          <span className={s.treeItem}>{item}</span>
        </>,
      ),
    );
  });
  return lines;
}

export function About() {
  return (
    <section id="about" className={s.section}>
      <div className="container">
        <Prompt command="cat about.md" comment="кто я и на чём пишу" />
        <div className={s.aboutGrid}>
          <div className={s.aboutText}>
            {profile.about.map((p, i) => (
              <p key={p} data-reveal style={delay(i * 120)}>
                {p}
              </p>
            ))}
          </div>
          <pre className={`mono ${s.tree}`} aria-label="Стек технологий" data-reveal style={delay(150)}>
            {treeLines().map((line, i) => (
              <span key={i} className={s.treeLine} style={{ "--i": i } as CSSProperties}>
                {line}
              </span>
            ))}
          </pre>
        </div>
      </div>
    </section>
  );
}
