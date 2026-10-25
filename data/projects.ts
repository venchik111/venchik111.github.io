// Заглушки — замените на свои проекты.
// featured: крупная карточка на две колонки; highlight — строка с ключевой метрикой.

export type Project = {
  name: string;
  description: string;
  stack: string[];
  stars?: number;
  repo?: string;
  demo?: string;
  featured?: boolean;
  highlight?: string;
};

export const projects: Project[] = [
  {
    name: "api-gate",
    description:
      "Лёгкий API-шлюз с rate limiting, JWT и горячей перезагрузкой конфигурации. Работает в проде у трёх команд и держит пиковые нагрузки без деградации.",
    stack: ["Go", "Redis"],
    stars: 120,
    repo: "https://github.com/",
    featured: true,
    highlight: "41 237 req/s · p99 12 мс",
  },
  {
    name: "dash-ui",
    description: "Набор компонентов для аналитических дашбордов с виртуализацией таблиц.",
    stack: ["TypeScript", "React"],
    stars: 48,
    repo: "https://github.com/",
    demo: "https://example.com/",
  },
  {
    name: "cli-tool",
    description: "CLI для миграций и сидов PostgreSQL с dry-run и откатом.",
    stack: ["Rust", "PostgreSQL"],
    stars: 31,
    repo: "https://github.com/",
  },
  {
    name: "notify-hub",
    description: "Сервис уведомлений: email, Telegram и web-push через единую очередь.",
    stack: ["Go", "NATS"],
    stars: 22,
    repo: "https://github.com/",
  },
  {
    name: "portfolio",
    description: "Этот сайт. Next.js, статический экспорт, без UI-библиотек.",
    stack: ["Next.js", "CSS"],
    repo: "https://github.com/",
  },
];
