"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { DotText } from "./DotText";
import { Icon } from "./icons";
import { APPS, AppView, LINKS, type AppId } from "./registry";
import { EMPTY_TIME, ivanTime, pad } from "./time";

type Rect = { x: number; y: number; w: number; h: number };
type Win = { ws: number; open: boolean; float: boolean; max: boolean; closing: boolean; rect: Rect | null; z: number };

const WS = [
  { n: 1, label: "dev" },
  { n: 2, label: "git" },
  { n: 3, label: "mail" },
  { n: 4, label: "desk" },
];
const GAP = 8;
const TRACK_MS = 9000;
const EASE = "cubic-bezier(.2,.8,.2,1)";

// Тайлинг master-stack, как в Hyprland: первое окно слева, остальные стопкой справа.
function tile(ids: AppId[], work: Rect) {
  const out: Partial<Record<AppId, Rect>> = {};
  if (ids.length === 1) out[ids[0]] = { ...work };
  else if (ids.length > 1) {
    const mw = Math.round((work.w - GAP) * 0.56);
    out[ids[0]] = { x: work.x, y: work.y, w: mw, h: work.h };
    const rest = ids.slice(1);
    const sw = work.w - GAP - mw;
    const sh = Math.round((work.h - GAP * (rest.length - 1)) / rest.length);
    rest.forEach((id, i) => {
      out[id] = { x: work.x + mw + GAP, y: work.y + i * (sh + GAP), w: sw, h: sh };
    });
  }
  return out;
}

// Обложка «трека»: точечный узор 8×8, свой у каждого проекта, одна точка красная.
function coverDots(i: number) {
  const out: string[] = [];
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++) {
      const dr = r - 3.5;
      const dc = c - 3.5;
      let on: boolean;
      if (i === 0) on = r === c || r + c === 7;
      else if (i === 1) on = r === 0 || r === 7 || c === 0 || c === 7 || (r > 2 && r < 5 && c > 2 && c < 5);
      else if (i === 2) on = (r + c) % 2 === 0 && Math.abs(dr) + Math.abs(dc) < 5;
      else on = Math.hypot(dr, dc) < 3.6 && Math.hypot(dr, dc) > 1.8;
      out.push(r === 0 && c === 7 ? "#C8102E" : on ? "#F5F5F5" : "#222328");
    }
  return out;
}

const TICKS = Array.from({ length: 60 }, (_, i) => {
  const a = (i / 60) * Math.PI * 2;
  const major = i % 5 === 0;
  const r1 = major ? 112 : 120;
  // Округление: иначе сервер и браузер расходятся в последних знаках и ломают гидратацию.
  const r2 = (v: number) => Math.round(v * 100) / 100;
  return { x1: r2(144 + Math.sin(a) * r1), y1: r2(144 - Math.cos(a) * r1), x2: r2(144 + Math.sin(a) * 128), y2: r2(144 - Math.cos(a) * 128), major };
});

// Полоса из 10 точек для CPU/RAM; значения — правдоподобный декор, не реальная телеметрия.
const dotBar = (v: number) => Array.from({ length: 10 }, (_, i) => (i < Math.round(v / 10) ? (v > 85 ? "#C8102E" : "#F5F5F5") : "#383940"));

const initialWins = (): Record<AppId, Win> =>
  Object.fromEntries(APPS.map((a, i) => [a.id, { ws: a.ws, open: true, float: false, max: false, closing: false, rect: null, z: i + 1 }])) as Record<AppId, Win>;

