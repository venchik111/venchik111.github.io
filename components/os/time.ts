// Время Ивана (UTC+3) — одинаковое для всех посетителей, независимо от их часового пояса.
const WD = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
const WD_LONG = ["ВОСКРЕСЕНЬЕ", "ПОНЕДЕЛЬНИК", "ВТОРНИК", "СРЕДА", "ЧЕТВЕРГ", "ПЯТНИЦА", "СУББОТА"];
const MON = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
const MON_LONG = ["ЯНВАРЯ", "ФЕВРАЛЯ", "МАРТА", "АПРЕЛЯ", "МАЯ", "ИЮНЯ", "ИЮЛЯ", "АВГУСТА", "СЕНТЯБРЯ", "ОКТЯБРЯ", "НОЯБРЯ", "ДЕКАБРЯ"];

export const pad = (n: number) => String(n).padStart(2, "0");

export function ivanTime(ms: number) {
  const d = new Date(ms + 3 * 3600e3);
  const h = d.getUTCHours();
  const m = d.getUTCMinutes();
  const s = d.getUTCSeconds();
  return {
    h,
    m,
    s,
    hhmm: `${pad(h)}:${pad(m)}`,
    // Двоеточие мигает раз в секунду.
    dots: `${pad(h)}${s % 2 ? " " : ":"}${pad(m)}`,
    short: `${WD[d.getUTCDay()]} ${d.getUTCDate()} ${MON[d.getUTCMonth()]}`,
    long: `${WD_LONG[d.getUTCDay()]}, ${d.getUTCDate()} ${MON_LONG[d.getUTCMonth()]}`,
    iso: `${d.toISOString().slice(0, 16).replace("T", " ")} MSK`,
  };
}

// До монтирования (и при статическом экспорте) часы показывают прочерки — без расхождения гидратации.
export const EMPTY_TIME = { h: 0, m: 0, s: 0, hhmm: "--:--", dots: "--:--", short: "", long: "", iso: "" };
