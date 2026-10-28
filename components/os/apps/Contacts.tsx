import { profile } from "@/data/profile";
import { DotText } from "../DotText";
import { Icon, type IconName } from "../icons";

const ROWS: { icon: IconName; title: string; sub: string; href: string }[] = [
  { icon: "send", title: "Telegram", sub: "@venchik111 · отвечаю быстрее всего", href: "https://t.me/venchik111" },
  { icon: "code", title: "GitHub", sub: "github.com/venchik111", href: "https://github.com/venchik111" },
  { icon: "card", title: "Резюме", sub: "singularity-resume.ru", href: profile.cvUrl },
];

// Карточка контакта в духе GNOME Contacts.
export function Contacts() {
  return (
    <div className="app contacts">
      <div className="contacts-head">
        <div className="avatar">
          <DotText text="IS" size={4} gap={2} off="#222328" label="ИС" />
        </div>
        <div>
          <h2>{profile.name}</h2>
          <p className="mono muted">{profile.role}</p>
        </div>
        <span className="status-pill mono">
          <span className="red-dot pulse" />
          ИЩУ СТАЖИРОВКУ
        </span>
      </div>

      <p className="contacts-intro dim">
        Ищу стажировку или начальную позицию в Python-разработке. Готов работать удалённо или в офисе. Для связи — Telegram.
      </p>

      <div className="contacts-group">
        <p className="caps">СВЯЗАТЬСЯ</p>
        <ul className="boxed-list">
          {ROWS.map((r) => (
            <li key={r.title}>
              <a href={r.href} target="_blank" rel="noreferrer">
                <Icon name={r.icon} size={18} />
                <span className="boxed-text">
                  <span className="boxed-title">{r.title}</span>
                  <span className="boxed-sub">{r.sub}</span>
                </span>
                <span className="muted" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <a href="https://t.me/venchik111" target="_blank" rel="noreferrer" className="btn-light big">
        Написать в Telegram
      </a>
    </div>
  );
}
