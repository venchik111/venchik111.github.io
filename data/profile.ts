export const profile = {
  name: "Иван Соловьев",
  handle: "venchik111",
  role: "начинающий Python-разработчик · backend",
  stackLine: "Python (базовый уровень) · GitHub · Linux",
  location: "Новочебоксарск, UTC+3",
  status: "ищу стажировку или начальную позицию",
  education: "2-й курс Singularity · выпуск в 2029",
  tagline: "Учусь Python-разработке, создаю учебные и командные проекты. Хочу развиваться в backend; готов работать удалённо или в офисе.",
  about: [
    "Я Иван, студент 2-го курса IT-колледжа Singularity по направлению Python-разработки. Ожидаемый год выпуска — 2029. Знаю Python на базовом уровне, люблю разбирать нестандартные задачи и хочу развиваться в backend.",
    "На двух хакатонах был капитаном команды LilRootDevelopers. В WebEducation и BLITZ_ARENA занимался клиентской частью и координацией команды. Проекты реализовывались с помощью ИИ-инструментов.",
    "Учебный Transaction Analysis посвящён анализу банковских операций. В личном проекте Nothing Interface for Ryoku работал с Linux, конфигурациями, компонентами оформления и документацией, применяя ИИ-инструменты.",
    "Вхожу в сборную Чувашии по спортивному программированию в направлении «Продуктовое программирование», имею II спортивный разряд. Ищу стажировку или начальную позицию Python-разработчика с возможностью учиться и решать практические задачи.",
  ],
  cvUrl: "https://singularity-resume.ru/studentsResume/ac140005-a121-1c05-81a1-3e96e46700b0",
  stats: [
    { value: 4, suffix: "", label: "проекта" },
    { value: 2, suffix: "", label: "хакатона" },
    { value: 2, suffix: "", label: "курс" },
  ],
  stack: {
    python: ["Python — базовый уровень"],
    tools: ["GitHub", "Linux", "Конфигурации"],
    practice: ["ИИ-инструменты", "Документация", "Координация команды"],
  } as Record<string, string[]>,
  experience: [
    {
      id: "study",
      period: "2-й курс",
      title: "Python-разработка",
      organization: "IT-колледж Singularity",
      note: "Обучаюсь по направлению Python-разработки. Ожидаемый выпуск — 2029 год. Практика на учебных буткемпах и проект Transaction Analysis.",
    },
    {
      id: "team",
      period: "2 хакатона",
      title: "Капитан команды",
      organization: "LilRootDevelopers",
      note: "WebEducation и BLITZ_ARENA: клиентская часть и координация команды. Проекты реализовывались с помощью ИИ-инструментов.",
    },
    {
      id: "sport",
      period: "II разряд",
      title: "Спортивное программирование",
      organization: "Сборная Чувашии",
      note: "Направление «Продуктовое программирование». II спортивный разряд по спортивному программированию.",
    },
  ],
  contacts: [
    { flag: "--telegram", label: "@venchik111", href: "https://t.me/venchik111" },
    { flag: "--github", label: "github.com/venchik111", href: "https://github.com/venchik111" },
  ],
};
