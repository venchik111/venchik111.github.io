import { profile } from "@/data/profile";
import { CountUp } from "./CountUp";
import { delay } from "./delay";
import { Scramble } from "./Scramble";
import { TerminalWindow } from "./TerminalWindow";
import s from "./ui.module.css";

export function Hero() {
  return (
    <section id="top" className={s.hero} data-spot>
      <div className={s.heroBg} aria-hidden="true">
        <span className={`${s.blob} ${s.blobA}`} />
        <span className={`${s.blob} ${s.blobB}`} />
        <span className={s.dots} />
        <span className={s.dotsLit} />
      </div>

      <div className={`container ${s.heroInner}`}>
        <div>
          <p className={`enter mono ${s.status}`}>
            <span className={s.pulse} />
            {profile.status}
          </p>
          <h1 className={`enter ${s.heroTitle}`} style={delay(100)} aria-label={profile.name}>
            <Scramble text={profile.name} />
          </h1>
          <p className={`enter mono ${s.heroRole}`} style={delay(200)}>
            {profile.role}
          </p>
          <p className={`enter mono ${s.heroLocation}`} style={delay(250)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
            {profile.location}
          </p>
          <p className={`enter ${s.heroTagline}`} style={delay(300)}>
            {profile.tagline}
          </p>
          <div className={`enter mono ${s.actions}`} style={delay(400)}>
            <a href="#projects" className={`${s.btn} ${s.btnPrimary}`}>
              ./projects <span aria-hidden="true">→</span>
            </a>
            <a href="#contact" className={s.btn}>
              ./contact
            </a>
            <a href={profile.cvUrl} className={`${s.btn} ${s.btnGhost}`} target="_blank" rel="noreferrer">
              ./resume <span aria-hidden="true">↗</span>
            </a>
          </div>
          <dl className={`enter ${s.stats}`} style={delay(500)}>
            {profile.stats.map((st) => (
              <div key={st.label} className={s.stat}>
                <dt>{st.label}</dt>
                <dd className="mono">{typeof st.value === "number" ? <CountUp value={st.value} /> : st.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={`enter ${s.heroTerminal}`} style={delay(350)}>
          <TerminalWindow />
        </div>
      </div>
    </section>
  );
}
