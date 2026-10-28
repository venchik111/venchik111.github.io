export const profile = {
  name: "Иван Соловьев",
  handle: "venchik111",
  role: "начинающий Python-разработчик · backend",
  stackLine: "Python (базовый уровень) · GitHub · Linux",
  location: "Новочебоксарск, UTC+3",
  status: "ищу стажировку или начальную позицию",
  education: "2-й курс Singularity · выпуск в 2029",
  tagline: "Учусь Python-разработке, создаю учебные и командные проекты. Хочу развиваться в backend; готов работать удалённо или в офисе.",
  // Хакатоны, проекты и спорт описаны в своих секциях, здесь — только вводная.
  about: [
    "Я Иван, студент 2-го курса IT-колледжа Singularity по направлению Python-разработки. Ожидаемый год выпуска — 2029. Знаю Python на базовом уровне, люблю разбирать нестандартные задачи и хочу развиваться в backend.",
  ],
  seeking:
    "Стажировку или начальную позицию Python-разработчика с возможностью учиться и решать практические задачи. Готов работать удалённо или в офисе.",
  cvUrl: "https://singularity-resume.ru/studentsResume/ac140005-a121-1c05-81a1-3e96e46700b0",
  stats: [
    { value: 4, label: "проекта на GitHub" },
    { value: 2, label: "хакатона капитаном" },
    { value: "II", label: "разряд по спорт. программированию" },
  ] as { value: number | string; label: string }[],
  stack: {
    languages: ["Python — базовый уровень"],
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
  // Первый контакт выводится в секции контактов главной кнопкой.
  contacts: [
    { flag: "--telegram", label: "@venchik111", href: "https://t.me/venchik111" },
    { flag: "--github", label: "github.com/venchik111", href: "https://github.com/venchik111" },
    {
      flag: "--resume",
      label: "резюме на Singularity",
      href: "https://singularity-resume.ru/studentsResume/ac140005-a121-1c05-81a1-3e96e46700b0",
    },
  ],
};
