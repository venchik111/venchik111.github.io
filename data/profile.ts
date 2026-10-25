// Заглушки — замените на свои данные.

export const profile = {
  name: "Иван Петров",
  handle: "ivan",
  role: "fullstack developer",
  stackLine: "Go · TypeScript · React · PostgreSQL",
  location: "Москва, UTC+3",
  status: "открыт к предложениям",
  uptime: "6+ лет в продакшене",
  tagline: "Строю быстрые бэкенды и аккуратные интерфейсы. Люблю, когда сложное работает просто.",
  about: [
    "Пишу код больше 6 лет: от высоконагруженных API до внутренних инструментов, которыми пользуются каждый день.",
    "Ценю понятную архитектуру, хорошие тесты и короткий путь от идеи до продакшена.",
  ],
  cvUrl: "#",
  stats: [
    { value: 6, suffix: "+", label: "лет в разработке" },
    { value: 40, suffix: "+", label: "проектов" },
    { value: 1200, suffix: "+", label: "коммитов в год" },
  ],
  stack: {
    languages: ["Go", "TypeScript", "Rust", "SQL"],
    frameworks: ["React", "Next.js", "gRPC", "Echo"],
    tools: ["PostgreSQL", "Redis", "Docker", "Kubernetes", "GitHub Actions"],
  } as Record<string, string[]>,
  experience: [
    { hash: "a1f3c9e", period: "2024 — сейчас", title: "Senior Backend Engineer", company: "Acme Cloud", note: "Платёжный шлюз, p99 < 40 мс" },
    { hash: "7bd20e4", period: "2021 — 2024", title: "Fullstack Developer", company: "Studio North", note: "Дашборды и B2B-панели на React + Go" },
    { hash: "3c9e1aa", period: "2019 — 2021", title: "Junior Developer", company: "Fintech Start", note: "Первые сервисы, CI/CD, мониторинг" },
  ],
  email: "ivan@example.com",
  contacts: [
    { flag: "--email", label: "ivan@example.com", href: "mailto:ivan@example.com" },
    { flag: "--github", label: "github.com/ivan", href: "https://github.com/" },
    { flag: "--telegram", label: "@ivan", href: "https://t.me/" },
    { flag: "--linkedin", label: "linkedin.com/in/ivan", href: "https://linkedin.com/" },
  ],
};
