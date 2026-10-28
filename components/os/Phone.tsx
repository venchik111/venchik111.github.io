"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { DotText } from "./DotText";
import { Icon } from "./icons";
import { APPS, AppView, LINKS, type AppId } from "./registry";
import { EMPTY_TIME, ivanTime } from "./time";

// Мобильная версия в духе Phosh: домашний экран с сеткой приложений, приложение — на весь экран.
export function Phone() {
  const [now, setNow] = useState<number | null>(null);
  const [app, setApp] = useState<AppId | null>(null);
  const [closing, setClosing] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setNow(Date.now());
    const tick = window.setInterval(() => setNow(Date.now()), 1000);
    // Системная кнопка «назад» закрывает открытое приложение.
    const onPop = () => setApp(null);
    window.addEventListener("popstate", onPop);
    return () => {
      window.clearInterval(tick);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  const open = (id: AppId) => {
    if (!app) history.pushState({ app: id }, "", `#${id}`);
    else history.replaceState({ app: id }, "", `#${id}`);
    setClosing(false);
    setApp(id);
  };

  const back = () => {
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      if (history.state?.app) history.back();
      else setApp(null);
    }, 180);
  };

  const t = now === null ? EMPTY_TIME : ivanTime(now);
  const q = query.trim().toLowerCase();
  const items = [
    ...APPS.map((a) => ({ key: a.id, name: a.name, icon: a.icon, badge: false, run: () => open(a.id) })),
    ...LINKS.map((l) => ({ key: l.name, name: l.name, icon: l.icon, badge: l.name === "Telegram", run: () => window.open(l.href, "_blank", "noopener") })),
  ].filter((it) => !q || it.name.toLowerCase().includes(q));
  const cur = APPS.find((a) => a.id === app);

  return (
    <div className="phone">
      <a href="plain/" className="skip-link">
        Простая версия сайта
      </a>
      <div className="wall phone-wall" aria-hidden="true" />
      <div className="phone-shade" aria-hidden="true" />

      <div className="phone-status mono">
        <span>{t.hhmm}</span>
        <span className="red-dot pulse small" />
        <span className="spacer" />
        <Icon name="wifi" size={13} stroke={2.2} />
        <span className="battery">
          <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" fill="none" stroke="#383940" strokeWidth="3.5" />
            <circle cx="12" cy="12" r="9" fill="none" stroke="#F5F5F5" strokeWidth="3.5" strokeDasharray="35 57" transform="rotate(-90 12 12)" />
          </svg>
          62
        </span>
      </div>

      <main className="phone-home">
        <div className="phone-clock">
          <DotText text={t.dots} size={7} gap={3} off="rgba(245,245,245,0.06)" label={`Время у Ивана ${t.hhmm}`} />
          <p className="mono caps">{t.long}</p>
        </div>

        <a href="https://t.me/venchik111" target="_blank" rel="noreferrer" className="phone-notif">
          <span className="notif-head caps">
            <span className="red-dot pulse" />
            <span className="spacer">TELEGRAM · @VENCHIK111</span>
            <span>сейчас</span>
          </span>
          <span className="notif-title">{profile.name} ищет стажировку</span>
          <span className="w-sub">Python · backend · удалённо или в офисе. Нажмите, чтобы написать.</span>
        </a>

        <label className="phone-search">
          <Icon name="search" size={15} stroke={2} />
          <input aria-label="Поиск приложений" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск приложений" spellCheck={false} />
        </label>

        <nav aria-label="Приложения" className="phone-grid">
          {items.map((it) => (
            <button key={it.key} type="button" className="phone-app" onClick={it.run}>
              <span className="phone-icon">
                <Icon name={it.icon} size={22} />
                {it.badge && <span className="red-dot badge" />}
              </span>
              {it.name}
            </button>
          ))}
        </nav>
        {items.length === 0 && <p className="mono muted center">ничего не найдено</p>}
      </main>

      <div className="home-bar" aria-hidden="true">
        <span />
      </div>

      {cur && (
        <div className={`phone-app-view${closing ? " closing" : ""}`} role="dialog" aria-label={cur.title}>
          <div className="phone-app-head">
            <button type="button" className="icon-btn" aria-label="Назад" onClick={back}>
              <Icon name="back" size={20} stroke={2} />
            </button>
            <span className="mono">{cur.title}</span>
          </div>
          <div className="phone-app-body">
            <AppView id={cur.id} selected={0} onOpen={open} />
          </div>
          <button type="button" className="home-bar" aria-label="На главный экран" onClick={back}>
            <span />
          </button>
        </div>
      )}
    </div>
  );
}
