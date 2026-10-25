"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import s from "./terminal.module.css";

type Line = { id: number; kind: "cmd" | "out"; content: ReactNode };

const SECTIONS = ["projects", "about", "experience", "contact"];

const COMMANDS = ["help", "neofetch", "about", "projects", "stack", "experience", "contact", "cd", "ls", "clear", "whoami", "date", "echo", "sudo"];

const HELP: [string, string][] = [
  ["neofetch", "краткая сводка обо мне"],
  ["about", "пара слов о себе"],
  ["projects", "проекты"],
  ["stack", "технологии"],
  ["experience", "образование и опыт"],
  ["contact", "как связаться"],
  ["cd <раздел>", "перейти к разделу страницы"],
  ["clear", "очистить экран (Ctrl+L)"],
];

const PALETTE = ["#f85149", "#d29922", "#3fb950", "#58a6ff", "#bc8cff", "#39c5cf", "#e6edf3", "#8b949e"];

const LOGO = `┌──────────┐
│ >_       │
│          │
│          │
└───┬──┬───┘
  ──┴──┴──`;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function Ps1() {
  return (
    <span className={s.ps1}>
      <span className={s.accent}>{profile.handle}@portfolio</span>:<span className={s.path}>~</span>$
    </span>
  );
}

function Neofetch() {
  const rows: [string, string][] = [
    ["role", profile.role],
    ["stack", profile.stackLine],
    ["education", profile.education],
    ["location", profile.location],
  ];
  return (
    <div className={s.neo}>
      <pre className={s.logo} aria-hidden="true">
        {LOGO}
      </pre>
      <div>
        <div>
          <span className={s.accent}>{profile.handle}</span>@<span className={s.accent}>portfolio</span>
        </div>
        <div className={s.dim}>{"─".repeat(18)}</div>
        {rows.map(([k, v]) => (
          <div key={k}>
            <span className={s.key}>{k}</span>: {v}
          </div>
        ))}
        <div>
          <span className={s.key}>status</span>: <span className={s.accent}>● {profile.status}</span>
        </div>
        <div className={s.palette} aria-hidden="true">
          {PALETTE.map((c) => (
            <span key={c} style={{ background: c }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function output(name: string, args: string[]): ReactNode {
  switch (name) {
    case "help":
      return (
        <div className={s.table}>
          {HELP.map(([c, d]) => (
            <div key={c}>
              <span className={s.accent}>{c}</span>
              <span className={s.dim}>{d}</span>
            </div>
          ))}
        </div>
      );
    case "neofetch":
      return <Neofetch />;
    case "whoami":
      return `${profile.name} — ${profile.role}`;
    case "about":
      return profile.about.map((p) => <p key={p}>{p}</p>);
    case "projects":
      return projects.map((p) => (
        <div key={p.name}>
          <a href={p.repo ?? "#projects"} target="_blank" rel="noreferrer">
            {p.name}
          </a>{" "}
          <span className={s.dim}>— {p.description.split(". ")[0]}</span>
        </div>
      ));
    case "stack":
      return Object.entries(profile.stack).map(([k, v]) => (
        <div key={k}>
          <span className={s.key}>{k}</span>: {v.join(", ")}
        </div>
      ));
    case "experience":
      return profile.experience.map((e) => (
        <div key={e.id}>
          <span className={s.hash}>{e.id}</span> {e.title} @ <span className={s.accent}>{e.organization}</span>{" "}
          <span className={s.dim}>({e.period})</span>
          <p className={s.dim}>{e.note}</p>
        </div>
      ));
    case "contact":
      return profile.contacts.map((c) => (
        <div key={c.flag}>
          <span className={s.accent}>{c.flag}</span>{" "}
          <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
            {c.label}
          </a>
        </div>
      ));
    case "ls":
      return (
        <div className={s.ls}>
          {SECTIONS.map((d) => (
            <span key={d} className={s.path}>
              {d}/
            </span>
          ))}
        </div>
      );
    case "cd": {
      const target = (args[0] ?? "~").replace(/^[~./]+/, "").replace(/\/$/, "");
      if (!target) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return <span className={s.dim}>→ ~</span>;
      }
      if (!SECTIONS.includes(target)) return <span className={s.err}>cd: нет такого раздела: {args[0]}</span>;
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
      return <span className={s.dim}>→ ~/{target}</span>;
    }
    case "date":
      return new Date().toLocaleString("ru-RU");
    case "echo":
      return args.join(" ");
    case "sudo":
      return <span className={s.err}>{profile.handle} is not in the sudoers file. This incident will be reported.</span>;
    default:
      return (
        <span className={s.err}>
          command not found: {name}. Введите <span className={s.accent}>help</span>
        </span>
      );
  }
}

// Окно терминала на первом экране: само «набирает» neofetch, потом принимает команды.
export function TerminalWindow() {
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState("");
  const [ready, setReady] = useState(false);
  const [input, setInput] = useState("");
  const nextId = useRef(0);
  const history = useRef<string[]>([]);
  const histPos = useRef(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const push = (...items: Omit<Line, "id">[]) =>
    setLines((prev) => [...prev, ...items.map((l) => ({ ...l, id: nextId.current++ }))]);

  useEffect(() => {
    let cancelled = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    (async () => {
      await wait(reduce ? 0 : 900);
      for (const ch of reduce ? "" : "neofetch") {
        if (cancelled) return;
        setTyping((t) => t + ch);
        await wait(80 + Math.random() * 70);
      }
      await wait(reduce ? 0 : 300);
      if (cancelled) return;
      setTyping("");
      push(
        { kind: "cmd", content: "neofetch" },
        { kind: "out", content: <Neofetch /> },
        {
          kind: "out",
          content: (
            <span className={s.dim}>
              Введите <span className={s.accent}>help</span>, чтобы увидеть команды.
            </span>
          ),
        },
      );
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, typing]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (cmd) history.current.push(cmd);
    histPos.current = history.current.length;
    const [name = "", ...args] = cmd.split(/\s+/);
    const lower = name.toLowerCase();
    if (lower === "clear") return setLines([]);
    const echo = { kind: "cmd" as const, content: raw };
    if (!lower) return push(echo);
    push(echo, { kind: "out", content: output(lower, args) });
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (histPos.current > 0) setInput(history.current[--histPos.current]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histPos.current < history.current.length) setInput(history.current[++histPos.current] ?? "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const prefix = input.trim().toLowerCase();
      const matches = COMMANDS.filter((c) => c.startsWith(prefix));
      if (prefix && matches.length === 1) setInput(`${matches[0]} `);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div className={`mono ${s.window}`}>
      <div className={s.titlebar}>
        <span className={s.dots} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className={s.title}>{profile.handle}@portfolio: ~</span>
      </div>
      <div ref={bodyRef} className={s.body} onClick={() => ready && inputRef.current?.focus({ preventScroll: true })}>
        {lines.map((l) =>
          l.kind === "cmd" ? (
            <div key={l.id} className={s.line}>
              <Ps1 />
              <span>{l.content}</span>
            </div>
          ) : (
            <div key={l.id} className={s.out}>
              {l.content}
            </div>
          ),
        )}
        <div className={s.line}>
          <Ps1 />
          {ready ? (
            <input
              ref={inputRef}
              className={s.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              aria-label="Команда терминала"
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
            />
          ) : (
            <span>
              {typing}
              <span className="cursor">█</span>
            </span>
          )}
        </div>
      </div>
      <div className={s.chips}>
        {["help", "projects", "stack", "contact", "sudo"].map((c) => (
          <button key={c} type="button" disabled={!ready} onClick={() => run(c)}>
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
