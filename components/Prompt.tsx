import type { CSSProperties } from "react";
import { delay } from "./delay";
import s from "./ui.module.css";

export function Prompt({ command, comment }: { command: string; comment?: string }) {
  return (
    <div className={s.promptRow}>
      <h2 className={`mono ${s.prompt}`} data-reveal>
        <span className={s.promptSign} aria-hidden="true">
          &gt;
        </span>
        <span className="cmd" style={{ "--n": command.length } as CSSProperties}>
          {command}
        </span>
      </h2>
      {comment && (
        <p className={`mono ${s.comment}`} data-reveal style={delay(500)}>
          # {comment}
        </p>
      )}
    </div>
  );
}
