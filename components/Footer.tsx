import { profile } from "@/data/profile";
import s from "./ui.module.css";

export function Footer() {
  return (
    <footer className={`mono ${s.footer}`}>
      <div className={`container ${s.footerInner}`}>
        <span>
          <span className={s.flag}>exit 0</span> · © {new Date().getFullYear()} {profile.name}
        </span>
        <a href="#top">cd ~ ↑</a>
      </div>
    </footer>
  );
}
