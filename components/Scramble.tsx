"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}=+*^?#01АБВЖЗЙЦШЩЭЮЯ";

// «Расшифровка» текста: символы перебираются и встают на место слева направо.
// Запускается при загрузке и при наведении.
export function Scramble({ text }: { text: string }) {
  const [out, setOut] = useState(text);
  const raf = useRef(0);

  const run = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    cancelAnimationFrame(raf.current);
    let frame = 0;
    const total = text.length * 3 + 14;
    const tick = () => {
      frame++;
      setOut(
        [...text]
          .map((ch, i) => {
            if (ch === " " || frame >= i * 3 + 10) return ch;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join(""),
      );
      if (frame < total) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [text]);

  useEffect(() => {
    run();
    return () => cancelAnimationFrame(raf.current);
  }, [run]);

  return (
    <span aria-hidden="true" onMouseEnter={run}>
      {out}
    </span>
  );
}
