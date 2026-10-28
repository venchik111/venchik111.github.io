// Тонкие штриховые иконки 24×24 (контуры), без эмодзи и брендовых логотипов.
export const ICONS = {
  folder: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  code: "m8 9-3 3 3 3M16 9l3 3-3 3M13.5 6l-3 12",
  term: "m4 7 5 5-5 5M12 18h8",
  git: "M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a9 9 0 0 1-9 9",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
  send: "M21 3 3 10.5l7 2.5 2.5 7zM10 13l4-4",
  card: "M3 5h18v14H3zM7 10h4M7 14h10",
  doc: "M14 3H6v18h12V7zM14 3v4h4M9 13h6M9 17h4",
  home: "M3 11 12 4l9 7v9H3z",
  desktop: "M3 5h18v12H3zM8 21h8",
  download: "M12 4v12M7 11l5 5 5-5M4 20h16",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-3.5-3.5",
  back: "m15 5-7 7 7 7",
  left: "m15 18-6-6 6-6",
  right: "m9 18 6-6-6-6",
  up: "m18 15-6-6-6 6",
  prev: "M6 5v14M19 5 9 12l10 7z",
  next: "M18 5v14M5 5l10 7-10 7z",
  play: "M7 5l12 7-12 7z",
  pause: "M8 5v14M16 5v14",
  bell: "M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0",
  wifi: "M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01",
  volume: "M4 9v6h4l5 4V5L8 9zM17 9a4 4 0 0 1 0 6",
  disk: "M3 6h18v12H3zM7 14h.01",
  external: "M7 17 17 7M8 7h9v9",
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({ name, size = 16, stroke = 1.8, color = "currentColor" }: { name: IconName; size?: number; stroke?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}