export function Desktop() {
  const [vp, setVp] = useState({ w: 1440, h: 900 });
  const [now, setNow] = useState<number | null>(null);
  const [start, setStart] = useState(0);
  const [wins, setWins] = useState(initialWins);
  const [order, setOrder] = useState<AppId[]>(APPS.map((a) => a.id));
  const [ws, setWs] = useState(1);
  const [wsAnim, setWsAnim] = useState({ n: 0, dir: "R" });
  const [focus, setFocus] = useState<AppId | null>("projects");
  const [zTop, setZTop] = useState(APPS.length);
  const [rofi, setRofi] = useState(false);
  const [query, setQuery] = useState("");
  const [notif, setNotif] = useState<"off" | "on" | "out">("off");
  const [unread, setUnread] = useState(true);
  const [lock, setLock] = useState<"on" | "out" | "off">("on");
  const [player, setPlayer] = useState({ track: 0, start: 0, playing: true, frozen: 0 });
  const [sel, setSel] = useState(0);
  const drag = useRef<{ id: AppId; ox: number; oy: number } | null>(null);
  const [dragging, setDragging] = useState<AppId | null>(null);
  const rofiInput = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);

  const work: Rect = { x: 12, y: 48, w: vp.w - 24, h: vp.h - 60 };

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const showNotif = () => {
    setNotif("on");
    setUnread(false);
    later(() => hideNotif(), 9000);
  };
  const hideNotif = () => {
    setNotif((n) => (n === "on" ? "out" : n));
    later(() => setNotif((n) => (n === "out" ? "off" : n)), 200);
  };

  const unlock = () => {
    setLock((l) => (l === "on" ? "out" : l));
    later(() => setLock("off"), 400);
    try {
      sessionStorage.setItem("unlocked", "1");
    } catch {}
    later(showNotif, 1500);
  };

  useEffect(() => {
    const t0 = Date.now();
    setNow(t0);
    setStart(t0);
    setPlayer((p) => ({ ...p, start: t0 }));
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener("resize", onResize);
    const tick = window.setInterval(() => setNow(Date.now()), 1000);

    let seen = false;
    try {
      seen = sessionStorage.getItem("unlocked") === "1";
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      setLock("off");
      if (!seen) later(showNotif, 800);
    } else later(unlock, 1800);

    // Ссылка вида /#contact открывает нужное окно.
    const fromHash = window.location.hash.slice(1) as AppId;
    if (APPS.some((a) => a.id === fromHash)) openApp(fromHash);

    const pending = timers.current;
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearInterval(tick);
      pending.forEach((t) => window.clearTimeout(t));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Проекты в плеере сменяются сами, пока он не на паузе.
  useEffect(() => {
    if (now !== null && player.playing && now - player.start >= TRACK_MS) {
      setPlayer((p) => ({ ...p, track: (p.track + 1) % projects.length, start: now }));
    }
  }, [now, player]);

  useEffect(() => {
    if (rofi) window.setTimeout(() => rofiInput.current?.focus(), 30);
  }, [rofi]);

  const goWs = (n: number) => {
    if (n === ws) return;
    setWsAnim((a) => ({ n: a.n + 1, dir: n > ws ? "R" : "L" }));
    setWs(n);
    setRofi(false);
    const top = (Object.entries(wins) as [AppId, Win][])
      .filter(([, w]) => w.open && !w.closing && w.ws === n)
      .sort((a, b) => b[1].z - a[1].z)[0];
    setFocus(top ? top[0] : null);
  };

  // Уже открытое окно поднимается (с переходом на его рабочий стол), закрытое открывается на текущем.
  function openApp(id: AppId) {
    setRofi(false);
    const nz = zTop + 1;
    setZTop(nz);
    const w = wins[id];
    if (w.open && !w.closing) {
      if (w.ws !== ws) {
        setWsAnim((a) => ({ n: a.n + 1, dir: w.ws > ws ? "R" : "L" }));
        setWs(w.ws);
      }
      setWins((all) => ({ ...all, [id]: { ...all[id], z: nz } }));
    } else {
      setOrder((o) => [...o.filter((x) => x !== id), id]);
      setWins((all) => ({ ...all, [id]: { ...all[id], ws, open: true, closing: false, float: false, max: false, z: nz } }));
    }
    setFocus(id);
    try {
      history.replaceState(null, "", `#${id}`);
    } catch {}
  }

  const focusWin = (id: AppId) => {
    if (focus === id && wins[id].z === zTop) return;
    const nz = zTop + 1;
    setZTop(nz);
    setWins((all) => ({ ...all, [id]: { ...all[id], z: nz } }));
    setFocus(id);
  };

  const closeWin = (id: AppId) => {
    setWins((all) => ({ ...all, [id]: { ...all[id], closing: true } }));
    const top = (Object.entries(wins) as [AppId, Win][])
      .filter(([other, w]) => other !== id && w.open && !w.closing && w.ws === ws)
      .sort((a, b) => b[1].z - a[1].z)[0];
    setFocus(top ? top[0] : null);
    later(() => setWins((all) => ({ ...all, [id]: { ...all[id], open: false, closing: false, max: false, float: false } })), 140);
  };

  const toggleMax = (id: AppId) => {
    setWins((all) => ({ ...all, [id]: { ...all[id], max: !all[id].max } }));
    focusWin(id);
  };

  const tiledIds = order.filter((id) => wins[id].open && wins[id].ws === ws && !wins[id].float && !wins[id].max);
  const tiled = tile(tiledIds, work);
  const rectOf = (id: AppId): Rect => {
    const w = wins[id];
    if (w.max) return work;
    if (w.float && w.rect) return w.rect;
    return tiled[id] ?? work;
  };

  // Перетаскивание делает окно плавающим, остальные перестраиваются, как в Hyprland.
  const startDrag = (id: AppId, e: RPointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button") || wins[id].max || e.button !== 0) return;
    const r = rectOf(id);
    const fl = wins[id].float ? r : { x: r.x + 24, y: r.y + 24, w: Math.min(r.w, 760), h: Math.min(r.h, 520) };
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { id, ox: e.clientX - fl.x, oy: e.clientY - fl.y };
    setDragging(id);
    setWins((all) => ({ ...all, [id]: { ...all[id], float: true, rect: fl } }));
    focusWin(id);
  };

  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    setWins((all) => {
      const w = all[d.id];
      if (!w.rect) return all;
      const x = Math.max(120 - w.rect.w, Math.min(vp.w - 120, e.clientX - d.ox));
      const y = Math.max(44, Math.min(vp.h - 40, e.clientY - d.oy));
      return { ...all, [d.id]: { ...w, rect: { ...w.rect, x: Math.round(x), y: Math.round(y) } } };
    });
  };

  const onUp = () => {
    drag.current = null;
    setDragging(null);
  };

  const t = now === null ? EMPTY_TIME : ivanTime(now);
  const cpu = now === null ? 12 : Math.round(13 + 6 * Math.sin(now / 3700) + 3 * Math.sin(now / 1300));
  const ram = now === null ? 44 : Math.round(44 + 2 * Math.sin(now / 9000));
  const temp = now === null ? 48 : Math.round(48 + 2 * Math.sin(now / 7000));
  const up = now === null ? 0 : Math.floor((now - start) / 1000);
  const uptime = `${Math.floor(up / 3600)}h${pad(Math.floor((up % 3600) / 60))}m`;
  const elapsed = now === null ? 0 : player.playing ? now - player.start : player.frozen;
  const progress = Math.min(100, (elapsed / TRACK_MS) * 100);
  const track = projects[player.track];
  const cover = useMemo(() => coverDots(player.track), [player.track]);

  const setTrack = (i: number) => setPlayer((p) => ({ ...p, track: (i + projects.length) % projects.length, start: Date.now(), frozen: 0 }));
  const togglePlay = () =>
    setPlayer((p) => (p.playing ? { ...p, playing: false, frozen: Date.now() - p.start } : { ...p, playing: true, start: Date.now() - p.frozen }));
  const openTrack = () => {
    setSel(player.track);
    openApp("projects");
  };

  const q = query.trim().toLowerCase();
  const rofiItems = [
    ...APPS.map((a) => ({ key: a.id, name: a.name, desc: a.desc, icon: a.icon, ext: false, run: () => openApp(a.id) })),
    ...LINKS.map((l) => ({ key: l.name, name: l.name, desc: l.desc, icon: l.icon, ext: true, run: () => (window.open(l.href, "_blank", "noopener"), setRofi(false)) })),
    { key: "plain", name: "Простая версия", desc: "весь сайт одной страницей", icon: "doc" as const, ext: true, run: () => (window.location.href = "plain/") },
  ].filter((it) => !q || `${it.name} ${it.desc}`.toLowerCase().includes(q));

  const active = focus && wins[focus].ws === ws ? APPS.find((a) => a.id === focus) : null;
  const visible = order.filter((id) => wins[id].open && wins[id].ws === ws);

  return (
    <div className="desk" onPointerMove={onMove} onPointerUp={onUp}>
      <a href="plain/" className="skip-link">
        Простая версия сайта
      </a>
      <div className="wall" aria-hidden="true" />

      <section aria-label="Виджеты рабочего стола" className="widgets">
        <div className="w-clock" role="img" aria-label={`Время у Ивана ${t.hhmm}`}>
          <svg width="288" height="288" viewBox="0 0 288 288" aria-hidden="true">
            <circle cx="144" cy="144" r="140" fill="rgba(17,18,20,0.35)" />
            {TICKS.map((k, i) => (
              <line key={i} x1={k.x1} y1={k.y1} x2={k.x2} y2={k.y2} stroke={k.major ? "#F5F5F5" : "#8A8C92"} strokeWidth={k.major ? 3 : 1.5} strokeLinecap="round" />
            ))}
            <line x1="144" y1="144" x2="144" y2="80" stroke="#F5F5F5" strokeWidth="6" strokeLinecap="round" style={{ transform: `rotate(${(t.h % 12) * 30 + t.m * 0.5}deg)`, transformOrigin: "144px 144px" }} />
            <line x1="144" y1="144" x2="144" y2="44" stroke="#F5F5F5" strokeWidth="3" strokeLinecap="round" style={{ transform: `rotate(${t.m * 6 + t.s * 0.1}deg)`, transformOrigin: "144px 144px" }} />
            <line x1="144" y1="160" x2="144" y2="40" stroke="#C8102E" strokeWidth="2" strokeLinecap="round" style={{ transform: `rotate(${t.s * 6}deg)`, transformOrigin: "144px 144px" }} />
            <circle cx="144" cy="144" r="5" fill="#C8102E" />
          </svg>
        </div>

        <button type="button" className="w-tile w-status" onClick={() => openApp("contact")} aria-label="Статус: ищу стажировку. Открыть контакты">
          <span className="w-ring">
            <svg width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
              <circle cx="48" cy="48" r="44" fill="none" stroke="#2D2E33" strokeWidth="6" />
              <circle cx="48" cy="48" r="44" fill="none" stroke="#C2C4CB" strokeWidth="3" strokeDasharray="0.1 9.2" strokeLinecap="round" />
            </svg>
            <span className="red-dot pulse big" />
          </span>
          <span className="w-caption">
            <span className="caps">OPEN TO WORK</span>
            <span className="w-title">ищу стажировку</span>
            <span className="w-sub">удалённо · офис</span>
          </span>
        </button>

        <div className="w-capsule" role="img" aria-label={`Сессия: ${uptime}`}>
          <span className="caps vertical">SESSION</span>
          <DotText text={uptime} size={5} gap={2} label={`Сессия ${uptime}`} />
        </div>

        <button type="button" className="w-tile w-rank" onClick={() => openApp("log")}>
          <span className="caps">RANK</span>
          <DotText text="II" size={9} gap={3} label="II" />
          <span className="w-sub">
            разряд по спортивному
            <br />
            программированию
          </span>
        </button>

        <section aria-label="Сейчас играет" className="w-media">
          <div className="w-cover" aria-hidden="true">
            {cover.map((c, i) => (
              <span key={i} style={{ background: c }} />
            ))}
          </div>
          <div className="w-media-body">
            <p className="caps">
              NOW PLAYING · {player.track + 1}/{projects.length}
            </p>
            <p className="w-media-title">{track.name}</p>
            <p className="w-sub">{track.stack.slice(0, 3).join(" · ")}</p>
            <span className="spacer" />
            <div className="progress" aria-hidden="true">
              <div style={{ width: `${progress}%`, transition: progress < 12 ? "none" : "width 1s linear" }} />
            </div>
            <div className="w-media-ctl">
              <button type="button" className="icon-btn" aria-label="Предыдущий проект" onClick={() => setTrack(player.track - 1)}>
                <Icon name="prev" size={18} />
              </button>
              <button type="button" className="icon-btn" aria-label={player.playing ? "Пауза" : "Воспроизвести"} onClick={togglePlay}>
                <Icon name={player.playing ? "pause" : "play"} size={18} stroke={2} />
              </button>
              <button type="button" className="icon-btn" aria-label="Следующий проект" onClick={() => setTrack(player.track + 1)}>
                <Icon name="next" size={18} />
              </button>
              <span className="spacer" />
              <button type="button" className="btn-light" onClick={openTrack}>
                открыть в Файлах
              </button>
            </div>
          </div>
        </section>
      </section>

      <div className={`win-layer ws${wsAnim.dir}${wsAnim.n % 2 ? "" : "2"}`}>
        {visible.map((id) => {
          const w = wins[id];
          const a = APPS.find((x) => x.id === id)!;
          const r = rectOf(id);
          const focused = focus === id;
          return (
            <section
              key={id}
              aria-label={a.title}
              className={`win${w.closing ? " closing" : ""}${focused ? " focused" : ""}${w.float ? " floating" : ""}`}
              onPointerDown={() => focusWin(id)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.stopPropagation();
                  closeWin(id);
                }
              }}
              style={{
                left: r.x,
                top: r.y,
                width: r.w,
                height: r.h,
                zIndex: (w.float || w.max ? 200 : 10) + w.z,
                transition: dragging === id ? "none" : `left .28s ${EASE}, top .28s ${EASE}, width .28s ${EASE}, height .28s ${EASE}`,
              }}
            >
              <div className="hyprbar" onPointerDown={(e) => startDrag(id, e)} onDoubleClick={() => toggleMax(id)} style={{ cursor: w.max ? "default" : "grab" }}>
                <span className="hyprbar-title">{a.title}</span>
                {w.float && !w.max && <span className="caps">FLOAT</span>}
                <button type="button" className="hb" aria-label="Развернуть" onClick={() => toggleMax(id)} />
                <button type="button" className="hb x" aria-label="Закрыть" onClick={() => closeWin(id)} />
              </div>
              <div className="win-body">
                <AppView id={id} selected={sel} onOpen={openApp} />
              </div>
            </section>
          );
        })}
      </div>

      <nav aria-label="Рабочие столы" className="island island-left mono">
        <button type="button" className="bar-btn launcher" aria-label="Меню приложений" aria-expanded={rofi} onClick={() => (setRofi(!rofi), setQuery(""))}>
          <span />
          <span />
          <span />
          <span className="red" />
        </button>
        {WS.map((w) => {
          const occupied = Object.values(wins).some((x) => x.open && x.ws === w.n);
          const cur = ws === w.n;
          return (
            <button
              key={w.n}
              type="button"
              className={`bar-btn ws-btn${cur ? " cur" : ""}${occupied ? " busy" : ""}`}
              aria-label={`Рабочий стол ${w.n} · ${w.label}`}
              aria-current={cur ? "true" : undefined}
              onClick={() => goWs(w.n)}
            >
              {cur ? `${w.n} ${w.label}` : w.n}
              {occupied && !cur && <span className="ws-dot" />}
            </button>
          );
        })}
        <span className="bar-sep" />
        <span className="bar-title">{active ? active.title : "рабочий стол"}</span>
      </nav>

      <div className="island island-center mono">
        <DotText text={t.dots} size={2} gap={1} off="rgba(245,245,245,0.08)" label={t.hhmm} />
        <span className="dim">{t.short}</span>
        <span className="bar-sep" />
        <button type="button" className="bar-btn media" onClick={openTrack} aria-label={`Сейчас играет: ${track.name}. Открыть`}>
          <span className="red-dot pulse" />
          <span className="marq-box" aria-hidden="true">
            <span className="marq">
              {track.name} — {track.stack.slice(0, 3).join(" · ")}
            </span>
          </span>
        </button>
      </div>

      <div className="island island-right mono">
        <span className="meter" aria-label={`Загрузка процессора ${cpu}%`}>
          <span className="caps">CPU</span>
          <span className="meter-dots" aria-hidden="true">
            {dotBar(cpu).map((c, i) => (
              <span key={i} style={{ background: c }} />
            ))}
          </span>
          <span className="meter-val">{cpu}%</span>
        </span>
        <span className="meter" aria-label={`Память ${ram}%`}>
          <span className="caps">RAM</span>
          <span className="meter-dots" aria-hidden="true">
            {dotBar(ram).map((c, i) => (
              <span key={i} style={{ background: c }} />
            ))}
          </span>
          <span className="meter-val">{ram}%</span>
        </span>
        <span className="hide-md">{temp}°</span>
        <span className="bar-sep" />
        <span>RU</span>
        <Icon name="wifi" size={14} stroke={2} />
        <Icon name="volume" size={14} stroke={2} />
        <button type="button" className="bar-btn bell" onClick={showNotif} aria-label={unread ? "Уведомления: 1 новое" : "Уведомления"}>
          <Icon name="bell" size={14} stroke={2} />
          {unread && <span className="bell-dot" />}
        </button>
        <span className="battery" aria-label="Батарея 62%">
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" fill="none" stroke="#383940" strokeWidth="3" />
            <circle cx="12" cy="12" r="9" fill="none" stroke="#F5F5F5" strokeWidth="3" strokeDasharray="35 57" transform="rotate(-90 12 12)" />
          </svg>
          62
        </span>
      </div>

      {notif !== "off" && (
        <div className={`notif${notif === "out" ? " out" : ""}`} role="status">
          <div className="notif-head caps">
            <span className="red-dot pulse" />
            <span className="spacer">TELEGRAM · @VENCHIK111</span>
            <span>сейчас</span>
          </div>
          <p className="notif-title">{profile.name} ищет стажировку</p>
          <p className="w-sub">Python · backend · удалённо или в офисе. Для связи — Telegram.</p>
          <div className="notif-actions">
            <a href="https://t.me/venchik111" target="_blank" rel="noreferrer" className="btn-light">
              Написать
            </a>
            <button type="button" className="btn-dark" onClick={hideNotif}>
              Скрыть
            </button>
          </div>
        </div>
      )}

      {rofi && (
        <div className="rofi-backdrop" onClick={() => setRofi(false)}>
          <div className="rofi mono" role="dialog" aria-label="Запуск приложений" onClick={(e) => e.stopPropagation()}>
            <label className="rofi-input">
              <span className="red" aria-hidden="true">
                ❯
              </span>
              <span className="sr-only">Поиск приложений</span>
              <input
                ref={rofiInput}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setRofi(false);
                  else if (e.key === "Enter") rofiItems[0]?.run();
                }}
                placeholder="drun: поиск приложений…"
                spellCheck={false}
                autoComplete="off"
              />
            </label>
            <div className="rofi-list">
              {rofiItems.map((it, i) => (
                <button key={it.key} type="button" className={`rofi-row${i === 0 && q ? " first" : ""}`} onClick={it.run}>
                  <span className="rofi-icon">
                    <Icon name={it.icon} size={14} stroke={2} />
                  </span>
                  <span>{it.name}</span>
                  <span className="rofi-desc">{it.desc}</span>
                  {it.ext && <span className="muted">↗</span>}
                </button>
              ))}
              {rofiItems.length === 0 && <p className="rofi-empty">ничего не найдено</p>}
            </div>
          </div>
        </div>
      )}

      {lock !== "off" && (
        <div className={`lock${lock === "out" ? " out" : ""}`} onClick={unlock}>
          <div className="wall blur" aria-hidden="true" />
          <div className="lock-body">
            <DotText text={t.hhmm} size={14} gap={4} off="rgba(245,245,245,0.06)" />
            <p className="lock-date mono">{t.long}</p>
            <button type="button" className="lock-btn" onClick={unlock}>
              <span className="red-dot pulse" />
              {profile.handle} · нажмите, чтобы войти
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
