import type { Metadata } from "next";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: `${profile.name} — портфолио (простая версия)`,
  description: profile.tagline,
};

// Весь контент одной страницей: для скринридеров, поисковиков и тех, кому не до рабочего стола.
export default function Plain() {
  return (
    <main className="plain">
      <p className="mono muted">
        <a href="../">← вернуться на рабочий стол</a>
      </p>

      <h1>{profile.name}</h1>
      <p className="lead">
        {profile.role} · {profile.location}
      </p>
      <p>
        <strong>Статус:</strong> {profile.status}.
      </p>

      <h2>Обо мне</h2>
      {profile.about.map((p) => (
        <p key={p}>{p}</p>
      ))}
      <p>
        <strong>Что ищу:</strong> {profile.seeking}
      </p>

      <h2>Навыки и инструменты</h2>
      <ul>
        {Object.entries(profile.stack).map(([k, v]) => (
          <li key={k}>
            <strong>{k}</strong>: {v.join(", ")}
          </li>
        ))}
      </ul>

      <h2>Проекты</h2>
      {projects.map((p) => (
        <section key={p.slug}>
          <h3>
            <a href={p.repo}>{p.name}</a> <span className="muted">· {p.kind}</span>
          </h3>
          <p>{p.description}</p>
          <p>
            <strong>Мой вклад:</strong> {p.contribution}
          </p>
          <p>
            <strong>Результат:</strong> {p.highlight}
          </p>
          <p className="muted">Стек: {p.stack.join(", ")}</p>
        </section>
      ))}

      <h2>Образование и опыт</h2>
      {profile.experience.map((e) => (
        <section key={e.id}>
          <h3>
            {e.title} — {e.organization} <span className="muted">· {e.period}</span>
          </h3>
          <p>{e.note}</p>
        </section>
      ))}

      <h2>Контакты</h2>
      <ul>
        <li>
          Telegram: <a href="https://t.me/venchik111">@venchik111</a>
        </li>
        <li>
          GitHub: <a href="https://github.com/venchik111">github.com/venchik111</a>
        </li>
        <li>
          Резюме: <a href={profile.cvUrl}>singularity-resume.ru</a>
        </li>
      </ul>
    </main>
  );
}
