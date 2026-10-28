import { profile } from "@/data/profile";
import s from "./ui.module.css";

const links = [
  { href: "#projects", label: "projects" },
  { href: "#about", label: "about" },
  { href: "#contact", label: "contact" },
  { href: profile.cvUrl, label: "cv", external: true },
];

export function Header() {
  return (
    <header className={s.header}>
      <div className={`container ${s.headerInner}`}>
        <a href="#top" className={`mono ${s.logo}`} aria-label="В начало страницы">
          <span className={s.logoPath}>
            ~<span className={s.logoHandle}>/{profile.handle}</span>
          </span>{" "}
          <span className={s.logoSign}>$</span> <span className="cursor">█</span>
        </a>
        <nav className={`mono ${s.nav}`} aria-label="Навигация">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noreferrer" : undefined}
            >
              <span className={s.bracket}>[</span>
              {l.label}
              <span className={s.bracket}>]</span>
            </a>
          ))}
        </nav>
      </div>
      <span className={s.progress} aria-hidden="true" />
    </header>
  );
}
