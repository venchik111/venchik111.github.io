"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { DotText } from "../DotText";
import { ivanTime } from "../time";
import type { AppId } from "../registry";

type Seg = { t: string; c?: string };
type Line = Seg[];

const seg = (t: string, c?: string): Seg => ({ t, c });
const OPENABLE: Partial<Record<string, AppId>> = { projects: "projects", about: "about", log: "log", contact: "contact" };
const COMMANDS = ["help", "fastfetch", "neofetch", "whoami", "projects", "stack", "contact", "open", "ls", "git", "date", "clear", "sudo"];

const NEO = [
  { k: "role     ", v: profile.role, c: "w" },
  { k: "stack    ", v: profile.stackLine },
  { k: "education", v: profile.education },
  { k: "location ", v: profile.location },
  { k: "shell    ", v: "Hyprland · Nothing Interface" },
  { k: "status   ", v: `● ${profile.status}`, c: "w" },
];

// git log --graph: опыт из профиля, ветки вместо хешей.
const GITLOG: Line[] = profile.experience.flatMap((e, i) => [
  [
    seg("* ", i === 0 ? "r" : "w"),
    seg("(", "d"),
    seg(i === 0 ? `HEAD -> ${e.id}` : e.id, "a"),
    seg(") ", "d"),
    seg(e.title, "w"),
    seg(` @ ${e.organization}`),
    seg(`  ${e.period}`, "d"),
  ],
  [seg(i === profile.experience.length - 1 ? "    " : "│   ", "d"), seg(e.note)],
]);

const prompt = (cmd: string): Line => [seg(profile.handle, "a"), seg(" ~ ", "d"), seg("❯ ", "r"), seg(cmd, "w")];

function output(name: string, args: string[], onOpen?: (id: AppId) => void): Line[] {
  switch (name) {
    case "help":
      return [
        ["fastfetch", "сводка о системе и обо мне"],
        ["projects", "список проектов"],
        ["git log", "образование и опыт"],
        ["stack", "навыки и инструменты"],
        ["contact", "как связаться"],
        ["open <app>", "projects · about · log · contact"],
        ["clear", "очистить экран (Ctrl+L)"],
      ].map(([c, d]) => [seg(c.padEnd(12), "a"), seg(d)]);
    case "fastfetch":
    case "neofetch":
      return NEO.map((r) => [seg(r.k, "a"), seg(" │ ", "d"), seg(r.v, r.c)]);
    case "whoami":
      return [[seg(profile.name, "w"), seg(` — ${profile.role}`)]];
    case "ls":
      return [[seg("projects/  about.md  .config/  .gitconfig", "a")]];
    case "projects":
      return [
        ...projects.map((p) => [seg("drwxr-xr-x  ", "d"), seg(p.slug.padEnd(25), "a"), seg(`${p.name} · ${p.kind}`)]),
        [seg("подробнее: ", "d"), seg("open projects", "a")],
      ];
    case "git":
      return args[0] === "log" ? GITLOG : [[seg("usage: ", "d"), seg("git log", "a")]];
    case "stack":
      return Object.entries(profile.stack).map(([k, v]) => [seg(k.padEnd(11), "a"), seg(v.join(", "))]);
    case "contact":
      return profile.contacts.map((c) => [seg(c.flag.slice(2).padEnd(10), "a"), seg(c.label, "w")]);
    case "open": {
      const app = OPENABLE[(args[0] ?? "").toLowerCase()];
      if (!app) return [[seg("open: ", "d"), seg("projects · about · log · contact", "a")]];
      onOpen?.(app);
      return [[seg("→ ", "d"), seg(app)]];
    }
    case "date":
      return [[seg(ivanTime(Date.now()).iso)]];
    case "sudo":
      return [[seg(`[sudo] password for ${profile.handle}: `)], [seg("Sorry, try again. ", "w"), seg("(это портфолио, а не прод)", "d")]];
    default:
      return [[seg("zsh: command not found: ", "r"), seg(name, "w")]];
  }
}

function render(line: Line, key: number): ReactNode {
  return (
    <div key={key} className="kitty-line">
      {line.map((s, j) => (
        <span key={j} className={s.c ? `k-${s.c}` : undefined}>
          {s.t}
        </span>
      ))}
    </div>
  );
}

// kitty: fastfetch при старте (или git log для окна «2 git»), команды и история.
export function Kitty({ start = "neofetch", onOpen }: { start?: "neofetch" | "log"; onOpen?: (id: AppId) => void }) {
  const isLog = start === "log";
  const [neo, setNeo] = useState(!isLog);
  const [lines, setLines] = useState<Line[]>(
    isLog ? [prompt("git log --graph --oneline"), ...GITLOG, []] : [[seg("введите ", "d"), seg("help", "a"), seg(", чтобы увидеть команды", "d")]],
  );
  const [input, setInput] = useState("");
  const history = useRef<string[]>([]);
  const hpos = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (cmd) history.current.push(cmd);
    hpos.current = history.current.length;
    const [name = "", ...args] = cmd.split(/\s+/);
    const lower = name.toLowerCase();
    setInput("");
    if (lower === "clear") {
      setLines([]);
      setNeo(false);
      return;
    }
    setLines((prev) => [...prev, prompt(raw), ...(lower ? output(lower, args, onOpen) : [])]);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") run(input);
    else if (e.key === "ArrowUp" && hpos.current > 0) {
      e.preventDefault();
      setInput(history.current[--hpos.current]);
    } else if (e.key === "ArrowDown" && hpos.current < history.current.length) {
      e.preventDefault();
      setInput(history.current[++hpos.current] ?? "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const p = input.trim().toLowerCase();
      const m = COMMANDS.filter((c) => c.startsWith(p));
      if (p && m.length === 1) setInput(`${m[0]} `);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      run("clear");
    }
  };

  return (
    <div className="app kitty mono" onClick={() => inputRef.current?.focus({ preventScroll: true })}>
      {neo && (
        <>
          {render(prompt("fastfetch"), -1)}
          <div className="neo">
            <div className="neo-logo" aria-hidden="true">
              <span />
              <span />
              <span />
              <span className="red" />
            </div>
            <div className="neo-info">
              <DotText text={profile.handle} size={3} gap={1} off="#1C1D21" />
              <div className="k-d">──────────────────────────</div>
              {NEO.map((r) => render([seg(r.k, "a"), seg(" │ ", "d"), seg(r.v, r.c)], r.k.length * 100 + r.v.length))}
              <div className="neo-palette" aria-hidden="true">
                {["#111214", "#C8102E", "#55565B", "#8A8C92", "#B1B3B3", "#C2C4CB", "#DCD7D2", "#F5F5F5"].map((c) => (
                  <span key={c} style={{ background: c }} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      {lines.map(render)}
      <label className="kitty-input">
        <span className="kitty-ps1">
          <span className="k-a">{profile.handle}</span> <span className="k-d">~</span> <span className="k-r">❯</span>
        </span>
        <input
          ref={inputRef}
          aria-label="Команда терминала"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
        />
      </label>
      <p className="kitty-hint">подсказка: help · projects · git log · open contact</p>
    </div>
  );
}
