"use client";

import { useEffect, useState } from "react";
import { LANGS, projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { Icon, type IconName } from "../icons";

const PLACES: { name: string; icon: IconName; active?: boolean }[] = [
  { name: "Домашняя", icon: "home" },
  { name: "Рабочий стол", icon: "desktop" },
  { name: "Документы", icon: "doc" },
  { name: "Загрузки", icon: "download" },
  { name: "projects", icon: "folder", active: true },
];

// Thunar-подобный файловый менеджер: папки проектов и README выбранной.
export function Files({ selected = 0 }: { selected?: number }) {
  const [sel, setSel] = useState(selected);
  const [query, setQuery] = useState("");

  useEffect(() => setSel(selected), [selected]);

  const q = query.trim().toLowerCase();
  const visible = projects.map((p, i) => ({ p, i })).filter(({ p }) => !q || `${p.slug} ${p.name}`.toLowerCase().includes(q));
  const shown = visible.some((v) => v.i === sel);
  const cur = projects[sel] ?? projects[0];

  return (
    <div className="app files">
      <div className="files-toolbar">
        <button type="button" className="tool-btn" aria-label="Назад" disabled>
          <Icon name="left" />
        </button>
        <button type="button" className="tool-btn" aria-label="Вперёд" disabled>
          <Icon name="right" />
        </button>
        <button type="button" className="tool-btn" aria-label="Наверх" onClick={() => setQuery("")}>
          <Icon name="up" />
        </button>
        <nav aria-label="Путь" className="files-path mono">
          <Icon name="home" size={13} stroke={2} />
          <span>home</span>›<span>{profile.handle}</span>›<span className="hl">projects</span>
          {shown && (
            <>
              ›<span className="warm">{cur.slug}</span>
            </>
          )}
        </nav>
        <label className="files-search">
          <Icon name="search" size={13} stroke={2} />
          <input aria-label="Поиск в папке" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск" spellCheck={false} />
        </label>
      </div>

      <div className="files-body">
        <nav aria-label="Места" className="files-side">
          <p className="caps">МЕСТА</p>
          {PLACES.map((pl) => (
            <span key={pl.name} className={`files-place${pl.active ? " active" : ""}`}>
              <Icon name={pl.icon} size={14} />
              {pl.name}
            </span>
          ))}
          <p className="caps">УСТРОЙСТВА</p>
          <span className="files-place">
            <Icon name="disk" size={14} />
            nvme0n1p2
          </span>
        </nav>

        <div className="files-main">
          <div role="table" aria-label="Проекты">
            <div role="row" className="files-row head">
              <span role="columnheader">Имя ▾</span>
              <span role="columnheader">Тип</span>
              <span role="columnheader">Язык</span>
            </div>
            {visible.map(({ p, i }) => (
              <button
                key={p.slug}
                type="button"
                role="row"
                aria-pressed={i === sel}
                className={`files-row${i === sel ? " sel" : ""}`}
                onClick={() => setSel(i)}
                onDoubleClick={() => window.open(p.repo, "_blank", "noopener")}
              >
                <span role="cell" className="files-name">
                  <Icon name="folder" />
                  <span>{p.slug}</span>
                </span>
                <span role="cell" className="files-dim">
                  {p.kind}
                </span>
                <span role="cell" className="files-dim mono">
                  {p.lang}
                </span>
              </button>
            ))}
          </div>

          {shown && (
            <article className="files-readme">
              <div className="files-readme-head">
                <span className="caps">README.MD</span>
                <h2>{cur.name}</h2>
              </div>
              <p className="dim">{cur.description}</p>
              <p>
                <span className="caps">МОЙ ВКЛАД&nbsp;&nbsp;</span>
                {cur.contribution}
              </p>
              <p className="result mono">
                <span className="red">❯</span> <span className="muted">result:</span> {cur.highlight}
              </p>
              <div className="files-tags">
                {cur.stack.map((t) => (
                  <span key={t} className="tag mono">
                    {LANGS.includes(t) && <span className="tag-dot" />}
                    {t}
                  </span>
                ))}
                <span className="spacer" />
                <a href={cur.repo} target="_blank" rel="noreferrer" className="btn-light">
                  Открыть на GitHub ↗
                </a>
              </div>
            </article>
          )}
        </div>
      </div>

      <div className="files-status mono">
        <span>{shown ? `${visible.length} папки · выбрано «${cur.slug}»` : `${visible.length} из ${projects.length} папок`}</span>
        <span className="spacer" />
        <span className="hide-narrow">двойной клик — открыть репозиторий</span>
      </div>
    </div>
  );
}
