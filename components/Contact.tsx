import { profile } from "@/data/profile";
import { delay } from "./delay";
import { Prompt } from "./Prompt";
import s from "./ui.module.css";

export function Contact() {
  return (
    <section id="contact" className={`${s.section} ${s.contact}`} data-spot>
      <div className="container">
        <Prompt command="contact --help" comment="открыт к предложениям" />
        <div className={s.contactGrid}>
          <div>
            <h3 className={s.cta} data-reveal>
              Ищете стажёра в команду?
              <br />
              <span className={s.ctaAccent}>Давайте обсудим.</span>
            </h3>
            <p className={s.contactIntro} data-reveal style={delay(120)}>
              Ищу стажировку или начальную позицию в Python-разработке. Готов работать удалённо или в офисе. Для связи — Telegram.
            </p>
          </div>
          <ul className={`mono ${s.options}`}>
            {profile.contacts.map((c, i) => (
              <li key={c.flag} data-reveal style={delay(150 + i * 80)}>
                <a
                  href={c.href}
                  className={s.option}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                >
                  <span className={s.flag}>{c.flag}</span>
                  <span>{c.label}</span>
                  <span className={s.optionArrow} aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
