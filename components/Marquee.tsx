import { profile } from "@/data/profile";
import s from "./ui.module.css";

// Бегущая строка со стеком между первым экраном и проектами.
export function Marquee() {
  const items = Object.values(profile.stack).flat();
  return (
    <div className={`mono ${s.marquee}`}>
      <div className={s.track}>
        {[0, 1].map((copy) => (
          <ul key={copy} className={s.marqueeList} aria-hidden={copy === 1 || undefined}>
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
