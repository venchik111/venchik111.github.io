"use client";

import { useState } from "react";
import s from "./ui.module.css";

// Копирование email; при открытии по http в локальной сети Clipboard API недоступен,
// поэтому есть запасной вариант через execCommand.
function copy(text: string) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  ta.remove();
  return Promise.resolve();
}

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className={`mono ${s.emailRow}`}>
      <a href={`mailto:${email}`} className={s.email}>
        {email}
      </a>
      <button
        type="button"
        className={s.copyBtn}
        onClick={async () => {
          await copy(email);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        }}
      >
        {copied ? "✓ скопировано" : "копировать"}
      </button>
    </div>
  );
}
