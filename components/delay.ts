import type { CSSProperties } from "react";

// Задержка анимации появления (переменная --d в globals.css).
export const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
