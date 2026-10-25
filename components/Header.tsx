import { profile } from "@/data/profile";
import s from "./ui.module.css";

const links = [
  { href: "#projects", label: "projects" },
  { href: "#about", label: "about" },
  { href: "#contact", label: "contact" },
];

export function Header() {
  return (
    <header className={s.header}>
      <div className={`container ${s.headerInner}`}>
        <a href="#top" className={`mono ${s.logo}`}>
          <span className={s.logoPath}>~/{profile.handle}</span>{" "}
          <span className={s.logoSign}>$</span> <span className="cursor">█</span>
        </a>
        <nav className={`mono ${s.nav}`} aria-label="Навигация">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              [{l.label}]
            </a>
          ))}
          <a href={profile.cvUrl}>[cv]</a>
        </nav>
      </div>
      <span className={s.progress} aria-hidden="true" />
    </header>
  );
}
