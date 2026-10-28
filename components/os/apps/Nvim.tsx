import { profile } from "@/data/profile";

type Seg = { t: string; cls?: string };

// about.md, как он выглядит в nvim: Markdown с подсветкой, относительные номера строк.
const SRC: Seg[][] = [
  [{ t: "# ", cls: "md-mark" }, { t: profile.name, cls: "md-h1" }],
  [],
  [{ t: "> ", cls: "md-mark" }, { t: profile.role, cls: "md-quote" }],
  [],
  ...profile.about.map((p) => [{ t: p }]),
  [],
  [{ t: "## ", cls: "md-mark" }, { t: "Что ищу", cls: "md-h2" }],
  [],
  [{ t: profile.seeking }],
  [],
  [{ t: "## ", cls: "md-mark" }, { t: "Стек", cls: "md-h2" }],
  [],
  ...Object.entries(profile.stack).map(([k, v]) => [
    { t: "- ", cls: "md-bullet" },
    { t: `**${k}**`, cls: "md-bold" },
    { t: `: ${v.join(", ")}` },
  ]),
  [],
  [{ t: "## ", cls: "md-mark" }, { t: "Связь", cls: "md-h2" }],
  [],
  [{ t: "Telegram " }, { t: "[@venchik111](https://t.me/venchik111)", cls: "md-link" }],
];
// Курсор стоит на строке «Что ищу» — самой важной для работодателя.
const CURSOR = SRC.findIndex((l) => l[1]?.t === "Что ищу") + 3;

export function Nvim() {
  return (
    <div className="app nvim mono">
      <div className="nvim-tabs">
        <span className="nvim-tab active">
          <span className="red-dot" />
          about.md
        </span>
        <span className="nvim-tab">projects.md</span>
      </div>
      <div className="nvim-buf">
        {SRC.map((segs, i) => {
          const n = i + 1;
          const cur = n === CURSOR;
          return (
            <div key={i} className={`nvim-line${cur ? " cur" : ""}`}>
              <span className="nvim-num" aria-hidden="true">
                {cur ? n : Math.abs(n - CURSOR)}
              </span>
              <span className="nvim-text">
                {segs.length === 0 && " "}
                {segs.map((s, j) =>
                  cur && j === 0 ? (
                    <span key={j}>
                      <span className="nvim-cursor">{s.t.slice(0, 1)}</span>
                      {s.t.slice(1)}
                    </span>
                  ) : (
                    <span key={j} className={s.cls}>
                      {s.t}
                    </span>
                  ),
                )}
              </span>
            </div>
          );
        })}
        {Array.from({ length: 6 }, (_, i) => (
          <div key={`t${i}`} className="nvim-line tilde" aria-hidden="true">
            <span className="nvim-num" />
            <span>~</span>
          </div>
        ))}
      </div>
      <div className="nvim-status">
        <span className="mode">NORMAL</span>
        <span className="file">about.md</span>
        <span className="muted">main</span>
        <span className="spacer" />
        <span className="muted">markdown</span>
        <span className="muted">utf-8</span>
        <span className="file">{CURSOR}:1</span>
      </div>
      <div className="nvim-cmd muted">&quot;about.md&quot; {SRC.length}L written</div>
    </div>
  );
}
